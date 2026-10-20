import { test } from 'node:test';
import * as assert from 'node:assert';
import { SCHOLARLY_MARGINALIA_PACK, generateScholarlyMarginaliaBlueprint } from '../../packs/components/scholarly-marginalia.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('SCHOLARLY_MARGINALIA_PACK exports correctly', () => {
    assert.strictEqual(SCHOLARLY_MARGINALIA_PACK.id, 'scholarly-marginalia');
    assert.strictEqual(SCHOLARLY_MARGINALIA_PACK.title, 'Scholarly Footnote & Synchronized Marginalia Reader');
    assert.strictEqual(SCHOLARLY_MARGINALIA_PACK.category, 'components');
    assert.strictEqual(SCHOLARLY_MARGINALIA_PACK.typography.display, 'Shippori Mincho');
    assert.strictEqual(SCHOLARLY_MARGINALIA_PACK.typography.body, 'Source Serif 4');
    assert.strictEqual(SCHOLARLY_MARGINALIA_PACK.typography.mono, 'IBM Plex Mono');
    assert.ok(SCHOLARLY_MARGINALIA_PACK.tokens.washi.includes('oklch'));
    assert.ok(SCHOLARLY_MARGINALIA_PACK.tokens.sumi.includes('oklch'));
    assert.ok(SCHOLARLY_MARGINALIA_PACK.tokens.vermilion.includes('oklch'));
    assert.deepStrictEqual(SCHOLARLY_MARGINALIA_PACK.gsapRecipe, ["ScrollTrigger", "matchMedia", "context", "useGSAP"]);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateScholarlyMarginaliaBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateScholarlyMarginaliaBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'scholarly-marginalia');
        assert.strictEqual(blueprint.framework, framework);
        assert.ok(blueprint.css.includes('min-height: 100dvh'), 'Should include min-height: 100dvh');
        assert.ok(blueprint.css.includes('tabular-nums'), 'Should include tabular-nums');
        assert.ok(blueprint.css.includes('min-height: 44px'), 'Should have buttons >= 44px');

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings in ${framework}, but got ${findings.length}`);

        assert.ok(!blueprint.code.includes('innerHTML'), 'Should not use innerHTML');
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should handle reduced motion with matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle prefers-reduced-motion: reduce');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else if (framework === 'vue' || framework === 'svelte' || framework === 'vanilla') {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('scholarly-marginalia showcase HTML passes detector', () => {
    const res = scanTargets(['examples/showcases/scholarly-marginalia.html']);
    assert.strictEqual(res.primaryCount, 0, `Expected 0 primary findings in HTML showcase, but got ${res.primaryCount}`);
});
