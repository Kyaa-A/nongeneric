import { test } from 'node:test';
import * as assert from 'node:assert';
import { TELEMETRY_DATAGRID_PACK, generateTelemetryDatagridBlueprint } from '../../packs/components/telemetry-datagrid.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('TELEMETRY_DATAGRID_PACK exports correctly', () => {
    assert.strictEqual(TELEMETRY_DATAGRID_PACK.id, 'telemetry-datagrid');
    assert.strictEqual(TELEMETRY_DATAGRID_PACK.title, 'High-Density Telemetry Data Grid & Inspector Drawer');
    assert.strictEqual(TELEMETRY_DATAGRID_PACK.category, 'components');
    assert.deepStrictEqual(TELEMETRY_DATAGRID_PACK.typography, {
        display: "Rajdhani",
        body: "Atkinson Hyperlegible",
        mono: "JetBrains Mono"
    });
    assert.ok(TELEMETRY_DATAGRID_PACK.tokens);
    assert.ok(TELEMETRY_DATAGRID_PACK.gsapRecipe);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateTelemetryDatagridBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
        const blueprint = generateTelemetryDatagridBlueprint({ framework });

        assert.strictEqual(blueprint.id, 'telemetry-datagrid');
        assert.strictEqual(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

        assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

        assert.ok(blueprint.code.includes('gsap.registerPlugin'), 'Should register GSAP plugins');
        assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
        assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');

        if (framework === 'react') {
            assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
        } else {
            assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
        }
    }
});

test('telemetry-datagrid showcase HTML passes detector checks', () => {
    const results = scanTargets(["examples/showcases/telemetry-datagrid.html"]);
    assert.strictEqual(results.primaryCount, 0, 'Showcase should have 0 primary findings');
});
