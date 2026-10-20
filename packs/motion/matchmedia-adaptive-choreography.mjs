export const MATCHMEDIA_ADAPTIVE_CHOREOGRAPHY_PACK = {
    id: "matchmedia-adaptive-choreography",
    title: "GSAP matchMedia Desktop-to-Mobile Adaptive Motion Matrix",
    category: "motion",
    typography: { display: "Syne", body: "Work Sans", mono: "JetBrains Mono" },
    tokens: {
        background: "oklch(0.98 0.01 200)",
        foreground: "oklch(0.2 0.01 200)",
        accent: "oklch(0.6 0.15 200)"
    },
    gsapRecipe: "matchMedia"
};

export function generateMatchmediaAdaptiveChoreographyBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";
    const isVanilla = framework === "vanilla";

    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    let motionLogic = `
        const mm = gsap.matchMedia();
        const items = gsap.utils.toArray('.adaptive-item');

        mm.add({
            isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
            isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)"
        }, (context) => {
            let { isDesktop, isMobile, reduceMotion } = context.conditions;

            if (reduceMotion) {
                // Instantly set states for accessibility
                gsap.set(items, { opacity: 1, x: 0, y: 0 });
                return;
            }

            if (isDesktop) {
                // Desktop: Spatial choreography with stagger
                gsap.fromTo(items,
                    { opacity: 0, x: -50 },
                    { opacity: 1, x: 0, duration: 1, stagger: 0.1, ease: "power3.out" }
                );
            } else if (isMobile) {
                // Mobile: Simplified vertical translation
                gsap.fromTo(items,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
                );
            }

            return () => {
                // Optional cleanup per matchMedia
            };
        });
    `;

    let code = '';

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function AdaptiveChoreography() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${motionLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="adaptive-container">\n            <div className="adaptive-item">Item 1</div>\n            <div className="adaptive-item">Item 2</div>\n            <div className="adaptive-item">Item 3</div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${motionLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${motionLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="adaptive-container">\n    <div class="adaptive-item">Item 1</div>\n    <div class="adaptive-item">Item 2</div>\n    <div class="adaptive-item">Item 3</div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initAdaptiveChoreography(container) {\n    const ctx = gsap.context(() => {\n${motionLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    return {
        id: "matchmedia-adaptive-choreography",
        framework,
        code,
        css: ""
    };
}
