import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { filterRulesByScope, getRule } from './rules-registry.js';
import type { AntipatternRule, Finding, RuleCategory, ScanOptions, ScanReport } from './types.js';

const SCANNABLE_EXTENSIONS = new Set([
  '.html',
  '.htm',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.vue',
  '.svelte',
  '.astro',
]);

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.nuxt',
  '.svelte-kit',
  'dist',
  'build',
  'coverage',
  '.cache',
]);

const OVERUSED_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Arial',
  'Helvetica',
  'Fraunces',
  'Geist Sans',
  'Geist Mono',
  'Geist',
  'Mona Sans',
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Recoleta',
  'Instrument Sans',
  'Instrument Serif',
];

const MARKETING_BUZZWORDS = [
  'streamline your',
  'empower your',
  'supercharge your',
  'unleash your',
  'unleash the power',
  'leverage the power',
  'built for the modern',
  'trusted by leading',
  'trusted by the world',
  'best-in-class',
  'industry-leading',
  'world-class',
  'enterprise-grade',
  'next-generation',
  'cutting-edge',
  'transform your business',
  'revolutionize',
  'game-changer',
  'game changing',
  'mission-critical',
  'best of breed',
  'future-proof',
  'future proof',
  'seamless experience',
  'seamlessly integrate',
  'drive engagement',
  'drive growth',
  'drive results',
  'harness the power',
];

interface InlineWaivers {
  fileAll: boolean;
  fileRules: Set<string>;
  lineAll: Set<number>;
  lineRules: Map<number, Set<string>>;
}

function parseInlineWaivers(lines: readonly string[]): InlineWaivers {
  const waivers: InlineWaivers = {
    fileAll: false,
    fileRules: new Set<string>(),
    lineAll: new Set<number>(),
    lineRules: new Map<number, Set<string>>(),
  };

  const directiveRe =
    /(?:nongeneric|impeccable)-disable(-next-line|-line)?(?:\s+([a-z0-9_*, -]+?))?(?:\s*--|\s*\*\/|\s*-->|$)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const match = directiveRe.exec(line);
    if (!match) continue;

    const kind = (match[1] ?? '').toLowerCase();
    const rawRules = (match[2] ?? '').trim();
    const ruleIds = rawRules
      ? rawRules
          .split(/[,\s]+/)
          .map((r) => r.trim().toLowerCase())
          .filter(Boolean)
      : ['*'];
    const isWildcard = ruleIds.includes('*') || ruleIds.length === 0;

    if (kind === '-line') {
      const targetLine = i + 1;
      if (isWildcard) {
        waivers.lineAll.add(targetLine);
      } else {
        const set = waivers.lineRules.get(targetLine) ?? new Set<string>();
        for (const r of ruleIds) set.add(r);
        waivers.lineRules.set(targetLine, set);
      }
    } else if (kind === '-next-line') {
      const targetLine = i + 2;
      if (isWildcard) {
        waivers.lineAll.add(targetLine);
      } else {
        const set = waivers.lineRules.get(targetLine) ?? new Set<string>();
        for (const r of ruleIds) set.add(r);
        waivers.lineRules.set(targetLine, set);
      }
    } else {
      if (isWildcard) {
        waivers.fileAll = true;
      } else {
        for (const r of ruleIds) waivers.fileRules.add(r);
      }
    }
  }

  return waivers;
}

function isWaived(waivers: InlineWaivers, ruleId: string, line: number): boolean {
  if (waivers.fileAll || waivers.fileRules.has(ruleId)) return true;
  if (line > 0) {
    if (waivers.lineAll.has(line)) return true;
    const lineSet = waivers.lineRules.get(line);
    if (lineSet && lineSet.has(ruleId)) return true;
  }
  return false;
}

function createFinding(
  rule: AntipatternRule,
  file: string,
  line: number,
  snippet: string
): Finding {
  return {
    ruleId: rule.id,
    name: rule.name,
    category: rule.category,
    severity: rule.severity,
    advisory: rule.severity === 'advisory',
    file,
    line,
    snippet: snippet.trim().slice(0, 140),
    description: rule.description,
    fix: rule.fix,
  };
}

