#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { auditTargets, formatAuditReport } from './auditor.js';
import { STRUCTURAL_COMPOSITIONS, WORLD_CONCEPTS } from './catalog.js';
import { formatConceptSeed, rollConceptSeed } from './concept-seed.js';
import { scanTargets } from './detector.js';
import { generateMotionBlueprint } from './motion-planner.js';
import { ANTIPATTERN_RULES, filterRulesByScope } from './rules-registry.js';
import { generateWorldSpecimenHtml } from './specimen.js';
import { generateTokens, type TokenFormat } from './tokens.js';
import type {
  CompositionGrain,
  FrameworkTarget,
  MotionPatternId,
  PlatformTarget,
  VisitorMode,
} from './types.js';

export const USAGE = `Usage: nongeneric <command> [options] [targets...]

Commands:
  detect [targets...]       Scan files or directories for UI anti-patterns, AI slop, GSAP bugs, and responsive breakage
  seed [options]            Roll a deterministic Concept Seed, Challenger Worlds, and Structural Compositions
  tokens [options]          Generate OKLCH design tokens, fluid typography scale, and motion tokens for a World
  motion-plan [options]     Generate cleanup-safe, reduced-motion-safe GSAP choreography code blueprints
  audit [targets...]        Score static source checks (not design quality) with P0-P3 remediation plan
  specimen [options]        Generate a self-contained Grade-S HTML5 + GSAP design system specimen board for a World
  rules [--scope <name>]    List all 82 deterministic anti-pattern rules
  worlds                    List all curated Aesthetic Worlds and Structural Compositions
  doctor                    Verify NonGeneric installation and runtime environment

Detect & Audit Options:
  --json                    Output structured JSON on stdout
  --quiet                   Only print the final findings count
  --scope <domains>         Comma-separated scopes (slop,quality,motion,responsive,copy,security,type,color,layout)
  --no-advisory             Suppress advisory findings
  --no-inline-ignores       Do not honor in-file nongeneric-disable / impeccable-disable comments

Seed Options:
  --scope <direction|surface>
  --mode <persuade|operate|read|experience>
  --grain <product|flow|view|region>
  --platform <web|ios|android|adaptive>
  --register <safer|bolder>
  --reroll <n>
  --from <8-hex-key>
  --json

Tokens Options:
  --world <world-id>        World ID from catalog (default: knightvision-editorial-telemetry)
  --format <css|json|tailwind>

Motion-Plan Options:
  --pattern <hero-reveal|pinned-horizontal|flip-filter|kinetic-type|magnetic-cursor|scroll-batch>
  --framework <react|vue|svelte|vanilla>
  --world <world-id>
  --json
`;

function takeFlagValue(args: string[], flag: string): string | undefined {
  const prefix = `${flag}=`;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] ?? '';
    if (arg.startsWith(prefix)) {
      args.splice(i, 1);
      return arg.slice(prefix.length);
    }
    if (arg === flag) {
      args.splice(i, 1);
      const next = args[i];
      if (next && !next.startsWith('--')) {
        args.splice(i, 1);
        return next;
      }
      return '';
    }
  }
  return undefined;
}

function takeBooleanFlag(args: string[], flag: string): boolean {
  const idx = args.indexOf(flag);
  if (idx !== -1) {
    args.splice(idx, 1);
    return true;
  }
  return false;
}

