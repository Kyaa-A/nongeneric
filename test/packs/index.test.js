import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPANSION_WORLDS,
  EXPANSION_MOTION_SUITES,
  WAVE3_COMPONENT_PACKS,
  WAVE3_WORLD_PACKS,
  WAVE3_MOTION_PACKS,
  ALL_WAVE3_PACKS,
} from '../../packs/index.mjs';
import { auditTargets } from '../../scripts/auditor.js';

describe('NonGeneric Unified Expansion Pack Registry (packs/index.mjs)', () => {
  it('registers all 8 Wave 1 Aesthetic World expansion packs with unique IDs', () => {
    assert.equal(EXPANSION_WORLDS.length, 8);
    const ids = new Set(EXPANSION_WORLDS.map((w) => w.id));
    assert.equal(ids.size, 8);
  });

  it('registers all 6 Wave 2 GSAP Motion Choreography suites (18 presets x 4 frameworks = 72 blueprints)', () => {
    const suiteNames = Object.keys(EXPANSION_MOTION_SUITES);
    assert.equal(suiteNames.length, 6);
    for (const suite of Object.values(EXPANSION_MOTION_SUITES)) {
      assert.equal(suite.presets.length, 3);
      for (const preset of suite.presets) {
        const bp = suite.generate({ preset, framework: 'react' });
        assert.ok(bp.code.length > 50);
      }
    }
  });

  it('registers all 49 Wave 3 Component, World, and GSAP Choreography packs (63 total expansion packs)', () => {
    assert.equal(WAVE3_COMPONENT_PACKS.length, 15);
    assert.equal(WAVE3_WORLD_PACKS.length, 17);
    assert.equal(WAVE3_MOTION_PACKS.length, 17);
    assert.equal(ALL_WAVE3_PACKS.length, 49);

    const ids = new Set(ALL_WAVE3_PACKS.map((entry) => entry.pack.id));
    assert.equal(ids.size, 49);

    for (const entry of ALL_WAVE3_PACKS) {
      assert.equal(typeof entry.pack.id, 'string');
      assert.equal(typeof entry.generate, 'function');
      const bp = entry.generate({ framework: 'react' });
      assert.equal(bp.id, entry.pack.id);
      assert.ok(bp.code.length > 40);
    }
  });

  it('audits all 6 flagship HTML showcases at 100/100 Grade S', () => {
    const showcases = [
      'examples/crafted-knightvision.html',
      'examples/showcases/avionics-cnc.html',
      'examples/showcases/bauhaus-constructivist.html',
      'examples/showcases/botanical-herbarium.html',
      'examples/showcases/broadcast-kinetic.html',
      'examples/showcases/monastic-washi.html',
    ];
    const scorecard = auditTargets(showcases);
    assert.equal(scorecard.overallScore, 100, JSON.stringify(scorecard.remediationPlan, null, 2));
    assert.equal(scorecard.grade, 'S');
    assert.equal(scorecard.remediationPlan.length, 0);
  });
});
