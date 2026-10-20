import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { AVIONICS_CNC_WORLD, compileAvionicsCncCss } from '../../packs/worlds/avionics-cnc.mjs';
import { scanTargets } from '../../scripts/detector.js';

test('avionics-cnc pack validity', async (t) => {
  await t.test('AVIONICS_CNC_WORLD has required shape', () => {
    assert.equal(AVIONICS_CNC_WORLD.id, 'avionics-cnc');
    assert.equal(AVIONICS_CNC_WORLD.name, 'Anodized CNC & Flight-Deck Avionics');
    assert.ok(AVIONICS_CNC_WORLD.Typography.display);
    assert.ok(AVIONICS_CNC_WORLD.Palette.surfaces);
  });

  await t.test('compileAvionicsCncCss() returns valid CSS', () => {
    const css = compileAvionicsCncCss();
    assert.ok(css.includes(':root {'));
    assert.ok(css.includes('--color-surface-base'));
    assert.ok(css.includes('--font-display'));
  });

  await t.test('examples/showcases/avionics-cnc.html has no slop', () => {
    const report = scanTargets(['examples/showcases/avionics-cnc.html']);
    assert.equal(report.primaryCount, 0, 'Should have 0 primary findings');
  });
});
