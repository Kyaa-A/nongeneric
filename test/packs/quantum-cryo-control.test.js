import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { QUANTUM_CRYO_CONTROL_PACK, generateQuantumCryoControlBlueprint } from '../../packs/worlds/quantum-cryo-control.mjs';
import { scanTargets } from '../../scripts/detector.js';

test('quantum-cryo-control pack validity', async (t) => {
  await t.test('QUANTUM_CRYO_CONTROL_PACK has required shape', () => {
    assert.equal(QUANTUM_CRYO_CONTROL_PACK.id, 'quantum-cryo-control');
    assert.equal(QUANTUM_CRYO_CONTROL_PACK.title, 'Cryogenic Qubit Dilution & Pulse Sequencer World');
    assert.ok(QUANTUM_CRYO_CONTROL_PACK.typography.display);
    assert.ok(QUANTUM_CRYO_CONTROL_PACK.tokens.groundPrimary);
  });

  await t.test('generateQuantumCryoControlBlueprint() works across frameworks', () => {
    for (const framework of ['vanilla', 'react', 'vue', 'svelte']) {
      const blueprint = generateQuantumCryoControlBlueprint({ framework });
      assert.equal(blueprint.id, 'quantum-cryo-control');
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code.includes('gsap.registerPlugin()'));
      assert.ok(blueprint.code.includes('prefers-reduced-motion: reduce'));
      assert.ok(blueprint.css.includes('--color-ground-primary'));
    }
  });

  await t.test('examples/showcases/quantum-cryo-control.html has no slop', () => {
    const report = scanTargets(['examples/showcases/quantum-cryo-control.html']);
    assert.equal(report.primaryCount, 0, 'Should have 0 primary findings');
  });
});
