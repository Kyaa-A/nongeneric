export const COMMAND_PALETTE_PACK = {
  id: "command-palette",
  title: "Command Palette (Cmd+K) & Keyboard Action Bar",
  category: "components",
  typography: {
    display: "Syne",
    body: "Work Sans",
    mono: "JetBrains Mono"
  },
  tokens: {
    background: "oklch(0.15 0.02 250)",
    surface: "oklch(0.20 0.02 250)",
    border: "oklch(0.30 0.02 250)",
    text: "oklch(0.90 0.02 250)",
    textMuted: "oklch(0.60 0.02 250)",
    accent: "oklch(0.70 0.15 250)"
  },
  gsapRecipe: {
    in: "fromTo(el, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' })",
    out: "to(el, { autoAlpha: 0, scale: 0.95, duration: 0.15, ease: 'power2.in' })"
  }
};

export function generateCommandPaletteBlueprint({ framework = "react" } = {}) {
  const css = `
.command-palette-backdrop {
  position: fixed;
  inset: 0;
  background-color: oklch(0% 0 0 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.command-palette-container {
  background-color: oklch(0.20 0.02 250);
  border: 1px solid oklch(0.30 0.02 250);
  border-radius: 8px;
  width: min(100%, 600px);
  color: oklch(0.90 0.02 250);
  font-family: 'Work Sans', sans-serif;
  box-shadow: 0 10px 30px oklch(0% 0 0 / 0.5);
  overflow: hidden;
}
.command-palette-input {
  width: 100%;
  padding: 16px;
  font-size: 1.2rem;
  font-family: 'Syne', sans-serif;
  background: transparent;
  border: none;
  border-bottom: 1px solid oklch(0.30 0.02 250);
  color: oklch(0.90 0.02 250);
  outline: none;
}
.command-palette-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
  margin: 0;
  list-style: none;
}
.command-palette-item {
  padding: 12px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.command-palette-item:hover,
.command-palette-item[aria-selected="true"] {
  background-color: oklch(0.30 0.02 250);
}
.command-palette-shortcut {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: oklch(0.60 0.02 250);
  background-color: oklch(0.15 0.02 250);
  padding: 4px 8px;
  border-radius: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .command-palette-container {
    animation: none;
    transition: none;
  }
}
  `.trim();

  let code = '';
  if (framework === 'react') {
    code = `
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function CommandPalette({ isOpen, onClose }) {
  const container = useRef(null);
  const palette = useRef(null);
  const { contextSafe } = useGSAP({ scope: container });

  useGSAP(() => {
    if (!isOpen) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(palette.current,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(palette.current, { autoAlpha: 1, scale: 1 });
    });

    return () => mm.revert();
  }, [isOpen]);

  const closePalette = contextSafe(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(palette.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: onClose
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      onClose();
    });
  });

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" ref={container} onClick={closePalette}>
      <div className="command-palette-container" ref={palette} onClick={(e) => e.stopPropagation()}>
        <input className="command-palette-input" placeholder="Search commands..." autoFocus />
        <ul className="command-palette-list">
          <li className="command-palette-item" aria-selected="true">
            <span>Open Settings</span>
            <span className="command-palette-shortcut">⌘ S</span>
          </li>
          <li className="command-palette-item">
            <span>Toggle Theme</span>
            <span className="command-palette-shortcut">⌘ T</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
    `.trim();
  } else if (framework === 'vue') {
    code = `
import { ref, watch, onUnmounted } from 'vue';
import gsap from 'gsap';

export default {
  props: ['isOpen'],
  emits: ['close'],
  setup(props, { emit }) {
    const container = ref(null);
    const palette = ref(null);
    let ctx;

    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        if (ctx) ctx.revert();
        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();
          mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(palette.value,
              { autoAlpha: 0, scale: 0.95 },
              { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
            );
          });
          mm.add('(prefers-reduced-motion: reduce)', () => {
            gsap.set(palette.value, { autoAlpha: 1, scale: 1 });
          });
        }, container.value);
      }
    });
          mm.add('(prefers-reduced-motion: reduce)', () => {
            gsap.set(palette.value, { autoAlpha: 1, scale: 1 });
          });
        }, container.value);
      }
    });

    const closePalette = () => {
      if (ctx) {
        ctx.add(() => {
          const mm = gsap.matchMedia();
          mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.to(palette.value, {
              autoAlpha: 0,
              scale: 0.95,
              duration: 0.15,
              ease: 'power2.in',
              onComplete: () => emit('close')
            });
          });
          mm.add('(prefers-reduced-motion: reduce)', () => {
            emit('close');
          });
        });
      } else {
        emit('close');
      }
    };

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return { container, palette, closePalette };
  }
}
    `.trim();
  } else if (framework === 'svelte') {
    code = `
import { onMount, onDestroy } from 'svelte';
import gsap from 'gsap';

export let isOpen = false;
export let onClose;

let container;
let palette;
let ctx;

$: if (isOpen && palette) {
  if (ctx) ctx.revert();
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(palette,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(palette, { autoAlpha: 1, scale: 1 });
    });
  }, container);
}

function closePalette() {
  if (ctx) {
    ctx.add(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(palette, {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: onClose
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        onClose();
      });
    });
  } else {
    onClose();
  }
}

onDestroy(() => {
  if (ctx) ctx.revert();
});
    `.trim();
  } else {
    // vanilla
    code = `
import gsap from 'gsap';

export function createCommandPalette(element, options = {}) {
  const palette = element.querySelector('.command-palette-container');
  let ctx = gsap.context(() => {}, element);

  function open() {
    ctx.add(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(palette,
          { autoAlpha: 0, scale: 0.95 },
          { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(palette, { autoAlpha: 1, scale: 1 });
      });
    });
  }

  function close() {
    ctx.add(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(palette, {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: options.onClose
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (options.onClose) options.onClose();
      });
    });
  }

  function destroy() {
    ctx.revert();
  }

  return { open, close, destroy };
}
    `.trim();
  }

  return { id: "command-palette", framework, code, css };
}
