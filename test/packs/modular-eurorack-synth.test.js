import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MODULAR_EURORACK_SYNTH_PACK, generateModularEurorackSynthBlueprint } from '../../packs/worlds/modular-eurorack-synth.mjs';
import { scanTargets } from '../../scripts/detector.js';

describe('Modular Eurorack Synth Pack', () => {
  it('should have correct shape', () => {
    assert.equal(MODULAR_EURORACK_SYNTH_PACK.id, 'modular-eurorack-synth');
    assert.equal(MODULAR_EURORACK_SYNTH_PACK.title, 'Eurorack Modular Patchbay & CV Oscilloscope World');
    assert.equal(MODULAR_EURORACK_SYNTH_PACK.category, 'worlds');
    assert.equal(MODULAR_EURORACK_SYNTH_PACK.typography.display, 'Chakra Petch');
    assert.equal(MODULAR_EURORACK_SYNTH_PACK.typography.body, 'Atkinson Hyperlegible');
    assert.equal(MODULAR_EURORACK_SYNTH_PACK.typography.mono, 'JetBrains Mono');
    assert.ok(MODULAR_EURORACK_SYNTH_PACK.tokens.background.includes('oklch'));
  });

  it('generateModularEurorackSynthBlueprint works for vanilla', () => {
    const blueprint = generateModularEurorackSynthBlueprint({ framework: 'vanilla' });
    assert.equal(blueprint.id, 'modular-eurorack-synth');
    assert.equal(blueprint.framework, 'vanilla');
    assert.ok(blueprint.code.includes('gsap.context'));
    assert.ok(blueprint.code.includes('gsap.matchMedia'));
    assert.ok(blueprint.code.includes('gsap.registerPlugin'));
  });

  it('generateModularEurorackSynthBlueprint works for react', () => {
    const blueprint = generateModularEurorackSynthBlueprint({ framework: 'react' });
    assert.equal(blueprint.id, 'modular-eurorack-synth');
    assert.equal(blueprint.framework, 'react');
    assert.ok(blueprint.code.includes('useGSAP'));
    assert.ok(blueprint.code.includes('gsap.matchMedia'));
    assert.ok(blueprint.code.includes('gsap.registerPlugin'));
  });

  it('generateModularEurorackSynthBlueprint works for vue', () => {
    const blueprint = generateModularEurorackSynthBlueprint({ framework: 'vue' });
    assert.equal(blueprint.id, 'modular-eurorack-synth');
    assert.equal(blueprint.framework, 'vue');
    assert.ok(blueprint.code.includes('gsap.context'));
    assert.ok(blueprint.code.includes('gsap.matchMedia'));
    assert.ok(blueprint.code.includes('gsap.registerPlugin'));
  });

  it('generateModularEurorackSynthBlueprint works for svelte', () => {
    const blueprint = generateModularEurorackSynthBlueprint({ framework: 'svelte' });
    assert.equal(blueprint.id, 'modular-eurorack-synth');
    assert.equal(blueprint.framework, 'svelte');
    assert.ok(blueprint.code.includes('gsap.context'));
    assert.ok(blueprint.code.includes('gsap.matchMedia'));
    assert.ok(blueprint.code.includes('gsap.registerPlugin'));
  });

  it('should pass detector scan on showcase with zero primary findings', () => {
    const report = scanTargets(['examples/showcases/modular-eurorack-synth.html']);
    if (report.primaryCount > 0) {
      console.error('Detector findings:');
      for (const finding of report.findings) {
        console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
      }
    }
    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
  });
});
