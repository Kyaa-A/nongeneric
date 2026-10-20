export const SPATIAL_CANVAS_MINIMAP_PACK = {
  id: "spatial-canvas-minimap",
  title: "Infinite Canvas Minimap & Coordinate Reticle",
  category: "components",
  typography: {
    display: "Barlow Condensed",
    body: "Atkinson Hyperlegible",
    mono: "JetBrains Mono"
  },
  tokens: {
    surface: "oklch(0.1 0 0)",
    grid: "oklch(0.2 0 0)",
    accent: "oklch(0.7 0.15 150)",
    text: "oklch(0.9 0 0)"
  },
  gsapRecipe: "Draggable + Observer"
};

export function generateSpatialCanvasMinimapBlueprint({ framework = "react" } = {}) {
  const codeByFramework = {
    react: `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(useGSAP, Draggable);

export default function SpatialCanvasMinimap() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: container.current,
        inertia: true
      });

      return () => {
        // cleanup if needed
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: container.current
      });

      return () => {
        // cleanup if needed
      };
    });
  }, { scope: container });

  return (
    <div ref={container} className="minimap-container">
      <div className="canvas-content" aria-label="Draggable Content">
        <p>Coordinate Reticle</p>
      </div>
    </div>
  );
}
`,
    vue: `
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: container.value,
        inertia: true
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: container.value
      });
    });
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="container" class="minimap-container">
    <div class="canvas-content" aria-label="Draggable Content">
      <p>Coordinate Reticle</p>
    </div>
  </div>
</template>
`,
    svelte: `
<script>
import { onMount } from 'svelte';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

let container;

onMount(() => {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: container,
        inertia: true
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: container
      });
    });
  }, container);

  return () => {
    ctx.revert();
  };
});
</script>

<div bind:this={container} class="minimap-container">
  <div class="canvas-content" aria-label="Draggable Content">
    <p>Coordinate Reticle</p>
  </div>
</div>
`,
    vanilla: `
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export function initMinimap(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: element,
        inertia: true
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      Draggable.create(".canvas-content", {
        type: "x,y",
        bounds: element
      });
    });
  }, element);

  return () => {
    ctx.revert();
  };
}
`
  };

  const css = `
.minimap-container {
  position: relative;
  overflow: hidden;
  min-height: 100dvh;
  min-width: 0;
  font-family: var(--ng-font-mono, 'JetBrains Mono');
  background-color: var(--ng-color-surface, oklch(0.1 0 0));
  color: var(--ng-color-text, oklch(0.9 0 0));
}

.canvas-content {
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem;
  font-variant-numeric: tabular-nums;
  cursor: grab;
}

.canvas-content:active {
  cursor: grabbing;
}
`;

  return {
    id: "spatial-canvas-minimap",
    framework,
    code: codeByFramework[framework] || codeByFramework.react,
    css
  };
}
