export const SVG_SCHEMATIC_BLUEPRINT_TRACE_PACK = {
  id: "svg-schematic-blueprint-trace",
  title: "GSAP SVG Technical Callout & Isometric Wireframe Trace",
  category: "motion",
  typography: {
    display: "Barlow Condensed",
    body: "Atkinson Hyperlegible",
    mono: "IBM Plex Mono"
  },
  tokens: {
    surface: "oklch(0.20 0.01 250)",
    text: "oklch(0.95 0.01 250)",
    accent: "oklch(0.70 0.16 150)"
  },
  gsapRecipe: "DrawSVGPlugin + ScrollTrigger"
};

export function generateSvgSchematicBlueprintTraceBlueprint({ framework = "react" } = {}) {
  const css = `
.wireframe-container {
  min-height: 100dvh;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: oklch(0.20 0.01 250);
}
.wireframe-path {
  stroke: oklch(0.70 0.16 150);
  stroke-width: 2;
  fill: none;
  vector-effect: non-scaling-stroke;
}
  `.trim();

  const getCommonSetup = () => {
    return `import { gsap } from "gsap";\nimport { DrawSVGPlugin } from "gsap/DrawSVGPlugin";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\n\ngsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);`;
  };

  const motionCode = `
      gsap.from(".wireframe-path", {
        drawSVG: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".wireframe-container",
          start: "top 80%",
        }
      });
  `.trim();

  const reducedMotionCode = `
      // Instant state for reduced motion
      gsap.set(".wireframe-path", { drawSVG: "100%" });
  `.trim();

  const getMatchMediaCode = () => {
    return `
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
${motionCode}
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
${reducedMotionCode}
    });
    return () => mm.revert();
    `.trim();
  };

  let code = '';
  if (framework === 'react') {
    code = `${getCommonSetup()}
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function SchematicTraceBlueprint() {
  const container = useRef(null);

  useGSAP(() => {
${getMatchMediaCode()}
  }, { scope: container });

  return (
    <div ref={container} className="wireframe-container">
      <svg viewBox="0 0 100 100">
        <path className="wireframe-path" d="M10 10 L90 10 L90 90 L10 90 Z" />
      </svg>
    </div>
  );
}
`;
  } else if (framework === 'vue') {
    code = `${getCommonSetup()}
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const container = ref(null);
    let ctx;

    onMounted(() => {
      ctx = gsap.context(() => {
${getMatchMediaCode()}
      }, container.value);
    });

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return { container };
  }
};
`;
  } else if (framework === 'svelte') {
    code = `${getCommonSetup()}
import { onMount, onDestroy } from "svelte";

let container;
let ctx;

onMount(() => {
  ctx = gsap.context(() => {
${getMatchMediaCode()}
  }, container);
});

onDestroy(() => {
  if (ctx) ctx.revert();
});
`;
  } else {
    // vanilla
    code = `${getCommonSetup()}

export function initSchematicTrace(container) {
  const ctx = gsap.context(() => {
${getMatchMediaCode()}
  }, container);
  return () => ctx.revert();
}
`;
  }

  return {
    id: "svg-schematic-blueprint-trace",
    framework,
    code,
    css
  };
}
