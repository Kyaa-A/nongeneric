export const FINTECH_LEDGER_WORLD = {
  id: 'fintech-ledger',
  name: 'Institutional Ledger & High-Density Telemetry',
  category: 'swiss_grids',
  VisitorModes: ['operate', 'decide'],
  Typography: {
    display: 'Instrument Serif',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono',
  },
  Palette: {
    alabaster: 'oklch(99% 0.01 90)',
    obsidian: 'oklch(15% 0.02 250)',
    semanticPositive: 'oklch(60% 0.15 140)',
    semanticNegative: 'oklch(55% 0.20 25)',
  },
  LayoutGrammar: {
    numericCells: 'right-aligned',
    borders: 'hairline grid borders',
    banned: ['decorative 4-card KPI rows with fake +12.5% badges'],
  },
  SurfaceRules: {
    entry: 'direct-to-workspace entry',
  },
  MotionLanguage: {
    patterns: ['GSAP tabular batch reveal', 'subtle row highlight'],
  },
  AntiHero: {
    banned: ['decorative 4-card KPI rows with fake +12.5% badges'],
  },
};

export function validateFinancialTableMarkup(html) {
  const errors = [];
  if (!html.includes('tabular-nums')) {
    errors.push('Missing tabular-nums for numeric alignment');
  }
  // This is a naive check. A real one might parse the HTML or look for typical classes.
  if (!/text-right|text-end|align-right/.test(html)) {
    errors.push('Numeric cells are not right-aligned');
  }
  if (/sparkline|KPI|badge/i.test(html) && /12\.5%/.test(html)) {
      errors.push('Found sparkline-card slop');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
