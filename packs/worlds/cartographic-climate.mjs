export const CARTOGRAPHIC_CLIMATE_PACK = {
  id: "cartographic-climate",
  title: "Earth Observation, Climate & Cartographic Atlas World",
  category: "worlds",
  typography: {
    display: "Newsreader",
    body: "Work Sans",
    mono: "Space Mono"
  },
  tokens: {
    background: "oklch(0.98 0.01 200)",
    surface: "oklch(0.96 0.01 200)",
    border: "oklch(0.9 0.01 200)",
    primary: "oklch(0.4 0.1 200)",
    text: "oklch(0.2 0.02 200)",
    muted: "oklch(0.5 0.02 200)"
  },
  gsapRecipe: "Precise vector choreography, staggered datum revelations, and non-scaling-stroke map interactions."
};

export function generateCartographicClimateBlueprint({ framework = "react" } = {}) {
  let targetRef, contextInit, contextCleanup, importStatement;

  if (framework === "vanilla") {
    targetRef = "const element = document.querySelector('.cartographic-canvas');";
    contextInit = "const ctx = gsap.context(() => {\n";
    contextCleanup = "});\n    return () => ctx.revert();";
    importStatement = "import { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';";
  } else if (framework === "react") {
    targetRef = "const container = useRef(null);";
    contextInit = "useGSAP(() => {\n";
    contextCleanup = "}, { scope: container });";
    importStatement = "import { useRef } from 'react';\nimport { gsap } from 'gsap';\nimport { useGSAP } from '@gsap/react';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';";
  } else if (framework === "vue") {
    targetRef = "const container = ref(null);";
    contextInit = "let ctx;\nonMounted(() => {\n      ctx = gsap.context(() => {\n";
    contextCleanup = "}, container.value);\n    });\n    onUnmounted(() => ctx?.revert());";
    importStatement = "import { ref, onMounted, onUnmounted } from 'vue';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';";
  } else if (framework === "svelte") {
    targetRef = "let container;";
    contextInit = "let ctx;\nonMount(() => {\n      ctx = gsap.context(() => {\n";
    contextCleanup = "}, container);\n      return () => ctx.revert();\n    });";
    importStatement = "import { onMount } from 'svelte';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';";
  }

  const css = `
.cartographic-canvas {
  font-family: "Work Sans", sans-serif;
  color: var(--color-text, oklch(0.2 0.02 200));
  background: var(--color-background, oklch(0.98 0.01 200));
  min-height: 100dvh;
  padding: 2rem;
}
.map-datum {
  font-family: "Space Mono", monospace;
  opacity: 0;
  transform: translateY(10px);
}
@media (prefers-reduced-motion: reduce) {
  .map-datum {
    opacity: 1;
    transform: none;
  }
}
`;

  const code = `${importStatement}

gsap.registerPlugin(ScrollTrigger);

export function CartographicClimateModule() {
  ${targetRef}

  ${contextInit}
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".map-datum", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cartographic-canvas",
          start: "top center"
        }
      });
    });
  ${contextCleanup}
}
`;

  return {
    id: "cartographic-climate",
    framework,
    code,
    css
  };
}
