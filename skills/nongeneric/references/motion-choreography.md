# Motion Choreography & Overdrive Playbook

Motion is never wallpaper. Every animation in `nongeneric` either **clarifies spatial causality** (where did this element come from, what changed when I clicked?) or **intensifies world atmosphere** without delaying user action.

---

## 1. Choreography Principles

1. **Hierarchy of Velocity**:
   - Micro-feedback (button press, keycap trigger, hover border): `120ms–180ms` (`power2.out`).
   - Interaction containers: `120ms–180ms` CSS transitions for tooltips/menus/popovers; `320ms–450ms` compositor transitions for drawers/sheets/dialogs. Follow [motion and interaction state](interaction-patterns.md#motion-and-interaction-state) for focus, closed-state cleanup, and instant reduced-motion behavior.
   - Other component state transitions (filter Flip, evaluation bar update): `320ms–550ms` (`power3.inOut` or `power3.out`).
   - Ceremonial stage entrances (SplitText masked headline + hero instrument reveal): `600ms–850ms` (`power3.out` or `expo.out`).
2. **Tight Stagger Budget (`stagger-overload`)**:
   - Per-item stagger (`each`) must stay between `0.03s` and `0.08s`, or total stagger (`amount`) must stay `<= 0.35s`. Never make a user wait 2 seconds for a list of items to finish appearing.
3. **Never Block Interaction**:
   - Interactive controls must be clickable immediately, even while entrance animations finish settling.
4. **One Focal Motion per Viewport**:
   - If the hero has a live interactive chessboard or telemetry oscilloscope, keep the surrounding background and navigation completely still. Competing motion in multiple regions creates visual chaos.
5. **Mandatory Reduced-Motion Parity (`missing-reduced-motion`)**:
   - Every CSS stylesheet must include a `@media (prefers-reduced-motion: reduce)` block, and every GSAP timeline must use `gsap.matchMedia()` so users with vestibular sensitivity receive instant, zero-travel state changes.
6. **Binary UI State Belongs to CSS**:
   - Selected/unselected, open/closed, and similar class-driven states should animate with CSS transitions on the class. A GSAP tween writes inline styles that outlive the state: a `fromTo` on a selected item left its fill visible after the selection moved, and tweens restarted by React re-renders froze halfway. Use GSAP for entrances, choreography, and dialog or ticket reveals; if GSAP must touch a stateful element, clear only GSAP-owned styles after restoring the current semantic state. Never let `clearProps` reveal a closed overlay; follow the interaction-state contract linked above.
7. **Content Is Visible at Rest**:
   - Never leave essential content at `opacity: 0` waiting on JavaScript. Entrance tweens start from a visible resting state or finish quickly, and never delay the first meaningful paint.

---

## 2. Six Signature Choreography Blueprints (`nongeneric motion-plan`)

Generate ready-to-use code for any of these patterns via:
```bash
node scripts/nongeneric.js motion-plan --pattern <id> --framework <react|vue|svelte|vanilla> --world <world-id>
```

1. **`hero-reveal`**: Masked `SplitText` line-by-line rise (`yPercent: 108 -> 0`) overlapped (`-=0.45`) with the hero instrument reveal and `scaleX` telemetry bar sweep.
2. **`pinned-horizontal`**: `ScrollTrigger` pinned stage with horizontal `ease: "none"` track and child `containerAnimation` triggers.
3. **`flip-filter`**: `Flip.getState()` -> DOM filter/sort mutation -> `Flip.from(state, { absolute: true, scale: true })`.
4. **`kinetic-type`**: Scroll-triggered character/word choreography with `autoSplit: true`.
5. **`magnetic-cursor`**: `gsap.quickTo()` pointer follower scoped strictly to `(pointer: fine) and (prefers-reduced-motion: no-preference)`.
6. **`scroll-batch`**: `ScrollTrigger.batch()` for staggered grid cards that enter in coordinated waves.
