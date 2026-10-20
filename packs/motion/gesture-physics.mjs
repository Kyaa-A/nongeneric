export const GESTURE_PHYSICS_PRESETS = [
  'observer-chamber-deck',
  'draggable-Bounded-canvas',
  'elastic-dial-snap'
];

export function generateGesturePhysicsBlueprint({ preset, framework = 'react', ease = 'expo.out' }) {
  const plugins = ['Observer', 'Draggable'];
  let code = '';

  const targetVar = framework === 'react' ? 'container.current' :
                    framework === 'vue' ? 'container.value' :
                    framework === 'svelte' ? 'container' : 'element';

  const keyboardFallback = `
    // Keyboard Accessibility Fallback (WCAG 2.2)
    // 1. Ensure the draggble container has tabindex="0" and aria-grabbed state
    // 2. Add keydown listeners for ArrowUp/ArrowDown/ArrowLeft/ArrowRight to move the container manually
    // 3. Fallback standard Enter/Space interaction when applicable
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') { gsap.to(${targetVar}, { x: '+=50', ease: '${ease}' }); }
      else if (e.key === 'ArrowLeft') { gsap.to(${targetVar}, { x: '-=50', ease: '${ease}' }); }
      // ... same for Up/Down
    }
  `;

  if (framework === 'react') {
    code = `import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/Observer';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Observer, Draggable, useGSAP);

export function GestureComponent() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Setup gesture based on preset: ${preset}
      ${preset === 'observer-chamber-deck' ? `
      Observer.create({
        target: container.current,
        type: "wheel,touch,pointer",
        onUp: () => gsap.to(container.current, { y: "-=100", ease: "${ease}" }),
        onDown: () => gsap.to(container.current, { y: "+=100", ease: "${ease}" })
      });
      ` : ''}
      ${preset === 'draggable-Bounded-canvas' ? `
      Draggable.create(container.current, {
        type: "x,y",
        bounds: window,
        inertia: true
      });
      ` : ''}
      ${preset === 'elastic-dial-snap' ? `
      Draggable.create(container.current, {
        type: "rotation",
        liveSnap: true,
        snap: (value) => Math.round(value / 90) * 90
      });
      ` : ''}
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Reduced motion fallback
      gsap.set(container.current, { clearProps: "all" });
    });

    return () => mm.revert();
  }, { scope: container });

  ${keyboardFallback}

  return (
    <div ref={container} tabIndex={0} onKeyDown={handleKeyDown} style={{ width: 100, height: 100, background: 'blue' }}>
      Gesture Element
    </div>
  );
}`;
  } else if (framework === 'vanilla') {
    code = `import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Observer, Draggable);

export function initGestureComponent(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ${preset === 'observer-chamber-deck' ? `
      Observer.create({
        target: element,
        type: "wheel,touch,pointer",
        onUp: () => gsap.to(element, { y: "-=100", ease: "${ease}" }),
        onDown: () => gsap.to(element, { y: "+=100", ease: "${ease}" })
      });
      ` : ''}
      ${preset === 'draggable-Bounded-canvas' ? `
      Draggable.create(element, {
        type: "x,y",
        bounds: window,
        inertia: true
      });
      ` : ''}
      ${preset === 'elastic-dial-snap' ? `
      Draggable.create(element, {
        type: "rotation",
        liveSnap: true,
        snap: (value) => Math.round(value / 90) * 90
      });
      ` : ''}
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(element, { clearProps: "all" });
    });
  }, element);

  ${keyboardFallback}
  element.setAttribute('tabindex', '0');
  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
    ctx.revert();
  };
}`;
  } else if (framework === 'vue') {
    code = `<template>
  <div ref="container" tabindex="0" @keydown="handleKeyDown" style="width: 100px; height: 100px; background: blue;">
    Gesture Element
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Observer, Draggable);

const container = ref(null);
let ctx;

${keyboardFallback}

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ${preset === 'observer-chamber-deck' ? `
      Observer.create({
        target: container.value,
        type: "wheel,touch,pointer",
        onUp: () => gsap.to(container.value, { y: "-=100", ease: "${ease}" }),
        onDown: () => gsap.to(container.value, { y: "+=100", ease: "${ease}" })
      });
      ` : ''}
      ${preset === 'draggable-Bounded-canvas' ? `
      Draggable.create(container.value, {
        type: "x,y",
        bounds: window,
        inertia: true
      });
      ` : ''}
      ${preset === 'elastic-dial-snap' ? `
      Draggable.create(container.value, {
        type: "rotation",
        liveSnap: true,
        snap: (value) => Math.round(value / 90) * 90
      });
      ` : ''}
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(container.value, { clearProps: "all" });
    });
  }, container.value);
});

onUnmounted(() => {
  ctx && ctx.revert();
});
</script>`;
  } else if (framework === 'svelte') {
    code = `<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { Observer } from 'gsap/Observer';
  import { Draggable } from 'gsap/Draggable';

  gsap.registerPlugin(Observer, Draggable);

  let container;
  let ctx;

  ${keyboardFallback}

  onMount(() => {
    ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ${preset === 'observer-chamber-deck' ? `
        Observer.create({
          target: container,
          type: "wheel,touch,pointer",
          onUp: () => gsap.to(container, { y: "-=100", ease: "${ease}" }),
          onDown: () => gsap.to(container, { y: "+=100", ease: "${ease}" })
        });
        ` : ''}
        ${preset === 'draggable-Bounded-canvas' ? `
        Draggable.create(container, {
          type: "x,y",
          bounds: window,
          inertia: true
        });
        ` : ''}
        ${preset === 'elastic-dial-snap' ? `
        Draggable.create(container, {
          type: "rotation",
          liveSnap: true,
          snap: (value) => Math.round(value / 90) * 90
        });
        ` : ''}
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(container, { clearProps: "all" });
      });
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div bind:this={container} tabindex="0" on:keydown={handleKeyDown} style="width: 100px; height: 100px; background: blue;">
  Gesture Element
</div>`;
  }

  return {
    preset,
    framework,
    plugins,
    code,
    keyboardFallback
  };
}
