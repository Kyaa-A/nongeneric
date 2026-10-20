export const SCHOLARLY_MARGINALIA_PACK = {
  id: "scholarly-marginalia",
  title: "Scholarly Footnote & Synchronized Marginalia Reader",
  category: "components",
  typography: {
    display: "Shippori Mincho",
    body: "Source Serif 4",
    mono: "IBM Plex Mono"
  },
  tokens: {
    washi: "oklch(0.96 0.015 82)",
    sumi: "oklch(0.19 0.01 65)",
    vermilion: "oklch(0.55 0.19 32)"
  },
  gsapRecipe: ["ScrollTrigger", "matchMedia", "context", "useGSAP"]
};

export function generateScholarlyMarginaliaBlueprint({ framework = "react" } = {}) {
  const css = `
:root {
  --ng-washi: oklch(0.96 0.015 82);
  --ng-sumi: oklch(0.19 0.01 65);
  --ng-vermilion: oklch(0.55 0.19 32);
}
.scholarly-reader {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  gap: 2rem;
  background-color: var(--ng-washi);
  color: var(--ng-sumi);
  padding: 4rem 2rem;
}
.marginalia-aside {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.marginalia-item {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  padding: 1rem;
  border-left: 1px solid var(--ng-sumi);
  opacity: 0.3;
  transition: opacity 250ms ease-out;
}
.marginalia-item.active {
  opacity: 1;
}
.reader-article {
  min-width: 0;
  font-family: 'Source Serif 4', serif;
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  line-height: 1.7;
  max-width: 65ch;
}
.reader-heading {
  font-family: 'Shippori Mincho', serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 2rem;
}
.reader-paragraph {
  margin-bottom: 1.5rem;
}
.reader-ref {
  color: var(--ng-vermilion);
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem;
}
.reader-action {
  min-height: 44px;
  min-width: 44px;
  padding: 0.5rem 1rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  background: var(--ng-sumi);
  color: var(--ng-washi);
  border: none;
  cursor: pointer;
}
@media (prefers-reduced-motion: reduce) {
  .marginalia-item {
    transition: none !important;
    animation: none !important;
  }
}
  `.trim();

  let code = '';

  if (framework === 'react') {
    code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScholarlyMarginalia() {
  const container = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray('.marginalia-item');
      const paragraphs = gsap.utils.toArray('.reader-paragraph');

      paragraphs.forEach((p, i) => {
        if (items[i]) {
          ScrollTrigger.create({
            trigger: p,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
            onLeave: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" }),
            onEnterBack: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
            onLeaveBack: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" })
          });
        }
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const items = gsap.utils.toArray('.marginalia-item');
      const paragraphs = gsap.utils.toArray('.reader-paragraph');

      paragraphs.forEach((p, i) => {
        if (items[i]) {
          ScrollTrigger.create({
            trigger: p,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.set(items[i], { opacity: 1 }),
            onLeave: () => gsap.set(items[i], { opacity: 0.3 }),
            onEnterBack: () => gsap.set(items[i], { opacity: 1 }),
            onLeaveBack: () => gsap.set(items[i], { opacity: 0.3 })
          });
        }
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="scholarly-reader">
      <aside className="marginalia-aside">
        <div className="marginalia-item">Ref 1: Note on the essence of space.</div>
        <div className="marginalia-item">Ref 2: Architectural significance.</div>
      </aside>
      <article className="reader-article">
        <h1 className="reader-heading">Scholarly Notes</h1>
        <p className="reader-paragraph">
          This is the first paragraph. <a href="#ref1" className="reader-ref">[1]</a> It introduces the topic.
        </p>
        <p className="reader-paragraph">
          This is the second paragraph. <a href="#ref2" className="reader-ref">[2]</a> It delves deeper.
        </p>
        <button className="reader-action">Action</button>
      </article>
    </div>
  );
}
    `.trim();
  } else if (framework === 'vue') {
    code = `
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray('.marginalia-item');
      const paragraphs = gsap.utils.toArray('.reader-paragraph');

      paragraphs.forEach((p, i) => {
        if (items[i]) {
          ScrollTrigger.create({
            trigger: p,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
            onLeave: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" }),
            onEnterBack: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
            onLeaveBack: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" })
          });
        }
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const items = gsap.utils.toArray('.marginalia-item');
      const paragraphs = gsap.utils.toArray('.reader-paragraph');

      paragraphs.forEach((p, i) => {
        if (items[i]) {
          ScrollTrigger.create({
            trigger: p,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.set(items[i], { opacity: 1 }),
            onLeave: () => gsap.set(items[i], { opacity: 0.3 }),
            onEnterBack: () => gsap.set(items[i], { opacity: 1 }),
            onLeaveBack: () => gsap.set(items[i], { opacity: 0.3 })
          });
        }
      });
    });
  }, container.value);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="container" class="scholarly-reader">
    <aside class="marginalia-aside">
      <div class="marginalia-item">Ref 1: Note on the essence of space.</div>
      <div class="marginalia-item">Ref 2: Architectural significance.</div>
    </aside>
    <article class="reader-article">
      <h1 class="reader-heading">Scholarly Notes</h1>
      <p class="reader-paragraph">
        This is the first paragraph. <a href="#ref1" class="reader-ref">[1]</a> It introduces the topic.
      </p>
      <p class="reader-paragraph">
        This is the second paragraph. <a href="#ref2" class="reader-ref">[2]</a> It delves deeper.
      </p>
      <button class="reader-action">Action</button>
    </article>
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
        const items = gsap.utils.toArray('.marginalia-item');
        const paragraphs = gsap.utils.toArray('.reader-paragraph');

        paragraphs.forEach((p, i) => {
          if (items[i]) {
            ScrollTrigger.create({
              trigger: p,
              start: "top center",
              end: "bottom center",
              onEnter: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
              onLeave: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" }),
              onEnterBack: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
              onLeaveBack: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" })
            });
          }
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const items = gsap.utils.toArray('.marginalia-item');
        const paragraphs = gsap.utils.toArray('.reader-paragraph');

        paragraphs.forEach((p, i) => {
          if (items[i]) {
            ScrollTrigger.create({
              trigger: p,
              start: "top center",
              end: "bottom center",
              onEnter: () => gsap.set(items[i], { opacity: 1 }),
              onLeave: () => gsap.set(items[i], { opacity: 0.3 }),
              onEnterBack: () => gsap.set(items[i], { opacity: 1 }),
              onLeaveBack: () => gsap.set(items[i], { opacity: 0.3 })
            });
          }
        });
      });
    }, container);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div bind:this={container} class="scholarly-reader">
  <aside class="marginalia-aside">
    <div class="marginalia-item">Ref 1: Note on the essence of space.</div>
    <div class="marginalia-item">Ref 2: Architectural significance.</div>
  </aside>
  <article class="reader-article">
    <h1 class="reader-heading">Scholarly Notes</h1>
    <p class="reader-paragraph">
      This is the first paragraph. <a href="#ref1" class="reader-ref">[1]</a> It introduces the topic.
    </p>
    <p class="reader-paragraph">
      This is the second paragraph. <a href="#ref2" class="reader-ref">[2]</a> It delves deeper.
    </p>
    <button class="reader-action">Action</button>
  </article>
</div>
    `.trim();
  } else {
    // vanilla
    code = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScholarlyMarginalia(element) {
  const ctx = gsap.context(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray('.marginalia-item');
      const paragraphs = gsap.utils.toArray('.reader-paragraph');

      paragraphs.forEach((p, i) => {
        if (items[i]) {
          ScrollTrigger.create({
            trigger: p,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
            onLeave: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" }),
            onEnterBack: () => gsap.to(items[i], { opacity: 1, duration: 0.3, ease: "power2.out" }),
            onLeaveBack: () => gsap.to(items[i], { opacity: 0.3, duration: 0.3, ease: "power2.in" })
          });
        }
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const items = gsap.utils.toArray('.marginalia-item');
      const paragraphs = gsap.utils.toArray('.reader-paragraph');

      paragraphs.forEach((p, i) => {
        if (items[i]) {
          ScrollTrigger.create({
            trigger: p,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.set(items[i], { opacity: 1 }),
            onLeave: () => gsap.set(items[i], { opacity: 0.3 }),
            onEnterBack: () => gsap.set(items[i], { opacity: 1 }),
            onLeaveBack: () => gsap.set(items[i], { opacity: 0.3 })
          });
        }
      });
    });
  }, element);

  return () => ctx.revert();
}
    `.trim();
  }

  return {
    id: "scholarly-marginalia",
    framework,
    code,
    css
  };
}
