import { resolveWorld } from './tokens.js';
export function generateMotionBlueprint(pattern = 'hero-reveal', framework = 'react', worldId) {
    const world = resolveWorld(worldId);
    const ease = world.gsapRecipe.primaryEase;
    const coreSnippets = {
        'hero-reveal': {
            plugins: ['SplitText', 'CustomEase'],
            body: `const mm = gsap.matchMedia();

mm.add(
  {
    motionOk: '(prefers-reduced-motion: no-preference)',
    reduced: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    const { motionOk } = context.conditions ?? {};
    if (!motionOk) {
      gsap.set(['[data-ng-kicker]', '[data-ng-headline]', '[data-ng-instrument]'], { autoAlpha: 1, y: 0 });
      return;
    }

    const split = SplitText.create('[data-ng-headline]', {
      type: 'lines,words',
      mask: 'lines',
      autoSplit: true,
    });

    const tl = gsap.timeline({ defaults: { ease: '${ease}' } });
    tl.from('[data-ng-kicker]', { autoAlpha: 0, y: 10, duration: 0.45 })
      .from(split.lines, { yPercent: 108, duration: 0.72, stagger: 0.065 }, '-=0.25')
      .from('[data-ng-instrument]', { autoAlpha: 0, y: 18, scale: 0.985, duration: 0.75 }, '-=0.45')
      .from('[data-ng-bar]', { scaleX: 0, transformOrigin: 'left center', duration: 0.6, stagger: 0.08 }, '-=0.35');
  }
);`,
        },
        'pinned-horizontal': {
            plugins: ['ScrollTrigger'],
            body: `const mm = gsap.matchMedia();

mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  const panels = gsap.utils.toArray<HTMLElement>('[data-ng-chamber]');
  const track = document.querySelector<HTMLElement>('[data-ng-track]');
  if (!track || panels.length < 2) return;

  // CRITICAL GSAP LAW: Horizontal containerAnimation tween MUST use ease: "none"
  const scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-ng-stage]',
      pin: true,
      scrub: 0.6,
      end: () => '+=' + track.offsetWidth,
      invalidateOnRefresh: true,
    },
  });

  panels.forEach((panel) => {
    const artifact = panel.querySelector('[data-ng-artifact]');
    if (!artifact) return;
    gsap.from(artifact, {
      y: 28,
      autoAlpha: 0,
      duration: 0.6,
      ease: '${ease}',
      scrollTrigger: {
        trigger: panel,
        containerAnimation: scrollTween,
        start: 'left 75%',
        toggleActions: 'play none none reverse',
      },
    });
  });
});`,
        },
        'flip-filter': {
            plugins: ['Flip'],
            body: `function applyFilter(category: string) {
  const items = gsap.utils.toArray<HTMLElement>('[data-ng-item]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = Flip.getState(items);

  items.forEach((item) => {
    const matches = category === 'all' || item.dataset.category === category;
    item.style.display = matches ? '' : 'none';
  });

  if (reduced) return;

  Flip.from(state, {
    duration: 0.55,
    ease: '${ease}',
    scale: true,
    absolute: true,
    stagger: 0.03,
    onEnter: (elements) =>
      gsap.fromTo(elements, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.4 }),
    onLeave: (elements) =>
      gsap.to(elements, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
  });
}`,
        },
        'kinetic-type': {
            plugins: ['SplitText', 'ScrollTrigger'],
            body: `const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  SplitText.create('[data-ng-kinetic]', {
    type: 'lines,chars',
    mask: 'lines',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.chars, {
        yPercent: 115,
        rotationZ: 2,
        duration: 0.65,
        ease: '${ease}',
        stagger: { amount: 0.32, from: 'start' },
        scrollTrigger: {
          trigger: '[data-ng-kinetic]',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    },
  });
});`,
        },
        'magnetic-cursor': {
            plugins: [],
            body: `const mm = gsap.matchMedia();

mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const target = document.querySelector<HTMLElement>('[data-ng-magnetic]');
  if (!target) return;

  // CRITICAL GSAP PERFORMANCE LAW: Pre-allocate quickTo setters outside pointermove
  const xTo = gsap.quickTo(target, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(target, 'y', { duration: 0.35, ease: 'power3' });

  const onMove = (e: PointerEvent) => {
    const rect = target.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    xTo(relX * 0.28);
    yTo(relY * 0.28);
  };

  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerleave', onLeave);
  return () => {
    target.removeEventListener('pointermove', onMove);
    target.removeEventListener('pointerleave', onLeave);
  };
});`,
        },
        'scroll-batch': {
            plugins: ['ScrollTrigger'],
            body: `const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.set('[data-ng-batch-card]', { autoAlpha: 0, y: 24 });

  ScrollTrigger.batch('[data-ng-batch-card]', {
    interval: 0.1,
    batchMax: 4,
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: '${ease}',
        stagger: 0.06,
        overwrite: true,
      }),
  });
});`,
        },
    };
    const selected = coreSnippets[pattern];
    const pluginImports = selected.plugins.length > 0
        ? `\n${selected.plugins.map((p) => `import { ${p} } from 'gsap/${p}';`).join('\n')}\n\ngsap.registerPlugin(${selected.plugins.join(', ')});`
        : '';
    let code = '';
    if (framework === 'react') {
        const pluginsList = selected.plugins.length > 0 ? `, ${selected.plugins.join(', ')}` : '';
        code = `'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';${selected.plugins.length > 0
            ? `\n${selected.plugins.map((p) => `import { ${p} } from 'gsap/${p}';`).join('\n')}`
            : ''}

gsap.registerPlugin(useGSAP${pluginsList});

export function useNonGenericMotion() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
${selected.body
            .split('\n')
            .map((l) => (l ? `      ${l}` : ''))
            .join('\n')}
    },
    { scope: containerRef }
  );

  return containerRef;
}
`;
    }
    else if (framework === 'vue') {
        code = `import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';${pluginImports}

export function useNonGenericMotion() {
  const containerRef = ref<HTMLElement | null>(null);
  let ctx: gsap.Context | undefined;

  onMounted(() => {
    if (!containerRef.value) return;
    ctx = gsap.context(() => {
${selected.body
            .split('\n')
            .map((l) => (l ? `      ${l}` : ''))
            .join('\n')}
    }, containerRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
  });

  return { containerRef };
}
`;
    }
    else if (framework === 'svelte') {
        code = `import { onMount } from 'svelte';
import gsap from 'gsap';${pluginImports}

export function mountNonGenericMotion(node: HTMLElement) {
  let ctx: gsap.Context | undefined;
  onMount(() => {
    ctx = gsap.context(() => {
${selected.body
            .split('\n')
            .map((l) => (l ? `      ${l}` : ''))
            .join('\n')}
    }, node);
    return () => ctx?.revert();
  });
}
`;
    }
    else {
        code = `import gsap from 'gsap';${pluginImports}

export function initNonGenericMotion(scope: Element | Document = document) {
  const ctx = gsap.context(() => {
${selected.body
            .split('\n')
            .map((l) => (l ? `    ${l}` : ''))
            .join('\n')}
  }, scope);

  return () => ctx.revert();
}
`;
    }
    return {
        pattern,
        framework,
        worldId: world.id,
        worldName: world.name,
        plugins: selected.plugins,
        accessibilityNotes: [
            'Uses gsap.matchMedia() to honor (prefers-reduced-motion: reduce) automatically.',
            'Preserves full visibility (autoAlpha: 1, y: 0) when motion is disabled.',
        ],
        performanceNotes: [
            'Animates only compositor-friendly transform (x, y, xPercent, yPercent, scale) and opacity/autoAlpha properties.',
            'Cleans up all ScrollTriggers, SplitText instances, and event listeners via gsap.context() / useGSAP().',
        ],
        code,
    };
}
