import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BOTANICAL_HERBARIUM_WORLD, compileBotanicalHerbariumCss } from '../../packs/worlds/botanical-herbarium.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Botanical Herbarium World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(BOTANICAL_HERBARIUM_WORLD.id, 'botanical-herbarium');
    assert.equal(BOTANICAL_HERBARIUM_WORLD.category, 'organic_craft');
    assert.ok(BOTANICAL_HERBARIUM_WORLD.VisitorModes.includes('read'));
    assert.ok(BOTANICAL_HERBARIUM_WORLD.VisitorModes.includes('immerse'));
    assert.ok(BOTANICAL_HERBARIUM_WORLD.VisitorModes.includes('decide'));

    assert.match(BOTANICAL_HERBARIUM_WORLD.Typography.display, /Cormorant Garamond/);
    assert.match(BOTANICAL_HERBARIUM_WORLD.Typography.body, /Source Serif 4/);
    assert.match(BOTANICAL_HERBARIUM_WORLD.Typography.mono, /IBM Plex Mono/);

    assert.equal(BOTANICAL_HERBARIUM_WORLD.Palette.parchment, 'oklch(0.955 0.016 86)');
    assert.equal(BOTANICAL_HERBARIUM_WORLD.Palette.ink, 'oklch(0.21 0.015 65)');
    assert.equal(BOTANICAL_HERBARIUM_WORLD.Palette.moss, 'oklch(0.46 0.09 148)');
    assert.equal(BOTANICAL_HERBARIUM_WORLD.Palette.tag, 'oklch(0.56 0.13 42)');
  });

  it('should compile CSS with correct tokens', () => {
    const css = compileBotanicalHerbariumCss();
    assert.match(css, /--ng-parchment:\s*oklch\(0\.955 0\.016 86\)/);
    assert.match(css, /--ng-ink:\s*oklch\(0\.21 0\.015 65\)/);
    assert.match(css, /--ng-moss:\s*oklch\(0\.46 0\.09 148\)/);
    assert.match(css, /--ng-tag:\s*oklch\(0\.56 0\.13 42\)/);
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/botanical-herbarium.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
