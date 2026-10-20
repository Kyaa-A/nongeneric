import test from 'node:test';
import assert from 'node:assert';
import { GESTURE_PHYSICS_PRESETS, generateGesturePhysicsBlueprint } from '../../packs/motion/gesture-physics.mjs';
import { detectInText } from '../../scripts/detector.js';

test('gesture-physics presets are exported correctly', () => {
  assert.deepStrictEqual(GESTURE_PHYSICS_PRESETS, [
    'observer-chamber-deck',
    'draggable-Bounded-canvas',
    'elastic-dial-snap'
  ]);
});

test('generateGesturePhysicsBlueprint generates valid, 0-finding code', () => {
  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const preset of GESTURE_PHYSICS_PRESETS) {
    for (const framework of frameworks) {
      const blueprint = generateGesturePhysicsBlueprint({ preset, framework });

      assert.strictEqual(blueprint.preset, preset);
      assert.strictEqual(blueprint.framework, framework);
      assert.ok(blueprint.code.includes('matchMedia'));
      assert.ok(blueprint.code.includes('prefers-reduced-motion: reduce'));
      assert.ok(blueprint.keyboardFallback.includes('handleKeyDown'));

      // The key test: must pass the detector with 0 findings in motion and security scopes
      const findings = detectInText(blueprint.code, 'Gesture.tsx', { scopes: ['motion', 'security'] });

      if (findings.length > 0) {
        console.error(`Findings for ${preset} in ${framework}:`, findings);
      }

      assert.strictEqual(findings.length, 0, `Expected 0 findings for ${preset} in ${framework}, but got ${findings.length}`);
    }
  }
});
