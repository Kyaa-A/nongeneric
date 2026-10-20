# GSAP Mastery Manual (8-Domain Distilled Reference)

Reverse-engineered and synthesized from `greensock/gsap-skills`, expanded with NonGeneric's deterministic performance and accessibility gates.

---

## 1. Core Tweens & Transform Shorthands (`gsap-core`)

### Methods
- `gsap.to(targets, vars)`: Animate from current state to target values.
- `gsap.from(targets, vars)`: Animate from specified values to current natural state.
- `gsap.fromTo(targets, fromVars, toVars)`: Explicit start and end states (put `duration`, `ease`, `stagger`, `scrollTrigger` in `toVars`).
- `gsap.set(targets, vars)`: Apply properties immediately (`duration: 0`).

### Compositor-Only Property Mapping
| GSAP Shorthand | CSS Output | Why Use It |
| :--- | :--- | :--- |
| `x`, `y` | `translateX(px)`, `translateY(px)` | Sub-pixel GPU composited translation |
| `xPercent`, `yPercent` | `translateX(%)`, `translateY(%)` | Responsive percentage translation (ideal for masked text & sliders) |
| `scale`, `scaleX`, `scaleY` | `scale()` | GPU composited scaling (use `scaleX`/`scaleY` instead of `width`/`height` for bars/lines) |
| `rotation`, `rotationX`, `rotationY` | `rotate()` | GPU composited rotation |
| `autoAlpha` | `opacity` + `visibility` | Toggles `visibility: hidden` when `opacity === 0` so invisible elements don't block clicks |

> **CRITICAL RULE (`gsap-layout-thrash`)**: Never animate `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, or `padding` in a standard tween. Use `scaleX`/`scaleY`, `x`/`y`, or the `Flip` plugin.

### Easing Decision Matrix
| UI Context | Recommended Ease | Forbidden Ease |
| :--- | :--- | :--- |
| **Element / Headline Entrance** | `power3.out`, `power4.out`, `expo.out` | `bounce.out`, `elastic.out`, `none` |
| **Element Exit / Dismissal** | `power2.in`, `power3.in` | `bounce`, `elastic` |
| **State Morph / Layout Flip** | `power3.inOut`, `expo.inOut` | `none` |
| **Scrubbed ScrollTrigger / ContainerAnimation** | `none` (MANDATORY) | Any eased curve (skews scroll progress) |

---

## 2. Timelines & Sequencing (`gsap-timeline`)

```js
const tl = gsap.timeline({
  defaults: { duration: 0.65, ease: 'power3.out' },
});

tl.from('.masthead', { yPercent: -100 })
  .from('.kicker', { autoAlpha: 0, y: 10 }, '-=0.3')      // Overlap by 0.3s
  .from('.headline-line', { yPercent: 105, stagger: 0.06 }, '<0.1') // 0.1s after previous starts
  .addLabel('instrumentReady')
  .from('.instrument-panel', { autoAlpha: 0, y: 20 }, 'instrumentReady-=0.2');
```

### Position Parameter Cheat Sheet
- `"<"`: Start at the exact start of the previous animation.
- `">"`: Start at the end of the previous animation (default).
- `"-=0.25"`: Overlap 0.25s before the end of the timeline.
- `"<0.15"`: Start 0.15s after the start of the previous animation.

---

## 3. ScrollTrigger Architecture (`gsap-scrolltrigger`)

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Three Non-Negotiable ScrollTrigger Laws
1. **No Nested ScrollTriggers (`gsap-nested-scrolltrigger`)**:
   - **WRONG**: `const tl = gsap.timeline(); tl.to('.box', { x: 100, scrollTrigger: { ... } });`
   - **RIGHT**: `const tl = gsap.timeline({ scrollTrigger: { trigger: '.section', start: 'top 80%' } }); tl.to('.box', { x: 100 });`
2. **Never Transform the Pinned Root (`pinned-root-transform`)**:
   - Pin an outer stage container (`trigger: '.stage', pin: true`) and animate inner child elements.
3. **Horizontal `containerAnimation` Must Use `ease: "none"` (`gsap-container-ease`)**:
   ```js
   const sections = gsap.utils.toArray('.chamber');
   const horizontalTween = gsap.to(sections, {
     xPercent: -100 * (sections.length - 1),
     ease: 'none', // MANDATORY for linear scroll distance mapping
     scrollTrigger: {
       trigger: '.stage',
       pin: true,
       scrub: 0.5,
       end: () => '+=' + document.querySelector('.stage').offsetWidth,
       invalidateOnRefresh: true,
     },
   });
   ```

---

## 4. Plugins: SplitText, Flip, Draggable, SVG (`gsap-plugins`)

### SplitText (v3.13+ Masked Responsive Pattern)
```js
SplitText.create('.hero-title', {
  type: 'lines,words',
  mask: 'lines',       // Creates overflow-clip wrapper around each line automatically
  autoSplit: true,     // Re-splits automatically when fonts load or viewport resizes
  onSplit(self) {
    return gsap.from(self.lines, {
      yPercent: 108,
      duration: 0.72,
      ease: 'power3.out',
      stagger: 0.065,
    });
  },
});
```

### Flip (First, Last, Invert, Play)
```js
const state = Flip.getState('.card-item');
// Perform DOM/class/layout change:
container.classList.toggle('compact-grid');
Flip.from(state, {
  duration: 0.55,
  ease: 'power3.inOut',
  absolute: true,
  stagger: 0.03,
});
```

---

## 5. High-Frequency Performance & Accessibility (`gsap-performance`)

### `gsap.quickTo()` for 60fps Pointer Tracking (`gsap-raw-mousemove`)
Never call `gsap.to()` inside `mousemove`/`pointermove`. Pre-allocate setters:
```js
const xTo = gsap.quickTo(cursorEl, 'x', { duration: 0.3, ease: 'power3' });
const yTo = gsap.quickTo(cursorEl, 'y', { duration: 0.3, ease: 'power3' });
window.addEventListener('pointermove', (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

### `gsap.matchMedia()` for Responsive + Reduced Motion (`missing-reduced-motion`)
```js
const mm = gsap.matchMedia();
mm.add(
  {
    isDesktop: '(min-width: 768px)',
    motionOk: '(prefers-reduced-motion: no-preference)',
  },
  (context) => {
    const { isDesktop, motionOk } = context.conditions;
    if (!motionOk) {
      gsap.set('.reveal', { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.from('.reveal', {
      autoAlpha: 0,
      y: isDesktop ? 28 : 14,
      duration: 0.65,
      ease: 'power3.out',
      stagger: 0.06,
    });
  }
);
```

---

## 6. Framework Lifecycle Cleanup (`gsap-react` & `gsap-frameworks`)

- **React / Next.js (`useGSAP`)**:
  ```tsx
  'use client';
  import { useRef } from 'react';
  import gsap from 'gsap';
  import { useGSAP } from '@gsap/react';

  gsap.registerPlugin(useGSAP);

  export function HeroStage() {
    const scopeRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP(() => {
      gsap.from('.hero-line', { yPercent: 100, stagger: 0.06, ease: 'power3.out' });
    }, { scope: scopeRef });

    const onTriggerClick = contextSafe(() => {
      gsap.to('.status-bar', { scaleX: 1, duration: 0.4, ease: 'power2.out' });
    });

    return <div ref={scopeRef}>...</div>;
  }
  ```
- **Vue 3 / Svelte / Vanilla**: Wrap all animations in `const ctx = gsap.context(() => { ... }, containerEl)` and call `ctx.revert()` on unmount.
