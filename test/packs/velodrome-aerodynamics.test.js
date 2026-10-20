import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { VELODROME_AERODYNAMICS_PACK, generateVelodromeAerodynamicsBlueprint } from '../../packs/worlds/velodrome-aerodynamics.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

test('velodrome-aerodynamics pack validity', async (t) => {
  await t.test('VELODROME_AERODYNAMICS_PACK has required shape', () => {
    assert.equal(VELODROME_AERODYNAMICS_PACK.id, 'velodrome-aerodynamics');
    assert.equal(VELODROME_AERODYNAMICS_PACK.title, 'Computational Fluid Dynamics & Wind-Tunnel Telemetry World');
    assert.ok(VELODROME_AERODYNAMICS_PACK.typography.display);
    assert.ok(VELODROME_AERODYNAMICS_PACK.tokens.surface);
  });

  await t.test('examples/showcases/velodrome-aerodynamics.html has no slop', () => {
    const report = scanTargets(['examples/showcases/velodrome-aerodynamics.html']);
    assert.equal(report.primaryCount, 0, 'Should have 0 primary findings');
  });

  await t.test('generateVelodromeAerodynamicsBlueprint generates valid code across frameworks', async (t) => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const fw of frameworks) {
      await t.test(`blueprint for ${fw}`, () => {
        const blueprint = generateVelodromeAerodynamicsBlueprint({ framework: fw });
        assert.equal(blueprint.id, 'velodrome-aerodynamics');
        assert.equal(blueprint.framework, fw);
        assert.ok(blueprint.css.includes(':root {'));

        const findings = detectInText(blueprint.code, `Component.${fw === 'react' ? 'tsx' : fw === 'vue' ? 'vue' : fw === 'svelte' ? 'svelte' : 'js'}`, { scopes: ['motion', 'security'] });
        const primaryCount = findings.filter(f => !f.advisory).length;
        assert.equal(primaryCount, 0, `Should have 0 primary findings for ${fw}`);
      });
    }
  });
});
