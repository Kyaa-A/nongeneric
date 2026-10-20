# REA Reverse-Engineering Evidence Ledger (`morluto/rea` -> `impeccable` + `gsap-skills` + `KnightVision`)

> **Methodology**: Evidence-First Static & Structural Reverse Engineering executed via `morluto/rea` (`rea@6.1.0` `analyze-javascript-application`) combined with full Rust/TypeScript/Skill AST inspection.

---

## 1. Reverse-Engineering Tooling: `morluto/rea` (`https://github.com/morluto/rea.git`)

### 1.1 Architecture & Capabilities
- **Engine**: `rea@6.1.0` (`skills/reverse-engineer-anything`), providing fail-closed, Evidence-backed static analysis across JavaScript/Electron applications (`analyze-javascript-application`), web bundles (`analyze-web-bundle`), native Mach-O/ELF/PE binaries, and reconstruction obligation ledgers (`build-reconstruction-obligation-ledger`).
- **Execution Evidence**:
  1. `rea-agents analyze-javascript-application impeccable/browser-bundle --format json` -> Reconstructed `rea-impeccable-browser-bundle.json` (18 MB static application & semantic graph).
  2. `rea-agents analyze-javascript-application impeccable/skill/scripts --format json` -> Reconstructed `rea-impeccable-skill-scripts.json` (145 MB static application & semantic graph across `command-metadata.json`, `font-index.json`, `live-browser.js`, `live-browser-dom.js`, `live-browser-ignores.js`, `live-browser-session.js`, `modern-screenshot.umd.js`).
  3. `rea-agents analyze-javascript-application gsap-skills --format json` -> Reconstructed `rea-gsap-skills.json` (881 KB static application graph).

### 1.2 Key Structural Finding on `pbakaus/impeccable`
- `impeccable` commits 16 duplicated provider distribution trees (`.agents`, `.claude`, `.cursor`, `.dsh`, `.gemini`, `.grok`, `.hermes`, `.kiro`, `.opencode`, `.pi`, `.qoder`, `.rovodev`, `.trae`, `.universal`, `.vscode`, `.windsurf`), each containing identical copies of `modern-screenshot.umd.js` and `font-index.json`.
- **NonGeneric Architectural Upgrade**: Instead of bloating the repository with 16 duplicated binary/JSON copies, `nongeneric` uses a single canonical `skills/` + `scripts/` + `agents/` + `commands/` tree referenced cleanly by `.claude-plugin`, `.codex-plugin`, `.cursor-plugin`, and `.agents/plugins/marketplace.json`.

---

## 2. Reverse-Engineering Target 1: `pbakaus/impeccable` (`https://github.com/pbakaus/impeccable.git`)

### 2.1 System Architecture (`crates/` & `skill/`)
`impeccable` is divided into two halves:
1. **Rust Engine (`crates/{cli,core,detect,html,context,comp,comp-verbs,live,wasm}`)**:
   - `crates/core/src/checks/`: Implements CSS/HTML/text anti-pattern scanners (`css_scan.rs`, `decorative_text.rs`, `gradient_geometry.rs`, `html_patterns.rs`, `measures.rs`, `rules.rs`, `text_context.rs`, `text_rules.rs`).
   - `crates/detect/src/{cli.rs,detect_text.rs,regex_matchers.rs,design_system.rs}`: Implements `impeccable detect` across static HTML/CSS, regex source matching (JSX/TSX/Vue/Svelte/SCSS), and browser DOM evaluation.
   - `crates/context/src/{concept_seed.rs,catalog.rs,roll_selection.rs,serve_question.rs}`: Implements `impeccable concept-seed` and `serve-question`.
   - `crates/live/`: Implements the local dev server overlay (`detect-antipatterns-browser.js`) for live variant hot-swapping.
2. **Skill Playbooks (`skill/SKILL.src.md` & `skill/reference/*.md`)**:
   - **Durable Authorities**:
     - `PRODUCT.md` (`<!-- impeccable:product-schema 1 -->`): Captures users, product purpose, positioning, operating context, capabilities/constraints, brand commitments, evidence on hand, and product principles. Never invents visual styles.
     - `DESIGN.md`: Captures the committed visual world, OKLCH color system, typography hierarchy, layout topology, component character, and motion grammar.
     - Surface Briefs (`.impeccable/<surface>.md`): Records the task's `FORM` line, `SEED REFERENCE`, visitor mode, focal point, and direction contract.

### 2.2 The 4 Visitor Modes (`mode-persuade.md`, `mode-operate.md`, `mode-read.md`)
| Visitor Mode | Primary Visitor Intent | How the Aesthetic World Enters | Build Path Default |
| :--- | :--- | :--- | :--- |
| **Persuade** | Evaluate offer, feel desire, convert | World may carry & structure the page, provided conversion & working action live inside the form (`skill-persuade-conversion-in-form`). | Comp-first or Code-first |
| **Experience** | Immerse in interactive/narrative work | The interactive work itself leads from the first viewport; world owns the stage. | Comp-first or Code-first |
| **Operate** | Execute tasks, inspect telemetry, act | World lends **only 4 things**: `type`, `palette`, `density`, and **one signature move**. Never costumes controls or navigation. | Always Code-led |
| **Read** | Understand documentation/articles | World owns the **frame** (masthead, rail, ground, section openers); reading column stays calm (`60-75ch`, `>=16px`). | Always Code-led |

