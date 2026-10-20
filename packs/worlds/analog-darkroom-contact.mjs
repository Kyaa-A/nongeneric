export const ANALOG_DARKROOM_CONTACT_PACK = {
  id: "analog-darkroom-contact",
  title: "Silver-Gelatin Darkroom Contact Sheet & Film Archive World",
  category: "worlds",
  typography: {
    display: "Playfair Display",
    body: "Work Sans",
    mono: "Space Mono"
  },
  tokens: {
    background: "oklch(0.15 0 0)",
    surface: "oklch(0.20 0 0)",
    border: "oklch(0.35 0 0)",
    text: "oklch(0.9 0 0)",
    muted: "oklch(0.6 0 0)",
    accent: "oklch(0.8 0 0)"
  },
  gsapRecipe: "Staggered reveal with ease: 'power2.out', using gsap.matchMedia() for reduced motion."
};

export function generateAnalogDarkroomContactBlueprint({ framework = "react" } = {}) {
  let code = "";

  if (framework === "react") {
    code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function AnalogDarkroomContact() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".contact-sheet-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        duration: 0.8
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="darkroom-container">
      <h1 className="darkroom-title">Film Archive</h1>
      <div className="contact-sheet-item">Frame 1</div>
      <div className="contact-sheet-item">Frame 2</div>
      <div className="contact-sheet-item">Frame 3</div>
    </div>
  );
}
    `.trim();
  } else if (framework === "vanilla") {
    code = `
import gsap from 'gsap';

export function initAnalogDarkroomContact(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".contact-sheet-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        duration: 0.8
      });
    });

    return () => mm.revert();
  }, element);

  return () => ctx.revert();
}
    `.trim();
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
      gsap.from(".contact-sheet-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        duration: 0.8
      });
    });
  }, container.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="container" class="darkroom-container">
    <h1 class="darkroom-title">Film Archive</h1>
    <div class="contact-sheet-item">Frame 1</div>
    <div class="contact-sheet-item">Frame 2</div>
    <div class="contact-sheet-item">Frame 3</div>
  </div>
</template>
    `.trim();
  } else if (framework === "svelte") {
    code = `
<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let container;

  onMount(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-sheet-item", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
          duration: 0.8
        });
      });
    }, container);

    return () => ctx.revert();
  });
</script>

<div bind:this={container} class="darkroom-container">
  <h1 class="darkroom-title">Film Archive</h1>
  <div class="contact-sheet-item">Frame 1</div>
  <div class="contact-sheet-item">Frame 2</div>
  <div class="contact-sheet-item">Frame 3</div>
</div>
    `.trim();
  }

  const css = `
.darkroom-container {
  background-color: oklch(0.15 0 0);
  color: oklch(0.9 0 0);
  font-family: "Work Sans", sans-serif;
  padding: 2rem;
}

.darkroom-title {
  font-family: "Playfair Display", serif;
}

.contact-sheet-item {
  font-family: "Space Mono", monospace;
  background-color: oklch(0.20 0 0);
  border: 1px solid oklch(0.35 0 0);
  padding: 1rem;
  margin-bottom: 1rem;
}
  `.trim();

  return {
    id: "analog-darkroom-contact",
    framework,
    code,
    css
  };
}
