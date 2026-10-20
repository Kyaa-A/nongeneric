export const BOTANICAL_HERBARIUM_WORLD = {
  id: 'botanical-herbarium',
  name: 'Archival Botanical Herbarium & Natural History',
  category: 'organic_craft',
  era: 'Victorian / Archival',
  summary: 'A meticulously cataloged, natural history museum aesthetic focused on preserved flora, structured ledgers, and tactile parchment textures.',
  VisitorModes: ['read', 'immerse', 'decide'],
  References: ['Victorian herbariums', 'Binomial nomenclature ledgers', 'Pressed flora archives', 'Natural history museums'],
  Typography: {
    display: "'Cormorant Garamond', serif",
    body: "'Source Serif 4', serif",
    mono: "'IBM Plex Mono', monospace",
  },
  Palette: {
    parchment: 'oklch(0.955 0.016 86)',
    ink: 'oklch(0.21 0.015 65)',
    moss: 'oklch(0.46 0.09 148)',
    tag: 'oklch(0.56 0.13 42)',
  },
  LayoutGrammar: {
    grid: 'Structured ledger layouts with rigid columns and precise tabular data alignment',
    folio: 'Index numbers, taxonomy classifications, and collection stamps',
  },
  SurfaceRules: {
    materials: 'Pressed linen parchment, aged paper, and natural organic fibers',
    depth: 'Flat preservation with subtle tactile grain and contrast',
  },
  MotionLanguage: {
    rhythm: 'Measured, archival reveals reminiscent of turning delicate catalog pages',
    ease: 'power1.inOut for gentle, careful handling',
  },
  AntiHero: 'Focuses on the meticulous details of classification and the quiet beauty of preserved specimens over loud promotional banners.',
};

export function compileBotanicalHerbariumCss() {
  return `
:root {
  --ng-parchment: oklch(0.955 0.016 86);
  --ng-ink: oklch(0.21 0.015 65);
  --ng-moss: oklch(0.46 0.09 148);
  --ng-tag: oklch(0.56 0.13 42);
  --ng-font-display: 'Cormorant Garamond', serif;
  --ng-font-body: 'Source Serif 4', serif;
  --ng-font-mono: 'IBM Plex Mono', monospace;
}
  `.trim();
}
