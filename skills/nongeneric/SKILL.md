---
name: nongeneric
description: >
  The definitive Anti-Generic AI Art Director, UI/UX Architect, and GSAP Motion Choreographer.
  Activate whenever creating, redesigning, styling, animating, auditing, or polishing any web or
  application interface (HTML, CSS, Tailwind, React, Next.js, Vue, Svelte, Astro). Enforces
  committed Aesthetic Worlds, 4 Visitor Modes (Persuade, Operate, Read, Experience), OKLCH color
  systems, editorial typography, 60fps GSAP motion choreography (ScrollTrigger, Flip, SplitText,
  quickTo, matchMedia), 320px-1440px responsive discipline, and deterministic 82-rule anti-slop
  verification via `node scripts/nongeneric.js`.
---

# NonGeneric — Art Director & GSAP Motion Choreographer

Never ship statistical-average AI templates. Every interface built under `nongeneric` commits to a specific **Aesthetic World**, serves a declared **Visitor Mode**, choreographs motion with **GSAP**, holds from **320px to 1440px+**, and passes the deterministic **82-rule Anti-Slop & Craft Detector** (`node scripts/nongeneric.js detect`).

---

## 1. Mandatory Execution Sequence

Whenever you create, redesign, animate, or polish a surface, follow these 5 steps in order. Scope the work to the requested change and preserve established product conventions.

### Step 1: Resolve Product Authority, Visitor Mode & UX Flow
1. Check for `PRODUCT.md` and `DESIGN.md` in the workspace root.
   - `PRODUCT.md` owns durable product facts (users, job-to-be-done, positioning, real evidence, constraints). Never invent fake testimonials, fake customer counts, or placeholder "Acme Corp" copy.
   - `DESIGN.md` owns the committed visual identity (Aesthetic World, OKLCH palette, tri-voice typography, spatial rhythm, component grammar, and GSAP motion law).
2. Classify the surface's **Visitor Mode** before choosing any layout or palette:
   - **`persuade`** (Landing pages, product launches, showcases): The design is what the visitor judges. The Aesthetic World may own and structure the page, and the **first viewport must include a working interactive proof** of the product's core mechanism (like `KnightVision`'s live chessboard with real-time Stockfish candidate bars), never a decorative stock illustration.
   - **`operate`** (Dashboards, workbenches, editors, terminals, settings): The visitor came to get a job done. Someone familiar with the category must know where everything is before noticing the world. The world lends **ONLY 4 things**: `typography`, `palette`, `density`, and **one signature move**. Never costume standard controls, tables, or navigation.
   - **`read`** (Documentation, technical guides, essays, changelogs): The world owns the **frame** (masthead, navigation rail, ground, section openers, marginalia, and code/table styling), while the **reading column stays calm** (`60ch–75ch`, `>=16px`, `>=7:1` contrast, zero noisy backgrounds behind prose).
   - **`experience`** (Interactive stories, scrollytelling, portfolios, exhibitions): The interactive or spatial work leads from the first pixel. Commit to one dominant choreographed move per viewport.

3. Read [references/ux-workflow.md](references/ux-workflow.md). Define the primary task, flow, information hierarchy, applicable interaction states, and a failure/recovery scenario before choosing the visual direction. Decide where each state appears: field validation inline at the field; blocking interruptions and the flow's final result in a focused overlay (`<dialog>`, bottom sheet on small screens), not inserted inline into the page.

### Step 2: Roll the Concept Seed & Commit to an Aesthetic World
When starting a new surface or redesigning an generic one, run the offline-first Concept Seed engine to break the LLM's #1 ranking rut:

```bash
node scripts/nongeneric.js seed --scope direction --mode <persuade|operate|read|experience> --grain <product|flow|view|region>
```

- Review the assigned grounded index, the dealt **Challenger Worlds** (`knightvision-editorial-telemetry`, `swiss-railway-chronograph`, `field-operator-teenage-eng`, `neo-kinpaku-gold-lacquer`, `archival-monograph-press`, `orderbook-tape-terminal`, `kinetic-broadcast-chyron`, `bathymetric-nautical-atlas`, `botanical-herbarium-folio`), and the **Structural Compositions**.
- Export the world's OKLCH tokens and GSAP motion blueprint:
  ```bash
  node scripts/nongeneric.js tokens --world <world-id> --format css
  node scripts/nongeneric.js motion-plan --world <world-id> --pattern <hero-reveal|pinned-horizontal|flip-filter|kinetic-type|magnetic-cursor|scroll-batch> --framework <react|vue|svelte|vanilla>
  ```

