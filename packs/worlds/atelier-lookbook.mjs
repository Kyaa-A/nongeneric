export const ATELIER_LOOKBOOK_WORLD = {
  id: 'atelier-lookbook',
  name: 'Independent Atelier & Tactile Lookbook',
  category: 'editorial_fashion',
  VisitorModes: ['immerse', 'convert', 'decide'],
  Typography: {
    display: "'Playfair Display', serif",
    body: "'Instrument Sans', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  Palette: {
    'unbleached-silk': 'oklch(0.96 0.012 78)',
    'espresso-umber': 'oklch(0.18 0.018 52)',
    'oxidized-bronze': 'oklch(0.52 0.09 64)',
  },
  LayoutGrammar: 'Editorial pacing with tactile material close-ups and provenance specification tables.',
  SurfaceRules: 'No identical 3-card pricing grids. Emphasize organic textures over synthetic interfaces.',
  MotionLanguage: 'Subtle transitions focusing on detail reveals rather than aggressive motion.',
  AntiHero: 'Avoids fake countdown timers and pop-up spin wheels. Values authenticity and provenance.',
};

export function compileAtelierLookbookCss() {
  return `
:root {
  --ng-unbleached-silk: oklch(0.96 0.012 78);
  --ng-espresso-umber: oklch(0.18 0.018 52);
  --ng-oxidized-bronze: oklch(0.52 0.09 64);
  --ng-font-display: 'Playfair Display', serif;
  --ng-font-body: 'Instrument Sans', sans-serif;
  --ng-font-mono: 'IBM Plex Mono', monospace;
}
  `.trim();
}
