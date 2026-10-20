import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { SPATIAL_MONOGRAPH_PACK, generateSpatialMonographBlueprint } from '../../packs/worlds/spatial-monograph.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('spatial-monograph pack validity', async (t) => {
  await t.test('SPATIAL_MONOGRAPH_PACK has required shape', () => {
    assert.equal(SPATIAL_MONOGRAPH_PACK.id, 'spatial-monograph');
    assert.equal(SPATIAL_MONOGRAPH_PACK.title, 'Architectural Monograph & Spatial Practice World');
    assert.equal(SPATIAL_MONOGRAPH_PACK.category, 'worlds');
    assert.equal(SPATIAL_MONOGRAPH_PACK.typography.display, 'Cormorant Garamond');
    assert.equal(SPATIAL_MONOGRAPH_PACK.typography.body, 'Work Sans');
    assert.equal(SPATIAL_MONOGRAPH_PACK.typography.mono, 'IBM Plex Mono');
    assert.ok(SPATIAL_MONOGRAPH_PACK.tokens.surface.includes('oklch'));
    assert.ok(SPATIAL_MONOGRAPH_PACK.tokens.ink.includes('oklch'));
    assert.ok(SPATIAL_MONOGRAPH_PACK.gsapRecipe);
  });

  await t.test('generateSpatialMonographBlueprint() supports all frameworks and passes detector', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];
    for (const fw of frameworks) {
      const blueprint = generateSpatialMonographBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'spatial-monograph');
      assert.equal(blueprint.framework, fw);
      assert.ok(blueprint.code.includes('gsap.matchMedia()'));
      if (fw === 'react') {
        assert.ok(blueprint.code.includes('useGSAP'));
      } else {
        assert.ok(blueprint.code.includes('gsap.context'));
      }
      const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });
      assert.equal(findings.length, 0, `Detector findings found in ${fw} blueprint code: ${JSON.stringify(findings)}`);
    }
  });

  await t.test('HTML showcase passes detector with 0 primary findings', () => {
    const report = scanTargets(['examples/showcases/spatial-monograph.html']);
    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, found ${report.primaryCount}: ${JSON.stringify(report.findings)}`);
  });
});
