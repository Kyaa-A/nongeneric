import { test } from 'node:test';
import * as assert from 'node:assert';
import { COMPILER_OBSERVATORY_PACK, generateCompilerObservatoryBlueprint } from '../../packs/worlds/compiler-observatory.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

test('compiler-observatory pack validity', async (t) => {
  await t.test('COMPILER_OBSERVATORY_PACK has required shape', () => {
    assert.strictEqual(COMPILER_OBSERVATORY_PACK.id, 'compiler-observatory');
    assert.strictEqual(COMPILER_OBSERVATORY_PACK.title, 'Compiler AST & Distributed Trace Observatory World');
    assert.strictEqual(COMPILER_OBSERVATORY_PACK.category, 'worlds');
    assert.strictEqual(COMPILER_OBSERVATORY_PACK.typography.display, 'Chakra Petch');
    assert.strictEqual(COMPILER_OBSERVATORY_PACK.typography.body, 'Work Sans');
    assert.strictEqual(COMPILER_OBSERVATORY_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(COMPILER_OBSERVATORY_PACK.tokens.background.includes('oklch'));
  });

  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  await t.test('generateCompilerObservatoryBlueprint generates valid code with no motion/security findings', () => {
    for (const framework of frameworks) {
      const blueprint = generateCompilerObservatoryBlueprint({ framework });

      assert.strictEqual(blueprint.id, 'compiler-observatory');
      assert.strictEqual(blueprint.framework, framework);

      const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });

      assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

      // Basic checks for cleanup-safe and reduced-motion-safe patterns
      assert.ok(blueprint.code.includes('gsap.matchMedia()'), 'Should handle reduced motion with matchMedia');
      assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle prefers-reduced-motion: reduce');

      if (framework === 'react') {
        assert.ok(blueprint.code.includes('useGSAP('), 'React should use useGSAP');
      } else {
        assert.ok(blueprint.code.includes('gsap.context('), `${framework} should use gsap.context`);
      }
    }
  });

  await t.test('examples/showcases/compiler-observatory.html has no slop', () => {
    const report = scanTargets(['examples/showcases/compiler-observatory.html']);
    assert.strictEqual(report.primaryCount, 0, 'Should have 0 primary findings');
  });
});
