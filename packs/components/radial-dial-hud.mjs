export const RADIAL_DIAL_HUD_PACK = {
    id: "radial-dial-hud",
    title: "Tactile Radial Encoder & Precision Dial HUD",
    category: "components",
    typography: {
        display: "Rajdhani",
        body: "Atkinson Hyperlegible",
        mono: "IBM Plex Mono"
    },
    tokens: {
        background: "oklch(0.15 0.02 250)",
        surface: "oklch(0.20 0.02 250)",
        primary: "oklch(0.70 0.15 250)",
        text: "oklch(0.95 0.02 250)",
        muted: "oklch(0.60 0.02 250)"
    },
    gsapRecipe: "Draggable + quickTo() parameter curves"
};

export function generateRadialDialHudBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";

    const plugins = ["Draggable"];

    const imports = isReact ? `import { useRef, useEffect } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';` :
                    `import gsap from 'gsap';\nimport { Draggable } from 'gsap/Draggable';`;

    const registerPlugin = `gsap.registerPlugin(Draggable);`;

    let getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let codeLogic = `
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const container = ${getContainerStr};
            if (!container) return;

            const dial = container.querySelector('.radial-dial');
            const valueDisplay = container.querySelector('.dial-value');
            if (!dial || !valueDisplay) return;

            let rotationProxy = { rotation: 0 };

            const updateValue = () => {
                const normalized = Math.round(((rotationProxy.rotation % 360) + 360) % 360);
                if (valueDisplay) valueDisplay.textContent = String(normalized).padStart(3, '0');
            };

            Draggable.create(dial, {
                type: "rotation",
                bounds: { minRotation: 0, maxRotation: 360 },
                inertia: true,
                onUpdate: function() {
                    rotationProxy.rotation = this.rotation;
                    updateValue();
                }
            });

            return () => {
                const dragInst = Draggable.get(dial);
                if (dragInst) dragInst.kill();
            };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            // Accessible fallback: static dial
            return () => {};
        });
    `;

    let code = "";

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function RadialDialHud() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${codeLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="radial-dial-hud relative p-8 flex flex-col items-center justify-center bg-[var(--background)] min-h-[100dvh]" tabIndex={0} style={{ '--background': 'oklch(0.15 0.02 250)' }}>\n            <div className="radial-dial w-32 h-32 rounded-full border-4 border-[oklch(0.70_0.15_250)] flex items-center justify-center cursor-pointer mb-4" aria-label="Rotatable dial" role="slider" aria-valuemin={0} aria-valuemax={360}>\n                <div className="dial-indicator w-2 h-8 bg-[oklch(0.70_0.15_250)] absolute top-0 rounded-full origin-bottom"></div>\n            </div>\n            <div className="dial-value text-4xl font-mono text-[oklch(0.95_0.02_250)]" aria-live="polite">000</div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${codeLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${codeLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="radial-dial-hud relative p-8 flex flex-col items-center justify-center bg-[var(--background)] min-h-[100dvh]" tabindex="0" style="--background: oklch(0.15 0.02 250);">\n    <div class="radial-dial w-32 h-32 rounded-full border-4 border-[oklch(0.70 0.15 250)] flex items-center justify-center cursor-pointer mb-4" aria-label="Rotatable dial" role="slider" aria-valuemin="0" aria-valuemax="360">\n        <div class="dial-indicator w-2 h-8 bg-[oklch(0.70 0.15 250)] absolute top-0 rounded-full origin-bottom"></div>\n    </div>\n    <div class="dial-value text-4xl font-mono text-[oklch(0.95 0.02 250)]" aria-live="polite">000</div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initRadialDialHud(container) {\n    const ctx = gsap.context(() => {\n${codeLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    return {
        id: "radial-dial-hud",
        framework,
        code,
        css: `
        .radial-dial-hud {
            background-color: oklch(0.15 0.02 250);
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Atkinson Hyperlegible', sans-serif;
            min-width: 0;
        }
        .radial-dial {
            width: 128px;
            height: 128px;
            border-radius: 50%;
            border: 4px solid oklch(0.70 0.15 250);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            margin-bottom: 1rem;
        }
        .dial-indicator {
            width: 8px;
            height: 32px;
            background-color: oklch(0.70 0.15 250);
            position: absolute;
            top: 0;
            border-radius: 4px;
            transform-origin: bottom center;
        }
        .dial-value {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 2.25rem;
            color: oklch(0.95 0.02 250);
            font-variant-numeric: tabular-nums;
        }
        `
    };
}
