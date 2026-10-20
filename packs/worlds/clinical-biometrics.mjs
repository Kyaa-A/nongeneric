export const CLINICAL_BIOMETRICS_PACK = {
  id: "clinical-biometrics",
  title: "High-Acuity Clinical Biometrics & Diagnostic World",
  category: "worlds",
  typography: {
    display: "Atkinson Hyperlegible",
    body: "Work Sans",
    mono: "IBM Plex Mono"
  },
  tokens: {
    background: "oklch(0.12 0.01 250)",
    surface: "oklch(0.18 0.02 250)",
    textPrimary: "oklch(0.95 0.01 250)",
    textSecondary: "oklch(0.70 0.02 250)",
    accentVitals: "oklch(0.65 0.20 25)",
    accentTelemetry: "oklch(0.75 0.15 180)",
    accentAlert: "oklch(0.55 0.22 30)"
  },
  gsapRecipe: "High-frequency precision ticker, data-driven easing (power1.out), and low-latency state changes. No bouncy effects or transition-all."
};

export function generateClinicalBiometricsBlueprint({ framework = "react" } = {}) {
  const code = `
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ClinicalBiometricsChart() {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".telemetry-node", {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%"
          }
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(".telemetry-node", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="clinical-container">
      <div className="telemetry-node">Data Pt 1</div>
      <div className="telemetry-node">Data Pt 2</div>
    </div>
  );
}
`.trim();

  const css = `
:root {
  --ng-bg: oklch(0.12 0.01 250);
  --ng-surface: oklch(0.18 0.02 250);
  --ng-text-primary: oklch(0.95 0.01 250);
  --ng-text-secondary: oklch(0.70 0.02 250);
  --ng-accent-vitals: oklch(0.65 0.20 25);
  --ng-accent-telemetry: oklch(0.75 0.15 180);
  --ng-accent-alert: oklch(0.55 0.22 30);
  --ng-font-display: "Atkinson Hyperlegible", sans-serif;
  --ng-font-body: "Work Sans", sans-serif;
  --ng-font-mono: "IBM Plex Mono", monospace;
}
  `.trim();

  return {
    id: "clinical-biometrics",
    framework,
    code,
    css
  };
}
