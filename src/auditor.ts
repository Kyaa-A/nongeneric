import { scanTargets } from './detector.js';
import type { AuditReport, Finding, PillarScore, ScanOptions } from './types.js';

function mapFindingToPillar(f: Finding): PillarScore['pillar'] {
  if (
    [
      'overused-font',
      'gradient-text',
      'animated-gradient-text',
      'wide-tracking',
      'extreme-negative-tracking',
      'all-caps-body',
      'undersized-ui-text',
      'wide-line-measure',
      'narrow-line-measure',
      'tight-line-height',
      'loose-heading-line-height',
      'orphaned-heading',
    ].includes(f.ruleId)
  ) {
    return 'typography';
  }
  if (
    [
      'purple-blue-gradient',
      'ai-color-palette',
      'cyan-on-dark',
      'neon-accent',
      'dark-glow',
      'radial-halo',
      'glassmorphism',
      'gray-on-color',
      'pure-black-or-white',
      'low-contrast-text',
      'low-contrast-near-bar',
      'link-text-contrast',
      'buried-raster',
    ].includes(f.ruleId)
  ) {
    return 'color';
  }
  if (f.category === 'motion' || ['bounce-easing', 'marquee', 'faux-3d-tilt'].includes(f.ruleId)) {
    return 'motion';
  }
  if (
    f.category === 'copy' ||
    [
      'em-dash-overuse',
      'marketing-buzzword',
      'aphoristic-cadence',
      'placeholder-text',
      'placeholder-slop',
      'generic-button-label',
      'sparkle-icon-ai',
      'generic-avatar-stack',
    ].includes(f.ruleId)
  ) {
    return 'copy';
  }
  return 'layout';
}

export function auditTargets(targets: readonly string[], options: ScanOptions = {}): AuditReport {
  const scan = scanTargets(targets, { ...options, includeAdvisory: true });
  const allFindings = [...scan.findings, ...scan.advisories];

  const pillars: Record<PillarScore['pillar'], PillarScore> = {
    typography: {
      pillar: 'typography',
      label: 'Typography & Hierarchy',
      score: 20,
      maxScore: 20,
      deductions: [],
    },
    color: {
      pillar: 'color',
      label: 'OKLCH Color & Atmosphere',
      score: 20,
      maxScore: 20,
      deductions: [],
    },
    layout: {
      pillar: 'layout',
      label: 'Spatial Rhythm & 320px Responsive',
      score: 20,
      maxScore: 20,
      deductions: [],
    },
    motion: {
      pillar: 'motion',
      label: 'GSAP Motion & Choreography',
      score: 20,
      maxScore: 20,
      deductions: [],
    },
    copy: {
      pillar: 'copy',
      label: 'Copy Authenticity & Security',
      score: 20,
      maxScore: 20,
      deductions: [],
    },
  };

  for (const f of allFindings) {
    const key = mapFindingToPillar(f);
    const p = pillars[key];
    const penalty = f.severity === 'error' ? 6 : f.severity === 'warning' ? 3 : 1;
    p.score = Math.max(0, p.score - penalty);
    if (p.deductions.length < 5) {
      p.deductions.push(`[${f.ruleId}] (${f.file}:${f.line}) ${f.snippet}`);
    }
  }

  const pillarList = Object.values(pillars);
  const overallScore = pillarList.reduce((acc, p) => acc + p.score, 0);

  let grade: AuditReport['grade'] = 'F';
  if (overallScore >= 95 && scan.primaryCount === 0) grade = 'S';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 72) grade = 'B';
  else if (overallScore >= 58) grade = 'C';
  else if (overallScore >= 40) grade = 'D';

  const verdict =
    scan.scannedFiles === 0
      ? 'No supported files scanned; static checks were not scored.'
      : grade === 'S'
      ? 'Zero primary anti-patterns detected in scanned source. Design quality is not verified.'
      : grade === 'A'
        ? 'Few static-check deductions. Design quality is not verified.'
        : grade === 'B'
          ? 'Static anti-pattern findings require review. Design quality is not verified.'
          : 'Significant static anti-pattern findings require remediation. Design quality is not verified.';

  const remediationPlan = allFindings.map((f) => {
    const priority: 'P0' | 'P1' | 'P2' | 'P3' =
      f.severity === 'error'
        ? 'P0'
        : f.category === 'slop' || f.category === 'motion' || f.category === 'responsive'
          ? 'P1'
          : f.severity === 'warning'
            ? 'P2'
            : 'P3';
    return {
      priority,
      ruleId: f.ruleId,
      location: f.line > 0 ? `${f.file}:${f.line}` : f.file,
      action: f.fix,
    };
  });

  const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
  remediationPlan.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    scoreKind: 'static-checks',
    overallScore: scan.scannedFiles > 0 ? overallScore : null,
    grade: scan.scannedFiles > 0 ? grade : null,
    verification: {
      visualQuality: 'not-verified',
      usability: 'not-verified',
      accessibility: 'not-verified',
      runtimeBehavior: 'not-verified',
    },
    verdict,
    pillars: scan.scannedFiles > 0 ? pillarList : [],
    scan,
    remediationPlan,
  };
}

export function formatAuditReport(report: AuditReport): string {
  const lines: string[] = [];
  lines.push('══════════════════════════════════════════════════════════════════════');
  const score = report.overallScore === null
    ? 'NOT SCORED'
    : `SCORE: ${report.overallScore}/100 (GRADE ${report.grade})`;
  lines.push(`  NONGENERIC STATIC CHECKS — ${score}`);
  lines.push(`  Verdict: ${report.verdict}`);
  lines.push('  Scope: source patterns only; scores do not certify design quality or accessibility.');
  lines.push(`  Visual quality: ${report.verification.visualQuality}`);
  lines.push(`  Usability: ${report.verification.usability}`);
  lines.push(`  Accessibility: ${report.verification.accessibility}`);
  lines.push(`  Runtime behavior: ${report.verification.runtimeBehavior}`);
  lines.push('══════════════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push('PILLAR BREAKDOWN:');
  for (const p of report.pillars) {
    lines.push(`  • ${p.label.padEnd(36)} ${String(p.score).padStart(2)}/${p.maxScore}`);
    for (const d of p.deductions) {
      lines.push(`      - ${d}`);
    }
  }
  lines.push('');
  lines.push(
    `SUMMARY: Scanned ${report.scan.scannedFiles} file(s) | ${report.scan.primaryCount} primary finding(s) | ${report.scan.advisoryCount} advisory note(s)`
  );

  if (report.remediationPlan.length > 0) {
    lines.push('');
    lines.push('ACTIONABLE REMEDIATION PLAN (P0–P3):');
    for (const item of report.remediationPlan.slice(0, 20)) {
      lines.push(`  [${item.priority}] [${item.ruleId}] ${item.location}`);
      lines.push(`       → ${item.action}`);
    }
  }

  return lines.join('\n');
}
