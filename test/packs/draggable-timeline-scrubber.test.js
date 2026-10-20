import { test } from 'node:test';
import * as assert from 'node:assert';
import { DRAGGABLE_TIMELINE_SCRUBBER_PACK, generateDraggableTimelineScrubberBlueprint } from '../../packs/motion/draggable-timeline-scrubber.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('DRAGGABLE_TIMELINE_SCRUBBER_PACK exports correctly', () => {
    assert.strictEqual(DRAGGABLE_TIMELINE_SCRUBBER_PACK.id, 'draggable-timeline-scrubber');
    assert.strictEqual(DRAGGABLE_TIMELINE_SCRUBBER_PACK.category, 'motion');
    assert.deepStrictEqual(DRAGGABLE_TIMELINE_SCRUBBER_PACK.typography, { display: "Chakra Petch", body: "Work Sans", mono: "JetBrains Mono" });
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateDraggableTimelineScrubberBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateDraggableTimelineScrubberBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'draggable-timeline-scrubber');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

        // Structural assertions
        assert.ok(blueprint.code.includes('gsap.registerPlugin(Draggable)'), 'Should register Draggable');
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('Draggable.create('), 'Should call Draggable.create');
        assert.ok(blueprint.code.includes('type: "x"'), 'Should set Draggable type to x');
        assert.ok(blueprint.code.includes('bounds:'), 'Should set Draggable bounds');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else if (framework === 'vue' || framework === 'svelte' || framework === 'vanilla') {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('examples/showcases/draggable-timeline-scrubber.html passes zero-slop scan', () => {
    const res = scanTargets(["examples/showcases/draggable-timeline-scrubber.html"]);
    assert.strictEqual(res.primaryCount, 0, 'Should have 0 primary findings');
});
