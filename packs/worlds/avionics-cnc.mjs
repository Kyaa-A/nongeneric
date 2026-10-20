export const AVIONICS_CNC_WORLD = {
  id: 'avionics-cnc',
  name: 'Anodized CNC & Flight-Deck Avionics',
  category: 'industrial_hardware',
  era: 'Contemporary High-Precision',
  summary: 'A dense, tactile interface inspired by modern flight decks and anodized CNC machinery, prioritizing high-legibility telemetry and infallible operator intent over aesthetic frills.',
  VisitorModes: ['operate', 'decide'],
  References: [
    'Boeing 787 / A350 Glass Cockpits',
    'Haas / Fanuc CNC control pendants',
    'High-end anodized aluminum enclosures',
  ],
  Typography: {
    display: 'Rajdhani',
    body: 'Atkinson Hyperlegible',
    mono: 'Berkeley Mono',
  },
  Palette: {
    surfaces: 'Bead-blasted dark titanium (OKLCH 25% 0.01 260)',
    accents: 'Aviation Amber (OKLCH 75% 0.18 70), Emerald Status (OKLCH 70% 0.16 150)',
  },
  LayoutGrammar: 'Rigid grid blocks, tabular numerals, distinct bezels separating function zones.',
  SurfaceRules: 'Matte textures with high-contrast, luminous text. No gradients. Tactile 44x44px minimum touch targets.',
  MotionLanguage: 'Instantaneous response. State changes occur on the frame. No ease-ins.',
  AntiHero: 'No marketing fluff. No hero sections. Straight to the mission-critical instrument workspace.',
};

export function compileAvionicsCncCss() {
  return `
:root {
  --color-surface-base: oklch(0.25 0.01 260);
  --color-surface-raised: oklch(0.30 0.01 260);
  --color-surface-recessed: oklch(0.20 0.01 260);

  --color-text-primary: oklch(0.95 0.01 260);
  --color-text-secondary: oklch(0.75 0.01 260);

  --color-status-amber: oklch(0.75 0.18 70);
  --color-status-emerald: oklch(0.70 0.16 150);
  --color-status-danger: oklch(0.65 0.20 25);

  --font-display: "Rajdhani", sans-serif;
  --font-body: "Atkinson Hyperlegible", sans-serif;
  --font-mono: "Berkeley Mono", "IBM Plex Mono", monospace;
}
  `.trim();
}
