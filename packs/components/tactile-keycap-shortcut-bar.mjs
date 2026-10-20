export const TACTILE_KEYCAP_SHORTCUT_BAR_PACK = {
    id: "tactile-keycap-shortcut-bar",
    title: "Mechanical Keycap Shortcut Legend & Chord Bar",
    category: "components",
    typography: {
        display: "Rajdhani",
        body: "Work Sans",
        mono: "JetBrains Mono"
    },
    tokens: {
        background: "oklch(0.15 0.02 250)",
        keycapSurface: "oklch(0.25 0.02 250)",
        keycapBorder: "oklch(0.35 0.02 250)",
        keycapShadow: "oklch(0.10 0.02 250)",
        textPrimary: "oklch(0.95 0.01 250)",
        textSecondary: "oklch(0.75 0.01 250)",
        accent: "oklch(0.70 0.15 250)"
    },
    gsapRecipe: {
        press: {
            y: 2,
            duration: 0.1,
            ease: "power2.out"
        },
        release: {
            y: 0,
            duration: 0.2,
            ease: "power2.out"
        }
    }
};

export function generateTactileKeycapShortcutBarBlueprint({ framework = "react" } = {}) {
    const css = `
.tactile-keycap-shortcut-bar {
    --bg: oklch(0.15 0.02 250);
    --surface: oklch(0.25 0.02 250);
    --border: oklch(0.35 0.02 250);
    --shadow: oklch(0.10 0.02 250);
    --text-primary: oklch(0.95 0.01 250);
    --text-secondary: oklch(0.75 0.01 250);

    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 24px;
    background: var(--bg);
    border-radius: 12px;
    font-family: "Work Sans", sans-serif;
    color: var(--text-primary);
}

.tactile-keycap-chord {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tactile-keycap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: "JetBrains Mono", monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    box-shadow: 0 4px 0 var(--shadow);
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    font-variant-numeric: tabular-nums;
}

.tactile-keycap-label {
    font-family: "Rajdhani", sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-left: 8px;
}
`;

    let code = '';

    const eventsScript = `
            const keycaps = gsap.utils.toArray('.tactile-keycap');
            const cleanups = [];

            keycaps.forEach(keycap => {
                const press = () => {
                    gsap.to(keycap, { y: 4, boxShadow: '0 0px 0 var(--shadow)', duration: 0.1, ease: 'power2.out' });
                };

                const release = () => {
                    gsap.to(keycap, { y: 0, boxShadow: '0 4px 0 var(--shadow)', duration: 0.2, ease: 'power2.out' });
                };

                const keydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        press();
                    }
                };

                const keyup = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        release();
                    }
                };

                keycap.addEventListener('pointerdown', press);
                keycap.addEventListener('pointerup', release);
                keycap.addEventListener('pointerleave', release);
                keycap.addEventListener('keydown', keydown);
                keycap.addEventListener('keyup', keyup);

                cleanups.push(() => {
                    keycap.removeEventListener('pointerdown', press);
                    keycap.removeEventListener('pointerup', release);
                    keycap.removeEventListener('pointerleave', release);
                    keycap.removeEventListener('keydown', keydown);
                    keycap.removeEventListener('keyup', keyup);
                });
            });

            return () => {
                cleanups.forEach(fn => fn());
            };
`;

    if (framework === 'react') {
        code = `
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin();

export function TactileKeycapShortcutBar() {
    const container = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
${eventsScript}
        });

        return () => mm.revert();
    }, { scope: container });

    return (
        <div className="tactile-keycap-shortcut-bar" ref={container}>
            <div className="tactile-keycap-chord">
                <span className="tactile-keycap" tabIndex={0} role="button">Ctrl</span>
                <span>+</span>
                <span className="tactile-keycap" tabIndex={0} role="button">K</span>
                <span className="tactile-keycap-label">Search</span>
            </div>
            <div className="tactile-keycap-chord">
                <span className="tactile-keycap" tabIndex={0} role="button">Shift</span>
                <span>+</span>
                <span className="tactile-keycap" tabIndex={0} role="button">?</span>
                <span className="tactile-keycap-label">Help</span>
            </div>
        </div>
    );
}
`;
    } else if (framework === 'vue') {
        code = `
<template>
    <div class="tactile-keycap-shortcut-bar" ref="container">
        <div class="tactile-keycap-chord">
            <span class="tactile-keycap" tabindex="0" role="button">Ctrl</span>
            <span>+</span>
            <span class="tactile-keycap" tabindex="0" role="button">K</span>
            <span class="tactile-keycap-label">Search</span>
        </div>
        <div class="tactile-keycap-chord">
            <span class="tactile-keycap" tabindex="0" role="button">Shift</span>
            <span>+</span>
            <span class="tactile-keycap" tabindex="0" role="button">?</span>
            <span class="tactile-keycap-label">Help</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

gsap.registerPlugin();

const container = ref(null);
let ctx;

onMounted(() => {
    ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
${eventsScript}
        });
    }, container.value);
});

onUnmounted(() => {
    if (ctx) ctx.revert();
});
</script>
`;
    } else if (framework === 'svelte') {
        code = `
<script>
    import { onMount, onDestroy } from 'svelte';
    import gsap from 'gsap';

    gsap.registerPlugin();

    let container;
    let ctx;

    onMount(() => {
        ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
${eventsScript}
            });
        }, container);
    });

    onDestroy(() => {
        if (ctx) ctx.revert();
    });
</script>

<div class="tactile-keycap-shortcut-bar" bind:this={container}>
    <div class="tactile-keycap-chord">
        <span class="tactile-keycap" tabindex="0" role="button">Ctrl</span>
        <span>+</span>
        <span class="tactile-keycap" tabindex="0" role="button">K</span>
        <span class="tactile-keycap-label">Search</span>
    </div>
    <div class="tactile-keycap-chord">
        <span class="tactile-keycap" tabindex="0" role="button">Shift</span>
        <span>+</span>
        <span class="tactile-keycap" tabindex="0" role="button">?</span>
        <span class="tactile-keycap-label">Help</span>
    </div>
</div>
`;
    } else {
        // vanilla
        code = `
import gsap from 'gsap';

gsap.registerPlugin();

export function initTactileKeycapShortcutBar(element) {
    const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
${eventsScript}
        });
    }, element);

    return () => ctx.revert();
}
`;
    }

    return {
        id: "tactile-keycap-shortcut-bar",
        framework,
        code,
        css
    };
}
