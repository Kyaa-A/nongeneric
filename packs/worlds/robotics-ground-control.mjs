export const ROBOTICS_GROUND_CONTROL_PACK = {
  id: 'robotics-ground-control',
  title: 'Autonomous Robotics & Drone Ground Control World',
  category: 'worlds',
  typography: {
    display: 'Rajdhani',
    body: 'Atkinson Hyperlegible',
    mono: 'JetBrains Mono'
  },
  tokens: {
    background: 'oklch(0.2 0.05 250)',
    surface: 'oklch(0.25 0.05 250)',
    border: 'oklch(0.4 0.1 250)',
    textPrimary: 'oklch(0.9 0.05 250)',
    textSecondary: 'oklch(0.7 0.05 250)',
    accent: 'oklch(0.7 0.2 150)',
    danger: 'oklch(0.6 0.2 25)'
  },
  gsapRecipe: 'Direct state updates with GSAP context. No ease-in for critical alerts. Focus on tabular number updates.'
};

export function generateRoboticsGroundControlBlueprint({ framework = 'react' } = {}) {
  const css = `
.robotics-container {
  background-color: var(--robotics-background, oklch(0.2 0.05 250));
  color: var(--robotics-text-primary, oklch(0.9 0.05 250));
  font-family: "Atkinson Hyperlegible", sans-serif;
  padding: 1rem;
  min-height: 100dvh;
  box-sizing: border-box;
}

.robotics-telemetry {
  font-family: "JetBrains Mono", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 2rem;
  color: var(--robotics-accent, oklch(0.7 0.2 150));
  margin-bottom: 1rem;
}

.robotics-alert {
  font-family: "Rajdhani", sans-serif;
  background-color: var(--robotics-danger, oklch(0.6 0.2 25));
  color: oklch(1 0 0); /* white text on danger background */
  padding: 1rem;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
}
  `.trim();

  let code = '';

  if (framework === 'react') {
    code = `
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function RoboticsControl() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.robotics-alert',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set('.robotics-alert', { opacity: 1, scale: 1 });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div className="robotics-container" ref={container}>
      <div className="robotics-telemetry">ALT: 14500m</div>
      <div className="robotics-alert">Critical Alert</div>
    </div>
  );
}
    `.trim();
  } else if (framework === 'vanilla') {
    code = `
import gsap from 'gsap';

gsap.registerPlugin();

export function initRoboticsControl(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.robotics-alert',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
       gsap.set('.robotics-alert', { opacity: 1, scale: 1 });
    });
  }, element);

  return () => ctx.revert();
}
    `.trim();
  } else if (framework === 'vue') {
     code = `
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

gsap.registerPlugin();

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.robotics-alert',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
       gsap.set('.robotics-alert', { opacity: 1, scale: 1 });
    });
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div class="robotics-container" ref="container">
    <div class="robotics-telemetry">ALT: 14500m</div>
    <div class="robotics-alert">Critical Alert</div>
  </div>
</template>
    `.trim();
  } else if (framework === 'svelte') {
      code = `
<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';

  gsap.registerPlugin();

  let container;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo('.robotics-alert',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
         gsap.set('.robotics-alert', { opacity: 1, scale: 1 });
      });
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div class="robotics-container" bind:this={container}>
  <div class="robotics-telemetry">ALT: 14500m</div>
  <div class="robotics-alert">Critical Alert</div>
</div>
    `.trim();
  }

  return {
    id: 'robotics-ground-control',
    framework,
    css,
    code
  };
}
