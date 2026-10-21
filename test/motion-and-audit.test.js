import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { generateMotionBlueprint } from '../scripts/motion-planner.js';
import { detectInText } from '../scripts/detector.js';
import { auditTargets, formatAuditReport } from '../scripts/auditor.js';
import { runCli } from '../scripts/nongeneric.js';

describe('NonGeneric GSAP Motion Planner, Auditor & CLI', () => {
  it('reports static checks without certifying an empty page as good design', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nongeneric-audit-'));
    try {
      const file = join(dir, 'blank.html');
      writeFileSync(file, '<!doctype html><html lang="en"><head><title>Blank</title></head><body></body></html>');
      const report = auditTargets([file]);
      assert.equal(report.scoreKind, 'static-checks');
      assert.deepEqual(report.verification, {
        visualQuality: 'not-verified',
        usability: 'not-verified',
        accessibility: 'not-verified',
        runtimeBehavior: 'not-verified',
      });
      const output = formatAuditReport(report);
      assert.match(output, /STATIC CHECKS/);
      assert.match(output, /Visual quality: not-verified/);
      assert.doesNotMatch(output, /Impeccable|High-craft/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('does not award a score when no supported files were scanned', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nongeneric-empty-'));
    try {
      const report = auditTargets([dir]);
      assert.equal(report.overallScore, null);
      assert.equal(report.grade, null);
      assert.deepEqual(report.pillars, []);
      assert.match(formatAuditReport(report), /NOT SCORED/);
      assert.equal(runCli(['audit', '--json', dir]), 1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('exposes evidence limits and no-file errors through the JSON CLI', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nongeneric-cli-'));
    try {
      for (const target of [dir, join(dir, 'missing.html')]) {
        const result = spawnSync(process.execPath, ['scripts/nongeneric.js', 'audit', '--json', target], { encoding: 'utf8' });
        assert.equal(result.status, 1, result.stderr);
        const report = JSON.parse(result.stdout);
        assert.equal(report.overallScore, null);
        assert.equal(report.grade, null);
        assert.equal(report.scoreKind, 'static-checks');
      }
      const result = spawnSync(process.execPath, ['scripts/nongeneric.js', 'audit', '--json', 'examples/crafted-knightvision.html'], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      const report = JSON.parse(result.stdout);
      assert.equal(report.overallScore, 100);
      assert.equal(report.grade, 'S');
      assert.equal(report.verification.usability, 'not-verified');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
  const patterns = [
    'hero-reveal',
    'pinned-horizontal',
    'flip-filter',
    'kinetic-type',
    'magnetic-cursor',
    'scroll-batch',
  ];
  const frameworks = ['react', 'vue', 'svelte', 'vanilla'];

  it('generates cleanup-safe, reduced-motion-safe blueprints across all patterns and frameworks', () => {
    for (const pattern of patterns) {
      for (const framework of frameworks) {
        const bp = generateMotionBlueprint(pattern, framework, 'knightvision-editorial-telemetry');
        assert.equal(bp.pattern, pattern);
        assert.equal(bp.framework, framework);
        assert.ok(bp.code.length > 100);

        // Verify generated GSAP code triggers 0 motion anti-patterns!
        const ext = framework === 'react' ? '.tsx' : '.ts';
        const findings = detectInText(bp.code, `generated-${pattern}-${framework}${ext}`, {
          scopes: ['motion'],
        });
        assert.equal(
          findings.length,
          0,
          `Pattern ${pattern} (${framework}) triggered motion findings: ${JSON.stringify(findings)}`
        );
      }
    }
  });

  it('grades crafted-knightvision.html as 100/100 Grade S and broken-ai-slop.html as Grade F', () => {
    const cleanAudit = auditTargets(['examples/crafted-knightvision.html']);
    assert.equal(cleanAudit.overallScore, 100);
    assert.equal(cleanAudit.grade, 'S');
    assert.equal(cleanAudit.remediationPlan.length, 0);

    const brokenAudit = auditTargets(['examples/broken-ai-slop.html']);
    assert.equal(brokenAudit.grade, 'F');
    assert.ok(brokenAudit.overallScore < 40);
    assert.ok(brokenAudit.remediationPlan.some((item) => item.priority === 'P0'));
  });

  it('executes CLI commands cleanly via runCli and via symlinked bin (npm link / npx)', () => {
    assert.equal(runCli(['doctor']), 0);
    assert.equal(runCli(['detect', '--quiet', 'examples/crafted-knightvision.html']), 0);
    assert.equal(runCli(['detect', '--quiet', 'examples/broken-ai-slop.html']), 2);

    const dir = mkdtempSync(join(tmpdir(), 'nongeneric-symlink-'));
    try {
      const linkPath = join(dir, 'nongeneric');
      symlinkSync(resolve('scripts/nongeneric.js'), linkPath);
      const result = spawnSync(process.execPath, [linkPath, 'doctor'], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      const parsed = JSON.parse(result.stdout);
      assert.equal(parsed.status, 'ok');
      assert.equal(parsed.rulesCount, 82);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
