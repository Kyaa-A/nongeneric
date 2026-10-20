import { test } from 'node:test';
import assert from 'node:assert';
import { EDITORIAL_MASTHEAD_COLOPHON_PACK, generateEditorialMastheadColophonBlueprint } from '../../packs/components/editorial-masthead-colophon.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

test('EDITORIAL_MASTHEAD_COLOPHON_PACK metadata', (t) => {
  assert.strictEqual(EDITORIAL_MASTHEAD_COLOPHON_PACK.id, 'editorial-masthead-colophon');
  assert.strictEqual(EDITORIAL_MASTHEAD_COLOPHON_PACK.title, 'Broadsheet Masthead, Issue Colophon & Index Bar');
  assert.strictEqual(EDITORIAL_MASTHEAD_COLOPHON_PACK.category, 'components');

  assert.ok(EDITORIAL_MASTHEAD_COLOPHON_PACK.typography);
  assert.strictEqual(EDITORIAL_MASTHEAD_COLOPHON_PACK.typography.display, 'Playfair Display');
  assert.strictEqual(EDITORIAL_MASTHEAD_COLOPHON_PACK.typography.body, 'Source Serif 4');
  assert.strictEqual(EDITORIAL_MASTHEAD_COLOPHON_PACK.typography.mono, 'IBM Plex Mono');

  assert.ok(EDITORIAL_MASTHEAD_COLOPHON_PACK.tokens);
  assert.ok(EDITORIAL_MASTHEAD_COLOPHON_PACK.gsapRecipe);
});

test('generateEditorialMastheadColophonBlueprint generates code for all frameworks', (t) => {
  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const framework of frameworks) {
    const blueprint = generateEditorialMastheadColophonBlueprint({ framework });
    assert.strictEqual(blueprint.id, 'editorial-masthead-colophon');
    assert.strictEqual(blueprint.framework, framework);
    assert.ok(blueprint.code);
    assert.ok(blueprint.css);

    // Check that code contains GSAP safe practices
    assert.ok(blueprint.code.includes('gsap.matchMedia('), `${framework} code should use gsap.matchMedia()`);
    assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), `${framework} code should respect prefers-reduced-motion`);

    if (framework === 'react') {
      assert.ok(blueprint.code.includes('gsap.registerPlugin(useGSAP)'), 'react code should register useGSAP plugin');
      assert.ok(blueprint.code.includes('useGSAP('), 'react code should use useGSAP');
    }

    const findings = detectInText(blueprint.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.strictEqual(findings.length, 0, `Blueprint for ${framework} should have 0 findings`);
  }
});

test('editorial-masthead-colophon HTML showcase passes scanTargets', (t) => {
  const results = scanTargets(['examples/showcases/editorial-masthead-colophon.html']);
  assert.strictEqual(results.primaryCount, 0, 'Should have 0 primary findings');
});
