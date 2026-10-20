export const RARE_BOOK_INCUNABULA_PACK = {
  id: "rare-book-incunabula",
  title: "Renaissance Incunabula & Rubricated Folio World",
  category: "worlds",
  typography: {
    display: "Cormorant Garamond",
    body: "Source Serif 4",
    mono: "IBM Plex Mono"
  },
  tokens: {
    parchment: "oklch(0.96 0.02 85)",
    ink: "oklch(0.2 0.01 65)",
    rubrication: "oklch(0.5 0.2 30)"
  },
  gsapRecipe: "gsap.from(element, { opacity: 0, duration: 1.5, ease: 'power2.inOut' });"
};

export function generateRareBookIncunabulaBlueprint({ framework = "react" } = {}) {
  let code = "";

  if (framework === "react") {
    code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function RareBookIncunabula() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".folio-text", {
        opacity: 0,
        y: 20,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.2
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="incunabula-world">
      <h1 className="folio-text">Renaissance Incunabula</h1>
      <p className="folio-text">A typographic exploration of early printing.</p>
    </div>
  );
}
`;
  } else if (framework === "vanilla") {
    code = `
import gsap from 'gsap';

export function initRareBookIncunabula(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(element.querySelectorAll(".folio-text"), {
        opacity: 0,
        y: 20,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.2
      });
    });

    return () => mm.revert();
  }, element);

  return () => ctx.revert();
}
`;
  } else if (framework === "vue") {
    code = `
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".folio-text", {
        opacity: 0,
        y: 20,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.2
      });
    });

    return () => mm.revert();
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="container" class="incunabula-world">
    <h1 class="folio-text">Renaissance Incunabula</h1>
    <p class="folio-text">A typographic exploration of early printing.</p>
  </div>
</template>
`;
  } else if (framework === "svelte") {
    code = `
<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';

  let container;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".folio-text", {
          opacity: 0,
          y: 20,
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.2
        });
      });

      return () => mm.revert();
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div bind:this={container} class="incunabula-world">
  <h1 class="folio-text">Renaissance Incunabula</h1>
  <p class="folio-text">A typographic exploration of early printing.</p>
</div>
`;
  }

  const css = `
.incunabula-world {
  --parchment: oklch(0.96 0.02 85);
  --ink: oklch(0.2 0.01 65);
  --rubrication: oklch(0.5 0.2 30);
  background-color: var(--parchment);
  color: var(--ink);
  font-family: "Source Serif 4", serif;
  min-height: 100dvh;
  padding: 2rem;
}
.incunabula-world h1 {
  font-family: "Cormorant Garamond", serif;
  color: var(--rubrication);
}
`;

  return {
    id: "rare-book-incunabula",
    framework,
    code: code.trim(),
    css: css.trim()
  };
}
