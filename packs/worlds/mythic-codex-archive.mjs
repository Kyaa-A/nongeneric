export const MYTHIC_CODEX_ARCHIVE_PACK = {
  id: "mythic-codex-archive",
  title: "Independent Game Lore & Worldbuilding Codex World",
  category: "worlds",
  typography: {
    display: "Shippori Mincho",
    body: "Source Serif 4",
    mono: "IBM Plex Mono"
  },
  tokens: {
    surface: "oklch(0.2 0.01 250)",
    text: "oklch(0.9 0.02 80)",
    accent: "oklch(0.6 0.15 45)"
  },
  gsapRecipe: "Staggered fade-ins with gentle transforms for codex entries."
};

export function generateMythicCodexArchiveBlueprint({ framework = "react" } = {}) {
  const css = `
:root {
  --ng-surface: oklch(0.2 0.01 250);
  --ng-text: oklch(0.9 0.02 80);
  --ng-accent: oklch(0.6 0.15 45);
  --ng-font-display: 'Shippori Mincho', serif;
  --ng-font-body: 'Source Serif 4', serif;
  --ng-font-mono: 'IBM Plex Mono', monospace;
}
  `.trim();

  let code = "";

  if (framework === "react") {
    code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function MythicCodexArchive() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".codex-entry", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".codex-entry", { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="mythic-codex-archive">
      <h1 className="codex-title">Mythic Codex Archive</h1>
      <div className="codex-entry">Entry 1</div>
      <div className="codex-entry">Entry 2</div>
      <div className="codex-entry">Entry 3</div>
    </div>
  );
}
    `.trim();
  } else if (framework === "vue") {
    code = `
<template>
  <div ref="container" class="mythic-codex-archive">
    <h1 class="codex-title">Mythic Codex Archive</h1>
    <div class="codex-entry">Entry 1</div>
    <div class="codex-entry">Entry 2</div>
    <div class="codex-entry">Entry 3</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

gsap.registerPlugin();

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".codex-entry", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".codex-entry", { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>
    `.trim();
  } else if (framework === "svelte") {
    code = `
<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  gsap.registerPlugin();

  let container;

  onMount(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".codex-entry", {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out"
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".codex-entry", { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    }, container);

    return () => {
      if (ctx) ctx.revert();
    };
  });
</script>

<div bind:this={container} class="mythic-codex-archive">
  <h1 class="codex-title">Mythic Codex Archive</h1>
  <div class="codex-entry">Entry 1</div>
  <div class="codex-entry">Entry 2</div>
  <div class="codex-entry">Entry 3</div>
</div>
    `.trim();
  } else {
    code = `
import gsap from 'gsap';

gsap.registerPlugin();

export function initMythicCodexArchive(element) {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".codex-entry", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".codex-entry", { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, element);

  return () => {
    ctx.revert();
  };
}
    `.trim();
  }

  return {
    id: "mythic-codex-archive",
    framework,
    code,
    css
  };
}
