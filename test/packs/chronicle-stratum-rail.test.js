import { test } from 'node:test';
import * as assert from 'node:assert';
import { CHRONICLE_STRATUM_RAIL_PACK, generateChronicleStratumRailBlueprint } from '../../packs/components/chronicle-stratum-rail.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

test('CHRONICLE_STRATUM_RAIL_PACK exports correctly', () => {
    assert.strictEqual(CHRONICLE_STRATUM_RAIL_PACK.id, 'chronicle-stratum-rail');
    assert.strictEqual(CHRONICLE_STRATUM_RAIL_PACK.title, 'Pinned Vertical Stratum & Epoch Timeline Rail');
    assert.strictEqual(CHRONICLE_STRATUM_RAIL_PACK.category, 'components');
    assert.deepStrictEqual(CHRONICLE_STRATUM_RAIL_PACK.gsapRecipe.plugins, ['ScrollTrigger']);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateChronicleStratumRailBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateChronicleStratumRailBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'chronicle-stratum-rail');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for chronicle-stratum-rail in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for chronicle-stratum-rail in ${framework}, but got ${findings.length}`);

        // Further structural assertions
        assert.ok(blueprint.code.includes('gsap.registerPlugin(ScrollTrigger)'), 'Should register ScrollTrigger');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('ScrollTrigger.create('), 'Should create ScrollTrigger');
        assert.ok(blueprint.code.includes('pin:'), 'Should pin the rail wrapper');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('Showcase HTML has 0 primary findings', () => {
    const results = scanTargets(['examples/showcases/chronicle-stratum-rail.html']);

    if (results.primaryCount > 0) {
        console.error('Primary findings in showcase:', results.findings);
    }

    assert.strictEqual(results.primaryCount, 0, 'Expected 0 primary findings in showcase HTML');
});