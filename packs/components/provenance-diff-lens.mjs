export const PROVENANCE_DIFF_LENS_PACK = {
  id: "provenance-diff-lens",
  title: "Inline Provenance Diff Lens & Citation Verifier",
  category: "components",
  typography: {
    display: "Newsreader",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(98% 0.01 200)",
    surface: "oklch(96% 0.02 200)",
    text: "oklch(20% 0.01 200)",
    diffAddText: "oklch(40% 0.1 140)",
    diffAddBg: "oklch(94% 0.04 140)",
    diffRemoveText: "oklch(40% 0.1 20)",
    diffRemoveBg: "oklch(94% 0.04 20)",
    lensBorder: "oklch(85% 0.02 200)"
  },
  gsapRecipe: {
    plugins: ["ScrollTrigger"],
    triggerConfig: {
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  }
};

export function generateProvenanceDiffLensBlueprint({ framework = "react" } = {}) {
  let targetElement = "";
  let containerRef = "";

  if (framework === "vanilla") {
    targetElement = "element";
    containerRef = "element";
  } else if (framework === "react") {
    targetElement = "container.current";
    containerRef = "container.current";
  } else if (framework === "vue") {
    targetElement = "container.value";
    containerRef = "container.value";
  } else if (framework === "svelte") {
    targetElement = "container";
    containerRef = "container";
  }

  const code = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProvenanceDiffLens(${framework !== 'vanilla' ? 'container' : 'element'}) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // using gsap.context to be cleanup-safe
    const ctx = gsap.context(() => {
      const lenses = gsap.utils.toArray('.diff-lens');

      lenses.forEach(lens => {
        gsap.fromTo(lens,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: lens,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Pointer move interactions with quickTo
      const xTo = gsap.quickTo('.diff-lens-cursor', 'x', { duration: 0.2, ease: 'power3' });
      const yTo = gsap.quickTo('.diff-lens-cursor', 'y', { duration: 0.2, ease: 'power3' });

      const handlePointerMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener('pointermove', handlePointerMove);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }, ${targetElement});

    return () => ctx.revert();
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    const ctx = gsap.context(() => {
      gsap.set('.diff-lens', { autoAlpha: 1, y: 0 });
    }, ${targetElement});

    return () => ctx.revert();
  });
}
`;

  const css = `
.provenance-container {
  font-family: "Work Sans", sans-serif;
  color: oklch(20% 0.01 200);
  background-color: oklch(98% 0.01 200);
  padding: 32px;
  min-height: 100dvh;
  min-width: 0;
}

.diff-lens {
  font-family: "JetBrains Mono", monospace;
  background-color: oklch(96% 0.02 200);
  border: 1px solid oklch(85% 0.02 200);
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  overflow-x: auto;
}

.diff-add {
  color: oklch(40% 0.1 140);
  background-color: oklch(94% 0.04 140);
  display: block;
  padding: 4px 8px;
}

.diff-remove {
  color: oklch(40% 0.1 20);
  background-color: oklch(94% 0.04 20);
  display: block;
  padding: 4px 8px;
}

.citation-btn {
  font-family: "Work Sans", sans-serif;
  min-height: 44px;
  min-width: 44px;
  padding: 8px 16px;
  background: oklch(20% 0.01 200);
  color: oklch(98% 0.01 200);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
}

.diff-lens-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: oklch(60% 0.1 200 / 0.5);
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .diff-lens {
    transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  .diff-lens-cursor {
    display: none !important;
  }
}
`;

  return {
    id: "provenance-diff-lens",
    framework,
    code,
    css
  };
}
