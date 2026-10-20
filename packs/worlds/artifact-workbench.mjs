export const ARTIFACT_WORKBENCH_WORLD = {
  id: 'artifact-workbench',
  name: 'Spatial Artifact Workbench & Provenance Canvas',
  category: 'swiss_grids',
  VisitorModes: ['operate', 'decide'],
  Typography: {
    display: 'Newsreader',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono'
  },
  Palette: {
    surfaces: 'Graphite slate (oklch(0.3 0 0)) and warm parchment modes (oklch(0.95 0.02 85))',
    accents: 'Provenance citation tokens (oklch(0.7 0.1 250))'
  },
  LayoutGrammar: 'Spatial artifact workbenches, inline diff lenses, confidence/provenance indicators, and keyboard-first command palettes.',
  SurfaceRules: 'Direct artifact inspection. No chat bubbles or generic AI panels.',
  MotionLanguage: 'Precise and instantaneous spatial transitions. No bouncy effects.',
  AntiHero: 'No chat bubbles or purple sparkle icons (lazy AI slop). No chat-only bottlenecks without direct artifact inspection.'
};

export function auditAiWorkspaceMarkup(html) {
  const issues = [];
  const lowerHtml = html.toLowerCase();

  if (html.includes('✨')) {
    issues.push("Contains sparkle emoji/icons ✨");
  }

  if (lowerHtml.includes('gradient') && lowerHtml.includes('ask ai')) {
    issues.push("Contains gradient 'Ask AI' pills");
  }

  const hasChat = lowerHtml.includes('chat') || lowerHtml.includes('message');
  const hasArtifact = lowerHtml.includes('artifact') || lowerHtml.includes('canvas') || lowerHtml.includes('workbench');

  if (hasChat && !hasArtifact) {
    issues.push("Contains chat-only bottlenecks without direct artifact inspection");
  }

  return issues;
}
