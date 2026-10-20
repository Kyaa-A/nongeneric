import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { OENOLOGY_CELLAR_REGISTER_PACK, generateOenologyCellarRegisterBlueprint } from '../../packs/worlds/oenology-cellar-register.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

describe('Oenology Cellar Register World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.id, 'oenology-cellar-register');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.title, 'Viticultural Terroir & Archival Cellar Register World');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.category, 'worlds');

    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.typography.display, 'Newsreader');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.typography.body, 'Source Serif 4');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.typography.mono, 'IBM Plex Mono');

    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.tokens.background, 'oklch(0.15 0.02 15)');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.tokens.text, 'oklch(0.9 0.02 20)');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.tokens.accent, 'oklch(0.4 0.1 25)');
    assert.equal(OENOLOGY_CELLAR_REGISTER_PACK.tokens.border, 'oklch(0.3 0.02 20)');
  });

  it('should generate blueprints for all frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const fw of frameworks) {
      const blueprint = generateOenologyCellarRegisterBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'oenology-cellar-register');
      assert.equal(blueprint.framework, fw);
      assert.ok(blueprint.code.length > 0);
      assert.ok(blueprint.css.length > 0);

      const findings = detectInText(blueprint.code, 'Component.tsx', { scopes: ['motion', 'security'] });
      assert.equal(findings.length, 0, `Blueprint for ${fw} should have 0 findings`);
    }
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/oenology-cellar-register.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
