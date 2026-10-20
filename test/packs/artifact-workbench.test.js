import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { ARTIFACT_WORKBENCH_WORLD, auditAiWorkspaceMarkup } from '../../packs/worlds/artifact-workbench.mjs';

test('artifact-workbench pack validity', async (t) => {
  await t.test('ARTIFACT_WORKBENCH_WORLD has required shape', () => {
    assert.equal(ARTIFACT_WORKBENCH_WORLD.id, 'artifact-workbench');
    assert.equal(ARTIFACT_WORKBENCH_WORLD.name, 'Spatial Artifact Workbench & Provenance Canvas');
    assert.equal(ARTIFACT_WORKBENCH_WORLD.category, 'swiss_grids');
    assert.deepEqual(ARTIFACT_WORKBENCH_WORLD.VisitorModes, ['operate', 'decide']);
    assert.equal(ARTIFACT_WORKBENCH_WORLD.Typography.display, 'Newsreader');
    assert.equal(ARTIFACT_WORKBENCH_WORLD.Typography.body, 'Plus Jakarta Sans');
    assert.equal(ARTIFACT_WORKBENCH_WORLD.Typography.mono, 'JetBrains Mono');
    assert.ok(ARTIFACT_WORKBENCH_WORLD.Palette.surfaces.includes('oklch'));
    assert.ok(ARTIFACT_WORKBENCH_WORLD.Palette.accents.includes('oklch'));
    assert.ok(ARTIFACT_WORKBENCH_WORLD.LayoutGrammar);
    assert.ok(ARTIFACT_WORKBENCH_WORLD.SurfaceRules);
    assert.ok(ARTIFACT_WORKBENCH_WORLD.MotionLanguage);
    assert.ok(ARTIFACT_WORKBENCH_WORLD.AntiHero);
  });

  await t.test('auditAiWorkspaceMarkup() detects anti-patterns', () => {
    // 1. Detects sparkles
    const slop1 = auditAiWorkspaceMarkup('<div>Generated with AI ✨</div>');
    assert.ok(slop1.some(issue => issue.includes('sparkle')));

    // 2. Detects gradient Ask AI pill
    const slop2 = auditAiWorkspaceMarkup('<button class="gradient-bg">Ask AI</button>');
    assert.ok(slop2.some(issue => issue.includes('gradient') && issue.includes('Ask AI')));

    // 3. Detects chat-only bottlenecks
    const slop3 = auditAiWorkspaceMarkup('<div class="chat-window"><div class="message">Hello!</div></div>');
    assert.ok(slop3.some(issue => issue.includes('chat-only bottlenecks')));

    // 4. Clean markup passes
    const clean = auditAiWorkspaceMarkup('<div class="artifact-canvas"><div class="provenance-token">Source: local</div></div>');
    assert.equal(clean.length, 0);
  });
});