### 2.3 Concept Seed & Challenger Architecture (`concept_seed.rs` & `roll_selection.rs`)
- **Why LLMs produce generic UI**: Left to rank its own ideas, an LLM always picks candidate #1—the statistical average of its training data.
- **How `concept-seed` breaks the rut**:
  - Generates a deterministic SHA-256 seed key and assigns a non-top candidate index (`buildIndex`) from the agent's grounded list, plus deals **Challenger Worlds** across 3 inspiration well tiers (`graphic`, `interaction`, `atmosphere`) and **Structural Compositions** across 4 grains (`product`, `flow`, `view`, `region`).
  - Each Challenger World defines 5 mandatory system rules (`Palette/material:`, `Type/composition:`, `Topology/navigation:`, `Controls/state:`, `Responsive/motion:`).
  - Each Structural Composition defines 4 mandatory staging rules (`Staging/hierarchy:`, `Sequence/attention:`, `Controls/state:`, `Adaptation:`).
  - **Weakness Found in `impeccable`**: `impeccable concept-seed` relies on `https://impeccable.style/api/roll` and degrades to `source: degraded` with **zero challengers** when offline or in sandboxed environments.
  - **How `nongeneric` solves this**: `nongeneric` ships an **offline-first, deterministic Concept & Composition Catalog** (`src/catalog.ts`) with SHA-256 ticket ranking built directly into the CLI, plus GSAP choreography recipes and OKLCH token packs per world!

### 2.4 All 61 Anti-Pattern Rules Extracted from `impeccable` (`antipatterns.json`)
- **Slop Rules (28)**: `side-tab`, `border-accent-on-rounded`, `gradient-text`, `animated-gradient-text`, `purple-blue-gradient`, `cyan-on-dark`, `neon-accent`, `dark-glow`, `radial-halo`, `glassmorphism`, `nested-cards`, `card-grid-monotony`, `pill-badge-above-heading`, `icon-in-colored-circle`, `floating-stat-badge`, `decorative-blob`, `grid-dot-background`, `fake-terminal-chrome`, `faux-3d-tilt`, `generic-avatar-stack`, `logo-wall-soup`, `sparkle-icon-ai`, `overused-font`, `bounce-easing`, `marquee`, `em-dash-overuse`, `marketing-buzzword`, `aphoristic-cadence`.
- **Quality Rules (33)**: `gray-on-color`, `ai-color-palette`, `pure-black-or-white`, `low-contrast-text`, `low-contrast-near-bar`, `link-text-contrast`, `wide-tracking`, `extreme-negative-tracking`, `all-caps-body`, `undersized-ui-text`, `wide-line-measure`, `narrow-line-measure`, `tight-line-height`, `loose-heading-line-height`, `orphaned-heading`, `monotonous-spacing`, `cramped-padding`, `uneven-card-heights`, `clipped-overflow-container`, `horizontal-page-overflow`, `tiny-tap-target`, `missing-focus-ring`, `broken-image`, `unsized-image`, `distorted-image-aspect`, `placeholder-text`, `dead-link`, `generic-button-label`, `unlabeled-input`, `z-index-war`, `gpt-thin-border-wide-shadow`, `organic-clip-path`, `buried-raster`.

---

## 3. Reverse-Engineering Target 2: `greensock/gsap-skills` (`https://github.com/greensock/gsap-skills.git`)

