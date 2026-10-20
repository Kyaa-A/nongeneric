export const SHADER_BRIDGE_PRESETS = [
  'uniform-scroll-scrub',
  'pointer-displacement-field',
  'dom-to-canvas-sync',
];

export function generateShaderBridgeBlueprint({ preset, framework = 'react', ease = 'power2.out' }) {
  let plugins = [];
  let body = '';

  if (preset === 'uniform-scroll-scrub') {
    plugins = ['ScrollTrigger'];
    body = `const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const uniforms = { uProgress: 0 };

  gsap.to(uniforms, {
    uProgress: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-ng-stage]',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  const updateShader = () => {
    // Sync uniforms.uProgress to your WebGL material here
  };

  gsap.ticker.add(updateShader);

  return () => {
    gsap.ticker.remove(updateShader);
  };
});`;
  } else if (preset === 'pointer-displacement-field') {
    plugins = [];
    body = `const mm = gsap.matchMedia();

mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const target = document.querySelector<HTMLElement>('[data-ng-stage]');
  if (!target) return;

  const uniforms = { uPointerX: 0, uPointerY: 0 };

  const xTo = gsap.quickTo(uniforms, 'uPointerX', { duration: 0.35, ease: '${ease}' });
  const yTo = gsap.quickTo(uniforms, 'uPointerY', { duration: 0.35, ease: '${ease}' });

  const onMove = (e: PointerEvent) => {
    const rect = target.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width * 2 - 1;
    const relY = -(e.clientY - rect.top) / rect.height * 2 + 1;
    xTo(relX);
    yTo(relY);
  };

  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerleave', onLeave);

  const updateShader = () => {
    // Sync uniforms.uPointerX and uniforms.uPointerY to WebGL here
  };
  gsap.ticker.add(updateShader);

  return () => {
    target.removeEventListener('pointermove', onMove);
    target.removeEventListener('pointerleave', onLeave);
    gsap.ticker.remove(updateShader);
  };
});`;
  } else if (preset === 'dom-to-canvas-sync') {
    plugins = [];
    body = `const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const uniforms = { uVelocity: 0 };

  const vTo = gsap.quickTo(uniforms, 'uVelocity', { duration: 0.25, ease: '${ease}' });

  const updateShader = () => {
    // Sync uniforms.uVelocity to your WebGL material here
  };

  gsap.ticker.add(updateShader);

  return () => {
    gsap.ticker.remove(updateShader);
  };
});`;
  }

  const pluginImports = plugins.length > 0
    ? `\n${plugins.map((p) => `import { ${p} } from 'gsap/${p}';`).join('\n')}\n\ngsap.registerPlugin(${plugins.join(', ')});`
    : '';

  let code = '';
  if (framework === 'react') {
    const pluginsList = plugins.length > 0 ? `, ${plugins.join(', ')}` : '';
    code = `'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';${plugins.length > 0
      ? `\n${plugins.map((p) => `import { ${p} } from 'gsap/${p}';`).join('\n')}`
      : ''}

gsap.registerPlugin(useGSAP${pluginsList});

export function useShaderBridge() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
${body.split('\n').map((l) => (l ? `      ${l}` : '')).join('\n')}
    },
    { scope: containerRef }
  );

  return containerRef;
}
`;
  } else if (framework === 'vue') {
    code = `import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';${pluginImports}

export function useShaderBridge() {
  const containerRef = ref<HTMLElement | null>(null);
  let ctx: gsap.Context | undefined;

  onMounted(() => {
    if (!containerRef.value) return;
    ctx = gsap.context(() => {
${body.split('\n').map((l) => (l ? `      ${l}` : '')).join('\n')}
    }, containerRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
  });

  return { containerRef };
}
`;
  } else if (framework === 'svelte') {
    code = `import { onMount } from 'svelte';
import gsap from 'gsap';${pluginImports}

export function mountShaderBridge(node: HTMLElement) {
  let ctx: gsap.Context | undefined;
  onMount(() => {
    ctx = gsap.context(() => {
${body.split('\n').map((l) => (l ? `      ${l}` : '')).join('\n')}
    }, node);
    return () => ctx?.revert();
  });
}
`;
  } else {
    code = `import gsap from 'gsap';${pluginImports}

export function initShaderBridge(scope: Element | Document = document) {
  const ctx = gsap.context(() => {
${body.split('\n').map((l) => (l ? `    ${l}` : '')).join('\n')}
  }, scope);

  return () => ctx.revert();
}
`;
  }

  return {
    preset,
    framework,
    plugins,
    code,
    performanceChecklist: [
      'Proxy plain JS objects to GSAP instead of DOM elements for WebGL values.',
      'Use gsap.ticker.add to update your WebGL material or Canvas 2D per frame.',
      'Always clean up the ticker listener on unmount or in gsap.matchMedia cleanup.',
      'Honor prefers-reduced-motion using gsap.matchMedia.',
      'Pre-allocate gsap.quickTo outside of pointermove event handlers.',
    ],
  };
}