function stripHtmlToText(content: string): string {
  return content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasRoundedInContext(windowText: string): boolean {
  const cleaned = windowText.replace(/\brounded-none\b|\brounded-0\b/g, '');
  if (/\brounded(?:-[a-z0-9[\]-]+)?\b/i.test(cleaned)) return true;
  const brMatch = /border-radius\s*:\s*([^;}"']+)/i.exec(cleaned);
  if (brMatch) {
    const val = (brMatch[1] ?? '').trim();
    if (val !== '0' && val !== '0px' && val !== 'none') return true;
  }
  const objMatch = /borderRadius\s*:\s*([^,}]+)/i.exec(cleaned);
  if (objMatch) {
    const val = (objMatch[1] ?? '').replace(/['"]/g, '').trim();
    if (val !== '0' && val !== '0px' && val !== 'none') return true;
  }
  return false;
}

export function detectInText(
  content: string,
  filePath: string,
  options: ScanOptions = {}
): Finding[] {
  const allowedRules = new Map<string, AntipatternRule>(
    filterRulesByScope(options.scopes).map((r) => [r.id, r])
  );
  if (options.ignoreRules) {
    for (const ignored of options.ignoreRules) {
      allowedRules.delete(ignored);
    }
  }

  const lines = content.split(/\r?\n/);
  const waivers =
    options.inlineIgnores === false
      ? { fileAll: false, fileRules: new Set<string>(), lineAll: new Set<number>(), lineRules: new Map<number, Set<string>>() }
      : parseInlineWaivers(lines);

  const findings: Finding[] = [];
  const seenKeys = new Set<string>();

  const pushFinding = (ruleId: string, lineNum: number, snippet: string) => {
    const rule = allowedRules.get(ruleId) ?? getRule(ruleId);
    if (!rule || !allowedRules.has(ruleId)) return;
    if (options.includeAdvisory === false && rule.severity === 'advisory') return;
    if (isWaived(waivers, ruleId, lineNum)) return;
    const dedupeKey = `${ruleId}:${lineNum}:${snippet.slice(0, 60)}`;
    if (seenKeys.has(dedupeKey)) return;
    seenKeys.add(dedupeKey);
    findings.push(createFinding(rule, filePath, lineNum, snippet));
  };

  const ext = extname(filePath).toLowerCase();
  const isMarkupOrStyle =
    ext === '' ||
    ['.html', '.htm', '.css', '.scss', '.sass', '.less', '.jsx', '.tsx', '.vue', '.svelte', '.astro'].includes(ext);

  const overusedFontRegex = new RegExp(
    `font-family\\s*:\\s*['"]?(${OVERUSED_FONTS.map((f) => f.replace(/\s+/g, '\\s+')).join('|')})\\b`,
    'i'
  );
  const googleFontsOverusedRegex = new RegExp(
    `fonts\\.googleapis\\.com\\/css2?\\?[^"'>\\s]*family=(${OVERUSED_FONTS.map((f) => f.replace(/\s+/g, '\\+')).join('|')})`,
    'i'
  );

  // ─── Line-by-Line Matchers ────────────────────────────────────────────────
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx] ?? '';
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('<!--')) {
      continue;
    }

    const contextWindow = lines.slice(Math.max(0, idx - 3), Math.min(lines.length, idx + 4)).join('\n');

    // 1. side-tab
    const twSideTab = /\bborder-([lrse])-([2-9]|\d{2,})\b/.exec(line);
    if (twSideTab && hasRoundedInContext(contextWindow)) {
      pushFinding('side-tab', lineNum, twSideTab[0]);
    }
    const cssSideTab = /border-(?:left|right|inline-start|inline-end)\s*:\s*([3-9]|\d{2,})px\s+solid\s+([^;}"']+)/i.exec(line);
    if (
      cssSideTab &&
      !/<(?:blockquote|nav|pre|code)\b/i.test(line) &&
      hasRoundedInContext(contextWindow)
    ) {
      pushFinding('side-tab', lineNum, cssSideTab[0]);
    }

    // 2. border-accent-on-rounded
    const twTopBot = /\bborder-([tb])-([2-9]|\d{2,})\b/.exec(line);
    if (twTopBot && hasRoundedInContext(line) && !/\banimate-spin\b/.test(line)) {
      pushFinding('border-accent-on-rounded', lineNum, twTopBot[0]);
    }
    const cssTopBot = /border-(?:top|bottom)\s*:\s*([3-9]|\d{2,})px\s+solid/i.exec(line);
    if (cssTopBot && hasRoundedInContext(contextWindow)) {
      pushFinding('border-accent-on-rounded', lineNum, cssTopBot[0]);
    }

    // 3. overused-font
    const fontMatch = overusedFontRegex.exec(line);
    if (fontMatch) {
      pushFinding('overused-font', lineNum, fontMatch[0]);
    }
    const gfMatch = googleFontsOverusedRegex.exec(line);
    if (gfMatch) {
      pushFinding('overused-font', lineNum, `Google Fonts: ${(gfMatch[1] ?? '').replace(/\+/g, ' ')}`);
    }

    // 4. gradient-text & animated-gradient-text
    if (
      (/(?:-webkit-)?background-clip\s*:\s*text/i.test(line) && /gradient/i.test(contextWindow)) ||
      (/\bbg-clip-text\b/.test(line) && /\bbg-gradient-to-/.test(line))
    ) {
      pushFinding('gradient-text', lineNum, 'background-clip: text + gradient');
      if (/animation|@keyframes|background-size\s*:\s*(?:200%|300%|400%)/i.test(contextWindow)) {
        pushFinding('animated-gradient-text', lineNum, 'animated gradient-clipped text');
      }
    }

    // 5. gray-on-color
    const grayTw = /\btext-(?:gray|slate|zinc|neutral|stone)-([3456]00)\b/.exec(line);
    const colorBgTw = /\bbg-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-([45678]00)\b/.exec(line);
    if (grayTw && colorBgTw && !line.includes('?') && !line.includes('hover:bg-')) {
      pushFinding('gray-on-color', lineNum, `${grayTw[0]} on ${colorBgTw[0]}`);
    }

    // 6. ai-color-palette & purple-blue-gradient
    const purpleHeading = /\btext-(?:purple|violet|indigo)-\d{3}\b/.exec(line);
    if (purpleHeading && (/\btext-[2-9]xl\b|<h[1-3]\b/i.test(line))) {
      pushFinding('ai-color-palette', lineNum, `${purpleHeading[0]} on heading`);
    }
    const purpleGradTw = /\bfrom-(?:purple|violet|indigo)-\d{3}\b/.exec(line);
    if (purpleGradTw && /\bto-(?:purple|violet|indigo|blue|cyan|pink|fuchsia)-\d{3}\b/.test(line)) {
      pushFinding('ai-color-palette', lineNum, `${purpleGradTw[0]} gradient`);
      pushFinding('purple-blue-gradient', lineNum, `${purpleGradTw[0]} gradient`);
    }
    const cssPurpleGrad = /linear-gradient\([^)]*(?:#8b5cf6|#6366f1|#7c3aed|#a855f7|rgba?\(\s*(?:99,\s*102,\s*241|139,\s*92,\s*246))[^)]*\)/i.exec(line);
    if (cssPurpleGrad) {
      pushFinding('purple-blue-gradient', lineNum, cssPurpleGrad[0]);
    }

    // 7. cyan-on-dark
    if (/(?:#06b6d4|#22d3ee|#00f0ff|\btext-cyan-400\b)/i.test(line) && /(?:#0f172a|#020617|\bbg-slate-9[05]0\b)/i.test(contextWindow)) {
      pushFinding('cyan-on-dark', lineNum, 'cyan accent on dark slate');
    }

    // 8. bounce-easing
    if (/\banimate-bounce\b/.test(line)) {
      pushFinding('bounce-easing', lineNum, 'animate-bounce');
    }
    const cssBounce = /animation(?:-name)?\s*:\s*([^;{}]*(?:bounce|elastic|wobble|jiggle)[^;{}]*)/i.exec(line);
    if (cssBounce) {
      pushFinding('bounce-easing', lineNum, `animation: ${(cssBounce[1] ?? '').trim()}`);
    }
    const gsapBounce = /\bease\s*:\s*['"](?:bounce|elastic)(?:\.(?:in|out|inOut))?['"]/.exec(line);
    if (gsapBounce) {
      pushFinding('bounce-easing', lineNum, gsapBounce[0]);
    }
    const bezierMatch = /cubic-bezier\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(line);
    if (bezierMatch) {
      const y1 = Number.parseFloat(bezierMatch[2] ?? '0');
      const y2 = Number.parseFloat(bezierMatch[4] ?? '0');
      if (y1 < -0.1 || y1 > 1.1 || y2 < -0.1 || y2 > 1.1) {
        pushFinding('bounce-easing', lineNum, bezierMatch[0]);
      }
    }

    // 9. broken-image & dead-link & generic-button-label
    const brokenImg = /<img\b[^>]*?\bsrc\s*=\s*(?:""|''|"\s+"|'\s+'|"#"|'#')/i.exec(line);
    if (brokenImg) {
      pushFinding('broken-image', lineNum, brokenImg[0]);
    } else if (/<img\b(?![^>]*\bsrc\s*=)[^>]*>/i.test(line)) {
      pushFinding('broken-image', lineNum, line.trim());
    }

    const deadLink = /<a\b[^>]*?\bhref\s*=\s*(?:"#"|'#'|"javascript:void\(0\)"|'javascript:void\(0\)')[^>]*>/i.exec(line);
    if (deadLink) {
      pushFinding('dead-link', lineNum, deadLink[0]);
    }

    const genericBtn = /<(?:button|a)\b[^>]*>\s*(Click here|Learn more|Submit|Read more)\s*<\/(?:button|a)>/i.exec(line);
    if (genericBtn) {
      pushFinding('generic-button-label', lineNum, genericBtn[0]);
    }

    // 10. sparkle-icon-ai & placeholder-text & placeholder-slop
    if (/✨/.test(line) && isMarkupOrStyle) {
      pushFinding('sparkle-icon-ai', lineNum, trimmed);
    }
    if (/\blorem ipsum\b/i.test(line)) {
      pushFinding('placeholder-text', lineNum, trimmed);
    }
    const placeholderSlop = /\b(Acme Corp|John Doe|Jane Smith|user@example\.com)\b/.exec(line);
    if (placeholderSlop && isMarkupOrStyle) {
      pushFinding('placeholder-slop', lineNum, placeholderSlop[0]);
    }

    // 11. Typography rules: wide-tracking, extreme-negative-tracking, undersized-ui-text, z-index-war, missing-focus-ring
    const letterSpacingEm = /letter-spacing\s*:\s*(-?[0-9.]+)em/i.exec(line);
    if (letterSpacingEm) {
      const val = Number.parseFloat(letterSpacingEm[1] ?? '0');
      if (val > 0.05 && !/uppercase/i.test(contextWindow)) {
        pushFinding('wide-tracking', lineNum, letterSpacingEm[0]);
      } else if (val < -0.05) {
        pushFinding('extreme-negative-tracking', lineNum, letterSpacingEm[0]);
      }
    }
    const fontSizePx = /font-size\s*:\s*([0-9.]+)px/i.exec(line);
    if (fontSizePx) {
      const px = Number.parseFloat(fontSizePx[1] ?? '16');
      if (px > 0 && px < 11) {
        pushFinding('undersized-ui-text', lineNum, fontSizePx[0]);
      }
      if (px < 16 && /input|select|textarea/i.test(contextWindow)) {
        pushFinding('ios-input-zoom', lineNum, `${fontSizePx[0]} on form control`);
      }
    }
    const zIndexWar = /z-index\s*:\s*([9]{3,}|\d{5,})\b/i.exec(line);
    if (zIndexWar) {
      pushFinding('z-index-war', lineNum, zIndexWar[0]);
    }
    if (/outline\s*:\s*(?:none|0)\b/.test(line) && !/focus-visible/.test(contextWindow)) {
      pushFinding('missing-focus-ring', lineNum, 'outline: none without :focus-visible replacement');
    }

    // 12. GSAP & Motion rules
    if (/\b(?:gsap|tl|timeline)\.(?:to|from|fromTo)\s*\(/.test(line)) {
      const layoutProp = /\b(width|height|top|left|right|bottom|margin|marginTop|marginLeft|padding|paddingTop)\s*:/.exec(
        contextWindow
      );
      if (layoutProp) {
        pushFinding('gsap-layout-thrash', lineNum, `gsap tween animating '${layoutProp[1]}'`);
      }
    }
    if (/\.to\s*\([^)]*scrollTrigger\s*:|\.from\s*\([^)]*scrollTrigger\s*:/.test(line) && /\btl\.|\btimeline\b/.test(contextWindow)) {
      pushFinding('gsap-nested-scrolltrigger', lineNum, 'scrollTrigger nested inside timeline tween');
    }
    const wideMotionWindow = lines.slice(Math.max(0, idx - 30), Math.min(lines.length, idx + 6)).join('\n');
    if (/containerAnimation\s*:/.test(line) && !/ease\s*:\s*['"]none['"]/.test(wideMotionWindow)) {
      pushFinding('gsap-container-ease', lineNum, 'containerAnimation without ease: "none"');
    }
    if (/\btransition\s*:\s*all\b|\btransition-all\b/.test(line)) {
      pushFinding('transition-all', lineNum, trimmed);
    }
    if (/will-change\s*:\s*all\b/i.test(line)) {
      pushFinding('will-change-abuse', lineNum, 'will-change: all');
    }
    const staggerEach = /stagger\s*:\s*(?:([0-9.]+)|\{[^}]*each\s*:\s*([0-9.]+))/.exec(line);
    if (staggerEach) {
      const sVal = Number.parseFloat(staggerEach[1] ?? staggerEach[2] ?? '0');
      if (sVal > 0.25) {
        pushFinding('stagger-overload', lineNum, staggerEach[0]);
      }
    }

    // 13. Responsive rules (doesntbreak fusion)
    if (/\bwidth\s*:\s*100vw\b|\bw-screen\b/.test(line)) {
      pushFinding('viewport-width-overflow', lineNum, trimmed);
    }
    if (/\b(?:min-)?height\s*:\s*100vh\b|\b(?:min-)?h-screen\b/.test(line) && !/100[ds]vh/.test(contextWindow)) {
      pushFinding('legacy-viewport-height', lineNum, trimmed);
    }
    const rigidWidth = /(?<![-\w])width\s*:\s*([3-9]\d{2}|\d{4,})px\b/i.exec(line);
    if (rigidWidth && !/max-width\s*:\s*100%/.test(contextWindow)) {
      pushFinding('rigid-desktop-width', lineNum, rigidWidth[0]);
    }
    const gridMinmax = /minmax\(\s*([3-9]\d{2})px\s*,/i.exec(line);
    if (gridMinmax) {
      pushFinding('unbounded-grid-track', lineNum, gridMinmax[0]);
    }
    if ((/\btruncate\b/.test(line) || /text-overflow\s*:\s*ellipsis/.test(line)) && /flex|grid/.test(contextWindow) && !/min-w-0|min-width\s*:\s*0/.test(contextWindow)) {
      pushFinding('missing-min-w-0', lineNum, 'truncated text in flex/grid without min-width: 0');
    }

    // 14. Security: unsafe DOM sinks
    const unsafeSink = /\.(?:innerHTML|outerHTML)\s*=|document\.write\s*\(|\beval\s*\(/.exec(line);
    if (unsafeSink) {
      pushFinding('unsafe-dom-sink', lineNum, unsafeSink[0]);
    }
  }

  // ─── File / Page-Level Analyzers ──────────────────────────────────────────

  // A. GSAP lifecycle checks across whole file (ignore comments)
  const codeWithoutComments = content
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\r\n]*/g, ' ');
  if (/\b(?:ScrollTrigger|Flip|SplitText|MorphSVGPlugin|DrawSVGPlugin|Draggable)\b/.test(codeWithoutComments)) {
    if (!/gsap\.registerPlugin\s*\(/.test(codeWithoutComments)) {
      pushFinding('gsap-missing-register', 1, 'GSAP plugin referenced without gsap.registerPlugin()');
    }
  }
  if (/\buseEffect\s*\(/.test(codeWithoutComments) && /\bgsap\.(?:to|from|fromTo|timeline)\b/.test(codeWithoutComments)) {
    if (!/\buseGSAP\b/.test(codeWithoutComments) && !/gsap\.context\s*\(/.test(codeWithoutComments)) {
      pushFinding('gsap-missing-cleanup', 1, 'gsap animation inside useEffect without useGSAP() or gsap.context()');
    }
  }
  if (/addEventListener\s*\(\s*['"](?:mousemove|pointermove)['"]/.test(codeWithoutComments) && /\bgsap\.to\s*\(/.test(codeWithoutComments) && !/\bquickTo\b/.test(codeWithoutComments)) {
    pushFinding('gsap-raw-mousemove', 1, 'gsap.to() inside mousemove/pointermove without gsap.quickTo()');
  }
  if (
    (/\bgsap\.(?:to|from|fromTo|timeline)\b/.test(codeWithoutComments) || /@keyframes\s+[a-z0-9_-]+/i.test(codeWithoutComments)) &&
    !/prefers-reduced-motion|gsap\.matchMedia\s*\(/.test(codeWithoutComments)
  ) {
    pushFinding('missing-reduced-motion', 1, 'Animations authored without prefers-reduced-motion or gsap.matchMedia()');
  }

  // B. Dark glow & radial halo
  const glowMatch = /box-shadow\s*:\s*0(?:px)?\s+0(?:px)?\s+([3-9]\d|\d{3,})px\s+[^;{}]*(?:rgba?\(|hsla?\(|oklch\(|#[0-9a-f]{3,8})/i.exec(content);
  if (glowMatch) {
    const lineNum = content.slice(0, glowMatch.index).split(/\r?\n/).length;
    pushFinding('dark-glow', lineNum, glowMatch[0]);
  }
  const radialHalo = /radial-gradient\([^)]+\)[^;{}]*filter\s*:\s*blur\(([5-9]\d|\d{3,})px\)|filter\s*:\s*blur\(([6-9]\d|\d{3,})px\)[^;{}]*radial-gradient/i.exec(content);
  if (radialHalo) {
    const lineNum = content.slice(0, radialHalo.index).split(/\r?\n/).length;
    pushFinding('radial-halo', lineNum, radialHalo[0]);
  }

  // C. Monotonous spacing analyzer
  if (isMarkupOrStyle) {
    const spacingVals: number[] = [];
    for (const m of content.matchAll(/(?:padding|margin)(?:-(?:top|right|bottom|left))?\s*:\s*(\d+)px/gi)) {
      const v = Number.parseInt(m[1] ?? '0', 10);
      if (v > 0 && v < 200) spacingVals.push(Math.round(v / 4) * 4);
    }
    for (const m of content.matchAll(/\bgap\s*:\s*(\d+)px/gi)) {
      const v = Number.parseInt(m[1] ?? '0', 10);
      if (v > 0 && v < 200) spacingVals.push(Math.round(v / 4) * 4);
    }
    if (spacingVals.length >= 10) {
      const counts = new Map<number, number>();
      for (const v of spacingVals) counts.set(v, (counts.get(v) ?? 0) + 1);
      let maxVal = 0;
      let maxCount = 0;
      for (const [val, count] of counts.entries()) {
        if (count > maxCount) {
          maxVal = val;
          maxCount = count;
        }
      }
      const pct = maxCount / spacingVals.length;
      if (pct > 0.65 && counts.size <= 3) {
        pushFinding(
          'monotonous-spacing',
          1,
          `~${maxVal}px used ${maxCount}/${spacingVals.length} times (${Math.round(pct * 100)}%)`
        );
      }
    }
  }

  // D. Copywriting analyzers (em-dash, marketing buzzwords, aphoristic cadence)
  if (isMarkupOrStyle) {
    const plainText = stripHtmlToText(content.replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014'));
    const emDashMatches = plainText.match(/\u2014|--/g) ?? [];
    if (emDashMatches.length >= 4 && plainText.length <= emDashMatches.length * 220) {
      pushFinding('em-dash-overuse', 1, `${emDashMatches.length} em-dashes in copy`);
    }

    const lowerText = plainText.toLowerCase();
    let buzzCount = 0;
    let firstBuzz = '';
    for (const phrase of MARKETING_BUZZWORDS) {
      if (lowerText.includes(phrase)) {
        buzzCount++;
        if (!firstBuzz) firstBuzz = phrase;
      }
    }
    if (buzzCount > 0) {
      pushFinding(
        'marketing-buzzword',
        1,
        `${buzzCount} buzzword phrase${buzzCount === 1 ? '' : 's'}: "${firstBuzz}"`
      );
    }

    const aphorismMatches = [
      ...plainText.matchAll(/\bNot an? [a-z][^.!?]{1,40}[.!]\s+[A-Z][^.!?]{1,60}[.!]/g),
      ...plainText.matchAll(/\b[A-Z][^.!?]{4,80}[.!]\s+(?:No|Just)\s+[a-z][^.!?]{2,60}[.!]/g),
    ];
    if (aphorismMatches.length >= 3) {
      const sample = (aphorismMatches[0]?.[0] ?? '').slice(0, 80);
      pushFinding('aphoristic-cadence', 1, `${aphorismMatches.length} aphoristic constructions: "${sample}"`);
    }
  }

  return findings;
}

export function collectTargetFiles(targets: readonly string[], ignoreFiles: readonly string[] = []): string[] {
  const results: string[] = [];
  const ignoredSet = new Set(ignoreFiles.map((f) => resolve(f)));

  const visit = (targetPath: string) => {
    const abs = resolve(targetPath);
    if (ignoredSet.has(abs)) return;
    let st;
    try {
      st = statSync(abs);
    } catch {
      return;
    }
    if (st.isFile()) {
      const ext = extname(abs).toLowerCase();
      if (SCANNABLE_EXTENSIONS.has(ext)) {
        results.push(abs);
      }
      return;
    }
    if (st.isDirectory()) {
      let entries;
      try {
        entries = readdirSync(abs, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.isSymbolicLink()) continue;
        if (entry.isDirectory()) {
          if (IGNORED_DIRS.has(entry.name)) continue;
          visit(join(abs, entry.name));
        } else if (entry.isFile()) {
          const ext = extname(entry.name).toLowerCase();
          if (SCANNABLE_EXTENSIONS.has(ext)) {
            results.push(join(abs, entry.name));
          }
        }
      }
    }
  };

  for (const target of targets) {
    visit(target);
  }
  return results.sort();
}

export function scanTargets(targets: readonly string[], options: ScanOptions = {}): ScanReport {
  const files = collectTargetFiles(targets, options.ignoreFiles);
  const allFindings: Finding[] = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const relPath = relative(process.cwd(), file) || file;
    const fileFindings = detectInText(content, relPath, options);
    allFindings.push(...fileFindings);
  }

  const primary = allFindings.filter((f) => !f.advisory);
  const advisories = allFindings.filter((f) => f.advisory);

  const byCategory: Record<RuleCategory, number> = {
    slop: 0,
    quality: 0,
    motion: 0,
    responsive: 0,
    copy: 0,
    security: 0,
  };
  for (const f of allFindings) {
    byCategory[f.category] = (byCategory[f.category] ?? 0) + 1;
  }

  return {
    scannedFiles: files.length,
    primaryCount: primary.length,
    advisoryCount: advisories.length,
    findings: primary,
    advisories,
    byCategory,
  };
}
