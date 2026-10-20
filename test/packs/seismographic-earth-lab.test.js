import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SEISMOGRAPHIC_EARTH_LAB_PACK, generateSeismographicEarthLabBlueprint } from '../../packs/worlds/seismographic-earth-lab.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Seismographic Earth Lab Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.id, 'seismographic-earth-lab');
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.category, 'worlds');

    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.typography.display, 'Barlow Condensed');
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.typography.body, 'Work Sans');
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.typography.mono, 'IBM Plex Mono');

    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.tokens.stratum, 'oklch(0.2 0.05 40)');
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.tokens.mantle, 'oklch(0.3 0.1 35)');
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.tokens.core, 'oklch(0.5 0.2 30)');
    assert.equal(SEISMOGRAPHIC_EARTH_LAB_PACK.tokens.seismograph, 'oklch(0.9 0.05 200)');
  });

  it('should generate blueprint across all frameworks', () => {
    for (const framework of ['vanilla', 'react', 'vue', 'svelte']) {
      const blueprint = generateSeismographicEarthLabBlueprint({ framework });
      assert.equal(blueprint.id, 'seismographic-earth-lab');
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code.includes('gsap.registerPlugin(ScrollTrigger)'));
      assert.ok(blueprint.code.includes('gsap.matchMedia()'));
      assert.ok(blueprint.code.includes('gsap.context('));
    }
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/seismographic-earth-lab.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
