import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PROVENANCE_DIFF_LENS_PACK, generateProvenanceDiffLensBlueprint } from '../../packs/components/provenance-diff-lens.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

describe('Provenance Diff Lens Component Pack', () => {
  it('exports valid PROVENANCE_DIFF_LENS_PACK metadata', () => {
    assert.equal(PROVENANCE_DIFF_LENS_PACK.id, 'provenance-diff-lens');
    assert.equal(PROVENANCE_DIFF_LENS_PACK.category, 'components');
    assert.equal(PROVENANCE_DIFF_LENS_PACK.typography.display, 'Newsreader');
    assert.equal(PROVENANCE_DIFF_LENS_PACK.typography.body, 'Work Sans');
    assert.equal(PROVENANCE_DIFF_LENS_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(PROVENANCE_DIFF_LENS_PACK.tokens);
    assert.ok(PROVENANCE_DIFF_LENS_PACK.gsapRecipe);
  });

  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const framework of frameworks) {
    it(`generates valid blueprint for ${framework} framework`, () => {
      const blueprint = generateProvenanceDiffLensBlueprint({ framework });

      assert.equal(blueprint.id, 'provenance-diff-lens');
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code.includes('gsap.registerPlugin(ScrollTrigger)'));
      assert.ok(blueprint.code.includes('gsap.matchMedia()'));
      assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'));
      assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'));
      assert.ok(blueprint.code.includes('gsap.context'));

      // Framework specific checks
      if (framework === 'react') {
        assert.ok(blueprint.code.includes('container.current'));
      } else if (framework === 'vue') {
        assert.ok(blueprint.code.includes('container.value'));
      } else if (framework === 'svelte') {
        assert.ok(blueprint.code.includes('}, container)'));
      } else {
        assert.ok(blueprint.code.includes('}, element)'));
      }

      // Ensure zero findings for motion/security scopes
      const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });
      assert.equal(findings.length, 0, `Expected 0 findings but got: ${JSON.stringify(findings)}`);
    });
  }

  it('HTML showcase passes strict detector scan with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/provenance-diff-lens.html']);
    assert.equal(report.primaryCount, 0, `Showcase has ${report.primaryCount} findings: ${JSON.stringify(report.findings)}`);
  });
});