export function runCli(argv: string[]): number {
  const args = [...argv];
  const command = args.shift() ?? '--help';

  if (command === '--help' || command === '-h' || command === 'help') {
    process.stdout.write(USAGE);
    return 0;
  }

  if (command === 'detect') {
    const json = takeBooleanFlag(args, '--json');
    const quiet = takeBooleanFlag(args, '--quiet');
    const noAdvisory = takeBooleanFlag(args, '--no-advisory');
    const noInlineIgnores = takeBooleanFlag(args, '--no-inline-ignores');
    const scopeRaw = takeFlagValue(args, '--scope');
    const scopes = scopeRaw ? scopeRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    const targets = args.filter((a) => !a.startsWith('--'));
    const scanPaths = targets.length > 0 ? targets : ['.'];

    const report = scanTargets(scanPaths, {
      ...(scopes ? { scopes } : {}),
      includeAdvisory: !noAdvisory,
      inlineIgnores: !noInlineIgnores,
    });

    if (json) {
      process.stdout.write(JSON.stringify(report, null, 2) + '\n');
      return report.primaryCount > 0 ? 2 : 0;
    }

    if (quiet) {
      process.stderr.write(`${report.primaryCount} anti-pattern${report.primaryCount === 1 ? '' : 's'} found.\n`);
      return report.primaryCount > 0 ? 2 : 0;
    }

    for (const f of report.findings) {
      const lineStr = f.line > 0 ? `line ${f.line}: ` : '';
      process.stderr.write(`${f.file}\n  ${lineStr}[${f.ruleId}] ${f.snippet}\n    → ${f.fix}\n`);
    }
    if (!noAdvisory && report.advisories.length > 0) {
      process.stderr.write(`\n── Advisory (not counted as failures) ──\n`);
      for (const f of report.advisories) {
        const lineStr = f.line > 0 ? `line ${f.line}: ` : '';
        process.stderr.write(`${f.file}\n  ${lineStr}[${f.ruleId}] ${f.snippet}\n    → ${f.fix}\n`);
      }
    }
    process.stderr.write(
      `\n${report.primaryCount} primary anti-pattern${report.primaryCount === 1 ? '' : 's'} found (${report.advisoryCount} advisory).\n`
    );
    return report.primaryCount > 0 ? 2 : 0;
  }

  if (command === 'seed' || command === 'concept-seed') {
    const json = takeBooleanFlag(args, '--json');
    const scope = (takeFlagValue(args, '--scope') ?? 'direction') as 'direction' | 'surface';
    const mode = (takeFlagValue(args, '--mode') ?? 'persuade') as VisitorMode;
    const grain = (takeFlagValue(args, '--grain') ?? 'product') as CompositionGrain;
    const platform = (takeFlagValue(args, '--platform') ?? 'web') as PlatformTarget;
    const register = takeFlagValue(args, '--register') as 'safer' | 'bolder' | undefined;
    const rerollRaw = takeFlagValue(args, '--reroll');
    const fromKey = takeFlagValue(args, '--from');
    const candidateCountRaw = takeFlagValue(args, '--candidate-count');

    const roll = rollConceptSeed({
      scope,
      mode,
      grain,
      platform,
      ...(register ? { register } : {}),
      reroll: rerollRaw ? Number.parseInt(rerollRaw, 10) : 0,
      ...(fromKey ? { fromKey } : {}),
      candidateCount: candidateCountRaw ? Number.parseInt(candidateCountRaw, 10) : 6,
    });

    if (json) {
      process.stdout.write(JSON.stringify(roll, null, 2) + '\n');
    } else {
      process.stdout.write(formatConceptSeed(roll) + '\n');
    }
    return 0;
  }

  if (command === 'tokens') {
    const worldId = takeFlagValue(args, '--world');
    const format = (takeFlagValue(args, '--format') ?? 'css') as TokenFormat;
    process.stdout.write(generateTokens(worldId, format) + '\n');
    return 0;
  }

  if (command === 'specimen') {
    const worldId = takeFlagValue(args, '--world') ?? 'knightvision-editorial-telemetry';
    const outFile = takeFlagValue(args, '--out');
    const html = generateWorldSpecimenHtml(worldId);
    if (outFile) {
      writeFileSync(outFile, html, 'utf8');
      process.stderr.write(`Wrote specimen for '${worldId}' to ${outFile}\n`);
    } else {
      process.stdout.write(html + '\n');
    }
    return 0;
  }

  if (command === 'motion-plan') {
    const json = takeBooleanFlag(args, '--json');
    const pattern = (takeFlagValue(args, '--pattern') ?? 'hero-reveal') as MotionPatternId;
    const framework = (takeFlagValue(args, '--framework') ?? 'react') as FrameworkTarget;
    const worldId = takeFlagValue(args, '--world');
    const blueprint = generateMotionBlueprint(pattern, framework, worldId);
    if (json) {
      process.stdout.write(JSON.stringify(blueprint, null, 2) + '\n');
    } else {
      process.stdout.write(blueprint.code);
    }
    return 0;
  }

  if (command === 'audit') {
    const json = takeBooleanFlag(args, '--json');
    const scopeRaw = takeFlagValue(args, '--scope');
    const scopes = scopeRaw ? scopeRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    const targets = args.filter((a) => !a.startsWith('--'));
    const scanPaths = targets.length > 0 ? targets : ['.'];
    const report = auditTargets(scanPaths, scopes ? { scopes } : {});

    if (json) {
      process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    } else {
      process.stdout.write(formatAuditReport(report) + '\n');
    }
    if (report.scan.scannedFiles === 0) return 1;
    return report.scan.primaryCount > 0 ? 2 : 0;
  }

  if (command === 'rules') {
    const json = takeBooleanFlag(args, '--json');
    const scopeRaw = takeFlagValue(args, '--scope');
    const scopes = scopeRaw ? scopeRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    const rules = filterRulesByScope(scopes);
    if (json) {
      process.stdout.write(JSON.stringify(rules, null, 2) + '\n');
    } else {
      process.stdout.write(`NonGeneric Anti-Pattern Registry (${rules.length}/${ANTIPATTERN_RULES.length} rules):\n\n`);
      for (const r of rules) {
        process.stdout.write(`  [${r.id}] (${r.category} · ${r.severity}) — ${r.name}\n    Fix: ${r.fix}\n`);
      }
    }
    return 0;
  }

  if (command === 'worlds') {
    const json = takeBooleanFlag(args, '--json');
    if (json) {
      process.stdout.write(
        JSON.stringify({ worlds: WORLD_CONCEPTS, compositions: STRUCTURAL_COMPOSITIONS }, null, 2) + '\n'
      );
    } else {
      process.stdout.write(`NonGeneric Curated Aesthetic Worlds (${WORLD_CONCEPTS.length}):\n\n`);
      for (const w of WORLD_CONCEPTS) {
        process.stdout.write(`  • ${w.id} [${w.wellTier}] — ${w.name}\n    Spark: ${w.spark}\n`);
      }
      process.stdout.write(`\nStructural Compositions (${STRUCTURAL_COMPOSITIONS.length}):\n\n`);
      for (const c of STRUCTURAL_COMPOSITIONS) {
        process.stdout.write(`  • ${c.id} [${c.surface} · ${c.grain}] — ${c.name}\n    Spark: ${c.spark}\n`);
      }
    }
    return 0;
  }

  if (command === 'doctor') {
    process.stdout.write(
      JSON.stringify(
        {
          status: 'ok',
          version: '1.0.0',
          node: process.version,
          rulesCount: ANTIPATTERN_RULES.length,
          worldsCount: WORLD_CONCEPTS.length,
          compositionsCount: STRUCTURAL_COMPOSITIONS.length,
        },
        null,
        2
      ) + '\n'
    );
    return 0;
  }

  process.stderr.write(`Unknown command: ${command}\n\n${USAGE}`);
  return 1;
}

const isMain =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  process.exitCode = runCli(process.argv.slice(2));
}
