export const DRAGGABLE_TIMELINE_SCRUBBER_PACK = {
    id: "draggable-timeline-scrubber",
    title: "GSAP Draggable Precision Keyframe Playhead & Zoom Bar",
    category: "motion",
    typography: { display: "Chakra Petch", body: "Work Sans", mono: "JetBrains Mono" },
    tokens: {
        primary: "oklch(0.65 0.25 250)",
        surface: "oklch(0.2 0.05 250)",
        text: "oklch(0.9 0.05 250)"
    },
    gsapRecipe: ["Draggable", "matchMedia"]
};

export function generateDraggableTimelineScrubberBlueprint({ framework = "react" } = {}) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    let imports = '';
    if (isReact) {
        imports = `import React, { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';`;
    } else if (isVue) {
        imports = `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';`;
    } else if (isSvelte) {
        imports = `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';`;
    } else {
        imports = `import gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';`;
    }

    const registerStr = `gsap.registerPlugin(Draggable);`;

    let code = '';
    if (isReact) {
        code = `${imports}\n\n${registerStr}\n\nexport function DraggableTimelineScrubber() {\n    const containerRef = useRef(null);\n    const playheadRef = useRef(null);\n\n    useGSAP(() => {\n        const mm = gsap.matchMedia();\n        mm.add("(prefers-reduced-motion: no-preference)", () => {\n            if (!containerRef.current || !playheadRef.current) return;\n            Draggable.create(playheadRef.current, {\n                type: "x",\n                bounds: containerRef.current,\n                inertia: true,\n                onDrag: function() {\n                    // Update timeline or animation based on this.x / max-width\n                }\n            });\n        });\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="timeline-track">\n            <button ref={playheadRef} className="timeline-playhead" aria-label="Scrub timeline">\n                Playhead\n            </button>\n        </div>\n    );\n}\n`;
    } else if (isVue) {
        code = `${imports}\n\n${registerStr}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        const playheadRef = ref(null);\n        let ctx;\n\n        onMounted(() => {\n            ctx = gsap.context(() => {\n                const mm = gsap.matchMedia();\n                mm.add("(prefers-reduced-motion: no-preference)", () => {\n                    if (!containerRef.value || !playheadRef.value) return;\n                    Draggable.create(playheadRef.value, {\n                        type: "x",\n                        bounds: containerRef.value,\n                        inertia: true,\n                        onDrag: function() {\n                            // Update timeline based on this.x\n                        }\n                    });\n                });\n            }, containerRef.value);\n        });\n\n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n\n        return { containerRef, playheadRef };\n    }\n};\n`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerStr}\n\nlet containerRef;\nlet playheadRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n        const mm = gsap.matchMedia();\n        mm.add("(prefers-reduced-motion: no-preference)", () => {\n            if (!containerRef || !playheadRef) return;\n            Draggable.create(playheadRef, {\n                type: "x",\n                bounds: containerRef,\n                inertia: true,\n                onDrag: function() {\n                    // Update timeline\n                }\n            });\n        });\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="timeline-track">\n    <button bind:this={playheadRef} class="timeline-playhead" aria-label="Scrub timeline">\n        Playhead\n    </button>\n</div>\n`;
    } else {
        code = `${imports}\n\n${registerStr}\n\nexport function initDraggableTimelineScrubber(containerElement, playheadElement) {\n    let ctx = gsap.context(() => {\n        const mm = gsap.matchMedia();\n        mm.add("(prefers-reduced-motion: no-preference)", () => {\n            if (!containerElement || !playheadElement) return;\n            Draggable.create(playheadElement, {\n                type: "x",\n                bounds: containerElement,\n                inertia: true,\n                onDrag: function() {\n                    // Update timeline\n                }\n            });\n        });\n    }, containerElement);\n\n    return () => ctx.revert();\n}\n`;
    }

    const css = `.timeline-track { width: 100%; height: 48px; background: oklch(0.2 0.05 250); position: relative; }\n.timeline-playhead { width: 44px; height: 44px; background: oklch(0.65 0.25 250); border-radius: 4px; min-width: 44px; min-height: 44px; border: none; cursor: pointer; color: oklch(0.9 0.05 250); }`;

    return {
        id: "draggable-timeline-scrubber",
        framework,
        code,
        css
    };
}
