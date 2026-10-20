export const CUSTOMEASE_MECHANICAL_DETENT_PACK = {
  id: "customease-mechanical-detent",
  title: "GSAP CustomEase Tactile Mechanical Detent & Spring Curves",
  category: "motion",
  typography: {
    display: "Rajdhani",
    body: "Work Sans",
    mono: "IBM Plex Mono"
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
    plugin: "CustomEase",
    reducedMotionGate: "gsap.matchMedia()",
    compositorPropsOnly: ["x", "y", "yPercent", "rotation", "autoAlpha"]
  }
};

export function generateCustomeaseMechanicalDetentBlueprint({ framework = "react" } = {}) {
  const css = `:root {
  --surface: oklch(14% 0.014 255);
  --ink: oklch(95% 0.01 90);
  --accent: oklch(74% 0.16 70);
  --font-display: "Rajdhani", serif;
  --font-body: "Work Sans", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
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
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

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
        CustomEase.create("detent", "M0,0 C0.14,0 0.24,1.06 0.44,1.02 0.62,0.98 0.78,1 1,1");
      gsap.to(".detent-dial", { rotation: 90, duration: 0.55, ease: "detent", overwrite: "auto" });
      }
    );
  }, rootEl);

  return () => ctx.revert();
}
`;

  const reactCode = `import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, CustomEase);

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
          CustomEase.create("detent", "M0,0 C0.14,0 0.24,1.06 0.44,1.02 0.62,0.98 0.78,1 1,1");
      gsap.to(".detent-dial", { rotation: 90, duration: 0.55, ease: "detent", overwrite: "auto" });
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="stage-shell">
      <div className="stage-item detent-dial ledger-row spec-drawer dock-item tabular-readout manuscript-clause marginalia-note">
        GSAP CustomEase Tactile Mechanical Detent & Spring Curves
      </div>
    </section>
  );
}
`;

  const vueCode = `import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

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
            CustomEase.create("detent", "M0,0 C0.14,0 0.24,1.06 0.44,1.02 0.62,0.98 0.78,1 1,1");
      gsap.to(".detent-dial", { rotation: 90, duration: 0.55, ease: "detent", overwrite: "auto" });
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
  import { CustomEase } from "gsap/CustomEase";

  gsap.registerPlugin(CustomEase);

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
          CustomEase.create("detent", "M0,0 C0.14,0 0.24,1.06 0.44,1.02 0.62,0.98 0.78,1 1,1");
      gsap.to(".detent-dial", { rotation: 90, duration: 0.55, ease: "detent", overwrite: "auto" });
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
    GSAP CustomEase Tactile Mechanical Detent & Spring Curves
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
    id: "customease-mechanical-detent",
    framework,
    plugins: ["CustomEase"],
    code: map[framework] || reactCode,
    css
  };
}
