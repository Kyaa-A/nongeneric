import { getWorldById, WORLD_CONCEPTS } from './catalog.js';
export function resolveWorld(worldId) {
    if (worldId) {
        const found = getWorldById(worldId);
        if (found)
            return found;
    }
    return WORLD_CONCEPTS[0];
}
export function generateTokens(worldId, format = 'css') {
    const world = resolveWorld(worldId);
    const t = world.tokens;
    if (format === 'json') {
        return JSON.stringify({
            worldId: world.id,
            worldName: world.name,
            wellTier: world.wellTier,
            googleFontsUrl: t.googleFontsUrl,
            colors: {
                groundPrimary: t.groundPrimary,
                groundElevated: t.groundElevated,
                groundGlass: t.groundGlass,
                inkPrimary: t.inkPrimary,
                inkSecondary: t.inkSecondary,
                inkMuted: t.inkMuted,
                accentPrimary: t.accentPrimary,
                accentSecondary: t.accentSecondary,
                borderHairline: t.borderHairline,
                semanticSuccess: t.semanticSuccess,
                semanticWarning: t.semanticWarning,
                semanticDanger: t.semanticDanger,
            },
            typography: {
                fontDisplay: t.fontDisplay,
                fontBody: t.fontBody,
                fontMono: t.fontMono,
                scale: {
                    xs: 'clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)',
                    sm: 'clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem)',
                    base: 'clamp(1rem, 0.96rem + 0.22vw, 1.0625rem)',
                    lg: 'clamp(1.125rem, 1.05rem + 0.38vw, 1.3125rem)',
                    xl: 'clamp(1.375rem, 1.2rem + 0.85vw, 1.875rem)',
                    '2xl': 'clamp(1.875rem, 1.5rem + 1.8vw, 3rem)',
                    display: 'clamp(2.375rem, 1.8rem + 2.8vw, 4.25rem)',
                },
            },
            motion: {
                easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
                easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
                easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
                gsapPrimaryEase: world.gsapRecipe.primaryEase,
            },
        }, null, 2);
    }
    if (format === 'tailwind') {
        return `/* NonGeneric Tailwind v4 @theme — World: ${world.name} (${world.id}) */
@import url('${t.googleFontsUrl}');
@import "tailwindcss";

@theme {
  --color-ground: ${t.groundPrimary};
  --color-ground-elevated: ${t.groundElevated};
  --color-ground-glass: ${t.groundGlass};
  --color-ink: ${t.inkPrimary};
  --color-ink-secondary: ${t.inkSecondary};
  --color-ink-muted: ${t.inkMuted};
  --color-accent: ${t.accentPrimary};
  --color-accent-secondary: ${t.accentSecondary};
  --color-hairline: ${t.borderHairline};
  --color-success: ${t.semanticSuccess};
  --color-warning: ${t.semanticWarning};
  --color-danger: ${t.semanticDanger};

  --font-display: ${t.fontDisplay};
  --font-sans: ${t.fontBody};
  --font-mono: ${t.fontMono};

  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
`;
    }
    return `/* ═══════════════════════════════════════════════════════════════════════════
 * NonGeneric OKLCH Design Tokens — World: ${world.name} (${world.id})
 * Lineage: ${world.lineage}
 * ═══════════════════════════════════════════════════════════════════════════ */
@import url('${t.googleFontsUrl}');

:root {
  /* 1. OKLCH Surface & Ink Palette */
  --ng-ground-primary: ${t.groundPrimary};
  --ng-ground-elevated: ${t.groundElevated};
  --ng-ground-glass: ${t.groundGlass};
  --ng-ink-primary: ${t.inkPrimary};
  --ng-ink-secondary: ${t.inkSecondary};
  --ng-ink-muted: ${t.inkMuted};
  --ng-accent-primary: ${t.accentPrimary};
  --ng-accent-secondary: ${t.accentSecondary};
  --ng-border-hairline: ${t.borderHairline};
  --ng-status-success: ${t.semanticSuccess};
  --ng-status-warning: ${t.semanticWarning};
  --ng-status-danger: ${t.semanticDanger};

  /* 2. Tri-Voice Typography */
  --ng-font-display: ${t.fontDisplay};
  --ng-font-body: ${t.fontBody};
  --ng-font-mono: ${t.fontMono};

  /* 3. Fluid Modular Type Scale */
  --ng-text-xs: clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem);
  --ng-text-sm: clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem);
  --ng-text-base: clamp(1rem, 0.96rem + 0.22vw, 1.0625rem);
  --ng-text-lg: clamp(1.125rem, 1.05rem + 0.38vw, 1.3125rem);
  --ng-text-xl: clamp(1.375rem, 1.2rem + 0.85vw, 1.875rem);
  --ng-text-2xl: clamp(1.875rem, 1.5rem + 1.8vw, 3rem);
  --ng-text-display: clamp(2.375rem, 1.8rem + 2.8vw, 4.25rem);

  /* 4. Non-Monotonous Spatial Rhythm */
  --ng-space-tight: 0.5rem;
  --ng-space-group: 1rem;
  --ng-space-card: clamp(1.25rem, 1rem + 1vw, 2rem);
  --ng-space-section: clamp(4rem, 3rem + 5vw, 7.5rem);
  --ng-measure-prose: 65ch;

  /* 5. Motion & Easing Physics */
  --ng-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ng-ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ng-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}
