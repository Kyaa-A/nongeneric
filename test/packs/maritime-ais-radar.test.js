import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MARITIME_AIS_RADAR_PACK, generateMaritimeAisRadarBlueprint } from '../../packs/worlds/maritime-ais-radar.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Maritime AIS Radar Plotting World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(MARITIME_AIS_RADAR_PACK.id, 'maritime-ais-radar');
    assert.equal(MARITIME_AIS_RADAR_PACK.category, 'worlds');

    assert.equal(MARITIME_AIS_RADAR_PACK.typography.display, 'Rajdhani');
    assert.equal(MARITIME_AIS_RADAR_PACK.typography.body, 'Atkinson Hyperlegible');
    assert.equal(MARITIME_AIS_RADAR_PACK.typography.mono, 'IBM Plex Mono');

    assert.equal(MARITIME_AIS_RADAR_PACK.tokens.radarSurface, 'oklch(0.12 0.01 250)');
    assert.equal(MARITIME_AIS_RADAR_PACK.tokens.gridLine, 'oklch(0.3 0.05 250)');
    assert.equal(MARITIME_AIS_RADAR_PACK.tokens.shipVessel, 'oklch(0.85 0.15 150)');
  });

  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];
  for (const framework of frameworks) {
    it(`should generate valid blueprint for ${framework}`, () => {
      const blueprint = generateMaritimeAisRadarBlueprint({ framework });
      assert.equal(blueprint.id, 'maritime-ais-radar');
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code.includes('gsap.matchMedia()'));
      assert.ok(blueprint.css.includes('var(--radar-surface'));

      if (framework === 'react') {
        assert.ok(blueprint.code.includes('useGSAP(()'));
      } else {
        assert.ok(blueprint.code.includes('gsap.context('));
      }
    });
  }

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/maritime-ais-radar.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
