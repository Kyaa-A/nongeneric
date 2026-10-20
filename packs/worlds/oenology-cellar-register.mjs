export const OENOLOGY_CELLAR_REGISTER_PACK = {
  id: "oenology-cellar-register",
  title: "Viticultural Terroir & Archival Cellar Register World",
  category: "worlds",
  typography: {
    display: "Newsreader",
    body: "Source Serif 4",
    mono: "IBM Plex Mono"
  },
  tokens: {
    background: "oklch(0.15 0.02 15)",
    text: "oklch(0.9 0.02 20)",
    accent: "oklch(0.4 0.1 25)",
    border: "oklch(0.3 0.02 20)"
  },
  gsapRecipe: {
    ease: "power2.out",
    duration: 1.2
  }
};

export function generateOenologyCellarRegisterBlueprint({ framework = "react" } = {}) {
  const css = `
:root {
  --ng-bg: oklch(0.15 0.02 15);
  --ng-fg: oklch(0.9 0.02 20);
  --ng-accent: oklch(0.4 0.1 25);
  --ng-border: oklch(0.3 0.02 20);
  --ng-font-display: "Newsreader", serif;
  --ng-font-body: "Source Serif 4", serif;
  --ng-font-mono: "IBM Plex Mono", monospace;
}
  `.trim();

  let code = '';
  if (framework === 'react') {
    code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function OenologyCellarRegister() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".vintage-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top center",
        }
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="cellar-register">
      <div className="vintage-item">1996</div>
      <div className="vintage-item">2005</div>
      <div className="vintage-item">2010</div>
    </div>
  );
}
    `.trim();
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
      gsap.from(".vintage-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.value,
          start: "top center",
        }
      });
    });
  }, container.value);
});

onUnmounted(() => {
  ctx && ctx.revert();
});
</script>

<template>
  <div ref="container" class="cellar-register">
    <div class="vintage-item">1996</div>
    <div class="vintage-item">2005</div>
    <div class="vintage-item">2010</div>
  </div>
</template>
    `.trim();
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
        gsap.from(".vintage-item", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top center",
          }
        });
      });
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div bind:this={container} class="cellar-register">
  <div class="vintage-item">1996</div>
  <div class="vintage-item">2005</div>
  <div class="vintage-item">2010</div>
</div>
    `.trim();
  } else {
    // vanilla
    code = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initOenologyCellarRegister(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".vintage-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top center",
        }
      });
    });
  }, element);

  return () => ctx.revert();
}
    `.trim();
  }

  return {
    id: "oenology-cellar-register",
    framework,
    code,
    css
  };
}
