export const EDITORIAL_PRICING_LEDGER_PACK = {
    id: "editorial-pricing-ledger",
    title: "Editorial Specification & Acquisition Matrix (Anti-3-Tier-Slop)",
    category: "components",
    typography: {
        display: "Newsreader",
        body: "Work Sans",
        mono: "IBM Plex Mono"
    },
    tokens: {
        background: "oklch(0.98 0 0)",
        surface: "oklch(1 0 0)",
        text: "oklch(0.2 0 0)",
        muted: "oklch(0.5 0 0)",
        border: "oklch(0.9 0 0)",
        accent: "oklch(0.6 0.1 250)"
    },
    gsapRecipe: {
        description: "Row-based sequential reveal using robust clean timelines.",
        plugins: []
    }
};

export function generateEditorialPricingLedgerBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";

    const registerCore = `gsap.registerPlugin();`;

    let wrapperStart = "";
    let wrapperEnd = "";

    if (isReact) {
        wrapperStart = `useGSAP(() => {\n    const mm = gsap.matchMedia();\n    mm.add("(prefers-reduced-motion: no-preference)", () => {\n      gsap.from(".ledger-row", { \n        y: 20, \n        opacity: 0, \n        stagger: 0.05, \n        duration: 0.6, \n        ease: "power3.out" \n      });\n    });\n  }, { scope: containerRef });`;
        wrapperEnd = ``;
    } else {
        const assignmentStr = (isVue || isSvelte) ? "ctx = gsap.context" : "const ctx = gsap.context";
        wrapperStart = `${assignmentStr}(() => {\n    const mm = gsap.matchMedia();\n    mm.add("(prefers-reduced-motion: no-preference)", () => {\n      gsap.from(".ledger-row", { \n        y: 20, \n        opacity: 0, \n        stagger: 0.05, \n        duration: 0.6, \n        ease: "power3.out" \n      });\n    });\n  }, ${isVue ? "containerRef.value" : "containerRef"});`;
        wrapperEnd = ``;
    }

    const htmlCode = `
<div class="pricing-ledger" ${isReact ? 'ref={containerRef}' : (isVue ? 'ref="containerRef"' : (isSvelte ? 'bind:this={containerRef}' : 'id="ledger-container"'))}>
  <div class="ledger-header">
    <h2>Editorial Ledger</h2>
    <p>Specification Matrix</p>
  </div>
  <table class="ledger-table">
    <thead>
      <tr>
        <th>Specification</th>
        <th>Standard</th>
        <th>Pro</th>
      </tr>
    </thead>
    <tbody>
      <tr class="ledger-row">
        <td>Telemetry</td>
        <td>Basic</td>
        <td>Advanced</td>
      </tr>
      <tr class="ledger-row">
        <td>Latency</td>
        <td>50ms</td>
        <td>10ms</td>
      </tr>
    </tbody>
  </table>
  <div class="ledger-actions">
    <button class="ledger-btn">Acquire Standard</button>
    <button class="ledger-btn primary">Acquire Pro</button>
  </div>
</div>
`;

    let code = ``;
    if (isReact) {
        code = `
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

export function EditorialPricingLedger() {
  const containerRef = useRef(null);

  ${registerCore}

  ${wrapperStart}

  return (
    ${htmlCode}
  );
}
`;
    } else if (isVue) {
        code = `
<script setup>
import gsap from 'gsap';
import { ref, onMounted, onUnmounted } from 'vue';

const containerRef = ref(null);
let ctx;

${registerCore}

onMounted(() => {
  ${wrapperStart}
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  ${htmlCode}
</template>
`;
    } else if (isSvelte) {
        code = `
<script>
import gsap from 'gsap';
import { onMount, onDestroy } from 'svelte';

let containerRef;
let ctx;

${registerCore}

onMount(() => {
  ${wrapperStart}
});

onDestroy(() => {
  if (ctx) ctx.revert();
});
</script>

${htmlCode}
`;
    } else {
        // Vanilla
        code = `
import gsap from 'gsap';

const containerRef = document.getElementById("ledger-container");

${registerCore}

${wrapperStart}

// Cleanup context when needed
// ctx.revert();

// Ensure the following HTML exists in your DOM:
/*
${htmlCode}
*/
`;
    }

    return {
        id: "editorial-pricing-ledger",
        framework,
        code,
        css: ""
    };
}
