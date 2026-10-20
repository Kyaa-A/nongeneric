import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BROADCAST_KINETIC_WORLD, compileBroadcastKineticCss } from '../../packs/worlds/broadcast-kinetic.mjs';
import { scanTargets } from '../../scripts/detector.js';
import { resolve, join } from 'node:path';

test('Broadcast Kinetic World - Metadata Validation', () => {
  assert.equal(BROADCAST_KINETIC_WORLD.id, 'broadcast-kinetic');
  assert.equal(BROADCAST_KINETIC_WORLD.category, 'kinetic_typography');
  assert.ok(BROADCAST_KINETIC_WORLD.VisitorModes.includes('immerse'));
  assert.ok(BROADCAST_KINETIC_WORLD.VisitorModes.includes('convert'));

  // Typography check
  assert.ok(BROADCAST_KINETIC_WORLD.Typography.fontDisplay.includes('Barlow Condensed'));
  assert.ok(BROADCAST_KINETIC_WORLD.Typography.fontBody.includes('Chakra Petch'));
  assert.ok(BROADCAST_KINETIC_WORLD.Typography.fontMono.includes('JetBrains Mono'));

  // Palette check
  assert.ok(BROADCAST_KINETIC_WORLD.Palette.groundPrimary.includes('oklch('));
  assert.ok(BROADCAST_KINETIC_WORLD.Palette.accentPrimary.includes('oklch('));

  // MotionLanguage check
  assert.equal(BROADCAST_KINETIC_WORLD.MotionLanguage.primaryEase, 'expo.out');
});

test('Broadcast Kinetic World - CSS Compilation', () => {
  const css = compileBroadcastKineticCss();
  assert.ok(css.includes(':root {'));
  assert.ok(css.includes('--ng-ground-primary:'));
  assert.ok(css.includes('--ng-accent-secondary:'));
  assert.ok(css.includes('oklch('));
});

test('Broadcast Kinetic World - Zero-slop HTML Showcase', () => {
  const showcasePath = resolve(process.cwd(), 'examples/showcases/broadcast-kinetic.html');
  const report = scanTargets([showcasePath]);

  assert.equal(
    report.primaryCount,
    0,
    `Expected 0 primary findings, but found ${report.primaryCount}:\n${report.findings.map(f => `  - ${f.name} (line ${f.line})`).join('\n')}`
  );
});
