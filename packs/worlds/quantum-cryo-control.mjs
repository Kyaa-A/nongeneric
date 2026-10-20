export const QUANTUM_CRYO_CONTROL_PACK = {
  id: "quantum-cryo-control",
  title: "Cryogenic Qubit Dilution & Pulse Sequencer World",
  category: "worlds",
  typography: {
    display: "Chakra Petch",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    groundPrimary: "oklch(0.15 0.02 240)",
    groundElevated: "oklch(0.20 0.02 240)",
    inkPrimary: "oklch(0.95 0.02 240)",
    inkSecondary: "oklch(0.70 0.02 240)",
    accentCyan: "oklch(0.85 0.15 190)",
    accentMagenta: "oklch(0.70 0.20 330)",
    borderHairline: "oklch(0.30 0.02 240)"
  },
  gsapRecipe: "Text scramble and targeted quickTo gauges."
};

export function generateQuantumCryoControlBlueprint({ framework = "react" } = {}) {
  const css = `
:root {
  --color-ground-primary: oklch(0.15 0.02 240);
  --color-ground-elevated: oklch(0.20 0.02 240);
  --color-ink-primary: oklch(0.95 0.02 240);
  --color-ink-secondary: oklch(0.70 0.02 240);
  --color-accent-cyan: oklch(0.85 0.15 190);
  --color-accent-magenta: oklch(0.70 0.20 330);
  --color-border-hairline: oklch(0.30 0.02 240);

  --font-display: "Chakra Petch", sans-serif;
  --font-body: "Work Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
`.trim();

  let code = '';

  if (framework === 'react') {
    code = `
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

gsap.registerPlugin(); // Add plugins here if necessary

export function QuantumCryoControl() {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Animation logic here
        gsap.to(".cryo-element", {
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".cryo-element", { opacity: 1 });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="quantum-cryo-control">
      <div className="cryo-element" style={{ opacity: 0 }}>
        Quantum Sequencer Initialized
      </div>
    </div>
  );
}
`.trim();
  } else if (framework === 'vue') {
    code = `
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';

gsap.registerPlugin();

export default {
  setup() {
    const container = ref(null);
    let ctx;

    onMounted(() => {
      ctx = gsap.context(() => {
        let mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.to(".cryo-element", {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
          });
        });
        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(".cryo-element", { opacity: 1 });
        });
      }, container.value);
    });

    onUnmounted(() => {
      ctx && ctx.revert();
    });

    return { container };
  }
}
`.trim();
  } else if (framework === 'svelte') {
    code = `
import { onMount } from 'svelte';
import gsap from 'gsap';

gsap.registerPlugin();

let container;

onMount(() => {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".cryo-element", {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".cryo-element", { opacity: 1 });
    });
  }, container);

  return () => ctx.revert();
});
`.trim();
  } else {
    code = `
import gsap from 'gsap';

gsap.registerPlugin();

export function initQuantumCryoControl(element) {
  let ctx = gsap.context(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".cryo-element", {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".cryo-element", { opacity: 1 });
    });
  }, element);
  return () => ctx.revert();
}
`.trim();
  }

  return {
    id: "quantum-cryo-control",
    framework,
    code,
    css
  };
}
