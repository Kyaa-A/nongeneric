import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ANALOG_DARKROOM_CONTACT_PACK, generateAnalogDarkroomContactBlueprint } from '../../packs/worlds/analog-darkroom-contact.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Analog Darkroom Contact World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(ANALOG_DARKROOM_CONTACT_PACK.id, 'analog-darkroom-contact');
    assert.equal(ANALOG_DARKROOM_CONTACT_PACK.category, 'worlds');
    assert.match(ANALOG_DARKROOM_CONTACT_PACK.typography.display, /Playfair Display/);
    assert.match(ANALOG_DARKROOM_CONTACT_PACK.typography.body, /Work Sans/);
    assert.match(ANALOG_DARKROOM_CONTACT_PACK.typography.mono, /Space Mono/);

    assert.ok(ANALOG_DARKROOM_CONTACT_PACK.tokens.background.startsWith('oklch'));
  });

  it('should generate valid blueprints for all frameworks', () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const fw of frameworks) {
      const blueprint = generateAnalogDarkroomContactBlueprint({ framework: fw });
      assert.equal(blueprint.id, 'analog-darkroom-contact');
      assert.equal(blueprint.framework, fw);
      assert.ok(blueprint.code.length > 0);
      assert.ok(blueprint.css.length > 0);

      // Verify safety rules are present in the code
      if (fw === 'react') {
        assert.ok(blueprint.code.includes('gsap.registerPlugin(useGSAP)'));
        assert.ok(blueprint.code.includes('useGSAP('));
      } else {
        assert.ok(blueprint.code.includes('gsap.context('));
      }

      assert.ok(blueprint.code.includes('gsap.matchMedia()'));
      assert.ok(blueprint.code.includes('(prefers-reduced-motion: no-preference)'));
    }
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/analog-darkroom-contact.html']);

    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
