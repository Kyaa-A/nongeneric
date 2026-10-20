import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SPATIAL_CANVAS_MINIMAP_PACK, generateSpatialCanvasMinimapBlueprint } from '../../packs/components/spatial-canvas-minimap.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

describe('Spatial Canvas Minimap Pack', () => {
  test('SPATIAL_CANVAS_MINIMAP_PACK has required metadata', () => {
    assert.strictEqual(SPATIAL_CANVAS_MINIMAP_PACK.id, 'spatial-canvas-minimap');
    assert.strictEqual(SPATIAL_CANVAS_MINIMAP_PACK.category, 'components');
    assert.strictEqual(SPATIAL_CANVAS_MINIMAP_PACK.typography.display, 'Barlow Condensed');
    assert.strictEqual(SPATIAL_CANVAS_MINIMAP_PACK.typography.body, 'Atkinson Hyperlegible');
    assert.strictEqual(SPATIAL_CANVAS_MINIMAP_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(SPATIAL_CANVAS_MINIMAP_PACK.tokens);
    assert.ok(SPATIAL_CANVAS_MINIMAP_PACK.gsapRecipe);
  });

  const frameworks = ['react', 'vue', 'svelte', 'vanilla'];

  for (const fw of frameworks) {
    test(`generateSpatialCanvasMinimapBlueprint generates clean code for ${fw}`, () => {
      const blueprint = generateSpatialCanvasMinimapBlueprint({ framework: fw });
      assert.strictEqual(blueprint.id, 'spatial-canvas-minimap');
      assert.strictEqual(blueprint.framework, fw);
      assert.ok(blueprint.code);
      assert.ok(blueprint.css);

      // Verify anti-slop rules on generated code
      const findings = detectInText(blueprint.code, `Component.${fw === 'react' ? 'tsx' : fw === 'vue' ? 'vue' : fw === 'svelte' ? 'svelte' : 'js'}`, { scopes: ['motion', 'security'] });

      const primaryFindings = findings.filter(f => !f.advisory);
      assert.strictEqual(primaryFindings.length, 0, `Found primary findings in ${fw} code: ${primaryFindings.map(f => f.ruleId).join(', ')}`);
    });
  }

  test('Showcase HTML passes anti-slop detector', () => {
    const result = scanTargets(['examples/showcases/spatial-canvas-minimap.html']);
    assert.strictEqual(result.primaryCount, 0, `Found ${result.primaryCount} primary findings in showcase: ${result.findings.map(f => f.ruleId).join(', ')}`);
  });
});
