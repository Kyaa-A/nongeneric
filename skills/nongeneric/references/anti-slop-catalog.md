# Anti-Slop Catalog (82 Deterministic Rules)

`node scripts/nongeneric.js detect` scans HTML, CSS, SCSS, JSX, TSX, Vue, Svelte, and Astro files for 82 deterministic rules across 6 domains.

---

## Domain 1: AI Visual & Color Slop (`slop`)

| Rule ID | What It Catches | The NonGeneric Fix |
| :--- | :--- | :--- |
| `side-tab` | `border-l-4` or `border-left: 4px solid` on a rounded card | Square the corners where the stripe sits (`border-radius: 0`) or use a top hairline / badge indicator |
| `border-accent-on-rounded` | Thick `border-top` / `border-bottom` on a rounded box | Square off the accented edge or place the stripe inside an `overflow: hidden` header |
| `gradient-text` | `background-clip: text` + gradient on headings | Use solid high-contrast ink; highlight keywords via italic serif contrast |
| `animated-gradient-text` | Shimmering animated `background-size` on gradient text | Remove background shimmer; leave text still unless a one-shot entrance serves the task |
| `purple-blue-gradient` | `#8b5cf6` / `#6366f1` / `from-purple-* to-indigo-*` | Use a committed OKLCH world palette |
| `cyan-on-dark` | Neon cyan (`#06b6d4` / `#22d3ee`) on dark slate (`#0f172a`) | Use warm charcoal/obsidian ground with purposeful signal accent |
| `dark-glow` | Diffuse `box-shadow: 0 0 40px rgba(...)` neon glow | Use crisp 1px structural hairlines or subtle elevation shadows |
| `radial-halo` | Blurred radial gradient spotlight blobs behind text | Delete decorative blur blobs; let grid structure or live proof anchor the hero |
| `overused-font` | Reflexive `Inter`, `Roboto`, `Arial`, `Space Grotesk` | Use deliberate typography roles; preserve a justified host font with a documented contextual waiver rather than adding families |
| `bounce-easing` | `animate-bounce`, `elastic`, or overshooting `cubic-bezier` | Use crisp deceleration curves (`power3.out`, `cubic-bezier(0.22, 1, 0.36, 1)`) |
| `sparkle-icon-ai` | `✨` emoji or generic 4-point AI sparkles | Name the concrete engine/model capability directly |
| `em-dash-overuse` | High density of `—` em-dashes in UI prose | Rewrite with direct declarative clauses and periods |
| `marketing-buzzword` | "Unleash", "supercharge", "seamlessly integrate", "next-gen" | Replace with concrete mechanisms, metrics, and domain nouns |
| `aphoristic-cadence` | Repeated "Not X. Just Y." AI copywriting cadence | State product truth in natural human prose |

---

## Domain 2: Visual, Typographic & Technical Quality (`quality`)

- `gray-on-color`: Neutral gray/slate text on a chromatic background -> Tint secondary text in OKLCH to match the background hue.
- `wide-tracking`: `letter-spacing > 0.05em` on lowercase text -> Restrict wide tracking to short uppercase kickers.
- `extreme-negative-tracking`: `letter-spacing < -0.05em` -> Keep display tracking between `-0.02em` and `-0.04em`.
- `undersized-ui-text`: `font-size < 11px` -> Enforce `12px` minimum for metadata and `16px` for prose.
- `monotonous-spacing`: Single spacing value used `>65%` of the time -> Establish tight (`8px`), component (`16-24px`), and section (`64-120px`) tiers.
- `missing-focus-ring`: `outline: none` without `:focus-visible` -> Always provide a visible `:focus-visible` ring.
- `broken-image` / `dead-link` / `generic-button-label` / `placeholder-text`.

---

## Domain 3: GSAP & Motion Choreography (`motion`)

- `gsap-layout-thrash`: Animating `width`, `height`, `top`, `left`, `margin`, `padding` -> Animate `x`, `y`, `scaleX`, `scaleY`, `autoAlpha`, or use `Flip`.
- `gsap-nested-scrolltrigger`: `scrollTrigger` inside a child tween of a timeline -> Move `scrollTrigger` to `gsap.timeline({ scrollTrigger })`.
- `gsap-container-ease`: `containerAnimation` without `ease: "none"` -> Set `ease: "none"` on horizontal scroll tweens.
- `gsap-missing-cleanup`: `gsap.*` inside `useEffect` without `useGSAP()` or `gsap.context()` -> Wrap in `useGSAP` or `gsap.context()` + `ctx.revert()`.
- `gsap-missing-register`: Using `ScrollTrigger`, `Flip`, or `SplitText` without `gsap.registerPlugin()`.
- `gsap-raw-mousemove`: Calling `gsap.to()` inside `mousemove`/`pointermove` -> Pre-allocate `gsap.quickTo()`.
- `transition-all`: `transition: all` or `transition-all` -> Specify exact properties.
- `will-change-abuse`: `will-change: all` -> Use `will-change: transform, opacity` sparingly.
- `missing-reduced-motion`: Animations without `prefers-reduced-motion` or `gsap.matchMedia()`.
- `stagger-overload`: Per-item stagger `> 0.25s`.

---

## Domain 4: Responsive & Layout Hardening (`responsive`)

- `viewport-width-overflow`: `width: 100vw` or `w-screen` -> Use `width: 100%`.
- `legacy-viewport-height`: Bare `100vh` / `h-screen` -> Use `100dvh` or `100svh`.
- `missing-min-w-0`: `truncate` / `text-overflow: ellipsis` inside flex/grid without `min-width: 0`.
- `ios-input-zoom`: Form `<input>`/`<select>`/`<textarea>` with `font-size < 16px`.
- `rigid-desktop-width`: `width: 450px+` without `max-width: 100%` or `min(100%, Npx)`.
- `unbounded-grid-track`: `minmax(350px, 1fr)` without `min(100%, 280px)`.

---

## Inline Waiver Syntax

When an intentional design choice triggers a rule, document the waiver inline:
```html
<!-- nongeneric-disable-next-line overused-font -- required by client brand guidelines -->
```
```css
.brand-legacy { font-family: Inter, sans-serif; } /* nongeneric-disable-line overused-font */
```
