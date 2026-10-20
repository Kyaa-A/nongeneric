# NonGeneric — Copilot & Agent Instructions

Always apply the **NonGeneric Design, Motion & Responsive Discipline** when creating, styling, animating, or refactoring web and app interfaces:

1. **Commit to an Aesthetic World & Visitor Mode**:
   - First follow `skills/nongeneric/references/ux-workflow.md`: define the primary task, flow, applicable states, and recovery scenario.
   - Determine the surface's visitor mode (`persuade`, `operate`, `read`, or `experience`) before writing layout or CSS.
   - Run `node scripts/nongeneric.js seed --mode <mode>` to roll a committed direction and structural composition.
   - Never ship generic SaaS templates (split hero with floating badge row over 3-column icon-in-colored-circle cards, purple/indigo/violet gradients, `background-clip: text` gradients, neon dark glows, or side-tab borders on rounded cards).

2. **Craft Floor (Typography, OKLCH Color, Spatial Rhythm, Responsive)**:
   - Use purposeful typographic contrast (e.g., editorial serif + crisp grotesque + `tabular-nums` monospace telemetry) instead of unexamined `Inter`/`Roboto`/`Arial` defaults.
   - Author color systems in **OKLCH** with warm or cool tinted neutrals (`0.005–0.02` chroma); never place medium gray text on colored backgrounds (`gray-on-color`).
   - Enforce mobile-first fluid responsiveness from `320px` to `1440px+`: use `min(100%, Npx)`, `min-width: 0` on flex/grid children, `100dvh`/`100svh` instead of bare `100vh`, `>=16px` form inputs, and `>=44x44px` touch targets.

3. **GSAP Motion Choreography**:
   - Animate only compositor-friendly properties (`x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `autoAlpha`). Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` (`gsap-layout-thrash`).
   - Register plugins once (`gsap.registerPlugin(ScrollTrigger, Flip, SplitText, CustomEase)`).
   - Never nest `ScrollTrigger` inside child tweens of a timeline; attach `scrollTrigger` to the parent `gsap.timeline({ scrollTrigger: ... })`.
   - Always use `ease: "none"` on horizontal container tweens referenced by `containerAnimation`.
   - Always wrap animations in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch and clean up via `useGSAP()` (React) or `gsap.context()` + `ctx.revert()`.

4. **Deterministic Verification Gate**:
   - Run `node scripts/nongeneric.js detect <target>` and `node scripts/nongeneric.js audit <target>`; resolve primary findings or document justified suppressions. Scores measure static checks only.
   - Follow `skills/nongeneric/references/browser-verification.md` before claiming surface verification. Report visual, usability, accessibility, and runtime evidence separately, marking untested dimensions as not verified.
