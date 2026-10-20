export const SCROLLTRIGGER_HORIZONTAL_TIMELINE_PACK = {
    id: "scrolltrigger-horizontal-timeline",
    title: "GSAP ScrollTrigger ContainerAnimation Archival Chronology",
    category: "motion",
    typography: { display: "Shippori Mincho", body: "Source Serif 4", mono: "IBM Plex Mono" },
    tokens: {
        background: "oklch(0.96 0.01 85)",
        foreground: "oklch(0.20 0.02 260)",
        accent: "oklch(0.60 0.15 30)"
    },
    gsapRecipe: "ScrollTrigger containerAnimation"
};

export function generateScrolltriggerHorizontalTimelineBlueprint({ framework = "react" } = {}) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    let code = '';
    const plugins = ['ScrollTrigger'];
    const css = `
.timeline-container {
    overflow-x: hidden;
    position: relative;
    width: 100%;
}
.timeline-track {
    display: flex;
    width: max-content;
}
.timeline-panel {
    width: 100dvw;
    flex: 0 0 100dvw;
}
`;

    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    let getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let logic = `
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const containerElem = ${getContainerStr};
            if (!containerElem) return;

            const track = containerElem.querySelector('.timeline-track');
            if (!track) return;

            const panels = gsap.utils.toArray(containerElem.querySelectorAll('.timeline-panel'));
            if (panels.length === 0) return;

            const tween = gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: containerElem,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => "+=" + track.offsetWidth
                }
            });

            const items = gsap.utils.toArray(containerElem.querySelectorAll('.timeline-item-anim'));
            items.forEach((item) => {
                gsap.to(item, {
                    scale: 1.5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        containerAnimation: tween,
                        start: "left center",
                        end: "right center",
                        scrub: true
                    }
                });
            });

            return () => {
                tween.kill();
            };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            return () => {};
        });
    `;

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function HorizontalTimeline() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${logic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="timeline-container relative w-full overflow-hidden">\n            <div className="timeline-track flex w-max">\n                <div className="timeline-panel flex-shrink-0">Panel 1 <div className="timeline-item-anim">A</div></div>\n                <div className="timeline-panel flex-shrink-0">Panel 2 <div className="timeline-item-anim">B</div></div>\n            </div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${logic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${logic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="timeline-container relative w-full overflow-hidden">\n    <div class="timeline-track flex w-max">\n        <div class="timeline-panel flex-shrink-0">Panel 1 <div class="timeline-item-anim">A</div></div>\n        <div class="timeline-panel flex-shrink-0">Panel 2 <div class="timeline-item-anim">B</div></div>\n    </div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initHorizontalTimeline(container) {\n    const ctx = gsap.context(() => {\n${logic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    return {
        id: "scrolltrigger-horizontal-timeline",
        framework,
        code,
        css
    };
}
