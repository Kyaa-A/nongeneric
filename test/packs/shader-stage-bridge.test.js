import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SHADER_BRIDGE_PRESETS, generateShaderBridgeBlueprint } from '../../packs/motion/shader-stage-bridge.mjs';
import { detectInText } from '../../scripts/detector.js';

describe('Shader Stage Bridge Blueprints', () => {
  const frameworks = ['react', 'vue', 'svelte', 'vanilla'];

  it('exports all 3 required presets', () => {
    assert.deepEqual(SHADER_BRIDGE_PRESETS, [
      'uniform-scroll-scrub',
      'pointer-displacement-field',
      'dom-to-canvas-sync',
    ]);
  });

  it('generates blueprints that pass motion and security detector scopes with 0 findings', () => {
    for (const preset of SHADER_BRIDGE_PRESETS) {
      for (const framework of frameworks) {
        const blueprint = generateShaderBridgeBlueprint({ preset, framework });

        assert.equal(blueprint.preset, preset);
        assert.equal(blueprint.framework, framework);
        assert.ok(blueprint.code.length > 50, 'Blueprint code should not be empty');

        const findings = detectInText(blueprint.code, 'ShaderBridge.tsx', { scopes: ['motion', 'security'] });

        assert.equal(
          findings.length,
          0,
          `Preset ${preset} (${framework}) triggered findings: ${JSON.stringify(findings)}`
        );
      }
    }
  });
});
