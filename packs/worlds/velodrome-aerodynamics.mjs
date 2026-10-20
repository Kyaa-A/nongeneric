export const VELODROME_AERODYNAMICS_PACK = {
  id: "velodrome-aerodynamics",
  title: "Computational Fluid Dynamics & Wind-Tunnel Telemetry World",
  category: "worlds",
  typography: {
    display: "Rajdhani",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.15 0.02 240)",
    surface: "oklch(0.20 0.02 240)",
    textPrimary: "oklch(0.95 0.01 240)",
    textSecondary: "oklch(0.80 0.01 240)",
    accent: "oklch(0.70 0.15 200)",
    alert: "oklch(0.65 0.20 25)"
  },
  gsapRecipe: {
    duration: 0.8,
    ease: "power2.out"
  }
};

export function generateVelodromeAerodynamicsBlueprint({ framework = "react" } = {}) {
  const css = `
:root {
  --va-bg: oklch(0.15 0.02 240);
  --va-surface: oklch(0.20 0.02 240);
  --va-text-primary: oklch(0.95 0.01 240);
  --va-text-secondary: oklch(0.80 0.01 240);
  --va-accent: oklch(0.70 0.15 200);
  --va-alert: oklch(0.65 0.20 25);

  --font-display: "Rajdhani", sans-serif;
  --font-body: "Work Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

.va-container {
  background-color: var(--va-bg);
  color: var(--va-text-primary);
  font-family: var(--font-body);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
}

.va-header {
  font-family: var(--font-display);
  font-size: 3rem;
  margin-bottom: 32px;
  color: var(--va-accent);
}

.va-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.va-card {
  background-color: var(--va-surface);
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.va-card-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--va-text-secondary);
}

.va-telemetry {
  font-family: var(--font-mono);
  font-size: 2rem;
  color: var(--va-text-primary);
  font-variant-numeric: tabular-nums;
}

.va-button {
  background-color: var(--va-accent);
  color: var(--va-bg);
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-family: var(--font-display);
  font-size: 1.25rem;
  cursor: pointer;
  min-height: 44px;
  margin-top: 32px;
  align-self: flex-start;
}

.va-button:hover {
  background-color: var(--va-text-primary);
}
  `.trim();

  let code = '';

  if (framework === 'react') {
    code = `
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function VelodromeAerodynamics() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".va-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div className="va-container" ref={container}>
      <h1 className="va-header">CFD & Telemetry</h1>
      <div className="va-data-grid">
        <div className="va-card">
          <div className="va-card-title">Drag Coefficient</div>
          <div className="va-telemetry">0.24 Cd</div>
        </div>
        <div className="va-card">
          <div className="va-card-title">Airflow Velocity</div>
          <div className="va-telemetry">120 m/s</div>
        </div>
        <div className="va-card">
          <div className="va-card-title">Downforce</div>
          <div className="va-telemetry">450 N</div>
        </div>
      </div>
      <button className="va-button">Run Simulation</button>
    </div>
  );
}
    `.trim();
  } else if (framework === 'vue') {
    code = `
<template>
  <div class="va-container" ref="container">
    <h1 class="va-header">CFD & Telemetry</h1>
    <div class="va-data-grid">
      <div class="va-card">
        <div class="va-card-title">Drag Coefficient</div>
        <div class="va-telemetry">0.24 Cd</div>
      </div>
      <div class="va-card">
        <div class="va-card-title">Airflow Velocity</div>
        <div class="va-telemetry">120 m/s</div>
      </div>
      <div class="va-card">
        <div class="va-card-title">Downforce</div>
        <div class="va-telemetry">450 N</div>
      </div>
    </div>
    <button class="va-button">Run Simulation</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

gsap.registerPlugin();

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".va-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>
    `.trim();
  } else if (framework === 'svelte') {
    code = `
<script>
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';

  gsap.registerPlugin();

  let container;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".va-card", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        });
      });
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div class="va-container" bind:this={container}>
  <h1 class="va-header">CFD & Telemetry</h1>
  <div class="va-data-grid">
    <div class="va-card">
      <div class="va-card-title">Drag Coefficient</div>
      <div class="va-telemetry">0.24 Cd</div>
    </div>
    <div class="va-card">
      <div class="va-card-title">Airflow Velocity</div>
      <div class="va-telemetry">120 m/s</div>
    </div>
    <div class="va-card">
      <div class="va-card-title">Downforce</div>
      <div class="va-telemetry">450 N</div>
    </div>
  </div>
  <button class="va-button">Run Simulation</button>
</div>
    `.trim();
  } else {
    code = `
import { gsap } from 'gsap';

gsap.registerPlugin();

export function initVelodromeAerodynamics(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".va-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  }, element);

  return () => ctx.revert();
}
    `.trim();
  }

  return {
    id: "velodrome-aerodynamics",
    framework,
    code,
    css
  };
}
