import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { MYTHIC_CODEX_ARCHIVE_PACK, generateMythicCodexArchiveBlueprint } from '../../packs/worlds/mythic-codex-archive.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('mythic-codex-archive pack validity', async (t) => {
  await t.test('MYTHIC_CODEX_ARCHIVE_PACK has required shape', () => {
    assert.equal(MYTHIC_CODEX_ARCHIVE_PACK.id, 'mythic-codex-archive');
    assert.equal(MYTHIC_CODEX_ARCHIVE_PACK.title, 'Independent Game Lore & Worldbuilding Codex World');
    assert.equal(MYTHIC_CODEX_ARCHIVE_PACK.category, 'worlds');
    assert.equal(MYTHIC_CODEX_ARCHIVE_PACK.typography.display, 'Shippori Mincho');
    assert.equal(MYTHIC_CODEX_ARCHIVE_PACK.typography.body, 'Source Serif 4');
    assert.equal(MYTHIC_CODEX_ARCHIVE_PACK.typography.mono, 'IBM Plex Mono');
    assert.ok(MYTHIC_CODEX_ARCHIVE_PACK.tokens.surface.includes('oklch'));
    assert.ok(MYTHIC_CODEX_ARCHIVE_PACK.tokens.text.includes('oklch'));
    assert.ok(MYTHIC_CODEX_ARCHIVE_PACK.tokens.accent.includes('oklch'));
    assert.ok(MYTHIC_CODEX_ARCHIVE_PACK.gsapRecipe);
  });

  await t.test('generateMythicCodexArchiveBlueprint() generates clean code across frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const framework of frameworks) {
      const result = generateMythicCodexArchiveBlueprint({ framework });
      assert.equal(result.id, 'mythic-codex-archive');
      assert.equal(result.framework, framework);

      const findings = detectInText(result.code, 'Component.tsx', { scopes: ['motion', 'security'] });
      const primaryFindings = findings.filter(f => !f.advisory);
      assert.equal(primaryFindings.length, 0, `Found primary findings in ${framework} blueprint`);
    }
  });

  await t.test('showcase HTML passes slop detector', () => {
    const { primaryCount } = scanTargets(['examples/showcases/mythic-codex-archive.html']);
    assert.equal(primaryCount, 0, 'Showcase HTML should have 0 primary findings');
  });
});
