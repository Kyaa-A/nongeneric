import test from 'node:test';
import assert from 'node:assert';
import { RADIAL_DIAL_HUD_PACK, generateRadialDialHudBlueprint } from '../../packs/components/radial-dial-hud.mjs';
import { scanTargets } from '../../scripts/detector.js';
import { join } from 'node:path';

test('Radial Dial HUD Pack Metadata', (t) => {
    assert.strictEqual(RADIAL_DIAL_HUD_PACK.id, 'radial-dial-hud');
    assert.strictEqual(RADIAL_DIAL_HUD_PACK.title, 'Tactile Radial Encoder & Precision Dial HUD');
    assert.strictEqual(RADIAL_DIAL_HUD_PACK.category, 'components');
    assert.deepStrictEqual(RADIAL_DIAL_HUD_PACK.typography, {
        display: "Rajdhani",
        body: "Atkinson Hyperlegible",
        mono: "IBM Plex Mono"
    });
    assert.ok(RADIAL_DIAL_HUD_PACK.tokens.background.startsWith('oklch'));
});

test('generateRadialDialHudBlueprint outputs correctly across frameworks', (t) => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const fw of frameworks) {
        const blueprint = generateRadialDialHudBlueprint({ framework: fw });
        assert.strictEqual(blueprint.id, 'radial-dial-hud');
        assert.strictEqual(blueprint.framework, fw);
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), `${fw} should contain gsap.matchMedia()`);
        assert.ok(blueprint.code.includes('gsap.registerPlugin(Draggable)'), `${fw} should register Draggable`);
        if (fw === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('));
        } else {
            assert.ok(blueprint.code.includes('gsap.context('));
        }
    }
});

test('examples/showcases/radial-dial-hud.html passes scanTargets with 0 primary findings', (t) => {
    const showcasePath = join(process.cwd(), 'examples/showcases/radial-dial-hud.html');
    const result = scanTargets([showcasePath]);
    assert.strictEqual(result.primaryCount, 0, `Expected 0 primary findings, but got ${result.primaryCount}. Findings: ${JSON.stringify(result.findings)}`);
});
