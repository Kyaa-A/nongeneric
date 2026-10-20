export const TYPOGRAPHIC_FOUNDRY_SPECIMEN_PACK = {
  id: "typographic-foundry-specimen",
  title: "Independent Type Foundry Specimen & Glyph Metrics World",
  category: "worlds",
  typography: {
    display: "Syne",
    body: "Source Serif 4",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.98 0.01 90)",
    foreground: "oklch(0.15 0.02 240)",
    accent: "oklch(0.65 0.15 30)"
  },
  gsapRecipe: "Staggered text reveals, custom easing, scroll-triggered glyph animations"
};

export function generateTypographicFoundrySpecimenBlueprint({ framework = "react" } = {}) {
  const code = framework === "react" ? `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Specimen() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".glyph", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top center"
        }
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="specimen">
      <h1 className="glyph">A</h1>
      <h1 className="glyph">B</h1>
      <h1 className="glyph">C</h1>
    </div>
  );
}
  ` : framework === "vue" ? `
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
      gsap.from(".glyph", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.value,
          start: "top center"
        }
      });
    });
  }, container.value);
});

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
  <div ref="container" class="specimen">
    <h1 class="glyph">A</h1>
    <h1 class="glyph">B</h1>
    <h1 class="glyph">C</h1>
  </div>
</template>
  ` : framework === "svelte" ? `
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
      gsap.from(".glyph", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top center"
        }
      });
    });
  }, container);
});

onDestroy(() => {
  if (ctx) ctx.revert();
});
</script>

<div bind:this={container} class="specimen">
  <h1 class="glyph">A</h1>
  <h1 class="glyph">B</h1>
  <h1 class="glyph">C</h1>
</div>
  ` : `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSpecimen(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".glyph", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top center"
        }
      });
    });
  }, element);

  return () => ctx.revert();
}
  `;

  const css = `
.specimen {
  font-family: var(--ng-font-display, 'Syne'), sans-serif;
}
.glyph {
  font-size: 5rem;
}
  `;

  return {
    id: "typographic-foundry-specimen",
    framework,
    code: code.trim(),
    css: css.trim()
  };
}
