/**
 * NonGeneric Expansion Packs — Unified Barrel Index
 *
 * Re-exports all 8 Aesthetic World Expansion Packs and 6 GSAP Motion Choreography Packs
 * generated and verified through the NonGeneric Jules Cloud Pipeline.
 */

import { ARTIFACT_WORKBENCH_WORLD, auditAiWorkspaceMarkup } from './worlds/artifact-workbench.mjs';
import { ATELIER_LOOKBOOK_WORLD, compileAtelierLookbookCss } from './worlds/atelier-lookbook.mjs';
import { AVIONICS_CNC_WORLD, compileAvionicsCncCss } from './worlds/avionics-cnc.mjs';
import { BAUHAUS_CONSTRUCTIVIST_WORLD, compileBauhausConstructivistCss } from './worlds/bauhaus-constructivist.mjs';
import { BOTANICAL_HERBARIUM_WORLD, compileBotanicalHerbariumCss } from './worlds/botanical-herbarium.mjs';
import { BROADCAST_KINETIC_WORLD, compileBroadcastKineticCss } from './worlds/broadcast-kinetic.mjs';
import { FINTECH_LEDGER_WORLD, validateFinancialTableMarkup } from './worlds/fintech-ledger.mjs';
import { MONASTIC_WASHI_WORLD, compileMonasticWashiCss } from './worlds/monastic-washi.mjs';

import { FLIP_SHARED_PRESETS, generateFlipSharedBlueprint } from './motion/flip-shared-element.mjs';
import { GESTURE_PHYSICS_PRESETS, generateGesturePhysicsBlueprint } from './motion/gesture-physics.mjs';
import { SHADER_BRIDGE_PRESETS, generateShaderBridgeBlueprint } from './motion/shader-stage-bridge.mjs';
import { SVG_CHOREOGRAPHY_PRESETS, generateSvgMotionBlueprint } from './motion/svg-choreography.mjs';
import { TEXT_SCRAMBLE_PRESETS, generateTextScrambleBlueprint } from './motion/text-scramble-telemetry.mjs';
import { VELOCITY_MARQUEE_PRESETS, generateVelocityMarqueeBlueprint } from './motion/velocity-marquee.mjs';

export const EXPANSION_WORLDS = [
  ARTIFACT_WORKBENCH_WORLD,
  ATELIER_LOOKBOOK_WORLD,
  AVIONICS_CNC_WORLD,
  BAUHAUS_CONSTRUCTIVIST_WORLD,
  BOTANICAL_HERBARIUM_WORLD,
  BROADCAST_KINETIC_WORLD,
  FINTECH_LEDGER_WORLD,
  MONASTIC_WASHI_WORLD,
];

export const EXPANSION_MOTION_SUITES = {
  'flip-shared-element': {
    presets: FLIP_SHARED_PRESETS,
    generate: generateFlipSharedBlueprint,
  },
  'gesture-physics': {
    presets: GESTURE_PHYSICS_PRESETS,
    generate: generateGesturePhysicsBlueprint,
  },
  'shader-stage-bridge': {
    presets: SHADER_BRIDGE_PRESETS,
    generate: generateShaderBridgeBlueprint,
  },
  'svg-choreography': {
    presets: SVG_CHOREOGRAPHY_PRESETS,
    generate: generateSvgMotionBlueprint,
  },
  'text-scramble-telemetry': {
    presets: TEXT_SCRAMBLE_PRESETS,
    generate: generateTextScrambleBlueprint,
  },
  'velocity-marquee': {
    presets: VELOCITY_MARQUEE_PRESETS,
    generate: generateVelocityMarqueeBlueprint,
  },
};

export {
  ARTIFACT_WORKBENCH_WORLD,
  auditAiWorkspaceMarkup,
  ATELIER_LOOKBOOK_WORLD,
  compileAtelierLookbookCss,
  AVIONICS_CNC_WORLD,
  compileAvionicsCncCss,
  BAUHAUS_CONSTRUCTIVIST_WORLD,
  compileBauhausConstructivistCss,
  BOTANICAL_HERBARIUM_WORLD,
  compileBotanicalHerbariumCss,
  BROADCAST_KINETIC_WORLD,
  compileBroadcastKineticCss,
  FINTECH_LEDGER_WORLD,
  validateFinancialTableMarkup,
  MONASTIC_WASHI_WORLD,
  compileMonasticWashiCss,
  FLIP_SHARED_PRESETS,
  generateFlipSharedBlueprint,
  GESTURE_PHYSICS_PRESETS,
  generateGesturePhysicsBlueprint,
  SHADER_BRIDGE_PRESETS,
  generateShaderBridgeBlueprint,
  SVG_CHOREOGRAPHY_PRESETS,
  generateSvgMotionBlueprint,
  TEXT_SCRAMBLE_PRESETS,
  generateTextScrambleBlueprint,
  VELOCITY_MARQUEE_PRESETS,
  generateVelocityMarqueeBlueprint,
};
