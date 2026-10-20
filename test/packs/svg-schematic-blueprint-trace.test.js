import test from 'node:test';
import assert from 'node:assert';
import { SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK, generateSvgSchematicBlueprintTraceBlueprint } from '../../packs/motion/svg-schematic-blueprint-trace.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('SVG Schematic Blueprint Trace Pack', async (t) => {
  await t.test('SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK exports correctly', () => {
    assert.strictEqual(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.id, 'svg-schematic-blueprint-trace');
    assert.strictEqual(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.title, 'GSAP SVG Technical Callout & Isometric Wireframe Trace');
    assert.strictEqual(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.category, 'motion');
    assert.strictEqual(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.typography.display, 'Barlow Condensed');
    assert.strictEqual(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.typography.body, 'Atkinson Hyperlegible');
    assert.strictEqual(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.typography.mono, 'IBM Plex Mono');
    assert.ok(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.tokens.surface);
    assert.ok(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.tokens.text);
    assert.ok(SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK.tokens.accent);
  });

  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const framework of frameworks) {
    await t.test(`generateSvgSchematicBlueprintTraceBlueprint generates valid code with no motion/security findings for ${framework}`, () => {
      const blueprint = generateSvgSchematicBlueprintTraceBlueprint({ framework });

      assert.strictEqual(blueprint.id, 'svg-schematic-blueprint-trace');
      assert.strictEqual(blueprint.framework, framework);
      assert.ok(blueprint.code.length > 0);
      assert.ok(blueprint.css.length > 0);

      const findings = detectInText(blueprint.code, 'Blueprint.tsx', { scopes: ['motion', 'security'] });

      if (findings.length > 0) {
        console.error(`Findings in ${framework}:`, findings);
      }
      assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

      // Verification of specific setup calls
      assert.ok(blueprint.code.includes('gsap.registerPlugin('), 'Should register plugins');
      assert.ok(blueprint.code.includes('const mm = gsap.matchMedia()'), 'Should use matchMedia');
      assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'), 'Should handle reduced motion');

      if (framework === 'react') {
        assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
      } else {
        assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
      }
    });
  }

  await t.test('scanTargets verifies the HTML showcase file has 0 primary findings', () => {
    const result = scanTargets(['examples/showcases/svg-schematic-blueprint-trace.html']);

    if (result.primaryCount > 0) {
      console.error('HTML Showcase Findings:', result.findings);
    }
    assert.strictEqual(result.primaryCount, 0, `Expected 0 primary findings but got ${result.primaryCount}`);
  });
});
