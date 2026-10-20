import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HOROLOGICAL_CALIBRE_ATELIER_PACK, generateHorologicalCalibreAtelierBlueprint } from '../../packs/worlds/horological-calibre-atelier.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

describe('Horological Calibre Atelier World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.id, 'horological-calibre-atelier');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.category, 'worlds');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.title, 'Haute Horlogerie Calibre & Escapement Blueprint World');

    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.typography.display, 'Cormorant Garamond');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.typography.body, 'Source Serif 4');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.typography.mono, 'IBM Plex Mono');

    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.tokens.steel, 'oklch(0.92 0.01 260)');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.tokens.brass, 'oklch(0.75 0.14 85)');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.tokens.ruby, 'oklch(0.55 0.22 15)');
    assert.equal(HOROLOGICAL_CALIBRE_ATELIER_PACK.tokens.obsidian, 'oklch(0.18 0.01 260)');
  });

  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const framework of frameworks) {
    it(`should generate valid blueprint for ${framework}`, () => {
      const blueprint = generateHorologicalCalibreAtelierBlueprint({ framework });

      assert.equal(blueprint.id, 'horological-calibre-atelier');
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code);
      assert.ok(blueprint.css);

      const findings = detectInText(blueprint.code, `Component.${framework === 'vue' ? 'vue' : framework === 'svelte' ? 'svelte' : framework === 'vanilla' ? 'js' : 'tsx'}`, { scopes: ['motion', 'security'] });
      const primaryFindings = findings.filter(f => !f.advisory);

      if (primaryFindings.length > 0) {
        console.error(`Detector findings for ${framework}:`, primaryFindings);
      }

      assert.equal(primaryFindings.length, 0, `Expected 0 primary findings for ${framework} blueprint code`);
    });
  }

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/horological-calibre-atelier.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings for showcase:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
