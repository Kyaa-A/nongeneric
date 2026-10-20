export const SPLITTEXT_EDITORIAL_CURTAIN_PACK = {
    id: "splittext-editorial-curtain",
    title: "GSAP SplitText Masked Editorial Curtain & Line Stagger",
    category: "motion",
    typography: {
        display: "Cormorant Garamond",
        body: "Work Sans",
        mono: "IBM Plex Mono"
    },
    tokens: {
        surface: "oklch(0.98 0.01 90)",
        text: "oklch(0.20 0.02 260)",
        accent: "oklch(0.60 0.15 40)"
    },
    gsapRecipe: "SplitText lines + yPercent stagger with overflow hidden masking"
};

export function generateSplittextEditorialCurtainBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";
    const isVanilla = framework === "vanilla";

    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { SplitText } from 'gsap/SplitText';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { SplitText } from 'gsap/SplitText';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { SplitText } from 'gsap/SplitText';` :
                    `import gsap from 'gsap';\nimport { SplitText } from 'gsap/SplitText';`;

    const registerPlugin = `gsap.registerPlugin(SplitText);`;
    const getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let code = '';

    const animationLogic = `
        const container = ${getContainerStr};
        if (!container) return;

        const target = container.querySelector('.split-target');
        if (!target) return;

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const split = new SplitText(target, { type: "lines" });
            const splitInner = new SplitText(split.lines, { type: "lines" });

            // Setup masked curtain effect
            gsap.set(split.lines, { overflow: "hidden" });
            gsap.set(splitInner.lines, { yPercent: 100 });

            gsap.to(splitInner.lines, {
                yPercent: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                onComplete: () => {
                    splitInner.revert();
                    split.revert();
                }
            });

            return () => {
                splitInner.revert();
                split.revert();
            };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            // Safe fallback for reduced motion: simple fade
            gsap.fromTo(target,
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        });
    `;

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function SplittextEditorialCurtain() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${animationLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="curtain-container">\n            <h2 className="split-target" style={{ fontFamily: 'Cormorant Garamond, serif' }}>\n                Editorial typography meets precise motion control.\n            </h2>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${animationLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${animationLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="curtain-container">\n    <h2 class="split-target" style="font-family: 'Cormorant Garamond', serif;">\n        Editorial typography meets precise motion control.\n    </h2>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initSplittextEditorialCurtain(container) {\n    const ctx = gsap.context(() => {\n${animationLogic}\n    }, container);\n    \n    return () => ctx.revert();\n}`;
    }

    return {
        id: "splittext-editorial-curtain",
        framework,
        code,
        css: ".curtain-container { min-width: 0; }"
    };
}
