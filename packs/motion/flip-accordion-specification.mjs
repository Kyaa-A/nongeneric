export const FLIP_ACCORDION_SPECIFICATION_PACK = {
  id: "flip-accordion-specification",
  title: "GSAP Flip Zero-Reflow Specification Accordion",
  category: "motion",
  typography: {
    display: "Playfair Display",
    body: "Source Serif 4",
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
    plugin: "Flip",
    reducedMotionGate: "gsap.matchMedia()",
    compositorPropsOnly: ["x", "y", "yPercent", "rotation", "autoAlpha"]
  }
};

export function generateFlipAccordionSpecificationBlueprint({ framework = "react" } = {}) {
  const css = `:root {
  --surface: oklch(14% 0.014 255);
  --ink: oklch(95% 0.01 90);
  --accent: oklch(74% 0.16 70);
  --font-display: "Playfair Display", serif;
  --font-body: "Source Serif 4", sans-serif;
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
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

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
        const state = Flip.getState(".spec-drawer");
      Flip.from(state, { duration: 0.5, ease: "power3.inOut", absolute: false });
      }
    );
  }, rootEl);

  return () => ctx.revert();
}
`;

  const reactCode = `import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(useGSAP, Flip);

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
          const state = Flip.getState(".spec-drawer");
      Flip.from(state, { duration: 0.5, ease: "power3.inOut", absolute: false });
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="stage-shell">
      <div className="stage-item detent-dial ledger-row spec-drawer dock-item tabular-readout manuscript-clause marginalia-note">
        GSAP Flip Zero-Reflow Specification Accordion
      </div>
    </section>
  );
}
`;

  const vueCode = `import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

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
            const state = Flip.getState(".spec-drawer");
      Flip.from(state, { duration: 0.5, ease: "power3.inOut", absolute: false });
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
  import { Flip } from "gsap/Flip";

  gsap.registerPlugin(Flip);

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
          const state = Flip.getState(".spec-drawer");
      Flip.from(state, { duration: 0.5, ease: "power3.inOut", absolute: false });
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
    GSAP Flip Zero-Reflow Specification Accordion
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
    id: "flip-accordion-specification",
    framework,
    plugins: ["Flip"],
    code: map[framework] || reactCode,
    css
  };
}
