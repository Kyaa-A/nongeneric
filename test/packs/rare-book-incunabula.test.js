import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RARE_BOOK_INCUNABULA_PACK, generateRareBookIncunabulaBlueprint } from '../../packs/worlds/rare-book-incunabula.mjs';
import { scanTargets, detectInText } from '../../scripts/detector.js';

describe('Rare Book Incunabula World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(RARE_BOOK_INCUNABULA_PACK.id, 'rare-book-incunabula');
    assert.equal(RARE_BOOK_INCUNABULA_PACK.category, 'worlds');

    assert.match(RARE_BOOK_INCUNABULA_PACK.typography.display, /Cormorant Garamond/);
    assert.match(RARE_BOOK_INCUNABULA_PACK.typography.body, /Source Serif 4/);
    assert.match(RARE_BOOK_INCUNABULA_PACK.typography.mono, /IBM Plex Mono/);

    assert.equal(RARE_BOOK_INCUNABULA_PACK.tokens.parchment, 'oklch(0.96 0.02 85)');
    assert.equal(RARE_BOOK_INCUNABULA_PACK.tokens.ink, 'oklch(0.2 0.01 65)');
    assert.equal(RARE_BOOK_INCUNABULA_PACK.tokens.rubrication, 'oklch(0.5 0.2 30)');
  });

  const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

  for (const fw of frameworks) {
    it(`should generate valid ${fw} blueprint code without detector findings`, () => {
      const blueprint = generateRareBookIncunabulaBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'rare-book-incunabula');
      assert.equal(blueprint.framework, fw);

      const fileName = fw === 'react' ? 'Component.tsx' :
                       fw === 'vue' ? 'Component.vue' :
                       fw === 'svelte' ? 'Component.svelte' : 'script.js';

      const findings = detectInText(blueprint.code, fileName, { scopes: ["motion", "security"] });

      if (findings.length > 0) {
        console.error(`Detector findings for ${fw}:`, findings);
      }

      assert.equal(findings.length, 0, `Expected 0 findings for ${fw}`);

      // Basic checks for cleanup-safe GSAP
      if (fw === 'react') {
        assert.ok(blueprint.code.includes('useGSAP'), 'Missing useGSAP');
      } else {
        assert.ok(blueprint.code.includes('gsap.context'), 'Missing gsap.context');
      }
      assert.ok(blueprint.code.includes('gsap.matchMedia'), 'Missing gsap.matchMedia for reduced motion');
      assert.ok(blueprint.code.includes('revert'), 'Missing revert() call for cleanup');
    });
  }

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/rare-book-incunabula.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});