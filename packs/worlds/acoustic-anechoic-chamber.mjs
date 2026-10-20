export const ACOUSTIC_ANECHOIC_CHAMBER_PACK = {
  id: "acoustic-anechoic-chamber",
  title: "Acoustic Impulse & Harmonics Lab World",
  category: "worlds",
  typography: {
    display: "Barlow Condensed",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    groundPrimary: "oklch(0.12 0.01 250)",
    groundElevated: "oklch(0.18 0.01 250)",
    inkPrimary: "oklch(0.98 0 0)",
    inkMuted: "oklch(0.65 0 0)",
    accentPrimary: "oklch(0.6 0.2 25)",
    borderHairline: "oklch(0.25 0.01 250)"
  },
  gsapRecipe: "Staggered amplitude bars with spring physics."
};

export function generateAcousticAnechoicChamberBlueprint({ framework = "react" } = {}) {
  const isReact = framework === "react";
  const isVue = framework === "vue";
  const isSvelte = framework === "svelte";

  const imports = isReact
    ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`
    : isVue
    ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`
    : isSvelte
    ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`
    : `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

  const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

  const logic = `
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const bars = gsap.utils.toArray('.amplitude-bar');
      if (bars.length) {
        gsap.from(bars, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: bars[0],
            start: 'top 80%',
          }
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Reduced motion: no animation, elements visible
    });
  `;

  let code = '';

  if (isReact) {
    code = `${imports}\n\n${registerPlugin}\n\nexport function AcousticChamber() {\n  const containerRef = useRef(null);\n  useGSAP(() => {\n${logic}\n  }, { scope: containerRef });\n\n  return (\n    <div ref={containerRef} className="acoustic-chamber">\n      <div className="amplitude-bar" />\n      <div className="amplitude-bar" />\n    </div>\n  );\n}`;
  } else if (isVue) {
    code = `${imports}\n\n${registerPlugin}\n\nexport default {\n  setup() {\n    const containerRef = ref(null);\n    let ctx;\n    onMounted(() => {\n      ctx = gsap.context(() => {\n${logic}\n      }, containerRef.value);\n    });\n    onUnmounted(() => {\n      if (ctx) ctx.revert();\n    });\n    return { containerRef };\n  }\n};`;
  } else if (isSvelte) {
    code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n  ctx = gsap.context(() => {\n${logic}\n  }, containerRef);\n});\n\nonDestroy(() => {\n  if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="acoustic-chamber">\n  <div class="amplitude-bar"></div>\n  <div class="amplitude-bar"></div>\n</div>`;
  } else {
    code = `${imports}\n\n${registerPlugin}\n\nexport function initAcousticChamber(element) {\n  const ctx = gsap.context(() => {\n${logic}\n  }, element);\n  return () => ctx.revert();\n}`;
  }

  const css = `
    .acoustic-chamber {
      background-color: var(--ng-ground-primary);
      color: var(--ng-ink-primary);
      font-family: 'Work Sans', sans-serif;
    }
  `;

  return {
    id: "acoustic-anechoic-chamber",
    framework,
    code,
    css
  };
}
