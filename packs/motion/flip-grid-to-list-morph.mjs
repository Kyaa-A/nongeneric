export const FLIP_GRID_TO_LIST_MORPH_PACK = {
    id: "flip-grid-to-list-morph",
    title: "GSAP Flip Dense Table-to-Gallery Spatial Morph",
    category: "motion",
    typography: { display: "Newsreader", body: "Work Sans", mono: "IBM Plex Mono" },
    tokens: {
        background: "oklch(0.96 0.01 250)",
        surface: "oklch(0.98 0.005 250)",
        text: "oklch(0.2 0.02 250)",
        accent: "oklch(0.6 0.15 250)"
    },
    gsapRecipe: "Flip.from(state, { duration: 0.6, ease: 'power3.inOut', absolute: true, nested: true })"
};

export function generateFlipGridToListMorphBlueprint({ framework = "react" } = {}) {
    const isReact = framework === 'react';
    const isVue = framework === 'vue';
    const isSvelte = framework === 'svelte';
    const isVanilla = framework === 'vanilla';

    const plugins = ['Flip'];
    const focusManagementNotes = 'Returns focus to the toggle button after animation.';

    const imports = isReact ? `import { useRef, useState, useEffect } from 'react';\nimport { useGSAP } from '@gsap/react';\nimport gsap from 'gsap';\nimport { Flip } from 'gsap/Flip';` :
                    isVue ? `import { ref, onMounted, onUnmounted, nextTick } from 'vue';\nimport gsap from 'gsap';\nimport { Flip } from 'gsap/Flip';` :
                    isSvelte ? `import { onMount, onDestroy, tick } from 'svelte';\nimport gsap from 'gsap';\nimport { Flip } from 'gsap/Flip';` :
                    `import gsap from 'gsap';\nimport { Flip } from 'gsap/Flip';`;

    const registerPlugin = `gsap.registerPlugin(Flip);`;

    let code = '';
    let css = '';

    if (isReact) {
        code = `${imports}\n\n${registerPlugin}\n\nexport function FlipGridToListMorph() {\n    const containerRef = useRef(null);\n    const [isGrid, setIsGrid] = useState(true);\n    \n    useGSAP(() => {\n        const container = containerRef.current;\n        if (!container) return;\n        \n        const handleEscape = (e) => {\n            if (e.key === 'Escape' && !isGrid) {\n                toggleView();\n            }\n        };\n        \n        container.addEventListener('keydown', handleEscape);\n        return () => container.removeEventListener('keydown', handleEscape);\n    }, { scope: containerRef, dependencies: [isGrid] });\n\n    const toggleView = () => {\n        const container = containerRef.current;\n        if (!container) return;\n        \n        const items = container.querySelectorAll('.morph-item, .morph-content');\n        const state = Flip.getState(items);\n        \n        setIsGrid(!isGrid);\n        \n        requestAnimationFrame(() => {\n            const mm = gsap.matchMedia();\n            mm.add("(prefers-reduced-motion: no-preference)", () => {\n                Flip.from(state, {\n                    duration: 0.6,\n                    ease: "power3.inOut",\n                    absolute: true,\n                    nested: true,\n                    onComplete: () => {\n                        const toggleBtn = container.querySelector('.toggle-view-btn');\n                        if (toggleBtn) toggleBtn.focus();\n                    }\n                });\n            });\n        });\n    };\n\n    return (\n        <div ref={containerRef} className={\`morph-container \${isGrid ? 'view-grid' : 'view-list'}\`}>\n            <button className="toggle-view-btn" onClick={toggleView}>\n                Toggle View\n            </button>\n            <div className="morph-layout">\n                {[1, 2, 3].map(i => (\n                    <div key={i} className="morph-item" data-flip-id={\`item-\${i}\`}>\n                        <div className="morph-content">Item {i}</div>\n                    </div>\n                ))}\n            </div>\n        </div>\n    );\n}`;
    } else if (isVue) {
        code = `${imports}\n\n${registerPlugin}\n\nexport default {\n    setup() {\n        const containerRef = ref(null);\n        const isGrid = ref(true);\n        let ctx;\n        \n        onMounted(() => {\n            ctx = gsap.context(() => {\n                const container = containerRef.value;\n                if (!container) return;\n                \n                const handleEscape = (e) => {\n                    if (e.key === 'Escape' && !isGrid.value) {\n                        toggleView();\n                    }\n                };\n                container.addEventListener('keydown', handleEscape);\n                return () => container.removeEventListener('keydown', handleEscape);\n            }, containerRef.value);\n        });\n        \n        onUnmounted(() => {\n            if (ctx) ctx.revert();\n        });\n\n        const toggleView = async () => {\n            const container = containerRef.value;\n            if (!container) return;\n            \n            const items = container.querySelectorAll('.morph-item, .morph-content');\n            const state = Flip.getState(items);\n            \n            isGrid.value = !isGrid.value;\n            \n            await nextTick();\n            \n            const mm = gsap.matchMedia();\n            mm.add("(prefers-reduced-motion: no-preference)", () => {\n                Flip.from(state, {\n                    duration: 0.6,\n                    ease: "power3.inOut",\n                    absolute: true,\n                    nested: true,\n                    onComplete: () => {\n                        const toggleBtn = container.querySelector('.toggle-view-btn');\n                        if (toggleBtn) toggleBtn.focus();\n                    }\n                });\n            });\n        };\n        \n        return { containerRef, isGrid, toggleView, items: [1, 2, 3] };\n    }\n};`;
    } else if (isSvelte) {
        code = `<script>\n${imports}\n\n${registerPlugin}\n\nlet containerRef;\nlet isGrid = true;\nlet ctx;\nlet items = [1, 2, 3];\n\nonMount(() => {\n    ctx = gsap.context(() => {\n        const container = containerRef;\n        if (!container) return;\n        \n        const handleEscape = (e) => {\n            if (e.key === 'Escape' && !isGrid) {\n                toggleView();\n            }\n        };\n        container.addEventListener('keydown', handleEscape);\n        return () => container.removeEventListener('keydown', handleEscape);\n    }, containerRef);\n});\n\nonDestroy(() => {\n    if (ctx) ctx.revert();\n});\n\nasync function toggleView() {\n    const container = containerRef;\n    if (!container) return;\n    \n    const domItems = container.querySelectorAll('.morph-item, .morph-content');\n    const state = Flip.getState(domItems);\n    \n    isGrid = !isGrid;\n    \n    await tick();\n    \n    const mm = gsap.matchMedia();\n    mm.add("(prefers-reduced-motion: no-preference)", () => {\n        Flip.from(state, {\n            duration: 0.6,\n            ease: "power3.inOut",\n            absolute: true,\n            nested: true,\n            onComplete: () => {\n                const toggleBtn = container.querySelector('.toggle-view-btn');\n                if (toggleBtn) toggleBtn.focus();\n            }\n        });\n    });\n}\n</script>\n\n<div bind:this={containerRef} class="morph-container {isGrid ? 'view-grid' : 'view-list'}">\n    <button class="toggle-view-btn" on:click={toggleView}>\n        Toggle View\n    </button>\n    <div class="morph-layout">\n        {#each items as item}\n            <div class="morph-item" data-flip-id="item-{item}">\n                <div class="morph-content">Item {item}</div>\n            </div>\n        {/each}\n    </div>\n</div>`;
    } else {
        code = `${imports}\n\n${registerPlugin}\n\nexport function initFlipGridToListMorph(container) {\n    let isGrid = true;\n    \n    const toggleView = () => {\n        const items = container.querySelectorAll('.morph-item, .morph-content');\n        const state = Flip.getState(items);\n        \n        isGrid = !isGrid;\n        \n        if (isGrid) {\n            container.classList.remove('view-list');\n            container.classList.add('view-grid');\n        } else {\n            container.classList.remove('view-grid');\n            container.classList.add('view-list');\n        }\n        \n        const mm = gsap.matchMedia();\n        mm.add("(prefers-reduced-motion: no-preference)", () => {\n            Flip.from(state, {\n                duration: 0.6,\n                ease: "power3.inOut",\n                absolute: true,\n                nested: true,\n                onComplete: () => {\n                    const toggleBtn = container.querySelector('.toggle-view-btn');\n                    if (toggleBtn) toggleBtn.focus();\n                }\n            });\n        });\n    };\n\n    const ctx = gsap.context(() => {\n        const handleEscape = (e) => {\n            if (e.key === 'Escape' && !isGrid) {\n                toggleView();\n            }\n        };\n        \n        container.addEventListener('keydown', handleEscape);\n        \n        const btn = container.querySelector('.toggle-view-btn');\n        if (btn) btn.addEventListener('click', toggleView);\n        \n        return () => {\n            container.removeEventListener('keydown', handleEscape);\n            if (btn) btn.removeEventListener('click', toggleView);\n        };\n    }, container);\n    \n    return () => ctx.revert();\n}`;
    }

    return {
        id: "flip-grid-to-list-morph",
        framework,
        plugins,
        code,
        css,
        focusManagementNotes
    };
}
