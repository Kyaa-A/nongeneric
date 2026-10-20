import { test } from 'node:test';
import * as assert from 'node:assert';
import { FLIP_SHARED_PRESETS, generateFlipSharedBlueprint } from '../../packs/motion/flip-shared-element.mjs';
import { detectInText } from '../../scripts/detector.js';

test('FLIP_SHARED_PRESETS exports correctly', () => {
    assert.deepStrictEqual(FLIP_SHARED_PRESETS, [
        'card-to-dossier-sheet',
        'specimen-lightbox-fit',
        'dock-to-inspector-panel'
    ]);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateFlipSharedBlueprint generates valid code with no motion/security findings', () => {
    for (const preset of FLIP_SHARED_PRESETS) {
        for (const framework of frameworks) {
            const blueprint = generateFlipSharedBlueprint({ preset, framework });

            assert.strictEqual(blueprint.preset, preset);
            assert.strictEqual(blueprint.framework, framework);
            assert.deepStrictEqual(blueprint.plugins, ['Flip']);
            assert.ok(blueprint.focusManagementNotes.includes('Escape'));

            const findings = detectInText(blueprint.code, 'FlipShared.tsx', { scopes: ['motion', 'security'] });

            if (findings.length > 0) {
                console.error(`Findings for ${preset} in ${framework}:`, findings);
            }
            assert.strictEqual(findings.length, 0, `Expected 0 findings for ${preset} in ${framework}, but got ${findings.length}`);

            // Structural assertions
            assert.ok(blueprint.code.includes('gsap.registerPlugin(Flip)'), 'Should register Flip');
            if (framework === 'react') {
                assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
                assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
            } else {
                assert.ok(blueprint.code.includes('window.matchMedia'), 'Should handle reduced motion via matchMedia');
                assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle reduced motion');
            }
            assert.ok(blueprint.code.includes('Flip.getState('), 'Should get Flip state');
            assert.ok(blueprint.code.includes('Flip.from('), 'Should call Flip.from');
            assert.ok(blueprint.code.includes('Escape'), 'Should handle Escape key');
            assert.ok(blueprint.code.includes('focus()'), 'Should restore focus');

            // Framework specific checks
            if (framework === 'react') {
                assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
            } else {
                assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
            }
        }
    }
});
