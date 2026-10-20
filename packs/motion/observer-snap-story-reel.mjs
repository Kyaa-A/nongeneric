export const OBSERVER_SNAP_STORY_REEL_PACK = {
    id: "observer-snap-story-reel",
    title: "GSAP Observer Velocity-Clamped Chapter Deck",
    category: "motion",
    typography: {
        display: "Playfair Display",
        body: "Source Serif 4",
        mono: "IBM Plex Mono"
    },
    tokens: {
        background: "oklch(0.12 0.01 250)",
        surface: "oklch(0.18 0.02 250)",
        text: "oklch(0.95 0.01 250)",
        accent: "oklch(0.7 0.1 250)"
    },
    gsapRecipe: "Observer"
};

export function generateObserverSnapStoryReelBlueprint({ framework = "react" } = {}) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    const plugins = ['Observer'];

    const imports = isReact ? `import { useRef, useEffect } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { Observer } from 'gsap/Observer';` :
                    isVue ? `import { ref, onMounted, onUnmounted } from 'vue';\nimport gsap from 'gsap';\nimport { Observer } from 'gsap/Observer';` :
                    isSvelte ? `import { onMount, onDestroy } from 'svelte';\nimport gsap from 'gsap';\nimport { Observer } from 'gsap/Observer';` :
                    `import gsap from 'gsap';\nimport { Observer } from 'gsap/Observer';`;

    const registerPlugin = `gsap.registerPlugin(Observer);`;

    const getContainerStr = isReact ? 'containerRef.current' : isVue ? 'containerRef.value' : isSvelte ? 'containerRef' : 'container';

    let observerLogic = `
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const container = ${getContainerStr};
            if (!container) return;
            const sections = gsap.utils.toArray('.chapter-panel', container);
            if (sections.length === 0) return;

            let currentIndex = 0;
            let isAnimating = false;

            const gotoSection = (index, direction) => {
                if (isAnimating || index < 0 || index >= sections.length) return;
                isAnimating = true;

                const targetSection = sections[index];
                const currentSection = sections[currentIndex];

                // Hide current
                gsap.to(currentSection, {
                    yPercent: direction === 1 ? -100 : 100,
                    duration: 1,
                    ease: "power3.inOut"
                });

                // Show target
                gsap.fromTo(targetSection, {
                    yPercent: direction === 1 ? 100 : -100
                }, {
                    yPercent: 0,
                    duration: 1,
                    ease: "power3.inOut",
                    onComplete: () => {
                        currentIndex = index;
                        isAnimating = false;
                    }
                });
            };

            const handleVelocitySnap = (velocity, deltaY) => {
                const threshold = 50; // Velocity threshold
                const clampedVelocity = gsap.utils.clamp(-1000, 1000, velocity);

                if (Math.abs(clampedVelocity) > threshold) {
                    if (clampedVelocity < 0 && currentIndex < sections.length - 1) {
                         // Swiping up -> move to next section
                         gotoSection(currentIndex + 1, 1);
                    } else if (clampedVelocity > 0 && currentIndex > 0) {
                         // Swiping down -> move to prev section
                         gotoSection(currentIndex - 1, -1);
                    }
                } else if (deltaY !== 0) {
                     if (deltaY > 0 && currentIndex < sections.length - 1) {
                         gotoSection(currentIndex + 1, 1);
                     } else if (deltaY < 0 && currentIndex > 0) {
                         gotoSection(currentIndex - 1, -1);
                     }
                }
            };

            // Set up initial state: absolute positioning and hide all but first
            gsap.set(sections, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                yPercent: i => i === 0 ? 0 : 100
            });

            const obs = Observer.create({
                target: container,
                type: "wheel,touch,pointer",
                preventDefault: true,
                onChangeY: (self) => {
                    if (!isAnimating) {
                        handleVelocitySnap(self.velocityY, self.deltaY);
                    }
                },
                wheelSpeed: -1, // Reverse wheel direction for intuitive feel
                tolerance: 10
            });

            return () => {
                obs.kill();
            };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            const container = ${getContainerStr};
            if (!container) return;
            const sections = gsap.utils.toArray('.chapter-panel', container);

            // For reduced motion, stack them normally and allow scrolling
            gsap.set(container, { overflowY: 'auto' });
            gsap.set(sections, {
                position: 'relative',
                yPercent: 0,
                height: 'auto',
                minHeight: '100dvh'
            });
            return () => {};
        });
    `;

    let code = '';

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function ObserverStoryReel() {\n    const containerRef = useRef(null);\n    \n    useGSAP(() => {\n${observerLogic}\n    }, { scope: containerRef });\n\n    return (\n        <div ref={containerRef} className="story-reel-container relative w-full h-[100dvh] overflow-hidden" tabIndex={0}>\n            <section className="chapter-panel flex items-center justify-center bg-gray-900 text-white"><h1 className="text-4xl">Chapter 1</h1></section>\n            <section className="chapter-panel flex items-center justify-center bg-gray-800 text-white"><h1 className="text-4xl">Chapter 2</h1></section>\n            <section className="chapter-panel flex items-center justify-center bg-gray-700 text-white"><h1 className="text-4xl">Chapter 3</h1></section>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n${observerLogic}\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n        \n        return { containerRef };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet ctx;\n\nonMount(() => {\n    ctx = gsap.context(() => {\n${observerLogic}\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n</script>\n\n<div bind:this={containerRef} class="story-reel-container relative w-full h-[100dvh] overflow-hidden" tabindex="0">\n    <section class="chapter-panel flex items-center justify-center bg-gray-900 text-white"><h1 class="text-4xl">Chapter 1</h1></section>\n    <section class="chapter-panel flex items-center justify-center bg-gray-800 text-white"><h1 class="text-4xl">Chapter 2</h1></section>\n    <section class="chapter-panel flex items-center justify-center bg-gray-700 text-white"><h1 class="text-4xl">Chapter 3</h1></section>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initObserverStoryReel(container) {\n    const ctx = gsap.context(() => {\n${observerLogic}\n    }, container);\n    return () => ctx.revert();\n}`;
    }

    return {
        id: "observer-snap-story-reel",
        framework,
        code,
        css: ""
    };
}
