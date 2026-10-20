export const QUICKTO_CURSOR_SPOTLIGHT_PACK = {
    id: "quickto-cursor-spotlight",
    title: "GSAP quickTo 60fps Specular Surface Spotlight & Reticle",
    category: "motion",
    typography: {
        display: "Rajdhani",
        body: "Atkinson Hyperlegible",
        mono: "JetBrains Mono"
    },
    tokens: {
        background: "oklch(0.15 0 0)",
        surface: "oklch(0.20 0 0)",
        accent: "oklch(0.85 0.15 120)",
        text: "oklch(0.95 0 0)"
    },
    gsapRecipe: "gsap.quickTo() pointer tracking + matchMedia() fallback"
};

export function generateQuicktoCursorSpotlightBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";

    let code = '';
    const plugins = [];

    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\n\ngsap.registerPlugin(useGSAP);` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';` :
                    `import gsap from 'gsap';`;

    const getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let motionLogic = `
        const mm = gsap.matchMedia();
        const containerElement = ${getContainerStr};

        if (containerElement) {
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const reticle = containerElement.querySelector('.cursor-reticle');
                const spotlight = containerElement.querySelector('.cursor-spotlight');

                if (!reticle || !spotlight) return;

                // Set initial states
                gsap.set(reticle, { xPercent: -50, yPercent: -50 });
                gsap.set(spotlight, { xPercent: -50, yPercent: -50 });

                // Create quickTo instances for 60fps raw pointer tracking
                const xReticle = gsap.quickTo(reticle, "x", { duration: 0.1, ease: "power3" });
                const yReticle = gsap.quickTo(reticle, "y", { duration: 0.1, ease: "power3" });

                const xSpotlight = gsap.quickTo(spotlight, "x", { duration: 0.4, ease: "power3" });
                const ySpotlight = gsap.quickTo(spotlight, "y", { duration: 0.4, ease: "power3" });

                const onPointerMove = (e) => {
                    const rect = containerElement.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    xReticle(x);
                    yReticle(y);
                    xSpotlight(x);
                    ySpotlight(y);
                };

                const onPointerEnter = () => {
                    gsap.to([reticle, spotlight], { opacity: 1, duration: 0.3 });
                };

                const onPointerLeave = () => {
                    gsap.to([reticle, spotlight], { opacity: 0, duration: 0.3 });
                };

                containerElement.addEventListener('pointermove', onPointerMove);
                containerElement.addEventListener('pointerenter', onPointerEnter);
                containerElement.addEventListener('pointerleave', onPointerLeave);

                return () => {
                    containerElement.removeEventListener('pointermove', onPointerMove);
                    containerElement.removeEventListener('pointerenter', onPointerEnter);
                    containerElement.removeEventListener('pointerleave', onPointerLeave);
                };
            });

            mm.add("(prefers-reduced-motion: reduce)", () => {
                // Completely disable cursor tracking for reduced motion
                const reticle = containerElement.querySelector('.cursor-reticle');
                const spotlight = containerElement.querySelector('.cursor-spotlight');
                if (reticle) gsap.set(reticle, { display: 'none' });
                if (spotlight) gsap.set(spotlight, { display: 'none' });
                return () => {};
            });
        }
    `;

    if (isReact) {
        code = `${imports}\n\nexport function QuicktoCursorSpotlight() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${motionLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="spotlight-container">\n            <div className="cursor-spotlight" aria-hidden="true"></div>\n            <div className="cursor-reticle" aria-hidden="true"></div>\n            <div className="content">Interactive Content</div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n<template>\n    <div ref="containerRef" class="spotlight-container">\n        <div class="cursor-spotlight" aria-hidden="true"></div>\n        <div class="cursor-reticle" aria-hidden="true"></div>\n        <div class="content">Interactive Content</div>\n    </div>\n</template>\n\n<script>\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${motionLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};\n</script>`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${motionLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="spotlight-container">\n    <div class="cursor-spotlight" aria-hidden="true"></div>\n    <div class="cursor-reticle" aria-hidden="true"></div>\n    <div class="content">Interactive Content</div>\n</div>`;
    } else {
        code = `${imports}\n\nexport function initQuicktoCursorSpotlight(container) {\n    const ctx = gsap.context(() => {\n${motionLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    const css = `
.spotlight-container {
    position: relative;
    overflow: hidden;
    /* other layout styles */
}
.cursor-spotlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
    opacity: 0;
    z-index: 10;
}
.cursor-reticle {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    z-index: 11;
}
    `.trim();

    return {
        id: "quickto-cursor-spotlight",
        framework,
        plugins,
        code,
        css
    };
}
