export const MONASTIC_WASHI_WORLD = {
  id: 'monastic-washi',
  name: 'Monastic Washi & Sumi Ink Editorial',
  category: 'organic_craft',
  era: 'Timeless / Archival',
  summary: 'A minimalist organic aesthetic grounded in raw materials, deliberate asymmetry, and generous negative space, channeling traditional monographs and artisanal printmaking.',
  VisitorModes: ['read', 'immerse'],
  References: ['Wabi-Sabi monographs', 'Sumi-e ink washing', 'Traditional Japanese editorial grids'],
  Typography: {
    display: "'Shippori Mincho', serif",
    body: "'Source Serif 4', serif",
    mono: "'IBM Plex Mono', monospace",
  },
  Palette: {
    washi: 'oklch(0.96 0.015 82)',
    sumi: 'oklch(0.19 0.01 65)',
    vermilion: 'oklch(0.55 0.19 32)',
  },
  LayoutGrammar: {
    grid: 'Asymmetric editorial with generous Ma (negative space)',
    folio: 'Marginalia and strict baseline alignment',
  },
  SurfaceRules: {
    materials: 'Raw textures, devoid of synthetic glass or neon',
    depth: 'Flat planes with stark contrast',
  },
  MotionLanguage: {
    rhythm: 'Deliberate, slow, ink-bleed fades',
    ease: 'power2.inOut or linear diffusion',
  },
  AntiHero: 'The focal point is the typography and negative space, refusing standard hero image paradigms.',
};

export function compileMonasticWashiCss() {
  return `
:root {
  --ng-washi: oklch(0.96 0.015 82);
  --ng-sumi: oklch(0.19 0.01 65);
  --ng-vermilion: oklch(0.55 0.19 32);
  --ng-font-display: 'Shippori Mincho', serif;
  --ng-font-body: 'Source Serif 4', serif;
  --ng-font-mono: 'IBM Plex Mono', monospace;
}
  `.trim();
}
