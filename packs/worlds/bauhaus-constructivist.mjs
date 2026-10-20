export const BAUHAUS_CONSTRUCTIVIST_WORLD = {
  id: 'bauhaus-constructivist',
  name: 'Bauhaus Dessau & Constructivist Archive',
  category: 'brutalist_systems',
  era: 'Avant-Garde Constructivism',
  summary: 'A stark, mathematically rigorous design language rooted in primary geometry, solid chromatic blocks, and aggressive typographic hierarchy.',
  VisitorModes: ['immerse', 'read', 'convert'],
  References: [
    'El Lissitzky Prouns',
    'Bauhaus Dessau Manifestos',
    'László Moholy-Nagy Typophoto',
  ],
  Typography: {
    display: "'Syne', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  Palette: {
    cream: 'oklch(0.95 0.018 84)',
    black: 'oklch(0.16 0.01 60)',
    vermilion: 'oklch(0.56 0.21 29)',
    cobalt: 'oklch(0.45 0.17 258)',
  },
  LayoutGrammar: 'Asymmetric tension grids, heavy structural rules crossing planes, intentional defiance of center-aligned containers.',
  SurfaceRules: 'Solid blocks of primary color cutting through stark unbleached space. Absolute avoidance of soft shadows or gradients.',
  MotionLanguage: 'Snappy, mechanical translation along hard axes. Rotations are strictly orthographic or 45-degree increments.',
  AntiHero: 'There is no hero image. Structural typographic elements, bold geometric intersecting lines, and dynamic scale are the core artifact.',
};

export function compileBauhausConstructivistCss() {
  return `
:root {
  --ng-bauhaus-cream: oklch(0.95 0.018 84);
  --ng-bauhaus-black: oklch(0.16 0.01 60);
  --ng-bauhaus-vermilion: oklch(0.56 0.21 29);
  --ng-bauhaus-cobalt: oklch(0.45 0.17 258);
  --ng-font-display: 'Syne', sans-serif;
  --ng-font-body: 'Plus Jakarta Sans', sans-serif;
  --ng-font-mono: 'IBM Plex Mono', monospace;
}
  `.trim();
}
