---
name: nongeneric-gsap
description: >
  Specialized GreenSock (GSAP) Motion Architect skill. Use when building timelines, ScrollTrigger
  pinned/scrubbed stages, SplitText masked typography, Flip layout transitions, Draggable/Observer
  interactions, quickTo cursor followers, or React/Vue/Svelte GSAP lifecycle hooks.
---

# NonGeneric GSAP Motion Architect

Follow these strict production laws whenever authoring GSAP animations:

1. **Generate Blueprints via CLI**:
   ```bash
   node scripts/nongeneric.js motion-plan --pattern <hero-reveal|pinned-horizontal|flip-filter|kinetic-type|magnetic-cursor|scroll-batch> --framework <react|vue|svelte|vanilla> --world <world-id>
   ```
2. **Compositor Properties Only (`gsap-layout-thrash`)**:
   - Animate `x`, `y`, `xPercent`, `yPercent`, `scale`, `scaleX`, `scaleY`, `rotation`, and `autoAlpha`.
   - Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly; use `scaleX`/`scaleY` or `Flip.from(state)`.
3. **ScrollTrigger Rules**:
   - Register plugins once: `gsap.registerPlugin(ScrollTrigger, Flip, SplitText, CustomEase)`.
   - Attach `scrollTrigger` to the parent `gsap.timeline({ scrollTrigger })`, never to child tweens inside a timeline (`gsap-nested-scrolltrigger`).
   - Always use `ease: "none"` on horizontal scroll tweens passed to `containerAnimation` (`gsap-container-ease`).
   - Never transform the exact DOM element that `ScrollTrigger` pins (`pinned-root-transform`); pin a wrapper and animate children inside it.
4. **High-Frequency Pointer Events (`gsap-raw-mousemove`)**:
   - Pre-create `gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" })` setters outside `pointermove`/`mousemove`.
5. **Accessibility & Framework Cleanup (`missing-reduced-motion`, `gsap-missing-cleanup`)**:
   - Always use `gsap.matchMedia()` to provide a `(prefers-reduced-motion: reduce)` branch.
   - Use `useGSAP()` + `contextSafe()` in React, or `gsap.context()` + `ctx.revert()` in Vue, Svelte, and Vanilla JS.
