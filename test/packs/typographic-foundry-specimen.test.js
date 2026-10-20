import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK, generateTypographicFoundrySpecimenBlueprint } from '../../packs/worlds/typographic-foundry-specimen.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

describe('Typographic Foundry Specimen World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.id, 'typographic-foundry-specimen');
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.title, 'Independent Type Foundry Specimen & Glyph Metrics World');
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.category, 'worlds');

    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.typography.display, 'Syne');
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.typography.body, 'Source Serif 4');
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.typography.mono, 'JetBrains Mono');

    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.tokens.background, 'oklch(0.98 0.01 90)');
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.tokens.foreground, 'oklch(0.15 0.02 240)');
    assert.equal(TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK.tokens.accent, 'oklch(0.65 0.15 30)');
  });

  const frameworks = ['react', 'vue', 'svelte', 'vanilla'];

  for (const framework of frameworks) {
    it(`should generate valid blueprint for ${framework}`, () => {
      const blueprint = generateTypographicFoundrySpecimenBlueprint({ framework });
      assert.equal(blueprint.id, 'typographic-foundry-specimen');
      assert.equal(blueprint.framework, framework);

      const findings = detectInText(blueprint.code, `Component.${framework === 'react' ? 'tsx' : framework === 'vue' ? 'vue' : framework === 'svelte' ? 'svelte' : 'js'}`, { scopes: ['motion', 'security'] });

      if (findings.length > 0) {
        console.error(`Detector findings for ${framework}:`);
        for (const finding of findings) {
          console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
        }
      }

      assert.equal(findings.length, 0, `Expected 0 motion/security findings in ${framework} blueprint code`);
    });
  }

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/typographic-foundry-specimen.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
