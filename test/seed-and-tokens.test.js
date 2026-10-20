import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatConceptSeed, rollConceptSeed } from '../scripts/concept-seed.js';
import { generateTokens } from '../scripts/tokens.js';
import { WORLD_CONCEPTS } from '../scripts/catalog.js';

describe('NonGeneric Offline-First Concept Seed & Token Compiler', () => {
  it('deals deterministic seed rolls when given a fixed 8-hex key', () => {
    const rollA = rollConceptSeed({
      scope: 'direction',
      mode: 'persuade',
      grain: 'product',
      fromKey: '3f9a1c2e',
    });
    const rollB = rollConceptSeed({
      scope: 'direction',
      mode: 'persuade',
      grain: 'product',
      fromKey: '3f9a1c2e',
    });

    assert.equal(rollA.seedReference, rollB.seedReference);
    assert.equal(rollA.assignedIndex, rollB.assignedIndex);
    assert.ok(rollA.assignedIndex >= 2 && rollA.assignedIndex <= 6, 'Never assigns #1 candidate');
    assert.deepEqual(
      rollA.challengers.map((c) => c.id),
      rollB.challengers.map((c) => c.id)
    );
  });

  it('excludes atmosphere costume worlds on operate surfaces', () => {
    const operateRoll = rollConceptSeed({
      scope: 'direction',
      mode: 'operate',
      fromKey: 'a1b2c3d4',
    });
    for (const challenger of operateRoll.challengers) {
      assert.notEqual(challenger.wellTier, 'atmosphere');
    }
    const formatted = formatConceptSeed(operateRoll);
    assert.match(formatted, /DIRECTION CONCEPT SEED/);
    assert.match(formatted, /GSAP MOTION RECIPE/);
  });

  it('compiles OKLCH tokens in css, json, and tailwind v4 formats for all worlds', () => {
    for (const world of WORLD_CONCEPTS) {
      const css = generateTokens(world.id, 'css');
      assert.match(css, /--ng-ground-primary:\s*oklch\(/);
      assert.match(css, /prefers-reduced-motion: reduce/);

      const jsonRaw = generateTokens(world.id, 'json');
      const parsed = JSON.parse(jsonRaw);
      assert.equal(parsed.worldId, world.id);
      assert.match(parsed.colors.groundPrimary, /^oklch\(/);

      const tw = generateTokens(world.id, 'tailwind');
      assert.match(tw, /@theme\s*\{/);
    }
  });
});
