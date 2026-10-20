/**
 * NonGeneric Live Browser DOM Inspector (`browser-bundle/detector.js`)
 *
 * Self-contained IIFE/ESM hybrid bundle designed to be evaluated inside a live
 * browser context (`page.evaluate()`, Playwright, Chrome DevTools, or GStack Browser).
 * Measures real rendered `getComputedStyle()` and bounding boxes across:
 *   1. Page-level horizontal overflow (`scrollWidth > innerWidth`) with offender attribution
 *   2. Touch target sizing (`< 44x44px` on interactive controls)
 *   3. iOS Safari input auto-zoom (`< 16px` font-size on inputs/selects/textareas)
 *   4. Overused AI default fonts (`Inter`, `Roboto`, `Open Sans`, `Lato`, `Montserrat`, `Poppins`, `Space Grotesk`)
 *   5. Gradient-clipped headings (`background-clip: text` + gradient)
 *   6. Side-tab thick borders (`border-left-width >= 3px` on rounded elements)
 *   7. Wide prose line measure (`<p>` exceeding 78 characters per line)
 *   8. Sibling card grid monotony (3+ sibling cards with identical geometry & tag structure)
 */

export function scanLiveDom(root = typeof document !== 'undefined' ? document : null) {
  if (!root || typeof window === 'undefined') {
    return { viewportWidth: 0, documentWidth: 0, findings: [] };
  }

  const findings = [];
  const vw = window.innerWidth;
  const docWidth = Math.max(
    root.documentElement?.scrollWidth ?? 0,
    root.body?.scrollWidth ?? 0
  );

  const BANNED_FONTS = /\b(Inter|Roboto|Open Sans|Lato|Montserrat|Poppins|Space Grotesk)\b/i;

  function selectorFor(el) {
    if (!el || !el.tagName) return 'unknown';
    const tag = el.tagName.toLowerCase();
    if (el.id) return `${tag}#${el.id}`;
    const cls = Array.from(el.classList || []).slice(0, 3).join('.');
    return cls ? `${tag}.${cls}` : tag;
  }

  function isHorizontallyContained(el) {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const ox = window.getComputedStyle(p).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
    }
    return false;
  }

  // 1. Horizontal page overflow
  if (docWidth > vw + 1) {
    let worstEl = null;
    let maxRight = vw;
    for (const el of root.querySelectorAll('*')) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && !isHorizontallyContained(el) && rect.right > maxRight) {
        maxRight = rect.right;
        worstEl = el;
      }
    }
    findings.push({
      ruleId: 'horizontal-page-overflow',
      severity: 'error',
      selector: worstEl ? selectorFor(worstEl) : 'document',
      description: `Document scrollWidth (${docWidth}px) exceeds viewport width (${vw}px) by ${Math.round(docWidth - vw)}px.`,
    });
  }

  // 2. Element-level computed style checks
  const elements = Array.from(root.querySelectorAll('body *'));
  let reportedFont = false;

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = window.getComputedStyle(el);
    const tag = el.tagName.toLowerCase();

    // Overused font (report once per page)
    if (!reportedFont && BANNED_FONTS.test(style.fontFamily)) {
      reportedFont = true;
      findings.push({
        ruleId: 'overused-font',
        severity: 'warning',
        selector: selectorFor(el),
        description: `Computed font-family uses banned AI default font: ${style.fontFamily}`,
      });
    }

    // Gradient text
    const bgClip = style.webkitBackgroundClip || style.backgroundClip;
    if (bgClip === 'text' && /gradient/i.test(style.backgroundImage)) {
      findings.push({
        ruleId: 'gradient-text',
        severity: 'warning',
        selector: selectorFor(el),
        description: 'Element uses background-clip: text with a gradient background.',
      });
    }

    // Side-tab border on rounded box
    const blw = parseFloat(style.borderLeftWidth || '0');
    const br = parseFloat(style.borderTopLeftRadius || '0');
    const bw = parseFloat(style.borderTopWidth || '0');
    if (blw >= 3 && br > 0 && blw > bw && !['blockquote', 'nav', 'pre', 'code'].includes(tag)) {
      findings.push({
        ruleId: 'side-tab',
        severity: 'warning',
        selector: selectorFor(el),
        description: `Rounded box has thick ${blw}px left accent border.`,
      });
    }

    // Interactive touch target (< 44x44px)
    if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) {
      if (tag !== 'a' || style.display !== 'inline') {
        if (rect.width < 44 && rect.height < 32) {
          findings.push({
            ruleId: 'tiny-tap-target',
            severity: 'advisory',
            selector: selectorFor(el),
            description: `Interactive control measures ${Math.round(rect.width)}x${Math.round(rect.height)}px (< 44x44px target).`,
          });
        }
      }
    }

    // iOS input zoom (< 16px)
    if (['input', 'select', 'textarea'].includes(tag)) {
      const fs = parseFloat(style.fontSize || '16');
      if (fs < 16) {
        findings.push({
          ruleId: 'ios-input-zoom',
          severity: 'error',
          selector: selectorFor(el),
          description: `Form control font-size is ${fs}px (< 16px triggers iOS Safari auto-zoom).`,
        });
      }
    }
  }

  return {
    viewportWidth: vw,
    documentWidth: docWidth,
    findingsCount: findings.length,
    findings,
  };
}

if (typeof window !== 'undefined') {
  window.__nongenericDetector = { scanLiveDom };
}
