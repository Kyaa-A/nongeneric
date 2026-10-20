export const SCROLLTRIGGER_MARGINALIA_SYNC_PACK = {
  id: "scrolltrigger-marginalia-sync",
  title: "GSAP ScrollTrigger Active Paragraph-to-Margin Pin Sync",
  category: "motion",
  typography: {
    display: "Shippori Mincho",
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
    plugin: "ScrollTrigger",
    reducedMotionGate: "gsap.matchMedia()",
    compositorPropsOnly: ["x", "y", "yPercent", "rotation", "autoAlpha"]
  }
};

export function generateScrolltriggerMarginaliaSyncBlueprint({ framework = "react" } = {}) {
  const css = `:root {
  --surface: oklch(14% 0.014 255);
  --ink: oklch(95% 0.01 90);
  --accent: oklch(74% 0.16 70);
  --font-display: "Shippori Mincho", serif;
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
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        ScrollTrigger.create({
        trigger: ".manuscript-clause",
        start: "top 65%",
        end: "bottom 35%",
        onToggle: (self) => gsap.to(".marginalia-note", { autoAlpha: self.isActive ? 1 : 0.35, y: self.isActive ? 0 : 6, duration: 0.35, ease: "power2.out", overwrite: "auto" })
      });
      }
    );
  }, rootEl);

  return () => ctx.revert();
}
`;

  const reactCode = `import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
          ScrollTrigger.create({
        trigger: ".manuscript-clause",
        start: "top 65%",
        end: "bottom 35%",
        onToggle: (self) => gsap.to(".marginalia-note", { autoAlpha: self.isActive ? 1 : 0.35, y: self.isActive ? 0 : 6, duration: 0.35, ease: "power2.out", overwrite: "auto" })
      });
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="stage-shell">
      <div className="stage-item detent-dial ledger-row spec-drawer dock-item tabular-readout manuscript-clause marginalia-note">
        GSAP ScrollTrigger Active Paragraph-to-Margin Pin Sync
      </div>
    </section>
  );
}
`;

  const vueCode = `import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
            ScrollTrigger.create({
        trigger: ".manuscript-clause",
        start: "top 65%",
        end: "bottom 35%",
        onToggle: (self) => gsap.to(".marginalia-note", { autoAlpha: self.isActive ? 1 : 0.35, y: self.isActive ? 0 : 6, duration: 0.35, ease: "power2.out", overwrite: "auto" })
      });
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
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

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
          ScrollTrigger.create({
        trigger: ".manuscript-clause",
        start: "top 65%",
        end: "bottom 35%",
        onToggle: (self) => gsap.to(".marginalia-note", { autoAlpha: self.isActive ? 1 : 0.35, y: self.isActive ? 0 : 6, duration: 0.35, ease: "power2.out", overwrite: "auto" })
      });
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
    GSAP ScrollTrigger Active Paragraph-to-Margin Pin Sync
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
    id: "scrolltrigger-marginalia-sync",
    framework,
    plugins: ["ScrollTrigger"],
    code: map[framework] || reactCode,
    css
  };
}
