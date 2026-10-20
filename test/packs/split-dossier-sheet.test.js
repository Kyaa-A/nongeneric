import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SPLIT_DOSSIER_SHEET_PACK, generateSplitDossierSheetBlueprint } from '../../packs/components/split-dossier-sheet.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Split Dossier Sheet Pack', () => {
  it('should export the correct pack shape', () => {
    assert.equal(SPLIT_DOSSIER_SHEET_PACK.id, 'split-dossier-sheet');
    assert.equal(SPLIT_DOSSIER_SHEET_PACK.category, 'components');
    assert.equal(SPLIT_DOSSIER_SHEET_PACK.typography.display, 'Playfair Display');
    assert.equal(SPLIT_DOSSIER_SHEET_PACK.typography.body, 'Work Sans');
    assert.equal(SPLIT_DOSSIER_SHEET_PACK.typography.mono, 'IBM Plex Mono');
    assert.ok(SPLIT_DOSSIER_SHEET_PACK.tokens.surface.includes('oklch'));
  });

  it('should generate blueprints for all frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const fw of frameworks) {
      const blueprint = generateSplitDossierSheetBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'split-dossier-sheet');
      assert.equal(blueprint.framework, fw);
      assert.ok(blueprint.code.includes('prefers-reduced-motion: no-preference'), `Missing reduced motion in ${fw}`);
      assert.ok(blueprint.css.includes('oklch'), `Missing oklch in ${fw} CSS`);
      assert.ok(blueprint.code.includes('ScrollTrigger'), `Missing ScrollTrigger in ${fw}`);

      if (fw === 'react') {
        assert.ok(blueprint.code.includes('useGSAP'));
      } else {
        assert.ok(blueprint.code.includes('gsap.context('));
      }
    }
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/split-dossier-sheet.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
