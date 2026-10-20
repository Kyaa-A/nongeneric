export type RuleCategory = 'slop' | 'quality' | 'motion' | 'responsive' | 'copy' | 'security';
export type RuleSeverity = 'error' | 'warning' | 'advisory';
export type VisitorMode = 'persuade' | 'operate' | 'read' | 'experience';
export type WellTier = 'graphic' | 'interaction' | 'atmosphere';
export type CompositionGrain = 'product' | 'flow' | 'view' | 'region';
export type PlatformTarget = 'web' | 'ios' | 'android' | 'adaptive';

export interface AntipatternRule {
  id: string;
  name: string;
  category: RuleCategory;
  severity: RuleSeverity;
  scopes: string[];
  description: string;
  fix: string;
  cssHint?: string;
}

export interface Finding {
  ruleId: string;
  name: string;
  category: RuleCategory;
  severity: RuleSeverity;
  advisory: boolean;
  file: string;
  line: number;
  snippet: string;
  description: string;
  fix: string;
}

export interface ScanOptions {
  scopes?: string[];
  includeAdvisory?: boolean;
  inlineIgnores?: boolean;
  ignoreRules?: string[];
  ignoreFiles?: string[];
}

export interface ScanReport {
  scannedFiles: number;
  primaryCount: number;
  advisoryCount: number;
  findings: Finding[];
  advisories: Finding[];
  byCategory: Record<RuleCategory, number>;
}

export interface WorldTokenSpec {
  groundPrimary: string;
  groundElevated: string;
  groundGlass: string;
  inkPrimary: string;
  inkSecondary: string;
  inkMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  borderHairline: string;
  semanticSuccess: string;
  semanticWarning: string;
  semanticDanger: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  googleFontsUrl: string;
}

export interface WorldGsapRecipe {
  plugins: string[];
  primaryEase: string;
  entrancePattern: string;
  scrollPattern: string;
  interactionPattern: string;
  reducedMotionFallback: string;
}

export interface WorldConcept {
  id: string;
  name: string;
  wellTier: WellTier;
  familyId: string;
  familyLabel: string;
  allowedModes: VisitorMode[];
  form: string;
  lineage: string;
  spark: string;
  tags: [string, string, string];
  system: [string, string, string, string, string];
  avoid: string[];
  webLeverage: string;
  tokens: WorldTokenSpec;
  gsapRecipe: WorldGsapRecipe;
}

export interface StructuralComposition {
  id: string;
  name: string;
  surface: VisitorMode;
  grain: CompositionGrain;
  platforms: PlatformTarget[];
  form: string;
  spark: string;
  grammar: [string, string, string, string];
  webLeverage: string;
}

export interface SeedRollOptions {
  scope?: 'direction' | 'surface';
  mode?: VisitorMode;
  grain?: CompositionGrain;
  platform?: PlatformTarget;
  register?: 'safer' | 'bolder';
  reroll?: number;
  fromKey?: string;
  candidateCount?: number;
}

export interface SeedRollResult {
  key: string;
  seedReference: string;
  scope: 'direction' | 'surface';
  mode: VisitorMode;
  grain: CompositionGrain;
  platform: PlatformTarget;
  reroll: number;
  register?: 'safer' | 'bolder';
  assignedIndex: number;
  dealtIndices: [number, number, number];
  challengers: WorldConcept[];
  compositions: StructuralComposition[];
  modeRules: {
    directions: string;
    comps: string;
  };
}

export type MotionPatternId =
  | 'hero-reveal'
  | 'pinned-horizontal'
  | 'flip-filter'
  | 'kinetic-type'
  | 'magnetic-cursor'
  | 'scroll-batch';

export type FrameworkTarget = 'react' | 'vue' | 'svelte' | 'vanilla';

export interface MotionBlueprint {
  pattern: MotionPatternId;
  framework: FrameworkTarget;
  worldId: string;
  worldName: string;
  plugins: string[];
  accessibilityNotes: string[];
  performanceNotes: string[];
  code: string;
}

export interface PillarScore {
  pillar: 'typography' | 'color' | 'layout' | 'motion' | 'copy';
  label: string;
  score: number;
  maxScore: number;
  deductions: string[];
}

export interface AuditReport {
  overallScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
  pillars: PillarScore[];
  scan: ScanReport;
  remediationPlan: {
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    ruleId: string;
    location: string;
    action: string;
  }[];
}
