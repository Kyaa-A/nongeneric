export const MULTI_AXIS_COMPARISON_MATRIX_PACK = {
  id: "multi-axis-comparison-matrix",
  title: "Multi-Axis Tradeoff & Benchmark Comparison Ledger",
  category: "components",
  typography: {
    display: "Syne",
    body: "Atkinson Hyperlegible",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(98% 0.01 90)",
    foreground: "oklch(20% 0.02 250)",
    primary: "oklch(60% 0.15 140)",
    border: "oklch(85% 0.05 250)"
  },
  gsapRecipe: "gsap.fromTo(cells, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.05, ease: 'power2.out', duration: 0.4 })"
};

export function generateMultiAxisComparisonMatrixBlueprint({ framework = "react" } = {}) {
  let code = '';

  if (framework === 'react') {
    code = `import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function MultiAxisComparisonMatrix() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".matrix-cell",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          duration: 0.4,
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%"
          }
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".matrix-cell", { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="multi-axis-comparison-matrix" style={{ minHeight: '100dvh', minWidth: 0 }}>
      {/* Matrix implementation */}
      <div className="matrix-cell" style={{ fontVariantNumeric: 'tabular-nums' }}>Cell 1</div>
    </div>
  );
}`;
  } else if (framework === 'vue') {
    code = `<template>
  <div ref="container" class="multi-axis-comparison-matrix" style="min-height: 100dvh; min-width: 0;">
    <div class="matrix-cell" style="font-variant-numeric: tabular-nums;">Cell 1</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".matrix-cell",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          duration: 0.4,
          scrollTrigger: {
            trigger: container.value,
            start: "top 80%"
          }
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".matrix-cell", { opacity: 1, y: 0 });
    });
  }, container.value);
});

onUnmounted(() => {
  ctx && ctx.revert();
});
</script>`;
  } else if (framework === 'svelte') {
    code = `<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let container;

  onMount(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".matrix-cell",
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            ease: "power2.out",
            duration: 0.4,
            scrollTrigger: {
              trigger: container,
              start: "top 80%"
            }
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".matrix-cell", { opacity: 1, y: 0 });
      });
    }, container);

    return () => ctx.revert();
  });
</script>

<div bind:this={container} class="multi-axis-comparison-matrix" style="min-height: 100dvh; min-width: 0;">
  <div class="matrix-cell" style="font-variant-numeric: tabular-nums;">Cell 1</div>
</div>`;
  } else {
    // vanilla
    code = `import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMultiAxisComparisonMatrix(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".matrix-cell",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          duration: 0.4,
          scrollTrigger: {
            trigger: element,
            start: "top 80%"
          }
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".matrix-cell", { opacity: 1, y: 0 });
    });
  }, element);

  return () => ctx.revert();
}`;
  }

  return {
    id: "multi-axis-comparison-matrix",
    framework,
    code,
    css: `.multi-axis-comparison-matrix { display: grid; gap: 16px; }`
  };
}
