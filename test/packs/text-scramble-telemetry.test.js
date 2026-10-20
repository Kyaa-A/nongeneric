import { test } from 'node:test';
import * as assert from 'node:assert';
import { TEXT_SCRAMBLE_PRESETS, generateTextScrambleBlueprint } from '../../packs/motion/text-scramble-telemetry.mjs';
import { detectInText } from '../../scripts/detector.js';

test('TEXT_SCRAMBLE_PRESETS exports correctly', () => {
    assert.deepStrictEqual(TEXT_SCRAMBLE_PRESETS, [
        'cipher-glyph-decode',
        'tabular-odometer-roll',
        'coordinate-lock-reveal'
    ]);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateTextScrambleBlueprint generates valid code with no motion/security findings', () => {
    for (const preset of TEXT_SCRAMBLE_PRESETS) {
        for (const framework of frameworks) {
            const blueprint = generateTextScrambleBlueprint({ preset, framework });

            assert.strictEqual(blueprint.preset, preset);
            assert.strictEqual(blueprint.framework, framework);
            assert.deepStrictEqual(blueprint.plugins, ['TextPlugin']);
            assert.ok(blueprint.a11yNotes.includes('aria-label'), 'Should include a11y notes');

            const findings = detectInText(blueprint.code, 'Scramble.tsx', { scopes: ['motion', 'security'] });

            if (findings.length > 0) {
                console.error(`Findings for ${preset} in ${framework}:`, findings);
            }
            assert.strictEqual(findings.length, 0, `Expected 0 findings for ${preset} in ${framework}, but got ${findings.length}`);

            // Structural assertions
            assert.ok(blueprint.code.includes('textContent'), 'Should use textContent instead of innerHTML');
            assert.ok(!blueprint.code.includes('innerHTML'), 'Should not use innerHTML');
            assert.ok(blueprint.code.includes('aria-label'), 'Should use aria-label on parent');
            assert.ok(blueprint.code.includes('aria-hidden="true"'), 'Should use aria-hidden="true" on animated span');
            assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should handle reduced motion with matchMedia');
            assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle prefers-reduced-motion: reduce');

            // Framework specific checks
            if (framework === 'react') {
                assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
            } else if (framework === 'vue' || framework === 'svelte' || framework === 'vanilla') {
                assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
            }
        }
    }
});
