export const EDITORIAL_MASTHEAD_COLOPHON_PACK = {
  id: "editorial-masthead-colophon",
  title: "Broadsheet Masthead, Issue Colophon & Index Bar",
  category: "components",
  typography: {
    display: "Playfair Display",
    body: "Source Serif 4",
    mono: "IBM Plex Mono"
  },
  tokens: {
    "color-background": "oklch(0.97 0.01 70)",
    "color-foreground": "oklch(0.15 0.01 70)",
    "color-accent": "oklch(0.50 0.15 40)"
  },
  gsapRecipe: "gsap.from(elements, { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })"
};

export function generateEditorialMastheadColophonBlueprint({ framework = "react" } = {}) {
  let code = "";

  if (framework === "react") {
    code = `import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function EditorialMastheadColophon() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".masthead-element", { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });
    });
  }, { scope: container });

  return (
    <div ref={container} className="masthead-colophon">
      <header className="masthead-element">Masthead</header>
      <div className="masthead-element">Colophon</div>
    </div>
  );
}`;
  } else if (framework === "vue") {
    code = `<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const container = ref(null);
let mm;

onMounted(() => {
  mm = gsap.matchMedia(container.value);
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".masthead-element", { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });
  });
});

onUnmounted(() => {
  mm && mm.revert();
});
</script>

<template>
  <div ref="container" class="masthead-colophon">
    <header class="masthead-element">Masthead</header>
    <div class="masthead-element">Colophon</div>
  </div>
</template>`;
  } else if (framework === "svelte") {
    code = `<script>
import { onMount, onDestroy } from 'svelte';
import gsap from 'gsap';

let container;
let mm;

onMount(() => {
  mm = gsap.matchMedia(container);
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".masthead-element", { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });
  });
});

onDestroy(() => {
  mm && mm.revert();
});
</script>

<div bind:this={container} class="masthead-colophon">
  <header class="masthead-element">Masthead</header>
  <div class="masthead-element">Colophon</div>
</div>`;
  } else {
    // vanilla
    code = `import gsap from 'gsap';

export function initEditorialMastheadColophon(element) {
  let mm = gsap.matchMedia(element);
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".masthead-element", { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });
  });

  return () => mm.revert();
}`;
  }

  return {
    id: "editorial-masthead-colophon",
    framework,
    code,
    css: ".masthead-colophon { font-family: 'Playfair Display', serif; }"
  };
}
