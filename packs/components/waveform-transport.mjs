export const WAVEFORM_TRANSPORT_PACK = {
    id: "waveform-transport",
    title: "Interactive Audio/Shader Waveform Transport Bar",
    category: "components",
    typography: {
        display: "Chakra Petch",
        body: "Atkinson Hyperlegible",
        mono: "JetBrains Mono"
    },
    tokens: {
        "ground-primary": "oklch(0.12 0.01 250)",
        "ground-elevated": "oklch(0.18 0.01 250)",
        "ink-primary": "oklch(0.98 0 0)",
        "ink-muted": "oklch(0.65 0 0)",
        "accent-primary": "oklch(0.6 0.2 25)"
    },
    gsapRecipe: ["ScrollTrigger"] // Not using any plugins explicitly for simple animation, but keeping standard
};

export function generateWaveformTransportBlueprint({ framework = "react" } = {}) {
    const isReact = framework === "react";
    const isVue = framework === "vue";
    const isSvelte = framework === "svelte";
    const isVanilla = framework === "vanilla";

    let code = '';

    const imports = isReact ? `import { useRef, useEffect } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    const getTargetStr = isReact ? "containerRef.current" : isVue ? "containerRef.value" : isSvelte ? "containerRef" : "container";

    let logic = `
        const target = ${getTargetStr};
        if (!target) return;

        const bars = target.querySelectorAll('.waveform-bar');

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            if (bars.length > 0) {
                const tl = gsap.timeline({ repeat: -1, yoyo: true });
                tl.to(bars, {
                    scaleY: "random(0.2, 1)",
                    duration: 0.15,
                    stagger: {
                        each: 0.05,
                        from: "random"
                    },
                    ease: "none"
                });

                // Play/Pause control
                const playBtn = target.querySelector('.btn-play');
                const pauseBtn = target.querySelector('.btn-pause');

                const handlePlay = () => tl.play();
                const handlePause = () => tl.pause();

                if (playBtn) {
                    playBtn.addEventListener('click', handlePlay);
                }
                if (pauseBtn) {
                    pauseBtn.addEventListener('click', handlePause);
                }

                return () => {
                    tl.kill();
                    if (playBtn) playBtn.removeEventListener('click', handlePlay);
                    if (pauseBtn) pauseBtn.removeEventListener('click', handlePause);
                };
            }
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            // Static accessible state
            gsap.set(bars, { scaleY: 0.5 });
            return () => {};
        });
    `;

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function WaveformTransport() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${logic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="waveform-transport" aria-label="Audio Transport">\n            <div className="waveform-display" aria-hidden="true">\n                <div className="waveform-bar"></div>\n                <div className="waveform-bar"></div>\n                <div className="waveform-bar"></div>\n            </div>\n            <div className="transport-controls">\n                <button className="btn-play" aria-label="Play">Play</button>\n                <button className="btn-pause" aria-label="Pause">Pause</button>\n            </div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\n<template>\n    <div ref="containerRef" class="waveform-transport" aria-label="Audio Transport">\n        <div class="waveform-display" aria-hidden="true">\n            <div class="waveform-bar"></div>\n            <div class="waveform-bar"></div>\n            <div class="waveform-bar"></div>\n        </div>\n        <div class="transport-controls">\n            <button class="btn-play" aria-label="Play">Play</button>\n            <button class="btn-pause" aria-label="Pause">Pause</button>\n        </div>\n    </div>\n</template>\n\n<script>\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${logic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};\n</script>`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${logic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="waveform-transport" aria-label="Audio Transport">\n    <div class="waveform-display" aria-hidden="true">\n        <div class="waveform-bar"></div>\n        <div class="waveform-bar"></div>\n        <div class="waveform-bar"></div>\n    </div>\n    <div class="transport-controls">\n        <button class="btn-play" aria-label="Play">Play</button>\n        <button class="btn-pause" aria-label="Pause">Pause</button>\n    </div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\n// HTML:\n// <div class="waveform-transport" aria-label="Audio Transport">\n//     <div class="waveform-display" aria-hidden="true">\n//         <div class="waveform-bar"></div>\n//     </div>\n// </div>\n\nexport function initWaveformTransport(container) {\n    const ctx = gsap.context(() => {\n${logic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    const css = `
        .waveform-transport {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--ng-ground-elevated, oklch(0.18 0.01 250));
            border-radius: 8px;
        }
        .waveform-display {
            display: flex;
            align-items: center;
            gap: 4px;
            height: 40px;
        }
        .waveform-bar {
            width: 8px;
            height: 100%;
            background: var(--ng-accent-primary, oklch(0.6 0.2 25));
            transform-origin: center;
        }
        .transport-controls {
            display: flex;
            gap: 0.5rem;
        }
        .transport-controls button {
            min-height: 44px;
            min-width: 44px;
            font-family: 'JetBrains Mono', monospace;
            font-variant-numeric: tabular-nums;
            cursor: pointer;
        }
    `;

    return {
        id: "waveform-transport",
        framework,
        code,
        css
    };
}
