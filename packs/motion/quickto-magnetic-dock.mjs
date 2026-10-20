export const QUICKTO_MAGNETIC_DOCK_PACK = {
  id: "quickto-magnetic-dock",
  title: "GSAP quickTo Proximity-Scaled Tool Dock",
  category: "motion",
  typography: {
    display: "Barlow Condensed",
    body: "Work Sans",
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
    plugin: "Observer",
    reducedMotionGate: "gsap.matchMedia()",
    compositorPropsOnly: ["x", "y", "yPercent", "rotation", "autoAlpha"]
  }
};

export function generateQuicktoMagneticDockBlueprint({ framework = "react" } = {}) {
  const css = `:root {
  --surface: oklch(14% 0.014 255);
  --ink: oklch(95% 0.01 90);
  --accent: oklch(74% 0.16 70);
  --font-display: "Barlow Condensed", serif;
  --font-body: "Work Sans", sans-serif;
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
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

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
        const xTo = gsap.quickTo(".dock-item", "x", { duration: 0.25, ease: "power3.out" });
      const yTo = gsap.quickTo(".dock-item", "y", { duration: 0.25, ease: "power3.out" });
      xTo(0);
      yTo(0);
      }
    );
  }, rootEl);

  return () => ctx.revert();
}
`;

  const reactCode = `import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(useGSAP, Observer);

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
          const xTo = gsap.quickTo(".dock-item", "x", { duration: 0.25, ease: "power3.out" });
      const yTo = gsap.quickTo(".dock-item", "y", { duration: 0.25, ease: "power3.out" });
      xTo(0);
      yTo(0);
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="stage-shell">
      <div className="stage-item detent-dial ledger-row spec-drawer dock-item tabular-readout manuscript-clause marginalia-note">
        GSAP quickTo Proximity-Scaled Tool Dock
      </div>
    </section>
  );
}
`;

  const vueCode = `import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

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
            const xTo = gsap.quickTo(".dock-item", "x", { duration: 0.25, ease: "power3.out" });
      const yTo = gsap.quickTo(".dock-item", "y", { duration: 0.25, ease: "power3.out" });
      xTo(0);
      yTo(0);
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
  import { Observer } from "gsap/Observer";

  gsap.registerPlugin(Observer);

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
          const xTo = gsap.quickTo(".dock-item", "x", { duration: 0.25, ease: "power3.out" });
      const yTo = gsap.quickTo(".dock-item", "y", { duration: 0.25, ease: "power3.out" });
      xTo(0);
      yTo(0);
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
    GSAP quickTo Proximity-Scaled Tool Dock
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
    id: "quickto-magnetic-dock",
    framework,
    plugins: ["Observer"],
    code: map[framework] || reactCode,
    css
  };
}
