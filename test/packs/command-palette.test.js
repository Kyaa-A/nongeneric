import { test } from 'node:test';
import * as assert from 'node:assert';
import { COMMAND_PALETTE_PACK, generateCommandPaletteBlueprint } from '../../packs/components/command-palette.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('COMMAND_PALETTE_PACK shape', () => {
  assert.strictEqual(COMMAND_PALETTE_PACK.id, 'command-palette');
  assert.strictEqual(COMMAND_PALETTE_PACK.title, 'Command Palette (Cmd+K) & Keyboard Action Bar');
  assert.strictEqual(COMMAND_PALETTE_PACK.category, 'components');
  assert.deepStrictEqual(COMMAND_PALETTE_PACK.typography, {
    display: "Syne",
    body: "Work Sans",
    mono: "JetBrains Mono"
  });
  assert.ok(COMMAND_PALETTE_PACK.tokens);
  assert.ok(COMMAND_PALETTE_PACK.gsapRecipe);
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateCommandPaletteBlueprint generates valid code with no motion/security findings', () => {
  for (const framework of frameworks) {
    const blueprint = generateCommandPaletteBlueprint({ framework });

    assert.strictEqual(blueprint.id, 'command-palette');
    assert.strictEqual(blueprint.framework, framework);

    const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });
    assert.strictEqual(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);

    assert.ok(blueprint.code.includes('(prefers-reduced-motion: reduce)'), 'Should handle reduced motion');
  }
});

test('showcase passes detector scan with 0 primary findings', () => {
  const result = scanTargets(['examples/showcases/command-palette.html']);
  assert.strictEqual(result.primaryCount, 0, `Expected 0 primary findings, but got ${result.primaryCount}`);
});
