import { test } from 'node:test';
import * as assert from 'node:assert';
import { OBSERVER_SNAP_STORY_REEL_PACK, generateObserverSnapStoryReelBlueprint } from '../../packs/motion/observer-snap-story-reel.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('OBSERVER_SNAP_STORY_REEL_PACK exports correctly', () => {
    assert.strictEqual(OBSERVER_SNAP_STORY_REEL_PACK.id, 'observer-snap-story-reel');
    assert.strictEqual(OBSERVER_SNAP_STORY_REEL_PACK.category, 'motion');
    assert.strictEqual(OBSERVER_SNAP_STORY_REEL_PACK.gsapRecipe, 'Observer');
    assert.strictEqual(OBSERVER_SNAP_STORY_REEL_PACK.typography.display, 'Playfair Display');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateObserverSnapStoryReelBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateObserverSnapStoryReelBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'observer-snap-story-reel');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for observer-snap-story-reel in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for observer-snap-story-reel in ${framework}, but got ${findings.length}`);

        assert.ok(blueprint.code.includes('gsap.registerPlugin(Observer)'), 'Should register Observer');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');
        assert.ok(blueprint.code.includes('Observer.create('), 'Should call Observer.create');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('Showcase HTML passes detector', () => {
    const results = scanTargets(['examples/showcases/observer-snap-story-reel.html']);

    if (results.primaryCount > 0) {
        console.error('Detector findings:', results.findings);
    }

    assert.strictEqual(results.primaryCount, 0, 'Expected 0 primary findings in showcase HTML');
});
