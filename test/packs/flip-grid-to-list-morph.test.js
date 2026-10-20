import { test } from 'node:test';
import * as assert from 'node:assert';
import { FLIP_GRID_TO_LIST_MORPH_PACK, generateFlipGridToListMorphBlueprint } from '../../packs/motion/flip-grid-to-list-morph.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('FLIP_GRID_TO_LIST_MORPH_PACK exports correctly', () => {
    assert.strictEqual(FLIP_GRID_TO_LIST_MORPH_PACK.id, 'flip-grid-to-list-morph');
    assert.strictEqual(FLIP_GRID_TO_LIST_MORPH_PACK.title, 'GSAP Flip Dense Table-to-Gallery Spatial Morph');
    assert.strictEqual(FLIP_GRID_TO_LIST_MORPH_PACK.category, 'motion');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateFlipGridToListMorphBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateFlipGridToListMorphBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'flip-grid-to-list-morph');
        assert.strictEqual(blueprint.framework, framework);
        assert.deepStrictEqual(blueprint.plugins, ['Flip']);
        assert.ok(blueprint.focusManagementNotes.includes('focus'));

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

        // Structural assertions
        assert.ok(blueprint.code.includes('gsap.registerPlugin(Flip)'), 'Should register Flip');
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
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
});

test('Showcase HTML passes anti-slop rules', () => {
    const result = scanTargets(['examples/showcases/flip-grid-to-list-morph.html']);
    assert.strictEqual(result.primaryCount, 0, 'HTML showcase should have 0 primary findings');
});
