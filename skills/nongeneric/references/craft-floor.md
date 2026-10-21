# The NonGeneric Craft Floor

Every surface built or touched by `nongeneric` must satisfy these baseline craft invariants across Typography, Color, Layout, and Interactivity.

---

## 1. Typography Roles & Consistent Hierarchy

1. **Three Roles, Not Three Required Font Families**:
   - Preserve the host type system. A single family with appropriate weights may serve display and body; add another only when it improves the hierarchy. Familiar fonts are valid deliberate choices. Display/body/mono token names describe roles, not a requirement to load three families.
   - **Display Voice (`--ng-font-display`)**: Carries headlines, section openers, and major focal numbers. When an expressive display face serves the direction, consider an editorial high-contrast serif (`Newsreader`, `Cormorant Garamond`, `Playfair Display`, `Instrument Serif` when paired intentionally) or a structural grotesque/condensed display (`Bricolage Grotesque`, `Syne`, `Big Shoulders Display`, `Archivo`).
   - **Body / UI Voice (`--ng-font-body`)**: Carries paragraphs, form labels, buttons, and navigation. Must have a generous x-height and open apertures (`IBM Plex Sans`, `Work Sans`, `DM Sans`, `Plus Jakarta Sans`).
   - **Telemetry / Code Voice (`--ng-font-mono`)**: Carries metrics, timestamps, coordinates, keyboard shortcuts, and code (`JetBrains Mono`, `IBM Plex Mono`, `Space Mono`, `Fira Code`). Use `font-variant-numeric: tabular-nums` when comparing aligned numeric values; omit the mono role when there is no code or data job.
2. **Shared Role Tokens**:
   - The role names below are application-authored examples, not additional CLI output. Generated world tokens are a starting point: retain the host font family, map or override generated sizes to the chosen roles, and remove unused font imports instead of loading every suggested family.
   - Reuse the host scale first. For a new clean product UI, this is a starting scale at a default 16px root, not a universal prescription:

     | Role token | Size | Line-height | Weight | Tracking | Typical use |
     | --- | --- | --- | --- | --- | --- |
     | `--ng-text-meta` | `0.875rem` | `1.4` | `400` | `0` | Supporting metadata |
     | `--ng-text-label` | `0.875rem` | `1.4` | `500` | `0` | Labels, navigation, buttons |
     | `--ng-text-body` | `1rem` | `1.6` | `400` | `0` | Paragraphs, input text |
     | `--ng-text-title` | `1.25rem` | `1.3` | `600` | `-0.01em` | Panel titles |
     | `--ng-text-section` | `1.5rem` | `1.25` | `600` | `-0.01em` | Section headings |
     | `--ng-text-display` | `clamp(2rem, 1.5rem + 2vw, 3.5rem)` | `1.15` | `600` | `-0.02em` | Optional launch/editorial headline |

   - Bind components to roles, including their weight and tracking. Do not use slightly different arbitrary sizes for equivalent labels on different screens. Define responsive changes once per role rather than per component.
   - Use the display role only where the hierarchy needs it; a settings page does not need a hero-sized title. Keep form inputs at least 16px and reading columns around `60–75ch`. Retain user text scaling; do not shrink the root size to squeeze content in.
   - Test long labels, 320px layouts, and 200% zoom. Check computed styles for matching roles across screens and states. Consistency is shared roles, not making all text the same size.
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
   - The "tasteful" default is a default too: warm cream paper with an editorial serif, a terracotta or vermilion accent, and broadsheet hairline rules reads as AI-made even when every detector rule passes. Use it only when the subject's own world calls for it, never as the fallback for "make it look designed".
4. **Color Must Mean Something**:
   - In `operate` surfaces, reserve saturated color for state (selected, active, error). Decorative color on unselected rows competes with the selection and tells the user nothing.
5. **Check Text on Accent Fills Both Ways**:
   - For every accent used as a fill, compute contrast for both light and dark text. If the readable option looks muddy (near-black on mid orange at 5.3:1 while white fails at 3.3:1), shift the accent's lightness until the intended ink passes (a deeper fired terracotta takes white at 5.96:1). Keep one ink rule per fill.

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
   - Hairlines drawn as `gap: 1px` over a dark container background fill every empty grid cell with that color. When items don't fill the last row, draw each cell's rule itself (`box-shadow: 0 0 0 1px var(--rule)` with a 1px gap and padding).
3. **Recompose, Don't Repaint**:
   - A redesign that keeps the original single column and only swaps fonts and colors still looks generic. Change the composition when the task benefits, for example a split layout with a persistent summary and action rail beside the steps.
   - Give the composition one focal point and balanced weight. Avoid a stack of equally loud blocks followed by thin outlined ones.
   - Fill the frame. A sticky column that leaves a large dead area under its content looks unfinished: pin it to the viewport (heading at the top, action at the bottom) and test more than one viewport height so pinned parts never collide.
4. **Unavailable Is Not Empty**:
   - Dashed outlines read as placeholders or drop zones. Mark unavailable options with a hatch or reduced fill, a struck label, and an explicit word ("Full"), and keep them disabled.
