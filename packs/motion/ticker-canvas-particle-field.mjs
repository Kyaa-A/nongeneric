export const TICKER_CANVAS_PARTICLE_FIELD_PACK = {
    id: "ticker-canvas-particle-field",
    title: "GSAP Ticker Synchronized Canvas2D Vector Field",
    category: "motion",
    typography: { display: "Chakra Petch", body: "Atkinson Hyperlegible", mono: "JetBrains Mono" },
    tokens: {
        background: "oklch(0.1 0.02 260)",
        foreground: "oklch(0.9 0.05 260)",
        primary: "oklch(0.7 0.15 260)",
        secondary: "oklch(0.6 0.1 200)"
    },
    gsapRecipe: "gsap.ticker.add()"
};

export function generateTickerCanvasParticleFieldBlueprint({ framework = "react" } = {}) {
    let code = '';
    let css = '';
    const plugins = [];

    // Vanilla JS setup
    const vanillaCode = `
import gsap from 'gsap';

export function initParticleField(canvasContainer) {
    const canvas = canvasContainer.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Store particle data as simple objects (not DOM elements)
    const particles = [];
    const numParticles = 100;

    for(let i=0; i<numParticles; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 2 + 1
        });
    }

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        particles.forEach(p => {
            // Simple update
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const mm = gsap.matchMedia();
    let isReducedMotion = false;

    mm.add("(prefers-reduced-motion: reduce)", () => {
        isReducedMotion = true;
        render(); // Render once
        return () => { isReducedMotion = false; }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        const update = () => {
            if (!isReducedMotion) {
                render();
            }
        };

        gsap.ticker.add(update);
        return () => {
            gsap.ticker.remove(update);
        }
    });

    return () => {
        window.removeEventListener('resize', resize);
        mm.revert();
    };
}
`;

    // React setup
    const reactCode = `
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function ParticleField() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useGSAP(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const particles = Array.from({length: 100}, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 2 + 1
        }));

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const mm = gsap.matchMedia();
        let isReducedMotion = false;

        mm.add("(prefers-reduced-motion: reduce)", () => {
            isReducedMotion = true;
            render();
            return () => { isReducedMotion = false; }
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const update = () => {
                if (!isReducedMotion) {
                    render();
                }
            };

            gsap.ticker.add(update);
            return () => gsap.ticker.remove(update);
        });

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
    );
}
`;

    // Vue setup
    const vueCode = `
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

export default {
    setup() {
        const containerRef = ref(null);
        const canvasRef = ref(null);
        let ctx_gsap;

        onMounted(() => {
            ctx_gsap = gsap.context(() => {
                const canvas = canvasRef.value;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');

                const particles = Array.from({length: 100}, () => ({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    radius: Math.random() * 2 + 1
                }));

                const resize = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };
                window.addEventListener('resize', resize);
                resize();

                const render = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

                    particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;

                        if (p.x < 0) p.x = canvas.width;
                        if (p.x > canvas.width) p.x = 0;
                        if (p.y < 0) p.y = canvas.height;
                        if (p.y > canvas.height) p.y = 0;

                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fill();
                    });
                };

                const mm = gsap.matchMedia();
                let isReducedMotion = false;

                mm.add("(prefers-reduced-motion: reduce)", () => {
                    isReducedMotion = true;
                    render();
                    return () => { isReducedMotion = false; }
                });

                mm.add("(prefers-reduced-motion: no-preference)", () => {
                    const update = () => {
                        if (!isReducedMotion) {
                            render();
                        }
                    };

                    gsap.ticker.add(update);
                    return () => gsap.ticker.remove(update);
                });

                return () => {
                    window.removeEventListener('resize', resize);
                };
            }, containerRef.value);
        });

        onUnmounted(() => {
            if (ctx_gsap) ctx_gsap.revert();
        });

        return { containerRef, canvasRef };
    }
};
`;

    // Svelte setup
    const svelteCode = `
<script>
    import { onMount, onDestroy } from 'svelte';
    import gsap from 'gsap';

    let containerRef;
    let canvasRef;
    let ctx_gsap;

    onMount(() => {
        ctx_gsap = gsap.context(() => {
            const canvas = canvasRef;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            const particles = Array.from({length: 100}, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1
            }));

            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resize);
            resize();

            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                });
            };

            const mm = gsap.matchMedia();
            let isReducedMotion = false;

            mm.add("(prefers-reduced-motion: reduce)", () => {
                isReducedMotion = true;
                render();
                return () => { isReducedMotion = false; }
            });

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const update = () => {
                    if (!isReducedMotion) {
                        render();
                    }
                };

                gsap.ticker.add(update);
                return () => gsap.ticker.remove(update);
            });

            return () => {
                window.removeEventListener('resize', resize);
            };
        }, containerRef);
    });

    onDestroy(() => {
        if (ctx_gsap) ctx_gsap.revert();
    });
</script>

<div bind:this={containerRef} style="width: 100%; height: 100%;">
    <canvas bind:this={canvasRef} style="display: block; width: 100%; height: 100%;"></canvas>
</div>
`;

    if (framework === 'react') {
        code = reactCode;
    } else if (framework === 'vue') {
        code = vueCode;
    } else if (framework === 'svelte') {
        code = svelteCode;
    } else {
        code = vanillaCode;
    }

    return {
        id: "ticker-canvas-particle-field",
        framework,
        plugins,
        code,
        css
    };
}
