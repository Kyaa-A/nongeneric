export const COMPILER_OBSERVATORY_PACK = {
  id: "compiler-observatory",
  title: "Compiler AST & Distributed Trace Observatory World",
  category: "worlds",
  typography: {
    display: "Chakra Petch",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.1 0 0)",
    surface: "oklch(0.2 0 0)",
    primaryText: "oklch(0.9 0 0)",
    accent: "oklch(0.6 0.2 250)"
  },
  gsapRecipe: "ast-tree-reveal"
};

export function generateCompilerObservatoryBlueprint({ framework = "react" } = {}) {
  let contextWrapperOpen = '';
  let contextWrapperClose = '';
  let targetNode = '';

  if (framework === 'react') {
    contextWrapperOpen = 'useGSAP(() => {';
    contextWrapperClose = '}, { scope: container });';
    targetNode = 'container.current';
  } else if (framework === 'vue') {
    contextWrapperOpen = 'let ctx;\nonMounted(() => {\n  ctx = gsap.context(() => {';
    contextWrapperClose = '  }, container.value);\n});\nonUnmounted(() => {\n  ctx.revert();\n});';
    targetNode = 'container.value';
  } else if (framework === 'svelte') {
    contextWrapperOpen = 'let ctx;\nonMount(() => {\n  ctx = gsap.context(() => {';
    contextWrapperClose = '  }, container);\n  return () => ctx.revert();\n});';
    targetNode = 'container';
  } else {
    // vanilla
    contextWrapperOpen = 'const ctx = gsap.context(() => {';
    contextWrapperClose = '}, element);\n// cleanup: ctx.revert();';
    targetNode = 'element';
  }

  const code = `
gsap.registerPlugin(ScrollTrigger);

${contextWrapperOpen}
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.fromTo(".ast-node",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".ast-node", { y: 0, opacity: 1 });
  });
${contextWrapperClose}
`.trim();

  return {
    id: "compiler-observatory",
    framework,
    code,
    css: `
.observatory-container {
  min-height: 100dvh;
  min-width: 0;
  background-color: var(--obs-bg, oklch(0.1 0 0));
  color: var(--obs-text, oklch(0.9 0 0));
  font-family: "Work Sans", sans-serif;
}
.ast-node {
  font-family: "JetBrains Mono", monospace;
  font-variant-numeric: tabular-nums;
}
@media (prefers-reduced-motion: reduce) {
  .ast-node {
    /* No transitions */
  }
}
    `.trim()
  };
}
