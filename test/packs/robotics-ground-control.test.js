import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { ROBOTICS_GROUND_CONTROL_PACK, generateRoboticsGroundControlBlueprint } from '../../packs/worlds/robotics-ground-control.mjs';
import { scanTargets } from '../../scripts/detector.js';

test('robotics-ground-control pack validity', async (t) => {
  await t.test('ROBOTICS_GROUND_CONTROL_PACK has required shape', () => {
    assert.equal(ROBOTICS_GROUND_CONTROL_PACK.id, 'robotics-ground-control');
    assert.equal(ROBOTICS_GROUND_CONTROL_PACK.title, 'Autonomous Robotics & Drone Ground Control World');
    assert.equal(ROBOTICS_GROUND_CONTROL_PACK.category, 'worlds');
    assert.equal(ROBOTICS_GROUND_CONTROL_PACK.typography.display, 'Rajdhani');
    assert.equal(ROBOTICS_GROUND_CONTROL_PACK.typography.body, 'Atkinson Hyperlegible');
    assert.equal(ROBOTICS_GROUND_CONTROL_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(ROBOTICS_GROUND_CONTROL_PACK.tokens);
    assert.ok(ROBOTICS_GROUND_CONTROL_PACK.gsapRecipe);
  });

  await t.test('generateRoboticsGroundControlBlueprint returns valid shape across frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];
    for (const fw of frameworks) {
      const blueprint = generateRoboticsGroundControlBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'robotics-ground-control');
      assert.equal(blueprint.framework, fw);
      assert.ok(blueprint.css.includes('--robotics-background'));
      assert.ok(blueprint.code.includes('robotics-alert'));
    }
  });

  await t.test('examples/showcases/robotics-ground-control.html has no slop', () => {
    const report = scanTargets(['examples/showcases/robotics-ground-control.html']);
    assert.equal(report.primaryCount, 0, 'Should have 0 primary findings');
  });
});