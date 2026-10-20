import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { SPLITTEXT_EDITORIAL_CURTAIN_PACK, generateSplittextEditorialCurtainBlueprint } from '../../packs/motion/splittext-editorial-curtain.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

describe('SplitText Editorial Curtain Pack', () => {
    test('SPLITTEXT_EDITORIAL_CURTAIN_PACK exports correctly', () => {
        assert.strictEqual(SPLITTEXT_EDITORIAL_CURTAIN_PACK.id, 'splittext-editorial-curtain');
        assert.strictEqual(SPLITTEXT_EDITORIAL_CURTAIN_PACK.category, 'motion');
        assert.strictEqual(SPLITTEXT_EDITORIAL_CURTAIN_PACK.typography.display, 'Cormorant Garamond');
        assert.strictEqual(SPLITTEXT_EDITORIAL_CURTAIN_PACK.typography.body, 'Work Sans');
        assert.strictEqual(SPLITTEXT_EDITORIAL_CURTAIN_PACK.typography.mono, 'IBM Plex Mono');

        assert.ok(SPLITTEXT_EDITORIAL_CURTAIN_PACK.tokens.surface.includes('oklch'));
        assert.ok(SPLITTEXT_EDITORIAL_CURTAIN_PACK.tokens.text.includes('oklch'));
        assert.ok(SPLITTEXT_EDITORIAL_CURTAIN_PACK.tokens.accent.includes('oklch'));
    });

    test('generateSplittextEditorialCurtainBlueprint generates valid code with no motion/security findings', () => {
        const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

        for (const framework of frameworks) {
            const blueprint = generateSplittextEditorialCurtainBlueprint({ framework });

            assert.strictEqual(blueprint.id, 'splittext-editorial-curtain');
            assert.strictEqual(blueprint.framework, framework);

            const findings = detectInText(blueprint.code, 'SplitTextComponent.js', { scopes: ['motion', 'security'] });

            if (findings.length > 0) {
                console.error(`Findings for ${framework}:`, findings);
            }
            assert.strictEqual(findings.length, 0, `Expected 0 findings in ${framework}, but got ${findings.length}`);

            // Assert structural GSAP requirements
            assert.ok(blueprint.code.includes('gsap.registerPlugin(SplitText)'), 'Should register SplitText plugin');
            assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use gsap.matchMedia for reduced motion');
            assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion explicitly');
            assert.ok(blueprint.code.includes('SplitText'), 'Should instantiate SplitText');
            assert.ok(blueprint.code.includes('overflow: "hidden"'), 'Should mask via overflow hidden');
            assert.ok(blueprint.code.includes('yPercent: 100'), 'Should stagger yPercent');

            if (framework === 'react') {
                assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP hook');
            } else {
                assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
            }
        }
    });

    test('Showcase HTML passes slop detector with 0 findings', () => {
        const report = scanTargets(['examples/showcases/splittext-editorial-curtain.html']);

        if (report.primaryCount > 0) {
            console.error('Detector Report:', JSON.stringify(report.findings, null, 2));
        }

        assert.strictEqual(report.primaryCount, 0, `Expected 0 primary findings, found ${report.primaryCount}`);
    });
});
