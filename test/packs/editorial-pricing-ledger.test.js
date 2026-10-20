import { test } from 'node:test';
import * as assert from 'node:assert';
import { EDITORIAL_PRICING_LEDGER_PACK, generateEditorialPricingLedgerBlueprint } from '../../packs/components/editorial-pricing-ledger.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('EDITORIAL_PRICING_LEDGER_PACK exports correctly', () => {
    assert.strictEqual(EDITORIAL_PRICING_LEDGER_PACK.id, 'editorial-pricing-ledger');
    assert.strictEqual(EDITORIAL_PRICING_LEDGER_PACK.title, 'Editorial Specification & Acquisition Matrix (Anti-3-Tier-Slop)');
    assert.strictEqual(EDITORIAL_PRICING_LEDGER_PACK.category, 'components');
    assert.strictEqual(EDITORIAL_PRICING_LEDGER_PACK.typography.display, 'Newsreader');
    assert.strictEqual(EDITORIAL_PRICING_LEDGER_PACK.typography.body, 'Work Sans');
    assert.strictEqual(EDITORIAL_PRICING_LEDGER_PACK.typography.mono, 'IBM Plex Mono');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateEditorialPricingLedgerBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateEditorialPricingLedgerBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'editorial-pricing-ledger');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });
        assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('scanTargets passes for HTML showcase', () => {
    const result = scanTargets(["examples/showcases/editorial-pricing-ledger.html"]);
    assert.strictEqual(result.primaryCount, 0, 'HTML showcase should have 0 primary findings');
});
