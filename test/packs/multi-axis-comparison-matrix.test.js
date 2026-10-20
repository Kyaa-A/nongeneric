import test from 'node:test';
import assert from 'node:assert/strict';
import { MULTI_AXIS_COMPARISON_MATRIX_PACK, generateMultiAxisComparisonMatrixBlueprint } from '../../packs/components/multi-axis-comparison-matrix.mjs';
import { scanTargets } from '../../scripts/detector.js';

test('MULTI_AXIS_COMPARISON_MATRIX_PACK has required metadata', () => {
  assert.equal(MULTI_AXIS_COMPARISON_MATRIX_PACK.id, 'multi-axis-comparison-matrix');
  assert.equal(MULTI_AXIS_COMPARISON_MATRIX_PACK.category, 'components');
  assert.ok(MULTI_AXIS_COMPARISON_MATRIX_PACK.typography);
  assert.ok(MULTI_AXIS_COMPARISON_MATRIX_PACK.tokens);
  assert.ok(MULTI_AXIS_COMPARISON_MATRIX_PACK.gsapRecipe);
});

test('generateMultiAxisComparisonMatrixBlueprint generates for all frameworks', () => {
  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const framework of frameworks) {
    const blueprint = generateMultiAxisComparisonMatrixBlueprint({ framework });
    assert.equal(blueprint.id, 'multi-axis-comparison-matrix');
    assert.equal(blueprint.framework, framework);
    assert.ok(typeof blueprint.code === 'string' && blueprint.code.length > 0);
    assert.ok(typeof blueprint.css === 'string' && blueprint.css.length > 0);

    // Check for required gsap integrations
    if (framework === 'react') {
      assert.ok(blueprint.code.includes('useGSAP'), 'React blueprint should use useGSAP');
    } else {
      assert.ok(blueprint.code.includes('gsap.context'), `${framework} blueprint should use gsap.context`);
    }
    assert.ok(blueprint.code.includes('gsap.registerPlugin'), 'Should register GSAP plugins');
    assert.ok(blueprint.code.includes('gsap.matchMedia'), 'Should handle reduced motion with matchMedia');
  }
});

test('HTML showcase passes slop detection', () => {
  const result = scanTargets(['examples/showcases/multi-axis-comparison-matrix.html']);
  assert.equal(result.primaryCount, 0, `Found ${result.primaryCount} primary slop findings`);
});