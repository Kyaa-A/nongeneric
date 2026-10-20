# Playbook: WebGL/Canvas2D Stages & DOM Typography

When pairing WebGL, Three.js, or Canvas2D stages with DOM typography in \`nongeneric\`, performance and accessibility are paramount. Mixing rich visual stages with DOM elements can easily lead to layout thrashing, decreased framerates, and severe accessibility issues if not handled carefully.

## Core Principles

### 1. Proxy Plain JS Objects to GSAP
Never animate WebGL properties or Canvas contexts directly with GSAP. Instead, proxy plain JavaScript objects and use \`gsap.ticker.add()\` to sync the values to your render loop.

**Why?**
GSAP is highly optimized for tweening numeric values on objects. Passing WebGL context or Three.js materials directly can cause unnecessary overhead and memory leaks.

\`\`\`javascript
const uniforms = { uProgress: 0 };
gsap.to(uniforms, { uProgress: 1, duration: 1 });

gsap.ticker.add(() => {
  material.uniforms.uProgress.value = uniforms.uProgress;
});
\`\`\`

### 2. Avoid Layout Thrashing
Avoid animating properties that trigger layout recalculations in the DOM (like \`width\`, \`height\`, \`top\`, \`left\`). Stick to compositor-friendly properties like \`transform\` (x, y, scale, rotation) and \`opacity\`.

**Why?**
Layout recalculations are expensive and will drop your framerate, ruining the WebGL experience alongside it.

### 3. Respect \`prefers-reduced-motion\`
All motion, including WebGL shader effects and Canvas drawings, must honor the user's \`prefers-reduced-motion\` preference. Use \`gsap.matchMedia()\` to conditionally apply animations.

**Why?**
Motion sickness is a real concern. Accessibility is a strict requirement for \`nongeneric\`.

\`\`\`javascript
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // WebGL or Canvas animations here
});
\`\`\`

### 4. Efficient Pointer Tracking
If WebGL interacts with the mouse, use \`gsap.quickTo\` pre-allocated outside of the event listener to avoid instantiating new tweens on every single mousemove.

**Why?**
Pointer events fire rapidly. Creating new animations inside the event handler causes severe garbage collection pauses and jank.

\`\`\`javascript
const uniforms = { uPointerX: 0, uPointerY: 0 };
const xTo = gsap.quickTo(uniforms, 'uPointerX', { duration: 0.35, ease: 'power2.out' });
const yTo = gsap.quickTo(uniforms, 'uPointerY', { duration: 0.35, ease: 'power2.out' });

target.addEventListener('pointermove', (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
\`\`\`

### 5. Proper Cleanup
Always clean up your ticker listeners and event listeners. If using React, do this inside \`useGSAP\`. For Vanilla JS, return a cleanup function from your \`gsap.context()\` or \`gsap.matchMedia()\` callback.

**Why?**
Leftover ticker listeners will continue firing in the background, consuming CPU and leading to massive memory leaks, particularly in Single Page Applications.
