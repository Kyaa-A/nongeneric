/**
 * NonGeneric Expansion Packs — Unified Barrel Index
 *
 * Re-exports all 63 Expansion Packs across Waves 1, 2, and 3:
 * - Wave 1 (8 Aesthetic World Expansion Packs)
 * - Wave 2 (6 GSAP Motion Choreography Suites)
 * - Wave 3 (49 Component Architecture, Aesthetic World, and GSAP Choreography Packs)
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

// Wave 3 — 15 Component Architecture Packs
import { COMMAND_PALETTE_PACK, generateCommandPaletteBlueprint } from './components/command-palette.mjs';
import { ASYMMETRIC_BENTO_PACK, generateAsymmetricBentoBlueprint } from './components/asymmetric-bento.mjs';
import { TELEMETRY_DATAGRID_PACK, generateTelemetryDatagridBlueprint } from './components/telemetry-datagrid.mjs';
import { EDITORIAL_PRICING_LEDGER_PACK, generateEditorialPricingLedgerBlueprint } from './components/editorial-pricing-ledger.mjs';
import { WAVEFORM_TRANSPORT_PACK, generateWaveformTransportBlueprint } from './components/waveform-transport.mjs';
import { SCHOLARLY_MARGINALIA_PACK, generateScholarlyMarginaliaBlueprint } from './components/scholarly-marginalia.mjs';
import { PROVENANCE_DIFF_LENS_PACK, generateProvenanceDiffLensBlueprint } from './components/provenance-diff-lens.mjs';
import { RADIAL_DIAL_HUD_PACK, generateRadialDialHudBlueprint } from './components/radial-dial-hud.mjs';
import { CHRONICLE_STRATUM_RAIL_PACK, generateChronicleStratumRailBlueprint } from './components/chronicle-stratum-rail.mjs';
import { SPLIT_DOSSIER_SHEET_PACK, generateSplitDossierSheetBlueprint } from './components/split-dossier-sheet.mjs';
import { LIVE_REPL_SANDBOX_PACK, generateLiveReplSandboxBlueprint } from './components/live-repl-sandbox.mjs';
import { SPATIAL_CANVAS_MINIMAP_PACK, generateSpatialCanvasMinimapBlueprint } from './components/spatial-canvas-minimap.mjs';
import { TACTILE_KEYCAP_SHORTCUT_BAR_PACK, generateTactileKeycapShortcutBarBlueprint } from './components/tactile-keycap-shortcut-bar.mjs';
import { EDITORIAL_MASTHEAD_COLOPHON_PACK, generateEditorialMastheadColophonBlueprint } from './components/editorial-masthead-colophon.mjs';
import { MULTI_AXIS_COMPARISON_MATRIX_PACK, generateMultiAxisComparisonMatrixBlueprint } from './components/multi-axis-comparison-matrix.mjs';

// Wave 3 — 17 Aesthetic World & Industry Packs
import { COMPILER_OBSERVATORY_PACK, generateCompilerObservatoryBlueprint } from './worlds/compiler-observatory.mjs';
import { CLINICAL_BIOMETRICS_PACK, generateClinicalBiometricsBlueprint } from './worlds/clinical-biometrics.mjs';
import { ROBOTICS_GROUND_CONTROL_PACK, generateRoboticsGroundControlBlueprint } from './worlds/robotics-ground-control.mjs';
import { SPATIAL_MONOGRAPH_PACK, generateSpatialMonographBlueprint } from './worlds/spatial-monograph.mjs';
import { CARTOGRAPHIC_CLIMATE_PACK, generateCartographicClimateBlueprint } from './worlds/cartographic-climate.mjs';
import { MYTHIC_CODEX_ARCHIVE_PACK, generateMythicCodexArchiveBlueprint } from './worlds/mythic-codex-archive.mjs';
import { ANALOG_DARKROOM_CONTACT_PACK, generateAnalogDarkroomContactBlueprint } from './worlds/analog-darkroom-contact.mjs';
import { MODULAR_EURORACK_SYNTH_PACK, generateModularEurorackSynthBlueprint } from './worlds/modular-eurorack-synth.mjs';
import { HOROLOGICAL_CALIBRE_ATELIER_PACK, generateHorologicalCalibreAtelierBlueprint } from './worlds/horological-calibre-atelier.mjs';
import { SEISMOGRAPHIC_EARTH_LAB_PACK, generateSeismographicEarthLabBlueprint } from './worlds/seismographic-earth-lab.mjs';
import { TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK, generateTypographicFoundrySpecimenBlueprint } from './worlds/typographic-foundry-specimen.mjs';
import { MARITIME_AIS_RADAR_PACK, generateMaritimeAisRadarBlueprint } from './worlds/maritime-ais-radar.mjs';
import { OENOLOGY_CELLAR_REGISTER_PACK, generateOenologyCellarRegisterBlueprint } from './worlds/oenology-cellar-register.mjs';
import { QUANTUM_CRYO_CONTROL_PACK, generateQuantumCryoControlBlueprint } from './worlds/quantum-cryo-control.mjs';
import { RARE_BOOK_INCUNABULA_PACK, generateRareBookIncunabulaBlueprint } from './worlds/rare-book-incunabula.mjs';
import { ACOUSTIC_ANECHOIC_CHAMBER_PACK, generateAcousticAnechoicChamberBlueprint } from './worlds/acoustic-anechoic-chamber.mjs';
import { VELODROME_AERODYNAMICS_PACK, generateVelodromeAerodynamicsBlueprint } from './worlds/velodrome-aerodynamics.mjs';

// Wave 3 — 17 GSAP Motion Choreography Packs
import { SPLITTEXT_EDITORIAL_CURTAIN_PACK, generateSplittextEditorialCurtainBlueprint } from './motion/splittext-editorial-curtain.mjs';
import { SCROLLTRIGGER_PINNED_COMPARISON_PACK, generateScrolltriggerPinnedComparisonBlueprint } from './motion/scrolltrigger-pinned-comparison.mjs';
import { FLIP_GRID_TO_LIST_MORPH_PACK, generateFlipGridToListMorphBlueprint } from './motion/flip-grid-to-list-morph.mjs';
import { QUICKTO_CURSOR_SPOTLIGHT_PACK, generateQuicktoCursorSpotlightBlueprint } from './motion/quickto-cursor-spotlight.mjs';
import { OBSERVER_SNAP_STORY_REEL_PACK, generateObserverSnapStoryReelBlueprint } from './motion/observer-snap-story-reel.mjs';
import { DRAGGABLE_TIMELINE_SCRUBBER_PACK, generateDraggableTimelineScrubberBlueprint } from './motion/draggable-timeline-scrubber.mjs';
import { SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK, generateSvgSchematicBlueprintTraceBlueprint } from './motion/svg-schematic-blueprint-trace.mjs';
import { SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK, generateScrolltriggerHorizontalTimelineBlueprint } from './motion/scrolltrigger-horizontal-timeline.mjs';
import { FLIP_FILTER_MULTI_TAG_PACK, generateFlipFilterMultiTagBlueprint } from './motion/flip-filter-multi-tag.mjs';
import { MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK, generateMatchmediaAdaptiveChoreographyBlueprint } from './motion/matchmedia-adaptive-choreography.mjs';
import { TICKER_CANVAS_PARTICLE_FIELD_PACK, generateTickerCanvasParticleFieldBlueprint } from './motion/ticker-canvas-particle-field.mjs';
import { CUSTOMEASE_MECHANICAL_DETENT_PACK, generateCustomeaseMechanicalDetentBlueprint } from './motion/customease-mechanical-detent.mjs';
import { SCROLLTRIGGER_BATCH_LEDGER_PACK, generateScrolltriggerBatchLedgerBlueprint } from './motion/scrolltrigger-batch-ledger.mjs';
import { FLIP_ACCORDION_SPECIFICATION_PACK, generateFlipAccordionSpecificationBlueprint } from './motion/flip-accordion-specification.mjs';
import { QUICKTO_MAGNETIC_DOCK_PACK, generateQuicktoMagneticDockBlueprint } from './motion/quickto-magnetic-dock.mjs';
import { SPLITTEXT_TABULAR_COUNTER_PACK, generateSplittextTabularCounterBlueprint } from './motion/splittext-tabular-counter.mjs';
import { SCROLLTRIGGER_MARGINALIA_SYNC_PACK, generateScrolltriggerMarginaliaSyncBlueprint } from './motion/scrolltrigger-marginalia-sync.mjs';

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

export const WAVE3_COMPONENT_PACKS = [
  { pack: COMMAND_PALETTE_PACK, generate: generateCommandPaletteBlueprint },
  { pack: ASYMMETRIC_BENTO_PACK, generate: generateAsymmetricBentoBlueprint },
  { pack: TELEMETRY_DATAGRID_PACK, generate: generateTelemetryDatagridBlueprint },
  { pack: EDITORIAL_PRICING_LEDGER_PACK, generate: generateEditorialPricingLedgerBlueprint },
  { pack: WAVEFORM_TRANSPORT_PACK, generate: generateWaveformTransportBlueprint },
  { pack: SCHOLARLY_MARGINALIA_PACK, generate: generateScholarlyMarginaliaBlueprint },
  { pack: PROVENANCE_DIFF_LENS_PACK, generate: generateProvenanceDiffLensBlueprint },
  { pack: RADIAL_DIAL_HUD_PACK, generate: generateRadialDialHudBlueprint },
  { pack: CHRONICLE_STRATUM_RAIL_PACK, generate: generateChronicleStratumRailBlueprint },
  { pack: SPLIT_DOSSIER_SHEET_PACK, generate: generateSplitDossierSheetBlueprint },
  { pack: LIVE_REPL_SANDBOX_PACK, generate: generateLiveReplSandboxBlueprint },
  { pack: SPATIAL_CANVAS_MINIMAP_PACK, generate: generateSpatialCanvasMinimapBlueprint },
  { pack: TACTILE_KEYCAP_SHORTCUT_BAR_PACK, generate: generateTactileKeycapShortcutBarBlueprint },
  { pack: EDITORIAL_MASTHEAD_COLOPHON_PACK, generate: generateEditorialMastheadColophonBlueprint },
  { pack: MULTI_AXIS_COMPARISON_MATRIX_PACK, generate: generateMultiAxisComparisonMatrixBlueprint },
];

export const WAVE3_WORLD_PACKS = [
  { pack: COMPILER_OBSERVATORY_PACK, generate: generateCompilerObservatoryBlueprint },
  { pack: CLINICAL_BIOMETRICS_PACK, generate: generateClinicalBiometricsBlueprint },
  { pack: ROBOTICS_GROUND_CONTROL_PACK, generate: generateRoboticsGroundControlBlueprint },
  { pack: SPATIAL_MONOGRAPH_PACK, generate: generateSpatialMonographBlueprint },
  { pack: CARTOGRAPHIC_CLIMATE_PACK, generate: generateCartographicClimateBlueprint },
  { pack: MYTHIC_CODEX_ARCHIVE_PACK, generate: generateMythicCodexArchiveBlueprint },
  { pack: ANALOG_DARKROOM_CONTACT_PACK, generate: generateAnalogDarkroomContactBlueprint },
  { pack: MODULAR_EURORACK_SYNTH_PACK, generate: generateModularEurorackSynthBlueprint },
  { pack: HOROLOGICAL_CALIBRE_ATELIER_PACK, generate: generateHorologicalCalibreAtelierBlueprint },
  { pack: SEISMOGRAPHIC_EARTH_LAB_PACK, generate: generateSeismographicEarthLabBlueprint },
  { pack: TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK, generate: generateTypographicFoundrySpecimenBlueprint },
  { pack: MARITIME_AIS_RADAR_PACK, generate: generateMaritimeAisRadarBlueprint },
  { pack: OENOLOGY_CELLAR_REGISTER_PACK, generate: generateOenologyCellarRegisterBlueprint },
  { pack: QUANTUM_CRYO_CONTROL_PACK, generate: generateQuantumCryoControlBlueprint },
  { pack: RARE_BOOK_INCUNABULA_PACK, generate: generateRareBookIncunabulaBlueprint },
  { pack: ACOUSTIC_ANECHOIC_CHAMBER_PACK, generate: generateAcousticAnechoicChamberBlueprint },
  { pack: VELODROME_AERODYNAMICS_PACK, generate: generateVelodromeAerodynamicsBlueprint },
];

export const WAVE3_MOTION_PACKS = [
  { pack: SPLITTEXT_EDITORIAL_CURTAIN_PACK, generate: generateSplittextEditorialCurtainBlueprint },
  { pack: SCROLLTRIGGER_PINNED_COMPARISON_PACK, generate: generateScrolltriggerPinnedComparisonBlueprint },
  { pack: FLIP_GRID_TO_LIST_MORPH_PACK, generate: generateFlipGridToListMorphBlueprint },
  { pack: QUICKTO_CURSOR_SPOTLIGHT_PACK, generate: generateQuicktoCursorSpotlightBlueprint },
  { pack: OBSERVER_SNAP_STORY_REEL_PACK, generate: generateObserverSnapStoryReelBlueprint },
  { pack: DRAGGABLE_TIMELINE_SCRUBBER_PACK, generate: generateDraggableTimelineScrubberBlueprint },
  { pack: SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK, generate: generateSvgSchematicBlueprintTraceBlueprint },
  { pack: SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK, generate: generateScrolltriggerHorizontalTimelineBlueprint },
  { pack: FLIP_FILTER_MULTI_TAG_PACK, generate: generateFlipFilterMultiTagBlueprint },
  { pack: MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK, generate: generateMatchmediaAdaptiveChoreographyBlueprint },
  { pack: TICKER_CANVAS_PARTICLE_FIELD_PACK, generate: generateTickerCanvasParticleFieldBlueprint },
  { pack: CUSTOMEASE_MECHANICAL_DETENT_PACK, generate: generateCustomeaseMechanicalDetentBlueprint },
  { pack: SCROLLTRIGGER_BATCH_LEDGER_PACK, generate: generateScrolltriggerBatchLedgerBlueprint },
  { pack: FLIP_ACCORDION_SPECIFICATION_PACK, generate: generateFlipAccordionSpecificationBlueprint },
  { pack: QUICKTO_MAGNETIC_DOCK_PACK, generate: generateQuicktoMagneticDockBlueprint },
  { pack: SPLITTEXT_TABULAR_COUNTER_PACK, generate: generateSplittextTabularCounterBlueprint },
  { pack: SCROLLTRIGGER_MARGINALIA_SYNC_PACK, generate: generateScrolltriggerMarginaliaSyncBlueprint },
];

export const ALL_WAVE3_PACKS = [
  ...WAVE3_COMPONENT_PACKS,
  ...WAVE3_WORLD_PACKS,
  ...WAVE3_MOTION_PACKS,
];

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
  COMMAND_PALETTE_PACK,
  generateCommandPaletteBlueprint,
  ASYMMETRIC_BENTO_PACK,
  generateAsymmetricBentoBlueprint,
  TELEMETRY_DATAGRID_PACK,
  generateTelemetryDatagridBlueprint,
  EDITORIAL_PRICING_LEDGER_PACK,
  generateEditorialPricingLedgerBlueprint,
  WAVEFORM_TRANSPORT_PACK,
  generateWaveformTransportBlueprint,
  SCHOLARLY_MARGINALIA_PACK,
  generateScholarlyMarginaliaBlueprint,
  PROVENANCE_DIFF_LENS_PACK,
  generateProvenanceDiffLensBlueprint,
  RADIAL_DIAL_HUD_PACK,
  generateRadialDialHudBlueprint,
  CHRONICLE_STRATUM_RAIL_PACK,
  generateChronicleStratumRailBlueprint,
  SPLIT_DOSSIER_SHEET_PACK,
  generateSplitDossierSheetBlueprint,
  LIVE_REPL_SANDBOX_PACK,
  generateLiveReplSandboxBlueprint,
  SPATIAL_CANVAS_MINIMAP_PACK,
  generateSpatialCanvasMinimapBlueprint,
  TACTILE_KEYCAP_SHORTCUT_BAR_PACK,
  generateTactileKeycapShortcutBarBlueprint,
  EDITORIAL_MASTHEAD_COLOPHON_PACK,
  generateEditorialMastheadColophonBlueprint,
  MULTI_AXIS_COMPARISON_MATRIX_PACK,
  generateMultiAxisComparisonMatrixBlueprint,
  COMPILER_OBSERVATORY_PACK,
  generateCompilerObservatoryBlueprint,
  CLINICAL_BIOMETRICS_PACK,
  generateClinicalBiometricsBlueprint,
  ROBOTICS_GROUND_CONTROL_PACK,
  generateRoboticsGroundControlBlueprint,
  SPATIAL_MONOGRAPH_PACK,
  generateSpatialMonographBlueprint,
  CARTOGRAPHIC_CLIMATE_PACK,
  generateCartographicClimateBlueprint,
  MYTHIC_CODEX_ARCHIVE_PACK,
  generateMythicCodexArchiveBlueprint,
  ANALOG_DARKROOM_CONTACT_PACK,
  generateAnalogDarkroomContactBlueprint,
  MODULAR_EURORACK_SYNTH_PACK,
  generateModularEurorackSynthBlueprint,
  HOROLOGICAL_CALIBRE_ATELIER_PACK,
  generateHorologicalCalibreAtelierBlueprint,
  SEISMOGRAPHIC_EARTH_LAB_PACK,
  generateSeismographicEarthLabBlueprint,
  TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK,
  generateTypographicFoundrySpecimenBlueprint,
  MARITIME_AIS_RADAR_PACK,
  generateMaritimeAisRadarBlueprint,
  OENOLOGY_CELLAR_REGISTER_PACK,
  generateOenologyCellarRegisterBlueprint,
  QUANTUM_CRYO_CONTROL_PACK,
  generateQuantumCryoControlBlueprint,
  RARE_BOOK_INCUNABULA_PACK,
  generateRareBookIncunabulaBlueprint,
  ACOUSTIC_ANECHOIC_CHAMBER_PACK,
  generateAcousticAnechoicChamberBlueprint,
  VELODROME_AERODYNAMICS_PACK,
  generateVelodromeAerodynamicsBlueprint,
  SPLITTEXT_EDITORIAL_CURTAIN_PACK,
  generateSplittextEditorialCurtainBlueprint,
  SCROLLTRIGGER_PINNED_COMPARISON_PACK,
  generateScrolltriggerPinnedComparisonBlueprint,
  FLIP_GRID_TO_LIST_MORPH_PACK,
  generateFlipGridToListMorphBlueprint,
  QUICKTO_CURSOR_SPOTLIGHT_PACK,
  generateQuicktoCursorSpotlightBlueprint,
  OBSERVER_SNAP_STORY_REEL_PACK,
  generateObserverSnapStoryReelBlueprint,
  DRAGGABLE_TIMELINE_SCRUBBER_PACK,
  generateDraggableTimelineScrubberBlueprint,
  SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK,
  generateSvgSchematicBlueprintTraceBlueprint,
  SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK,
  generateScrolltriggerHorizontalTimelineBlueprint,
  FLIP_FILTER_MULTI_TAG_PACK,
  generateFlipFilterMultiTagBlueprint,
  MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK,
  generateMatchmediaAdaptiveChoreographyBlueprint,
  TICKER_CANVAS_PARTICLE_FIELD_PACK,
  generateTickerCanvasParticleFieldBlueprint,
  CUSTOMEASE_MECHANICAL_DETENT_PACK,
  generateCustomeaseMechanicalDetentBlueprint,
  SCROLLTRIGGER_BATCH_LEDGER_PACK,
  generateScrolltriggerBatchLedgerBlueprint,
  FLIP_ACCORDION_SPECIFICATION_PACK,
  generateFlipAccordionSpecificationBlueprint,
  QUICKTO_MAGNETIC_DOCK_PACK,
  generateQuicktoMagneticDockBlueprint,
  SPLITTEXT_TABULAR_COUNTER_PACK,
  generateSplittextTabularCounterBlueprint,
  SCROLLTRIGGER_MARGINALIA_SYNC_PACK,
  generateScrolltriggerMarginaliaSyncBlueprint,
};
