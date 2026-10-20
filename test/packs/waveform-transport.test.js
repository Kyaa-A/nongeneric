import { test } from 'node:test';
import * as assert from 'node:assert';
import { WAVEFORM_TRANSPORT_PACK, generateWaveformTransportBlueprint } from '../../packs/components/waveform-transport.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('WAVEFORM_TRANSPORT_PACK exports correctly', () => {
    assert.strictEqual(WAVEFORM_TRANSPORT_PACK.id, 'waveform-transport');
    assert.strictEqual(WAVEFORM_TRANSPORT_PACK.title, 'Interactive Audio/Shader Waveform Transport Bar');
    assert.strictEqual(WAVEFORM_TRANSPORT_PACK.category, 'components');
    assert.strictEqual(WAVEFORM_TRANSPORT_PACK.typography.display, 'Chakra Petch');
    assert.strictEqual(WAVEFORM_TRANSPORT_PACK.typography.body, 'Atkinson Hyperlegible');
    assert.strictEqual(WAVEFORM_TRANSPORT_PACK.typography.mono, 'JetBrains Mono');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateWaveformTransportBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateWaveformTransportBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'waveform-transport');
        assert.strictEqual(blueprint.framework, framework);
        assert.ok(blueprint.code.length > 0, 'Code should not be empty');

        const findings = detectInText(blueprint.code, `WaveformTransport.${framework}`, { scopes: ['motion', 'security'] });

        if (findings.length > 0) {
            console.error(`Findings for waveform transport in ${framework}:`, findings);
        }
        assert.strictEqual(findings.length, 0, `Expected 0 findings for waveform transport in ${framework}, but got ${findings.length}`);

        // Structural assertions
        assert.ok(!blueprint.code.includes('innerHTML'), 'Should not use innerHTML');
        assert.ok(blueprint.code.includes('aria-label='), 'Should use aria-label');
        assert.ok(blueprint.code.includes('aria-hidden="true"'), 'Should use aria-hidden="true"');
        assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should handle reduced motion with matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle prefers-reduced-motion: reduce');

        // Framework specific checks
        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else if (framework === 'vue' || framework === 'svelte' || framework === 'vanilla') {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('waveform-transport.html showcase passes scanTargets with 0 primary findings', () => {
    const report = scanTargets(['examples/showcases/waveform-transport.html']);

    if (report.primaryCount > 0) {
        console.error('Primary findings in HTML:', report.findings);
    }

    assert.strictEqual(report.primaryCount, 0, 'Expected 0 primary findings in HTML showcase');
});
