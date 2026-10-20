import { test } from 'node:test';
import * as assert from 'node:assert';
import { QUICKTO_CURSOR_SPOTLIGHT_PACK, generateQuicktoCursorSpotlightBlueprint } from '../../packs/motion/quickto-cursor-spotlight.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('QUICKTO_CURSOR_SPOTLIGHT_PACK exports correctly', () => {
    assert.strictEqual(QUICKTO_CURSOR_SPOTLIGHT_PACK.id, 'quickto-cursor-spotlight');
    assert.strictEqual(QUICKTO_CURSOR_SPOTLIGHT_PACK.category, 'motion');
    assert.ok(QUICKTO_CURSOR_SPOTLIGHT_PACK.typography);
    assert.ok(QUICKTO_CURSOR_SPOTLIGHT_PACK.tokens);
    assert.ok(QUICKTO_CURSOR_SPOTLIGHT_PACK.gsapRecipe.includes('gsap.quickTo'));
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateQuicktoCursorSpotlightBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateQuicktoCursorSpotlightBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'quickto-cursor-spotlight');
        assert.strictEqual(blueprint.framework, framework);
        assert.ok(blueprint.css.includes('.cursor-spotlight'));

        const findings = detectInText(blueprint.code, 'CursorSpotlight.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for in ${framework}, but got ${findings.length}`);

        // Structural assertions
        assert.ok(blueprint.code.includes('gsap.quickTo'), 'Should use quickTo');
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('pointermove'), 'Should listen for pointermove');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('HTML Showcase has 0 primary findings', () => {
    const report = scanTargets(['examples/showcases/quickto-cursor-spotlight.html']);

    if (report.primaryCount > 0) {
        console.error('HTML Showcase findings:', report.findings);
    }

    assert.strictEqual(report.primaryCount, 0, 'Showcase HTML should have exactly 0 primary findings');
});
