# The NonGeneric Craft Floor

Every surface built or touched by `nongeneric` must satisfy these baseline craft invariants across Typography, Color, Layout, and Interactivity.

---

## 1. Tri-Voice Typography & Hierarchy

1. **Three Distinct Voices, Each with a Job**:
   - **Display Voice (`--ng-font-display`)**: Carries headlines, section openers, and major focal numbers. Choose a typeface with unmistakable silhouette—either an editorial high-contrast serif (`Newsreader`, `Cormorant Garamond`, `Playfair Display`, `Instrument Serif` when paired intentionally) or a structural grotesque/condensed display (`Bricolage Grotesque`, `Syne`, `Big Shoulders Display`, `Archivo`).
   - **Body / UI Voice (`--ng-font-body`)**: Carries paragraphs, form labels, buttons, and navigation. Must have a generous x-height and open apertures (`IBM Plex Sans`, `Work Sans`, `DM Sans`, `Plus Jakarta Sans`).
   - **Telemetry / Code Voice (`--ng-font-mono`)**: Carries metrics, timestamps, coordinates, keyboard shortcuts, and code (`JetBrains Mono`, `IBM Plex Mono`, `Space Mono`, `Fira Code`). Always enforce `font-variant-numeric: tabular-nums`.
2. **Fluid Modular Scale (`clamp()`)**:
   - Never hardcode desktop pixel sizes on headings that overflow 320px screens. Use fluid `clamp()` tokens:
     - Display H1: `clamp(2.25rem, 1.7rem + 2.8vw, 4.25rem)`, `line-height: 1.06`, `letter-spacing: -0.025em`, `text-wrap: balance`.
     - Section H2: `clamp(1.625rem, 1.3rem + 1.5vw, 2.5rem)`, `line-height: 1.12`, `letter-spacing: -0.02em`, `text-wrap: balance`.
     - Body copy: `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)`, `line-height: 1.6`, `max-width: 65ch`.
     - Kicker / Metadata: `0.75rem` (`12px` floor), `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-weight: 600`.
3. **Strict Tracking & Case Rules**:
   - Never apply positive tracking (`letter-spacing > 0.04em`) to lowercase body text (`wide-tracking`).
   - Never crush tracking tighter than `-0.05em` (`extreme-negative-tracking`).
   - Never set multi-sentence copy in `UPPERCASE` (`all-caps-body`).
   - Never set any UI text smaller than `11px` (`undersized-ui-text`).

---

## 2. Perceptual Color in OKLCH

1. **Tinted Grounds & Inks (No Dead Greys or Pure `#000000`)**:
   - Neutral surfaces and inks should carry a subtle chroma (`0.005` to `0.018`) aligned with the world's temperature:
     - Warm Archival Paper: `oklch(0.975 0.008 80)` with Obsidian Ink `oklch(0.16 0.01 75)`.
     - Deep Carbon Studio: `oklch(0.145 0.008 250)` with Ivory Ink `oklch(0.95 0.006 85)`.
2. **No Neutral Gray on Chromatic Backgrounds (`gray-on-color`)**:
   - Placing `text-slate-400` or `#888888` on a colored fill looks muddy and washed out. Either use high-contrast ink or match the text's hue angle `H` in OKLCH to the background's hue.
3. **Ban the Default AI Palette**:
   - No `from-purple-500 to-indigo-600` gradients (`purple-blue-gradient`, `ai-color-palette`).
   - No `background-clip: text` rainbow or purple-blue headlines (`gradient-text`).
   - No diffuse neon box-shadows (`dark-glow`) or blurred background blobs (`radial-halo`).

---

## 3. Spatial Rhythm & Architectural Framing

1. **Three-Tier Spacing Cadence (Defeating `monotonous-spacing`)**:
   - If every gap, padding, and margin is `16px` or `24px`, the page flattens into a uniform soup.
   - Use distinct ratios:
     - **Internal tight grouping**: `6px–10px` (kicker to heading, label to input).
     - **Component padding & sibling gap**: `16px–28px`.
     - **Major section break**: `64px–120px` (`clamp(4rem, 3rem + 5vw, 7.5rem)`).
2. **One Boundary System**:
   - Choose either **exposed 1px architectural hairlines** (`border: 1px solid var(--ng-border-hairline)`) OR **tonal surface elevation** (`background: var(--ng-ground-elevated)`).
   - Never nest bordered, shadowed cards inside bordered, shadowed cards (`nested-cards`).
   - Never put a thick `4px` colored left/right border on a rounded card (`side-tab`).
