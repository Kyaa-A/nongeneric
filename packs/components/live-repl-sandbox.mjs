export const LIVE_REPL_SANDBOX_PACK = {
  id: "live-repl-sandbox",
  title: "Interactive Code & Token REPL Sandbox Stage",
  category: "components",
  typography: {
    display: "Chakra Petch",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.15 0.02 240)",
    surface: "oklch(0.25 0.03 240)",
    text: "oklch(0.95 0.01 240)",
    accent: "oklch(0.65 0.15 240)"
  },
  gsapRecipe: "ScrollTrigger + context/useGSAP"
};

export function generateLiveReplSandboxBlueprint({ framework = "react" } = {}) {
  let code = '';

  if (framework === 'react') {
    code = `import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LiveReplSandbox() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(container.current,
        { opacity: 0, yPercent: 10 },
        { opacity: 1, yPercent: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: container.current, start: "top center" } }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="repl-sandbox">
      <h2>REPL Sandbox</h2>
    </div>
  );
}`;
  } else if (framework === 'vue') {
    code = `import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  setup() {
    const container = ref(null);
    let ctx;

    onMounted(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(container.value,
            { opacity: 0, yPercent: 10 },
            { opacity: 1, yPercent: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: container.value, start: "top center" } }
          );
        });
      }, container.value);
    });

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return { container };
  }
}`;
  } else if (framework === 'svelte') {
    code = `import { onMount } from 'svelte';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let container;

onMount(() => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(container,
        { opacity: 0, yPercent: 10 },
        { opacity: 1, yPercent: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: container, start: "top center" } }
      );
    });
  }, container);

  return () => ctx.revert();
});
`;
  } else {
    code = `import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLiveReplSandbox(element) {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(element,
        { opacity: 0, yPercent: 10 },
        { opacity: 1, yPercent: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: element, start: "top center" } }
      );
    });
  }, element);
  return () => ctx.revert();
}`;
  }

  return {
    id: "live-repl-sandbox",
    framework,
    code,
    css: `.repl-sandbox { min-height: 100dvh; min-width: 0; }`
  };
}
