import { test } from 'node:test';
import * as assert from 'node:assert';
import { SCROLLTRIGGER_PINNED_COMPARISON_PACK, generateScrolltriggerPinnedComparisonBlueprint } from '../../packs/motion/scrolltrigger-pinned-comparison.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('SCROLLTRIGGER_PINNED_COMPARISON_PACK exports correctly', () => {
    assert.strictEqual(SCROLLTRIGGER_PINNED_COMPARISON_PACK.id, 'scrolltrigger-pinned-comparison');
    assert.strictEqual(SCROLLTRIGGER_PINNED_COMPARISON_PACK.category, 'motion');
    assert.strictEqual(SCROLLTRIGGER_PINNED_COMPARISON_PACK.typography.display, 'Syne');
    assert.ok(SCROLLTRIGGER_PINNED_COMPARISON_PACK.tokens);
    assert.strictEqual(SCROLLTRIGGER_PINNED_COMPARISON_PACK.gsapRecipe, 'pinned-lens-wipe');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateScrolltriggerPinnedComparisonBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateScrolltriggerPinnedComparisonBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'scrolltrigger-pinned-comparison');
        assert.strictEqual(blueprint.framework, framework);
        assert.deepStrictEqual(blueprint.plugins, ['ScrollTrigger']);
        assert.ok(blueprint.css.includes('position: relative'));
        assert.ok(blueprint.css.includes('clip-path'));

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings in ${framework}, but got ${findings.length}`);

        assert.ok(blueprint.code.includes('gsap.registerPlugin(ScrollTrigger)'), 'Should register ScrollTrigger');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('clipPath: "inset(0% 0% 0% 0%)"'), 'Should animate clip path correctly');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('scanTargets runs against showcase and returns 0 findings', () => {
    const result = scanTargets(["examples/showcases/scrolltrigger-pinned-comparison.html"]);
    assert.strictEqual(result.primaryCount, 0, 'Should have 0 primary findings');
});
