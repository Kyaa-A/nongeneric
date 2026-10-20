export const MARITIME_AIS_RADAR_PACK = {
  id: "maritime-ais-radar",
  title: "Maritime Vessel Traffic & AIS Radar Plotting World",
  category: "worlds",
  typography: {
    display: "Rajdhani",
    body: "Atkinson Hyperlegible",
    mono: "IBM Plex Mono"
  },
  tokens: {
    radarSurface: "oklch(0.12 0.01 250)",
    gridLine: "oklch(0.3 0.05 250)",
    shipVessel: "oklch(0.85 0.15 150)",
    alertZone: "oklch(0.6 0.2 25)",
    textPrimary: "oklch(0.95 0.02 250)",
    textSecondary: "oklch(0.7 0.05 250)"
  },
  gsapRecipe: "DrawSVG radar sweeps and quickTo() target positioning"
};

export function generateMaritimeAisRadarBlueprint({ framework = "react" } = {}) {
  let code = '';

  if (framework === "react") {
    code = `import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function MaritimeRadar() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Complex sweep animation
      gsap.to(".radar-sweep", {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Instant fallback or minimal motion
      gsap.set(".radar-sweep", { opacity: 0.5 });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className="radar-container">
      <div className="radar-sweep" aria-hidden="true" />
      <div className="vessel-target" />
    </div>
  );
}`;
  } else if (framework === "vanilla") {
    code = `import gsap from 'gsap';

gsap.registerPlugin(); // Add necessary plugins here if extending

export function initMaritimeRadar(element) {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".radar-sweep", {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".radar-sweep", { opacity: 0.5 });
    });
  }, element);

  return () => ctx.revert();
}`;
  } else if (framework === "vue") {
    code = `import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';

gsap.registerPlugin();

export function useMaritimeRadar() {
  const container = ref(null);
  let ctx;

  onMounted(() => {
    if (!container.value) return;

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".radar-sweep", {
          rotation: 360,
          duration: 4,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center"
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".radar-sweep", { opacity: 0.5 });
      });
    }, container.value);
  });

  onUnmounted(() => {
    ctx && ctx.revert();
  });

  return { container };
}`;
  } else if (framework === "svelte") {
    code = `
import gsap from 'gsap';

gsap.registerPlugin();

export function maritimeRadar(container) {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".radar-sweep", {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".radar-sweep", { opacity: 0.5 });
    });
  }, container);

  return {
    destroy() {
      ctx.revert();
    }
  };
}`;
  }

  const css = `
.radar-container {
  background: var(--radar-surface, oklch(0.12 0.01 250));
  border: 1px solid var(--grid-line, oklch(0.3 0.05 250));
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
.radar-sweep {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: conic-gradient(from 0deg, transparent 70%, rgba(133, 224, 150, 0.2) 100%);
}
.vessel-target {
  position: absolute;
  width: 8px; height: 8px;
  background: var(--ship-vessel, oklch(0.85 0.15 150));
  border-radius: 50%;
}
  `.trim();

  return {
    id: "maritime-ais-radar",
    framework,
    code,
    css
  };
}
