import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MONASTIC_WASHI_WORLD, compileMonasticWashiCss } from '../../packs/worlds/monastic-washi.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Monastic Washi World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(MONASTIC_WASHI_WORLD.id, 'monastic-washi');
    assert.equal(MONASTIC_WASHI_WORLD.category, 'organic_craft');
    assert.ok(MONASTIC_WASHI_WORLD.VisitorModes.includes('read'));
    assert.ok(MONASTIC_WASHI_WORLD.VisitorModes.includes('immerse'));

    assert.match(MONASTIC_WASHI_WORLD.Typography.display, /Shippori Mincho/);
    assert.match(MONASTIC_WASHI_WORLD.Typography.body, /Source Serif 4/);
    assert.match(MONASTIC_WASHI_WORLD.Typography.mono, /IBM Plex Mono/);

    assert.equal(MONASTIC_WASHI_WORLD.Palette.washi, 'oklch(0.96 0.015 82)');
    assert.equal(MONASTIC_WASHI_WORLD.Palette.sumi, 'oklch(0.19 0.01 65)');
    assert.equal(MONASTIC_WASHI_WORLD.Palette.vermilion, 'oklch(0.55 0.19 32)');
  });

  it('should compile CSS with correct tokens', () => {
    const css = compileMonasticWashiCss();
    assert.match(css, /--ng-washi:\s*oklch\(0\.96 0\.015 82\)/);
    assert.match(css, /--ng-sumi:\s*oklch\(0\.19 0\.01 65\)/);
    assert.match(css, /--ng-vermilion:\s*oklch\(0\.55 0\.19 32\)/);
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/monastic-washi.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
