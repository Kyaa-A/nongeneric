import { test } from 'node:test';
import * as assert from 'node:assert';
import { VELOCITY_MARQUEE_PRESETS, generateVelocityMarqueeBlueprint } from '../../packs/motion/velocity-marquee.mjs';
import { detectInText } from '../../scripts/detector.js';

test('VELOCITY_MARQUEE_PRESETS exports correctly', () => {
    assert.deepStrictEqual(VELOCITY_MARQUEE_PRESETS, [
        'seamless-ribbon-loop',
        'scroll-velocity-skew',
        'ticker-telemetry-tape'
    ]);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateVelocityMarqueeBlueprint generates valid code with no motion/security findings', () => {
    for (const preset of VELOCITY_MARQUEE_PRESETS) {
        for (const framework of frameworks) {
            const blueprint = generateVelocityMarqueeBlueprint({ preset, framework });

            assert.strictEqual(blueprint.preset, preset);
            assert.strictEqual(blueprint.framework, framework);
            assert.deepStrictEqual(blueprint.plugins, ['ScrollTrigger']);

            const findings = detectInText(blueprint.code, 'Marquee.tsx', { scopes: ['motion', 'security'] });

            if (findings.length > 0) {
                console.error(`Findings for ${preset} in ${framework}:`, findings);
            }
            assert.strictEqual(findings.length, 0, `Expected 0 findings for ${preset} in ${framework}, but got ${findings.length}`);

            // Further structural assertions
            assert.ok(blueprint.code.includes('gsap.registerPlugin(ScrollTrigger)'), 'Should register ScrollTrigger');
            assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
            assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
            assert.ok(blueprint.code.includes('xPercent:'), 'Should use xPercent instead of layout properties');

            if (preset === 'scroll-velocity-skew') {
                assert.ok(blueprint.code.includes('self.getVelocity()'), 'Should get velocity for skew');
                assert.ok(blueprint.code.includes('gsap.utils.clamp(-12, 12)'), 'Should clamp skew');
            }

            // Framework specific checks
            if (framework === 'react') {
                assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
            } else {
                assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
            }
        }
    }
});
