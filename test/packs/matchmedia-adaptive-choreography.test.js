import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK, generateMatchmediaAdaptiveChoreographyBlueprint } from '../../packs/motion/matchmedia-adaptive-choreography.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('GSAP matchMedia Desktop-to-Mobile Adaptive Motion Matrix Pack', () => {
    it('should export valid pack metadata', () => {
        assert.equal(MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK.id, 'matchmedia-adaptive-choreography');
        assert.equal(MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK.category, 'motion');
        assert.ok(MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK.tokens);
        assert.ok(MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK.typography);
        assert.equal(MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK.gsapRecipe, 'matchMedia');
    });

    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const framework of frameworks) {
        it(`should generate valid blueprint for ${framework}`, () => {
            const blueprint = generateMatchmediaAdaptiveChoreographyBlueprint({ framework });
            assert.equal(blueprint.id, 'matchmedia-adaptive-choreography');
            assert.equal(blueprint.framework, framework);
            assert.ok(typeof blueprint.code === 'string');
            assert.ok(blueprint.code.includes('gsap.matchMedia()'));
            assert.ok(blueprint.code.includes('prefers-reduced-motion'));
            if (framework === 'react') {
                assert.ok(blueprint.code.includes('useGSAP'));
            } else {
                assert.ok(blueprint.code.includes('gsap.context'));
            }
        });
    }

    it('should have 0 primary slop findings in showcase HTML', () => {
        const result = scanTargets(['examples/showcases/matchmedia-adaptive-choreography.html']);
        assert.equal(result.primaryCount, 0, `Expected 0 primary findings, got ${result.primaryCount}. Findings: ${JSON.stringify(result.findings)}`);
    });
});
