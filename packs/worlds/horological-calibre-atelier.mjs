export const HOROLOGICAL_CALIBRE_ATELIER_PACK = {
  id: "horological-calibre-atelier",
  title: "Haute Horlogerie Calibre & Escapement Blueprint World",
  category: "worlds",
  typography: {
    display: "Cormorant Garamond",
    body: "Source Serif 4",
    mono: "IBM Plex Mono"
  },
  tokens: {
    steel: 'oklch(0.92 0.01 260)',
    brass: 'oklch(0.75 0.14 85)',
    ruby: 'oklch(0.55 0.22 15)',
    obsidian: 'oklch(0.18 0.01 260)'
  },
  gsapRecipe: "Precision gear-train rotations and strict timeline staggers mimicking a mechanical escapement ticking."
};

export function generateHorologicalCalibreAtelierBlueprint({ framework = "react" } = {}) {
  const isReact = framework === 'react';
  const isVue = framework === 'vue';
  const isSvelte = framework === 'svelte';
  const isVanilla = framework === 'vanilla';

  let code = '';

  const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                  isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                  isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                  `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

  const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

  let getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

  let logic = `
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const gears = gsap.utils.toArray('.gear');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ${getContainerStr},
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        }
      });
      tl.to(gears, {
        rotation: 360,
        stagger: 0.1,
        ease: "none",
        duration: 2
      });
      return () => { tl.kill(); };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      return () => {};
    });
  `;

  if (isReact) {
      code = `${imports}\n\n${registerPlugin}\n\nexport function HorologicalCalibre() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${logic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="calibre-container relative w-full overflow-hidden" tabIndex={0}>\n            <div className="gear">Gear 1</div>\n            <div className="gear">Gear 2</div>\n        </div>\n    );\n}`;
  } else if (isVue) {
      code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${logic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
  } else if (isSvelte) {
      code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${logic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="calibre-container relative w-full overflow-hidden" tabindex="0">\n    <div class="gear">Gear 1</div>\n    <div class="gear">Gear 2</div>\n</div>`;
  } else {
      code = `${imports}\n\n${registerPlugin}\n\nexport function initHorologicalCalibre(container) {\n    const ctx = gsap.context(() => {\n${logic}\n    }, container);\n    return () => ctx.revert();\n}`;
  }

  const css = `
:root {
  --ng-steel: oklch(0.92 0.01 260);
  --ng-brass: oklch(0.75 0.14 85);
  --ng-ruby: oklch(0.55 0.22 15);
  --ng-obsidian: oklch(0.18 0.01 260);
}
.calibre-container {
  min-height: 100dvh;
  min-width: 0;
  font-family: 'Cormorant Garamond', serif;
}
  `.trim();

  return {
    id: "horological-calibre-atelier",
    framework,
    code,
    css
  };
}
