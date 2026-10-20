export const VELOCITY_MARQUEE_PRESETS = [
    'seamless-ribbon-loop',
    'scroll-velocity-skew',
    'ticker-telemetry-tape'
];

export function generateVelocityMarqueeBlueprint({ preset, framework = 'react', ease = 'none' }) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    let code = '';
    const plugins = ['ScrollTrigger'];

    // Common setup
    const imports = isReact ? `import { useRef } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';` :
                    `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`;

    const registerPlugin = `gsap.registerPlugin(ScrollTrigger);`;

    let getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let marqueeLogic = `
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const items = gsap.utils.toArray('.marquee-item');
            if (items.length === 0) return;

            const wrap = gsap.utils.wrap(-100, (items.length - 1) * 100);
            const clampSkew = gsap.utils.clamp(-12, 12);

            // Seamless xPercent loop on absolute positioned items
            gsap.set(items, { xPercent: i => i * 100, position: 'absolute', top: 0, left: 0 });

            // Set height based on first item since they are absolute
            const container = ${getContainerStr};
            if (container && items[0]) {
               const track = container.querySelector('.marquee-track');
               if (track) gsap.set(track, { height: items[0].offsetHeight });
            }

            const tl = gsap.timeline({ repeat: -1, paused: false });
            tl.to(items, {
                xPercent: "-=" + (items.length * 100),
                duration: 10 * items.length, // Normalize speed by item count
                ease: "${ease}",
                modifiers: {
                    xPercent: x => wrap(parseFloat(x))
                }
            });

            // Pause on hover/focus logic
            const handlePause = () => tl.pause();
            const handlePlay = () => tl.play();

            if (container) {
                container.addEventListener('mouseenter', handlePause);
                container.addEventListener('mouseleave', handlePlay);
                container.addEventListener('focusin', handlePause);
                container.addEventListener('focusout', handlePlay);
            }

            ${preset === 'scroll-velocity-skew' ? `
            let proxy = { skew: 0 };
            let skewSetter = gsap.quickTo(items, "skewX", {ease: "power3", duration: 0.5});
            ScrollTrigger.create({
                onUpdate: (self) => {
                    let skew = clampSkew(self.getVelocity() / -50);
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                        proxy.skew = skew;
                        gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
                    }
                }
            });
            ` : ''}

            return () => {
                if (container) {
                    container.removeEventListener('mouseenter', handlePause);
                    container.removeEventListener('mouseleave', handlePlay);
                    container.removeEventListener('focusin', handlePause);
                    container.removeEventListener('focusout', handlePlay);
                }
                tl.kill();
            };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            // Accessible fallback: No continuous motion, just simple static layout
            return () => {};
        });
    `;

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function VelocityMarquee() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${marqueeLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="marquee-container relative w-full overflow-hidden" tabIndex={0}>\n            <div className="marquee-track relative w-full">\n                <div className="marquee-item">Marquee Item 1</div>\n                <div className="marquee-item">Marquee Item 2</div>\n                <div className="marquee-item">Marquee Item 3</div>\n            </div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${marqueeLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${marqueeLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="marquee-container relative w-full overflow-hidden" tabindex="0">\n    <div class="marquee-track relative w-full">\n        <div class="marquee-item">Marquee Item 1</div>\n        <div class="marquee-item">Marquee Item 2</div>\n        <div class="marquee-item">Marquee Item 3</div>\n    </div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initVelocityMarquee(container) {\n    const ctx = gsap.context(() => {\n${marqueeLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    return {
        preset,
        framework,
        plugins,
        code,
        reducedMotionBehavior: 'static-fallback'
    };
}
