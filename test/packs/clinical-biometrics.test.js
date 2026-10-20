import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CLINICAL_BIOMETRICS_PACK, generateClinicalBiometricsBlueprint } from '../../packs/worlds/clinical-biometrics.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Clinical Biometrics World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(CLINICAL_BIOMETRICS_PACK.id, 'clinical-biometrics');
    assert.equal(CLINICAL_BIOMETRICS_PACK.category, 'worlds');

    assert.equal(CLINICAL_BIOMETRICS_PACK.typography.display, 'Atkinson Hyperlegible');
    assert.equal(CLINICAL_BIOMETRICS_PACK.typography.body, 'Work Sans');
    assert.equal(CLINICAL_BIOMETRICS_PACK.typography.mono, 'IBM Plex Mono');

    assert.ok(CLINICAL_BIOMETRICS_PACK.tokens);
    assert.ok(CLINICAL_BIOMETRICS_PACK.tokens.background.startsWith('oklch('));
  });

  it('should generate valid blueprint for multiple frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const fw of frameworks) {
      const blueprint = generateClinicalBiometricsBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'clinical-biometrics');
      assert.equal(blueprint.framework, fw);
      assert.ok(blueprint.code.includes('gsap.registerPlugin'));
    }
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/clinical-biometrics.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
