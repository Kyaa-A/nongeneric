export const SPLIT_DOSSIER_SHEET_PACK = {
  id: "split-dossier-sheet",
  title: "Split-Screen Archival Dossier & Evidence Sheet",
  category: "components",
  typography: {
    display: "Playfair Display",
    body: "Work Sans",
    mono: "IBM Plex Mono"
  },
  tokens: {
    surface: "oklch(0.97 0.01 95)",
    ink: "oklch(0.15 0.02 240)",
    accent: "oklch(0.5 0.15 40)",
    border: "oklch(0.85 0.01 240)"
  },
  gsapRecipe: {
    plugins: ["ScrollTrigger"],
    elements: ["entry", "sheet", "stamp"],
    animation: "Scrubbed reveal for archival evidence sheet"
  }
};

export function generateSplitDossierSheetBlueprint({ framework = "react" } = {}) {
  let code = "";

  if (framework === "react") {
    code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SplitDossierSheet() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        }
      });

      tl.from(".dossier-entry", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      })
      .from(".dossier-stamp", {
        scale: 1.5,
        opacity: 0,
        rotation: -15,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.2");
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="dossier-container">
      <div className="dossier-sheet">
        <h2 className="dossier-entry">Exhibit A</h2>
        <p className="dossier-entry">Classified findings.</p>
        <div className="dossier-stamp">CONFIDENTIAL</div>
      </div>
    </div>
  );
}
`;
  } else if (framework === "vue") {
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.value,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        }
      });

      tl.from(".dossier-entry", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      })
      .from(".dossier-stamp", {
        scale: 1.5,
        opacity: 0,
        rotation: -15,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.2");
    });
  }, container.value);
});

onUnmounted(() => {
  ctx && ctx.revert();
});
</script>

<template>
  <div ref="container" class="dossier-container">
    <div class="dossier-sheet">
      <h2 class="dossier-entry">Exhibit A</h2>
      <p class="dossier-entry">Classified findings.</p>
      <div class="dossier-stamp">CONFIDENTIAL</div>
    </div>
  </div>
</template>
`;
  } else if (framework === "svelte") {
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
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          }
        });

        tl.from(".dossier-entry", {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out"
        })
        .from(".dossier-stamp", {
          scale: 1.5,
          opacity: 0,
          rotation: -15,
          duration: 0.4,
          ease: "back.out(1.7)"
        }, "-=0.2");
      });
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div bind:this={container} class="dossier-container">
  <div class="dossier-sheet">
    <h2 class="dossier-entry">Exhibit A</h2>
    <p class="dossier-entry">Classified findings.</p>
    <div class="dossier-stamp">CONFIDENTIAL</div>
  </div>
</div>
`;
  } else {
    // vanilla
    code = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSplitDossierSheet(element) {
  const ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        }
      });

      tl.from(".dossier-entry", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      })
      .from(".dossier-stamp", {
        scale: 1.5,
        opacity: 0,
        rotation: -15,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.2");
    });
  }, element);

  return () => ctx.revert();
}
`;
  }

  return {
    id: "split-dossier-sheet",
    framework,
    code,
    css: `
.dossier-container {
  min-height: 100dvh;
  min-width: 0;
  font-family: "Work Sans", sans-serif;
  background-color: oklch(0.97 0.01 95);
  color: oklch(0.15 0.02 240);
}
.dossier-entry {
  font-variant-numeric: tabular-nums;
}
.dossier-stamp {
  font-family: "IBM Plex Mono", monospace;
  color: oklch(0.5 0.15 40);
  border: 2px solid oklch(0.5 0.15 40);
  display: inline-block;
  padding: 0.5rem 1rem;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
    `
  };
}
