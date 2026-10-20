export const CHRONICLE_STRATUM_RAIL_PACK = {
    id: "chronicle-stratum-rail",
    title: "Pinned Vertical Stratum & Epoch Timeline Rail",
    category: "components",
    typography: {
        display: "Cormorant Garamond",
        body: "Source Serif 4",
        mono: "IBM Plex Mono"
    },
    tokens: {
        "rail-bg": "oklch(0.98 0.01 90)",
        "rail-fg": "oklch(0.20 0.02 260)",
        "rail-accent": "oklch(0.60 0.15 30)",
        "rail-subtle": "oklch(0.90 0.02 90)"
    },
    gsapRecipe: {
        plugins: ["ScrollTrigger"],
        dependencies: ["gsap"]
    }
};

export function generateChronicleStratumRailBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";

    let imports = `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;
    if (isReact) {
        imports = `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\n${imports}`;
    } else if (isVue) {
        imports = `import { ref, onMounted, onUnmounted } from 'vue';\n${imports}`;
    } else if (isSvelte) {
        imports = `import { onMount, onDestroy } from 'svelte';\n${imports}`;
    }

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    const getContainerStr = isReact ? 'container.current' : isVue ? 'container.value' : isSvelte ? 'container' : 'element';

    const gsapLogic = `
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const root = ${getContainerStr};
            if (!root) return;

            const railWrapper = root.querySelector('.stratum-rail-wrapper');
            const epochs = gsap.utils.toArray(root.querySelectorAll('article.epoch-item'));

            if (!railWrapper || epochs.length === 0) return;

            // Pin the wrapper, not the items being animated
            ScrollTrigger.create({
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                pin: railWrapper,
                pinSpacing: false
            });

            epochs.forEach((epoch, i) => {
                const indicator = railWrapper.querySelector(\`.epoch-indicator:nth-child(\${i + 1})\`);

                if (indicator) {
                    ScrollTrigger.create({
                        trigger: epoch,
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => gsap.to(indicator, { opacity: 1, scale: 1.1, duration: 0.3, ease: "power3.out" }),
                        onLeave: () => gsap.to(indicator, { opacity: 0.5, scale: 1, duration: 0.3, ease: "power3.out" }),
                        onEnterBack: () => gsap.to(indicator, { opacity: 1, scale: 1.1, duration: 0.3, ease: "power3.out" }),
                        onLeaveBack: () => gsap.to(indicator, { opacity: 0.5, scale: 1, duration: 0.3, ease: "power3.out" })
                    });
                }
            });

        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            // Static fallback, no scroll animations
            return () => {};
        });
    `;

    let code = '';
    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function ChronicleStratumRail() {\n    const container = useRef(null);\n    \n    useGSAP(() => {\n${gsapLogic}\n    }, { scope: container });\n\n    return (\n        <section ref={container} className="chronicle-root relative min-h-[100dvh]">\n            <div className="stratum-rail-wrapper absolute left-0 top-0 h-[100dvh] w-16 border-r border-[var(--rail-subtle)]">\n                <nav className="flex flex-col items-center justify-center h-full gap-8">\n                    <div className="epoch-indicator w-3 h-3 rounded-full bg-[var(--rail-accent)] opacity-50" />\n                    <div className="epoch-indicator w-3 h-3 rounded-full bg-[var(--rail-accent)] opacity-50" />\n                    <div className="epoch-indicator w-3 h-3 rounded-full bg-[var(--rail-accent)] opacity-50" />\n                </nav>\n            </div>\n            <div className="epoch-content ml-16">\n                <article className="epoch-item min-h-[100dvh] p-8">\n                    <time className="tabular-nums font-mono text-sm">1998</time>\n                    <h2 className="font-display text-4xl mt-4">Epoch One</h2>\n                </article>\n                <article className="epoch-item min-h-[100dvh] p-8">\n                    <time className="tabular-nums font-mono text-sm">2005</time>\n                    <h2 className="font-display text-4xl mt-4">Epoch Two</h2>\n                </article>\n                <article className="epoch-item min-h-[100dvh] p-8">\n                    <time className="tabular-nums font-mono text-sm">2012</time>\n                    <h2 className="font-display text-4xl mt-4">Epoch Three</h2>\n                </article>\n            </div>\n        </section>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const container = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${gsapLogic}\n            }, container.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { container };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet container;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${gsapLogic}\n    }, container);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<section bind:this={container} class="chronicle-root relative min-h-[100dvh]">\n    <div class="stratum-rail-wrapper absolute left-0 top-0 h-[100dvh] w-16 border-r border-[var(--rail-subtle)]">\n        <nav class="flex flex-col items-center justify-center h-full gap-8">\n            <div class="epoch-indicator w-3 h-3 rounded-full bg-[var(--rail-accent)] opacity-50"></div>\n            <div class="epoch-indicator w-3 h-3 rounded-full bg-[var(--rail-accent)] opacity-50"></div>\n            <div class="epoch-indicator w-3 h-3 rounded-full bg-[var(--rail-accent)] opacity-50"></div>\n        </nav>\n    </div>\n    <div class="epoch-content ml-16">\n        <article class="epoch-item min-h-[100dvh] p-8">\n            <time class="tabular-nums font-mono text-sm">1998</time>\n            <h2 class="font-display text-4xl mt-4">Epoch One</h2>\n        </article>\n        <article class="epoch-item min-h-[100dvh] p-8">\n            <time class="tabular-nums font-mono text-sm">2005</time>\n            <h2 class="font-display text-4xl mt-4">Epoch Two</h2>\n        </article>\n        <article class="epoch-item min-h-[100dvh] p-8">\n            <time class="tabular-nums font-mono text-sm">2012</time>\n            <h2 class="font-display text-4xl mt-4">Epoch Three</h2>\n        </article>\n    </div>\n</section>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initChronicleStratumRail(element) {\n    const ctx = gsap.context(() => {\n${gsapLogic}\n    }, element);\n    return () => ctx.revert();\n}`;
    }

    return {
        id: "chronicle-stratum-rail",
        framework,
        code,
        css: ""
    };
}
