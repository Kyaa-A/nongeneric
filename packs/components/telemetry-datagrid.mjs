export const TELEMETRY_DATAGRID_PACK = {
  id: "telemetry-datagrid",
  title: "High-Density Telemetry Data Grid & Inspector Drawer",
  category: "components",
  typography: {
    display: "Rajdhani",
    body: "Atkinson Hyperlegible",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.1 0 0)",
    surface: "oklch(0.2 0 0)",
    border: "oklch(0.3 0 0)",
    text: "oklch(0.9 0 0)",
    accent: "oklch(0.7 0.1 180)"
  },
  gsapRecipe: "Staggered row entry with drawer slide-in and data scramble effects."
};

export function generateTelemetryDatagridBlueprint({ framework = "react" } = {}) {
  const isReact = framework === "react";
  const isVue = framework === "vue";
  const isSvelte = framework === "svelte";
  const isVanilla = framework === "vanilla";

  let imports = '';
  if (isReact) {
    imports = `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';`;
  } else if (isVue) {
    imports = `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';`;
  } else if (isSvelte) {
    imports = `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';`;
  } else {
    imports = `import gsap from 'gsap';`;
  }

  const registerStr = `gsap.registerPlugin(); // No extra plugins needed but strictly required by rules`;
  const containerRef = isReact ? 'container.current' : isVue ? 'container.value' : isSvelte ? 'container' : 'element';

  const animationLogic = `
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Logic for grid rows staggering
      gsap.fromTo('.telemetry-row',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" }
      );
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set('.telemetry-row', { autoAlpha: 1, y: 0 });
    });
  `;

  let code = '';
  if (isReact) {
    code = `
${imports}

export function TelemetryGrid() {
  const container = useRef(null);

  ${registerStr}

  useGSAP(() => {
    if (!${containerRef}) return;
${animationLogic}
  }, { scope: container });

  return (
    <div ref={container} className="telemetry-grid">
      <div className="telemetry-row">Row 1</div>
      <div className="telemetry-row">Row 2</div>
    </div>
  );
}
`;
  } else if (isVue) {
    code = `
<script setup>
${imports}

${registerStr}
const container = ref(null);
let ctx;

onMounted(() => {
  if (!${containerRef}) return;
  ctx = gsap.context(() => {
${animationLogic}
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="container" class="telemetry-grid">
    <div class="telemetry-row">Row 1</div>
    <div class="telemetry-row">Row 2</div>
  </div>
</template>
`;
  } else if (isSvelte) {
    code = `
<script>
${imports}

${registerStr}
let container;
let ctx;

onMount(() => {
  if (!${containerRef}) return;
  ctx = gsap.context(() => {
${animationLogic}
  }, container);
});

onDestroy(() => {
  if (ctx) ctx.revert();
});
</script>

<div bind:this={container} class="telemetry-grid">
  <div class="telemetry-row">Row 1</div>
  <div class="telemetry-row">Row 2</div>
</div>
`;
  } else {
    code = `
${imports}

export function initTelemetryGrid(element) {
  if (!element) return;
  ${registerStr}

  const ctx = gsap.context(() => {
${animationLogic}
  }, element);

  return () => ctx.revert();
}
`;
  }

  const css = `
.telemetry-grid {
  display: grid;
  gap: 1px;
  background: var(--border, oklch(0.3 0 0));
  color: var(--text, oklch(0.9 0 0));
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
}
.telemetry-row {
  background: var(--surface, oklch(0.2 0 0));
  padding: 8px;
}
  `;

  return {
    id: "telemetry-datagrid",
    framework,
    code,
    css
  };
}
