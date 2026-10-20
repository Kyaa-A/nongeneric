import { test } from 'node:test';
import * as assert from 'node:assert';
import { FLIP_FILTER_MULTI_TAG_PACK, generateFlipFilterMultiTagBlueprint } from '../../packs/motion/flip-filter-multi-tag.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('FLIP_FILTER_MULTI_TAG_PACK exports correctly', () => {
    assert.strictEqual(FLIP_FILTER_MULTI_TAG_PACK.id, 'flip-filter-multi-tag');
    assert.strictEqual(FLIP_FILTER_MULTI_TAG_PACK.category, 'motion');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateFlipFilterMultiTagBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateFlipFilterMultiTagBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'flip-filter-multi-tag');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'FlipFilter.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for in ${framework}, but got ${findings.length}`);

        // Structural assertions
        assert.ok(blueprint.code.includes('gsap.registerPlugin(Flip)'), 'Should register Flip');
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('Flip.getState('), 'Should get Flip state');
        assert.ok(blueprint.code.includes('Flip.from('), 'Should call Flip.from');
        assert.ok(blueprint.code.includes('focus()'), 'Should restore focus');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else if (framework !== 'vanilla') {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('Showcase HTML passes detector with 0 primary findings', () => {
    const report = scanTargets(['examples/showcases/flip-filter-multi-tag.html']);
    if (report.primaryCount > 0) {
        console.error('Showcase HTML Findings:', report.findings);
    }
    assert.strictEqual(report.primaryCount, 0, `Expected 0 primary findings, got ${report.primaryCount}`);
});