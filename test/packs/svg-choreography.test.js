import test from 'node:test';
import assert from 'node:assert';
import { SVG_CHOREOGRAPHY_PRESETS, generateSvgMotionBlueprint } from '../../packs/motion/svg-choreography.mjs';
import { detectInText } from '../../scripts/detector.js';

test('SVG Choreography Motion Blueprints', async (t) => {
  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const preset of SVG_CHOREOGRAPHY_PRESETS) {
    for (const framework of frameworks) {
      await t.test(`Generates valid GSAP motion blueprint for ${preset} in ${framework}`, () => {
        const bp = generateSvgMotionBlueprint({ preset, framework });

        assert.strictEqual(bp.preset, preset);
        assert.strictEqual(bp.framework, framework);
        assert.ok(bp.code.length > 0);
        assert.ok(bp.plugins.length > 0);

        const findings = detectInText(bp.code, 'Blueprint.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for ${preset} in ${framework}:`, findings);
        }

        assert.strictEqual(findings.length, 0, `Expected 0 findings but got ${findings.length}`);
      });
    }
  }
});
