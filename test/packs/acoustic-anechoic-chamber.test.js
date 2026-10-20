import test from 'node:test';
import assert from 'node:assert/strict';
import { ACOUSTIC_ANECHOIC_CHAMBER_PACK, generateAcousticAnechoicChamberBlueprint } from '../../packs/worlds/acoustic-anechoic-chamber.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('ACOUSTIC_ANECHOIC_CHAMBER_PACK', async (t) => {
  await t.test('metadata is correctly structured', () => {
    assert.equal(ACOUSTIC_ANECHOIC_CHAMBER_PACK.id, 'acoustic-anechoic-chamber');
    assert.equal(ACOUSTIC_ANECHOIC_CHAMBER_PACK.title, 'Acoustic Impulse & Harmonics Lab World');
    assert.equal(ACOUSTIC_ANECHOIC_CHAMBER_PACK.category, 'worlds');
    assert.equal(ACOUSTIC_ANECHOIC_CHAMBER_PACK.typography.display, 'Barlow Condensed');
    assert.equal(ACOUSTIC_ANECHOIC_CHAMBER_PACK.typography.body, 'Work Sans');
    assert.equal(ACOUSTIC_ANECHOIC_CHAMBER_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(ACOUSTIC_ANECHOIC_CHAMBER_PACK.tokens);
    assert.ok(ACOUSTIC_ANECHOIC_CHAMBER_PACK.gsapRecipe);
  });

  await t.test('generateAcousticAnechoicChamberBlueprint works for all frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];
    for (const framework of frameworks) {
      const blueprint = generateAcousticAnechoicChamberBlueprint({ framework });
      assert.equal(blueprint.id, 'acoustic-anechoic-chamber');
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code.includes('gsap.registerPlugin'));
      assert.ok(blueprint.code.includes('gsap.matchMedia'));

      const findings = detectInText(blueprint.code, `Component.${framework}`, { scopes: ['motion', 'security'] });
      assert.equal(findings.length, 0, `Found issues in generated ${framework} blueprint`);
    }
  });

  await t.test('HTML showcase passes the static detector', () => {
    const result = scanTargets(['examples/showcases/acoustic-anechoic-chamber.html']);
    assert.equal(result.primaryCount, 0, 'Found primary issues in HTML showcase');
  });
});
