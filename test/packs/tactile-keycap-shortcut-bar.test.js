import { test } from 'node:test';
import * as assert from 'node:assert';
import { TACTILE_KEYCAP_SHORTCUT_BAR_PACK, generateTactileKeycapShortcutBarBlueprint } from '../../packs/components/tactile-keycap-shortcut-bar.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('TACTILE_KEYCAP_SHORTCUT_BAR_PACK exports correctly with metadata', () => {
    assert.strictEqual(TACTILE_KEYCAP_SHORTCUT_BAR_PACK.id, 'tactile-keycap-shortcut-bar');
    assert.strictEqual(TACTILE_KEYCAP_SHORTCUT_BAR_PACK.category, 'components');
    assert.ok(TACTILE_KEYCAP_SHORTCUT_BAR_PACK.typography);
    assert.ok(TACTILE_KEYCAP_SHORTCUT_BAR_PACK.tokens);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateTactileKeycapShortcutBarBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateTactileKeycapShortcutBarBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'tactile-keycap-shortcut-bar');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        assert.strictEqual(findings.length, 0, `Expected 0 findings in ${framework}, but got ${findings.length}`);

        assert.ok(blueprint.code.includes('gsap.registerPlugin()'), 'Should register GSAP plugins');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('examples/showcases/tactile-keycap-shortcut-bar.html passes detector scan', () => {
    const results = scanTargets(['examples/showcases/tactile-keycap-shortcut-bar.html']);
    assert.strictEqual(results.primaryCount, 0, 'Showcase HTML should have 0 primary findings');
});