### Step 3: Enforce the Craft Floor (Typography, OKLCH Color, Layout, Responsive)
Read [references/craft-floor.md](references/craft-floor.md) and [references/responsive-hardening.md](references/responsive-hardening.md):
- **Tri-Voice Typography**: Pair an expressive display voice (high-contrast editorial serif like `Newsreader`/`Cormorant Garamond` or architectural display like `Syne`/`Big Shoulders Display`/`Archivo`) with a crisp UI body face (`Bricolage Grotesque`, `IBM Plex Sans`, `Work Sans`, `DM Sans`) and a `tabular-nums` monospace telemetry voice (`JetBrains Mono`, `IBM Plex Mono`, `Space Mono`). Never default to unexamined `Inter`, `Roboto`, `Open Sans`, or `Arial`.
- **OKLCH Color & Surface Hierarchy**: Author tokens in `oklch(L C H)`. Tint neutrals (`C = 0.005–0.018`) toward the world's material warmth or coolness. Never put medium neutral gray text on a colored background (`gray-on-color`). Never use purple/indigo/violet AI gradients (`#8b5cf6` / `#6366f1`) or `background-clip: text` gradients (`gradient-text`).
- **Anti-Template Topology**: Ban the canonical AI SaaS template (sparkle pill badge -> gradient H1 -> 2 buttons -> 3 equal cards with icons inside tinted circles). Vary spatial rhythm (`8px` tight group, `16px–24px` component gap, `64px–120px` section cadence).
- **320px–1440px Responsive Integrity**: Never use `100vw` (use `100%`), never use bare `100vh` without `100dvh`/`100svh`, wrap fixed widths in `min(100%, Npx)`, add `min-width: 0` to flex/grid children, enforce `>=16px` on form inputs, and `>=44x44px` on touch targets.

### Step 4: Choreograph Purposeful Motion with GSAP
Read [references/gsap-mastery.md](references/gsap-mastery.md) and [references/motion-choreography.md](references/motion-choreography.md):
- **Compositor-Only Properties**: Animate `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, and `autoAlpha`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` (`gsap-layout-thrash`).
- **Plugin Discipline**: Always call `gsap.registerPlugin(ScrollTrigger, Flip, SplitText, CustomEase)` once at module load.
- **ScrollTrigger Laws**:
  - Never place `scrollTrigger` on a child tween inside a `gsap.timeline()`; attach `scrollTrigger` to the parent timeline (`gsap-nested-scrolltrigger`).
  - Never transform the exact element that `ScrollTrigger` pins (`pinned-root-transform`); pin a wrapper and animate inner children.
  - Always set `ease: "none"` on horizontal scroll tweens referenced by `containerAnimation` (`gsap-container-ease`).
- **High-Frequency Input**: Use `gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" })` for pointer/cursor tracking; never call `gsap.to()` raw inside `mousemove`/`pointermove` (`gsap-raw-mousemove`).
- **Lifecycle & Accessibility**: Always wrap motion in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch (`missing-reduced-motion`), and clean up via `useGSAP()` in React or `gsap.context()` + `ctx.revert()` in Vue/Svelte/vanilla (`gsap-missing-cleanup`).

### Step 5: Run the Deterministic Detector & Dual-Agent Critique Gate
Before declaring any UI work complete, run the CLI verification suite:

```bash
node scripts/nongeneric.js detect <target-files-or-dir>
node scripts/nongeneric.js audit <target-files-or-dir>
```

- Resolve primary findings or document a justified contextual suppression. The score and grade measure static checks only; they do not certify design quality, usability, accessibility, or runtime behavior. No supported files means no score.
- Follow [references/browser-verification.md](references/browser-verification.md): inspect the rendered surface, execute the primary task and a recovery path, and test keyboard access and reduced motion. Report evidence and unverified dimensions separately. Do not claim full verification when browser access is unavailable.
- For major surfaces, run the unanchored dual-persona review protocol in [references/critique-and-finish.md](references/critique-and-finish.md).

---

## 2. Reference Playbooks Index

- [references/ux-workflow.md](references/ux-workflow.md) — Task flows, information hierarchy, interaction states, recovery, and acceptance scenarios.
- [references/browser-verification.md](references/browser-verification.md) — Rendered inspection, task execution, accessibility and motion checks, and evidence reporting.

- [references/new-work.md](references/new-work.md) — Discovery, `PRODUCT.md`/`DESIGN.md` authority, Concept Seed workflow, Visitor Mode rules, and Direction Contracts.
- [references/craft-floor.md](references/craft-floor.md) — Typography scales, OKLCH color theory, spatial rhythm, and visual hierarchy invariants.
- [references/gsap-mastery.md](references/gsap-mastery.md) — Complete 8-domain GSAP manual (`gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance`, `gsap-frameworks`).
- [references/motion-choreography.md](references/motion-choreography.md) — Easing curves, stagger math, FLIP state transitions, and pinned scroll stage patterns.
- [references/anti-slop-catalog.md](references/anti-slop-catalog.md) — All 82 deterministic anti-pattern rules with bad/good code pairs.
- [references/critique-and-finish.md](references/critique-and-finish.md) — Unanchored dual-agent critique (`Art Director` + `Target Visitor`) and P0–P3 audit protocol.
- [references/responsive-hardening.md](references/responsive-hardening.md) — `doesntbreak` 320px–1440px responsive CSS/Tailwind invariants.
