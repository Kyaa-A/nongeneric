export const SPLITTEXT_TABULAR_COUNTER_PACK = {
  id: "splittext-tabular-counter",
  title: "GSAP SplitText Tabular-Nums Odometer & Delta Roll",
  category: "motion",
  typography: {
    display: "Rajdhani",
    body: "Atkinson Hyperlegible",
    mono: "JetBrains Mono"
  },
  tokens: {
    surface: "oklch(14% 0.014 255)",
    surfaceElevated: "oklch(19% 0.018 255)",
    ink: "oklch(95% 0.01 90)",
    inkMuted: "oklch(68% 0.018 255)",
    accent: "oklch(74% 0.16 70)",
    border: "oklch(28% 0.02 255)"
  },
  gsapRecipe: {
    plugin: "SplitText",
    reducedMotionGate: "gsap.matchMedia()",
    compositorPropsOnly: ["x", "y", "yPercent", "rotation", "autoAlpha"]
  }
};

export function generateSplittextTabularCounterBlueprint({ framework = "react" } = {}) {
  const css = `:root {
  --surface: oklch(14% 0.014 255);
  --ink: oklch(95% 0.01 90);
  --accent: oklch(74% 0.16 70);
  --font-display: "Rajdhani", serif;
  --font-body: "Atkinson Hyperlegible", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
.stage-shell {
  min-height: 100dvh;
  min-width: 0;
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
}`;

  const vanillaCode = `import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export function mountStage(rootEl) {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motionOk: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const { reduced } = context.conditions;
        if (reduced) {
          gsap.set(".stage-item", { autoAlpha: 1, x: 0, y: 0 });
          return;
        }
        const split = SplitText.create(".tabular-readout", { type: "chars", mask: "chars" });
      gsap.from(split.chars, { yPercent: 100, duration: 0.5, stagger: 0.03, ease: "expo.out" });
      }
    );
  }, rootEl);

  return () => ctx.revert();
}
`;

  const reactCode = `import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

export function StageChoreography() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)"
        },
        (context) => {
          const { reduced } = context.conditions;
          if (reduced) {
            gsap.set(".stage-item", { autoAlpha: 1, x: 0, y: 0 });
            return;
          }
          const split = SplitText.create(".tabular-readout", { type: "chars", mask: "chars" });
      gsap.from(split.chars, { yPercent: 100, duration: 0.5, stagger: 0.03, ease: "expo.out" });
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="stage-shell">
      <div className="stage-item detent-dial ledger-row spec-drawer dock-item tabular-readout manuscript-clause marginalia-note">
        GSAP SplitText Tabular-Nums Odometer & Delta Roll
      </div>
    </section>
  );
}
`;

  const vueCode = `import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default {
  setup() {
    const rootRef = ref(null);
    let ctx;

    onMounted(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(
          {
            motionOk: "(prefers-reduced-motion: no-preference)",
            reduced: "(prefers-reduced-motion: reduce)"
          },
          (context) => {
            const { reduced } = context.conditions;
            if (reduced) {
              gsap.set(".stage-item", { autoAlpha: 1, x: 0, y: 0 });
              return;
            }
            const split = SplitText.create(".tabular-readout", { type: "chars", mask: "chars" });
      gsap.from(split.chars, { yPercent: 100, duration: 0.5, stagger: 0.03, ease: "expo.out" });
          }
        );
      }, rootRef.value);
    });

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return { rootRef };
  }
};
`;

  const svelteCode = `<script>
  import { onMount, onDestroy } from "svelte";
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(SplitText);

  let rootEl;
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)"
        },
        (context) => {
          const { reduced } = context.conditions;
          if (reduced) {
            gsap.set(".stage-item", { autoAlpha: 1, x: 0, y: 0 });
            return;
          }
          const split = SplitText.create(".tabular-readout", { type: "chars", mask: "chars" });
      gsap.from(split.chars, { yPercent: 100, duration: 0.5, stagger: 0.03, ease: "expo.out" });
        }
      );
    }, rootEl);
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section bind:this={rootEl} class="stage-shell">
  <div class="stage-item detent-dial ledger-row spec-drawer dock-item tabular-readout manuscript-clause marginalia-note">
    GSAP SplitText Tabular-Nums Odometer & Delta Roll
  </div>
</section>
`;

  const map = {
    vanilla: vanillaCode,
    react: reactCode,
    vue: vueCode,
    svelte: svelteCode
  };

  return {
    id: "splittext-tabular-counter",
    framework,
    plugins: ["SplitText"],
    code: map[framework] || reactCode,
    css
  };
}
