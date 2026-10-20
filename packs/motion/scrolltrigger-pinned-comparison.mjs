export const SCROLLTRIGGER_PINNED_COMPARISON_PACK = {
    id: "scrolltrigger-pinned-comparison",
    title: "GSAP ScrollTrigger Pinned Before/After Lens Wipe",
    category: "motion",
    typography: {
        display: "Syne",
        body: "Work Sans",
        mono: "JetBrains Mono"
    },
    tokens: {
        background: "oklch(0.15 0.02 250)",
        foreground: "oklch(0.95 0.02 250)",
        accent: "oklch(0.7 0.15 180)"
    },
    gsapRecipe: "pinned-lens-wipe"
};

export function generateScrolltriggerPinnedComparisonBlueprint({ framework = "react" } = {}) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    let code = '';
    const plugins = ['ScrollTrigger'];

    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    const getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let motionLogic = `
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const containerEl = ${getContainerStr};
            if (!containerEl) return;

            const afterImage = containerEl.querySelector('.after-image');
            if (!afterImage) return;

            gsap.to(afterImage, {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                    trigger: containerEl,
                    start: "top top",
                    end: "+=100%",
                    pin: true,
                    scrub: true,
                    anticipatePin: 1
                }
            });
        });
    `;

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function ScrolltriggerPinnedComparison() {\n    const containerRef = useRef(null);\n\n    useGSAP(() => {\n${motionLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="comparison-container">\n            <div className="before-image">Before Content</div>\n            <div className="after-image">After Content</div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n\n        onMounted(() => {\n            ctx = gsap.context(() => {\n${motionLogic}\n            }, containerRef.value);\n        });\n\n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n\n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${motionLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="comparison-container">\n    <div class="before-image">Before Content</div>\n    <div class="after-image">After Content</div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initScrolltriggerPinnedComparison(container) {\n    const ctx = gsap.context(() => {\n${motionLogic}\n    }, container);\n\n    return () => ctx.revert();\n}`;
    }

    const css = `
.comparison-container {
    position: relative;
    width: 100%;
    min-height: 100dvh;
    overflow: hidden;
}

.before-image, .after-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.after-image {
    clip-path: inset(0% 100% 0% 0%);
}
`;

    return {
        id: "scrolltrigger-pinned-comparison",
        framework,
        plugins,
        code,
        css
    };
}
