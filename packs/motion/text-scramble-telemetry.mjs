export const TEXT_SCRAMBLE_PRESETS = [
    'cipher-glyph-decode',
    'tabular-odometer-roll',
    'coordinate-lock-reveal'
];

export function generateTextScrambleBlueprint({ preset, framework = 'react', ease = 'power2.out' }) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    let code = '';
    const plugins = ['TextPlugin'];

    const imports = isReact ? `import { useRef, useEffect } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { TextPlugin } from 'gsap/TextPlugin';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { TextPlugin } from 'gsap/TextPlugin';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { TextPlugin } from 'gsap/TextPlugin';` :
                    `import gsap from 'gsap';\nimport { TextPlugin } from 'gsap/TextPlugin';`;

    const registerPlugin = `gsap.registerPlugin(TextPlugin);`;

    const getTargetStr = isReact ? 'textRef.current' : isVue ? 'textRef.value' : isSvelte ? 'textRef' : 'targetElement';

    // We are creating a simple custom scramble logic to avoid innerHTML using TextPlugin or custom string manipulation
    // Actually GSAP TextPlugin handles textContent well. But standard scramble logic:
    // Let's implement a custom ticker-based scrambler using textContent to be 100% safe from innerHTML findings and flexible.

    let scrambleLogic = `
        const target = ${getTargetStr};
        if (!target) return;

        const finalString = target.getAttribute('data-final-text') || 'DECODED_DATA';
        const chars = '!<>-_\\\\/[]{}—=+*^?#_';

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            let obj = { value: 0 };
            gsap.to(obj, {
                value: finalString.length,
                duration: 2,
                ease: "${ease}",
                onUpdate: () => {
                    const progress = Math.floor(obj.value);
                    let scrambled = '';
                    for(let i = 0; i < finalString.length; i++) {
                        if (i < progress) {
                            scrambled += finalString[i];
                        } else {
                            scrambled += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }
                    target.textContent = scrambled;
                },
                onComplete: () => {
                    target.textContent = finalString;
                }
            });

            return () => gsap.killTweensOf(obj);
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            target.textContent = finalString;
            return () => {};
        });
    `;

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function TextScramble() {\n    const containerRef = useRef(null);\n    const textRef = useRef(null);\n    \n    useGSAP(() => {\n${scrambleLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="scramble-container" aria-label="Decoded Data">\n            <span \n                ref={textRef} \n                className="tabular-nums" \n                aria-hidden="true" \n                data-final-text="DECODED_DATA"\n            >\n                ------------\n            </span>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\n<template>\n    <div ref="containerRef" class="scramble-container" aria-label="Decoded Data">\n        <span \n            ref="textRef" \n            class="tabular-nums" \n            aria-hidden="true" \n            data-final-text="DECODED_DATA"\n        >\n            ------------\n        </span>\n    </div>\n</template>\n\n<script>\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        const textRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${scrambleLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef, textRef };\n    }\n};\n</script>`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet textRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${scrambleLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="scramble-container" aria-label="Decoded Data">\n    <span \n        bind:this={textRef} \n        class="tabular-nums" \n        aria-hidden="true" \n        data-final-text="DECODED_DATA"\n    >\n        ------------\n    </span>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\n// HTML:\n// <div class="scramble-container" aria-label="Decoded Data">\n//     <span class="tabular-nums scramble-target" aria-hidden="true" data-final-text="DECODED_DATA">\n//         ------------\n//     </span>\n// </div>\n\nexport function initTextScramble(container, targetElement) {\n    const ctx = gsap.context(() => {\n${scrambleLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    return {
        preset,
        framework,
        plugins,
        code,
        a11yNotes: "Uses aria-label on the parent container and aria-hidden='true' on the scrambled text element. This ensures that screen readers announce the final text once rather than reading out the rapidly changing random characters during the animation."
    };
}
