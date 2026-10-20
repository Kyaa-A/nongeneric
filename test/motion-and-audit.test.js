import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateMotionBlueprint } from '../scripts/motion-planner.js';
import { detectInText } from '../scripts/detector.js';
import { auditTargets } from '../scripts/auditor.js';
import { runCli } from '../scripts/nongeneric.js';

describe('NonGeneric GSAP Motion Planner, Auditor & CLI', () => {
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

  it('executes CLI commands cleanly via runCli', () => {
    assert.equal(runCli(['doctor']), 0);
    assert.equal(runCli(['detect', '--quiet', 'examples/crafted-knightvision.html']), 0);
    assert.equal(runCli(['detect', '--quiet', 'examples/broken-ai-slop.html']), 2);
  });
});
