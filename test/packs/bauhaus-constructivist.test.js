import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BAUHAUS_CONSTRUCTIVIST_WORLD, compileBauhausConstructivistCss } from '../../packs/worlds/bauhaus-constructivist.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Bauhaus Constructivist World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.id, 'bauhaus-constructivist');
    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.name, 'Bauhaus Dessau & Constructivist Archive');
    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.category, 'brutalist_systems');

    assert.ok(BAUHAUS_CONSTRUCTIVIST_WORLD.VisitorModes.includes('immerse'));
    assert.ok(BAUHAUS_CONSTRUCTIVIST_WORLD.VisitorModes.includes('read'));
    assert.ok(BAUHAUS_CONSTRUCTIVIST_WORLD.VisitorModes.includes('convert'));

    assert.match(BAUHAUS_CONSTRUCTIVIST_WORLD.Typography.display, /Syne/);
    assert.match(BAUHAUS_CONSTRUCTIVIST_WORLD.Typography.body, /Plus Jakarta Sans/);
    assert.match(BAUHAUS_CONSTRUCTIVIST_WORLD.Typography.mono, /IBM Plex Mono/);

    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.Palette.cream, 'oklch(0.95 0.018 84)');
    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.Palette.black, 'oklch(0.16 0.01 60)');
    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.Palette.vermilion, 'oklch(0.56 0.21 29)');
    assert.equal(BAUHAUS_CONSTRUCTIVIST_WORLD.Palette.cobalt, 'oklch(0.45 0.17 258)');
  });

  it('should compile CSS with correct tokens', () => {
    const css = compileBauhausConstructivistCss();
    assert.match(css, /--ng-bauhaus-cream:\s*oklch\(0\.95 0\.018 84\)/);
    assert.match(css, /--ng-bauhaus-black:\s*oklch\(0\.16 0\.01 60\)/);
    assert.match(css, /--ng-bauhaus-vermilion:\s*oklch\(0\.56 0\.21 29\)/);
    assert.match(css, /--ng-bauhaus-cobalt:\s*oklch\(0\.45 0\.17 258\)/);
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/bauhaus-constructivist.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
