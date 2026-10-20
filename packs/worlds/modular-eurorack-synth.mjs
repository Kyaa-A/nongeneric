export const MODULAR_EURORACK_SYNTH_PACK = {
  id: "modular-eurorack-synth",
  title: "Eurorack Modular Patchbay & CV Oscilloscope World",
  category: "worlds",
  typography: {
    display: "Chakra Petch",
    body: "Atkinson Hyperlegible",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.15 0 0)",
    panel: "oklch(0.20 0 0)",
    text: "oklch(0.9 0 0)",
    accent: "oklch(0.7 0.15 150)",
    cable: "oklch(0.6 0.18 20)"
  },
  gsapRecipe: "CV oscilloscope traces, quick snappy patching interactions, and precise mechanical movements."
};

export function generateModularEurorackSynthBlueprint({ framework = "react" } = {}) {
  let code = '';

  if (framework === 'react') {
    code = `
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ModularEurorack() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.cv-trace',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: "power2.out", stagger: 0.1 }
      );
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="eurorack-panel">
      <div className="cv-trace"></div>
      <div className="cv-trace"></div>
    </div>
  );
}
`;
  } else if (framework === 'vanilla') {
    code = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initModularEurorack(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.cv-trace',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: "power2.out", stagger: 0.1 }
      );
    });

  }, element);

  return () => ctx.revert();
}
`;
  } else if (framework === 'vue') {
    code = `
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.cv-trace',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: "power2.out", stagger: 0.1 }
      );
    });
  }, container.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="container" class="eurorack-panel">
    <div class="cv-trace"></div>
    <div class="cv-trace"></div>
  </div>
</template>
`;
  } else if (framework === 'svelte') {
    code = `
<script>
import { onMount, onDestroy } from 'svelte';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let container;
let ctx;

onMount(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo('.cv-trace',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: "power2.out", stagger: 0.1 }
      );
    });
  }, container);
});

onDestroy(() => {
  ctx?.revert();
});
</script>

<div bind:this={container} class="eurorack-panel">
  <div class="cv-trace"></div>
  <div class="cv-trace"></div>
</div>
`;
  }

  return {
    id: "modular-eurorack-synth",
    framework,
    code: code.trim(),
    css: `
.eurorack-panel {
  background-color: var(--ng-panel, oklch(0.20 0 0));
  color: var(--ng-text, oklch(0.9 0 0));
  font-family: var(--ng-font-body, 'Atkinson Hyperlegible');
  padding: 2rem;
}
.cv-trace {
  height: 2px;
  background-color: var(--ng-accent, oklch(0.7 0.15 150));
  margin-bottom: 1rem;
  transform-origin: left center;
}
    `.trim()
  };
}