### 3.1 Modular 8-Skill Architecture
`gsap-skills` decomposes GreenSock mastery into 8 specialized skills:
1. **`gsap-core`**: Tweens (`gsap.to`, `gsap.from`, `gsap.fromTo`, `gsap.set`), transform shorthands (`x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `autoAlpha`), easing taxonomy (`power2.out`–`power4.out` for entrances, `power2.in` for exits, `power2.inOut` for state transitions, `expo.out` for dramatic reveals, `none` for scrubbed/linear), and stagger objects (`each`, `amount`, `from: "center" | "edges" | "random"`, `grid: "auto"`, `axis: "x" | "y"`).
2. **`gsap-timeline`**: `gsap.timeline({ defaults })`, position parameter syntax (`"<"`, `">"`, `"-=0.2"`, `"+=0.3"`, `"<0.15"`, `"labelName"`), nested sub-timelines (`master.add(intro())`), `tweenTo()` / `tweenFromTo()`.
3. **`gsap-scrolltrigger`**: Trigger lifecycle (`onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack`), `toggleActions: "play none none reverse"`, `scrub: true | number`, `pin: true` (never animate the pinned element directly—animate children inside it), `ScrollTrigger.batch()` for staggered grid reveals, `containerAnimation` for horizontal scroll sections (**critical law**: the horizontal container tween MUST have `ease: "none"`), `ScrollTrigger.refresh()` after async DOM/font loads.
4. **`gsap-plugins`**: All GSAP plugins (now 100% free following Webflow acquisition):
   - `SplitText`: `SplitText.create(el, { type: "lines,words,chars", mask: "lines", autoSplit: true, onSplit(self) { return gsap.from(self.lines, ...); } })`.
   - `Flip`: `const state = Flip.getState(targets)` -> mutate DOM -> `Flip.from(state, { duration: 0.6, ease: "power3.inOut", absolute: true, nested: true, onEnter, onLeave })`.
   - `MorphSVGPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`, `Draggable` + `InertiaPlugin`, `Observer`, `ScrollSmoother`, `ScrambleTextPlugin`, `CustomEase` / `CustomWiggle` / `CustomBounce`.
5. **`gsap-utils`**: `gsap.utils.toArray()`, `clamp()`, `mapRange()`, `interpolate()`, `snap()`, `wrap()`, `pipe()`, `distribute()`, `random()`, `selector()`.
6. **`gsap-react`**: `@gsap/react` `useGSAP(() => { ... }, { scope: containerRef, dependencies: [...] })` for automatic `gsap.context()` revert, and `contextSafe((e) => { ... })` for event handlers created outside the hook execution pass.
7. **`gsap-performance`**: Hardware-accelerated properties (`transform`, `opacity`, `autoAlpha`), avoiding layout thrashing (`width`, `height`, `top`, `left`, `margin`, `padding`), `gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" })` for high-frequency `mousemove` / `pointermove` listeners, `gsap.matchMedia()` for responsive breakpoints AND `(prefers-reduced-motion: reduce)` accessibility, `gsap.ticker` for WebGL/Three.js sync.
8. **`gsap-frameworks`**: Lifecycle cleanup patterns across Next.js App Router (`'use client'` + `useGSAP`), Vue 3 (`onMounted` + `gsap.context()` -> `onUnmounted(() => ctx.revert())`), Svelte (`onMount(() => { const ctx = gsap.context(...); return () => ctx.revert(); })`), and Astro (`astro:page-load` + `astro:before-swap`).

### 3.2 Weakness Found in `gsap-skills` & `impeccable`
- `impeccable` has only a 5KB generic `animate.md` and **zero GSAP choreography or GSAP static linting rules**.
- `gsap-skills` has great API documentation, but **zero aesthetic direction, zero visitor mode awareness, and zero automated static detector** to catch common GSAP bugs (like animating `width`/`top`, nesting `ScrollTrigger` inside timeline children, forgetting `ease: "none"` on `containerAnimation`, or forgetting `useGSAP` / `gsap.context` cleanup).
- **How `nongeneric` unifies them**: `nongeneric` embeds both deep GSAP motion choreography into every Aesthetic World AND deterministic static detection of GSAP anti-patterns in `nongeneric detect`!

---

## 4. Aesthetic Benchmark: `Kyaa-A/StockFish` (`KnightVision`) & `Kyaa-A/doesntbreak`

### 4.1 `KnightVision` (`stockfish.asnari.tech`) Aesthetic Deconstruction
From inspecting the user's flagship `KnightVision` interface:
1. **Material Ground**: Warm archival paper (`oklch(0.975 0.008 80)`) with crisp hairline borders (`1px solid oklch(0.88 0.012 80)`) and deep obsidian ink (`oklch(0.16 0.01 75)`).
2. **Tri-Voice Typography**:
   - **Display Voice**: High-contrast editorial serif italic (`"Green & Yellow"`) paired with tight geometric grotesque bold (`"Play smarter with ... chess vision."`).
   - **UI Voice**: Clean humanist grotesque at comfortable reading measure.
   - **Telemetry Voice**: Tabular monospace (`font-variant-numeric: tabular-nums`) for engine status (`SF19 NNUE`, `Eval +0.17`, `Depth 16 NNUE`, `51.4%`, `d2 -> d3`).
3. **Working Proof in the First Viewport (`Persuade` + `Operate` Hybrid)**:
   - Instead of a decorative illustration or marketing fluff, the hero contains a **live interactive chessboard** with real-time Stockfish candidate move overlays (`1ST Q Pawn d2 to d3 51.4%` in emerald `#16a34a`, `2ND E Pawn c2 to c3 51.0%` in amber `#d97706`) and tactile keyboard shortcut pills (`Q`, `E`, `Alt+A`, `Alt+H`).

### 4.2 `doesntbreak` Responsive Discipline
- Mobile-first fluid sizing from `320px` to `1440px+` without horizontal scroll (`documentElement.scrollWidth <= clientWidth`).
- `min(100%, Npx)` instead of rigid `width: Npx`.
- `min-width: 0` on flex/grid children containing truncated or long content.
- `100dvh` / `100svh` instead of bare `100vh`.
- `>=16px` (`1rem`) minimum font size on `<input>`, `<select>`, `<textarea>` to prevent iOS Safari zoom.
- `>=44x44px` minimum tap targets.
