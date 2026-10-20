export const SEISMOGRAPHIC_EARTH_LAB_PACK = {
  id: "seismographic-earth-lab",
  title: "Geophysical Seismograph & Subsurface Stratum World",
  category: "worlds",
  typography: { display: "Barlow Condensed", body: "Work Sans", mono: "IBM Plex Mono" },
  tokens: {
    stratum: "oklch(0.2 0.05 40)",
    mantle: "oklch(0.3 0.1 35)",
    core: "oklch(0.5 0.2 30)",
    seismograph: "oklch(0.9 0.05 200)",
  },
  gsapRecipe: "gsap.to('.seismograph-line', { x: 100, duration: 1, ease: 'power1.inOut' })"
};

export function generateSeismographicEarthLabBlueprint({ framework = "react" } = {}) {
  let target = "element";
  if (framework === "react") target = "container.current";
  if (framework === "vue") target = "container.value";
  if (framework === "svelte") target = "container";

  const code = `
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSeismograph(${framework === 'vanilla' ? 'element' : 'container'}) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // safe cleanup container
    let ctx = gsap.context(() => {
      gsap.to('.seismograph-line', {
        xPercent: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.seismograph-container',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });
    }, ${target});

    return () => ctx.revert(); // cleanup
  });
}
  `.trim();

  const css = `
:root {
  --ng-stratum: oklch(0.2 0.05 40);
  --ng-mantle: oklch(0.3 0.1 35);
  --ng-core: oklch(0.5 0.2 30);
  --ng-seismograph: oklch(0.9 0.05 200);
  --ng-font-display: 'Barlow Condensed', sans-serif;
  --ng-font-body: 'Work Sans', sans-serif;
  --ng-font-mono: 'IBM Plex Mono', monospace;
}
  `.trim();

  return {
    id: "seismographic-earth-lab",
    framework,
    code,
    css
  };
}
