export const ASYMMETRIC_BENTO_PACK = {
    id: "asymmetric-bento",
    title: "Asymmetric 7:5 Bento & Specimen Stage",
    category: "components",
    typography: {
        display: "Cormorant Garamond",
        body: "Work Sans",
        mono: "IBM Plex Mono"
    },
    tokens: {
        background: "oklch(0.97 0.01 90)",
        surface: "oklch(0.99 0.005 90)",
        border: "oklch(0.85 0.02 90)",
        text: "oklch(0.15 0.02 250)",
        accent: "oklch(0.5 0.15 250)"
    },
    gsapRecipe: {
        plugins: ["ScrollTrigger"],
        trigger: ".bento-grid",
        elements: ".bento-cell",
        animation: {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        }
    }
};

export function generateAsymmetricBentoBlueprint({ framework = "react" } = {}) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    let getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let animationLogic = `
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const container = ${getContainerStr};
            if (!container) return;

            const cells = container.querySelectorAll('.bento-cell');
            if (cells.length === 0) return;

            gsap.from(cells, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            return () => {};
        });
    `;

    let code = '';

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function AsymmetricBento() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${animationLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="bento-grid">\n            <div className="bento-cell bento-span-7">Cell 7</div>\n            <div className="bento-cell bento-span-5">Cell 5</div>\n            <div className="bento-cell bento-span-12">Cell 12</div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${animationLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${animationLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="bento-grid">\n    <div class="bento-cell bento-span-7">Cell 7</div>\n    <div class="bento-cell bento-span-5">Cell 5</div>\n    <div class="bento-cell bento-span-12">Cell 12</div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initAsymmetricBento(container) {\n    const ctx = gsap.context(() => {\n${animationLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    const css = `
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 1.5rem;
            width: 100%;
        }
        .bento-cell {
            background-color: var(--bento-surface, oklch(0.99 0.005 90));
            border: 1px solid var(--bento-border, oklch(0.85 0.02 90));
            border-radius: 0.5rem;
            padding: 1.5rem;
            color: var(--bento-text, oklch(0.15 0.02 250));
        }
        .bento-span-7 {
            grid-column: span 7;
        }
        .bento-span-5 {
            grid-column: span 5;
        }
        .bento-span-12 {
            grid-column: span 12;
        }
        @media (max-width: 768px) {
            .bento-span-7, .bento-span-5 {
                grid-column: span 12;
            }
        }
    `;

    return {
        id: "asymmetric-bento",
        framework,
        code,
        css
    };
}
