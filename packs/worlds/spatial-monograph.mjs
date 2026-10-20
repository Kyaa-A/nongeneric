export const SPATIAL_MONOGRAPH_PACK = {
  id: "spatial-monograph",
  title: "Architectural Monograph & Spatial Practice World",
  category: "worlds",
  typography: {
    display: "Cormorant Garamond",
    body: "Work Sans",
    mono: "IBM Plex Mono",
  },
  tokens: {
    surface: "oklch(0.96 0.01 85)",
    ink: "oklch(0.18 0.02 60)",
    accent: "oklch(0.52 0.15 45)",
    muted: "oklch(0.85 0.01 80)"
  },
  gsapRecipe: "gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => { gsap.from('.element', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }) })"
};

export function generateSpatialMonographBlueprint({ framework = "react" } = {}) {
  let targetElement = 'container';
  if (framework === 'react') targetElement = 'container.current';
  else if (framework === 'vue') targetElement = 'container.value';
  else if (framework === 'svelte') targetElement = 'container';

  let code = '';

  if (framework === 'react') {
    code = `import { useRef } from 'react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\nimport { useGSAP } from '@gsap/react';\n\ngsap.registerPlugin(ScrollTrigger);\n\nexport default function SpatialMonograph() {\n  const container = useRef(null);\n\n  useGSAP(() => {\n    const mm = gsap.matchMedia();\n    mm.add('(prefers-reduced-motion: no-preference)', () => {\n      gsap.from('.mono-element', {\n        y: 30,\n        opacity: 0,\n        duration: 1.2,\n        ease: 'power3.out',\n        scrollTrigger: {\n          trigger: container.current,\n          start: 'top 80%',\n        }\n      });\n    });\n    return () => mm.revert();\n  }, { scope: container });\n\n  return (\n    <div ref={container} className="spatial-monograph" aria-label="Architectural Monograph">\n      <h1 className="mono-element">Spatial Practice</h1>\n    </div>\n  );\n}`;
  } else {
    code = `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\nexport function initSpatialMonograph(container) {\n  let ctx = gsap.context(() => {\n    const mm = gsap.matchMedia();\n    mm.add('(prefers-reduced-motion: no-preference)', () => {\n      gsap.from('.mono-element', {\n        y: 30,\n        opacity: 0,\n        duration: 1.2,\n        ease: 'power3.out',\n        scrollTrigger: {\n          trigger: ${targetElement},\n          start: 'top 80%',\n        }\n      });\n    });\n  }, container);\n  return () => ctx.revert();\n}`;
  }

  const css = `
:root {
  --ng-surface: oklch(0.96 0.01 85);
  --ng-ink: oklch(0.18 0.02 60);
  --ng-accent: oklch(0.52 0.15 45);
  --ng-muted: oklch(0.85 0.01 80);
  --ng-font-display: "Cormorant Garamond", serif;
  --ng-font-body: "Work Sans", sans-serif;
  --ng-font-mono: "IBM Plex Mono", monospace;
}
.spatial-monograph {
  background-color: var(--ng-surface);
  color: var(--ng-ink);
  font-family: var(--ng-font-body);
  min-height: 100dvh;
  min-width: 0;
}
.mono-element {
  font-family: var(--ng-font-display);
}
@media (prefers-reduced-motion: reduce) {
  .mono-element {
    transition: none !important;
    animation: none !important;
  }
}
  `.trim();

  return { id: "spatial-monograph", framework, code, css };
}
