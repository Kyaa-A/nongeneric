import { test } from 'node:test';
import * as assert from 'node:assert';
import { TICKER_CANVAS_PARTICLE_FIELD_PACK, generateTickerCanvasParticleFieldBlueprint } from '../../packs/motion/ticker-canvas-particle-field.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

test('TICKER_CANVAS_PARTICLE_FIELD_PACK exports correctly', () => {
    assert.strictEqual(TICKER_CANVAS_PARTICLE_FIELD_PACK.id, 'ticker-canvas-particle-field');
    assert.strictEqual(TICKER_CANVAS_PARTICLE_FIELD_PACK.category, 'motion');
    assert.strictEqual(TICKER_CANVAS_PARTICLE_FIELD_PACK.typography.display, 'Chakra Petch');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateTickerCanvasParticleFieldBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateTickerCanvasParticleFieldBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'ticker-canvas-particle-field');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for in ${framework}, but got ${findings.length}`);

        // Common architectural assertions
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle reduced motion explicitly');
        assert.ok(blueprint.code.includes('gsap.ticker.add('), 'Should attach to gsap ticker');
        assert.ok(blueprint.code.includes('canvas.getContext(\'2d\')'), 'Should retrieve canvas 2D context');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else if (framework === 'vue' || framework === 'svelte') {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('ticker-canvas-particle-field showcase HTML has 0 primary findings', () => {
    const results = scanTargets(['examples/showcases/ticker-canvas-particle-field.html']);
    assert.strictEqual(results.primaryCount, 0, 'Showcase HTML should have 0 primary findings');
});