export const BROADCAST_KINETIC_WORLD = {
  id: 'broadcast-kinetic',
  name: 'Broadcast Kinetic',
  category: 'kinetic_typography',
  era: 'Contemporary',
  summary: 'A high-velocity motorsport and esports broadcast telemetry aesthetic.',
  VisitorModes: ['immerse', 'convert'],
  References: ['F1 Broadcast', 'Rocket League Esports', 'Gran Turismo 7 HUD'],
  Typography: {
    fontDisplay: "'Barlow Condensed', sans-serif",
    fontBody: "'Chakra Petch', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
  },
  Palette: {
    groundPrimary: 'oklch(0.12 0.01 250)', // Dark carbon
    groundElevated: 'oklch(0.18 0.01 250)', // Dark titanium
    groundGlass: 'oklch(0.12 0.01 250 / 0.8)',
    inkPrimary: 'oklch(0.98 0 0)',
    inkSecondary: 'oklch(0.85 0 0)',
    inkMuted: 'oklch(0.65 0 0)',
    accentPrimary: 'oklch(0.6 0.2 25)', // Signal red
    accentSecondary: 'oklch(0.7 0.18 70)', // Amber
    borderHairline: 'oklch(0.25 0.01 250)',
    semanticSuccess: 'oklch(0.6 0.15 150)',
    semanticWarning: 'oklch(0.7 0.18 70)',
    semanticDanger: 'oklch(0.6 0.2 25)',
  },
  LayoutGrammar: [
    'Fluid full-width telemetry splits.',
    'Heavy reliance on tabular-nums for real-time deltas.',
    'Skewed or high-angle geometry elements.',
  ],
  SurfaceRules: [
    'Avoid soft shadows; use hard drop-shadows or stark borders.',
    'Surface contrasts are aggressive (dark vs neon/bright).',
  ],
  MotionLanguage: {
    primaryEase: 'expo.out',
    entrancePattern: 'Rapid scale/slide with heavy stagger.',
    reducedMotionFallback: 'Instant snap.',
  },
  AntiHero: 'Avoid serene, slow, or organic forms.',
};

export function compileBroadcastKineticCss() {
  const p = BROADCAST_KINETIC_WORLD.Palette;
  return `:root {
  --ng-ground-primary: ${p.groundPrimary};
  --ng-ground-elevated: ${p.groundElevated};
  --ng-ground-glass: ${p.groundGlass};
  --ng-ink-primary: ${p.inkPrimary};
  --ng-ink-secondary: ${p.inkSecondary};
  --ng-ink-muted: ${p.inkMuted};
  --ng-accent-primary: ${p.accentPrimary};
  --ng-accent-secondary: ${p.accentSecondary};
  --ng-border-hairline: ${p.borderHairline};
  --ng-semantic-success: ${p.semanticSuccess};
  --ng-semantic-warning: ${p.semanticWarning};
  --ng-semantic-danger: ${p.semanticDanger};
}`;
}
