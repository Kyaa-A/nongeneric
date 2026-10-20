import { test } from 'node:test';
import * as assert from 'node:assert';
import { SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK, generateScrolltriggerHorizontalTimelineBlueprint } from '../../packs/motion/scrolltrigger-horizontal-timeline.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK exports correctly', () => {
    assert.strictEqual(SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK.id, 'scrolltrigger-horizontal-timeline');
    assert.strictEqual(SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK.title, 'GSAP ScrollTrigger ContainerAnimation Archival Chronology');
    assert.strictEqual(SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK.category, 'motion');
    assert.deepStrictEqual(SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK.typography, {
        display: "Shippori Mincho",
        body: "Source Serif 4",
        mono: "IBM Plex Mono"
    });
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateScrolltriggerHorizontalTimelineBlueprint generates valid code with 0 findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateScrolltriggerHorizontalTimelineBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'scrolltrigger-horizontal-timeline');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Timeline.tsx', { scopes: ['motion', 'security'] });
        assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

        // Assert structure
        assert.ok(blueprint.code.includes('gsap.registerPlugin(ScrollTrigger)'), 'Should register ScrollTrigger');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('containerAnimation:'), 'Should use containerAnimation');
        assert.ok(blueprint.code.includes('ease: "none"'), 'Should use ease none for containerAnimation');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('Showcase HTML passes scanTargets with 0 primary findings', () => {
    const result = scanTargets(["examples/showcases/scrolltrigger-horizontal-timeline.html"]);
    assert.strictEqual(result.primaryCount, 0, `Expected 0 primary findings, got ${result.primaryCount}. Details: ${JSON.stringify(result.findings)}`);
});
