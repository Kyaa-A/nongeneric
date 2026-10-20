import { test } from 'node:test';
import * as assert from 'node:assert';
import { LIVE_REPL_SANDBOX_PACK, generateLiveReplSandboxBlueprint } from '../../packs/components/live-repl-sandbox.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('LIVE_REPL_SANDBOX_PACK exports correctly', () => {
    assert.strictEqual(LIVE_REPL_SANDBOX_PACK.id, 'live-repl-sandbox');
    assert.strictEqual(LIVE_REPL_SANDBOX_PACK.title, 'Interactive Code & Token REPL Sandbox Stage');
    assert.strictEqual(LIVE_REPL_SANDBOX_PACK.category, 'components');
    assert.strictEqual(LIVE_REPL_SANDBOX_PACK.typography.display, 'Chakra Petch');
    assert.strictEqual(LIVE_REPL_SANDBOX_PACK.typography.body, 'Work Sans');
    assert.strictEqual(LIVE_REPL_SANDBOX_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(LIVE_REPL_SANDBOX_PACK.tokens.background.includes('oklch'));
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateLiveReplSandboxBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateLiveReplSandboxBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'live-repl-sandbox');
        assert.strictEqual(blueprint.framework, framework);
        assert.ok(blueprint.code.includes('gsap.registerPlugin('), 'Should register plugins');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });
        assert.strictEqual(findings.length, 0, `Expected 0 findings in ${framework}, got ${findings.length}`);
    }
});

test('Showcase HTML passes detector with 0 findings', () => {
    const result = scanTargets(['examples/showcases/live-repl-sandbox.html']);
    assert.strictEqual(result.primaryCount, 0, 'Expected 0 primary findings');
});
