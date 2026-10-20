export const SVG_CHOREOGRAPHY_PRESETS = [
  'stroke-schematic-draw',
  'organic-path-morph',
  'orbital-motion-path'
];

export function generateSvgMotionBlueprint({ preset, framework = 'react', ease = 'power3.out' }) {
  if (!SVG_CHOREOGRAPHY_PRESETS.includes(preset)) {
    throw new Error(`Invalid preset: ${preset}. Valid presets are: ${SVG_CHOREOGRAPHY_PRESETS.join(', ')}`);
  }

  const plugins = [];
  let a11yNotes = 'Respects prefers-reduced-motion using gsap.matchMedia(). Spatial or complex SVG motion is replaced with simple static states or opacity fades.';
  let code = '';

  const getCommonSetup = (pluginsList) => {
    return `import { gsap } from "gsap";\n${pluginsList.map(p => `import { ${p} } from "gsap/${p}";`).join('\n')}\n\ngsap.registerPlugin(${pluginsList.join(', ')});`;
  };

  const getMatchMediaCode = (motionCode, reducedMotionCode = '// Instant state for reduced motion\n') => {
    return `    const mm = gsap.matchMedia();\n    mm.add("(prefers-reduced-motion: no-preference)", () => {\n${motionCode}\n    });\n    mm.add("(prefers-reduced-motion: reduce)", () => {\n${reducedMotionCode}\n    });\n    return () => mm.revert();`;
  };

  const generateFrameworkTemplate = (setup, mmCode) => {
    switch(framework) {
      case 'react':
        return `${setup}\nimport { useGSAP } from "@gsap/react";\nimport { useRef } from "react";\n\ngsap.registerPlugin(useGSAP);\n\nexport function SvgMotionBlueprint() {\n  const container = useRef(null);\n\n  useGSAP(() => {\n${mmCode}\n  }, { scope: container });\n\n  return <div ref={container} className="svg-container">...</div>;\n}`;
      case 'vue':
        return `${setup}\nimport { ref, onMounted, onUnmounted } from "vue";\n\nexport default {\n  setup() {\n    const container = ref(null);\n    let ctx;\n\n    onMounted(() => {\n      ctx = gsap.context(() => {\n${mmCode}\n      }, container.value);\n    });\n\n    onUnmounted(() => {\n      if (ctx) ctx.revert();\n    });\n\n    return { container };\n  }\n};`;
      case 'svelte':
        return `${setup}\nimport { onMount, onDestroy } from "svelte";\n\nlet container;\nlet ctx;\n\nonMount(() => {\n  ctx = gsap.context(() => {\n${mmCode}\n  }, container);\n});\n\nonDestroy(() => {\n  if (ctx) ctx.revert();\n});`;
      case 'vanilla':
      default:
        return `${setup}\n\nexport function initSvgMotion(container) {\n  const ctx = gsap.context(() => {\n${mmCode}\n  }, container);\n  return () => ctx.revert();\n}`;
    }
  };

  if (preset === 'stroke-schematic-draw') {
    plugins.push('DrawSVGPlugin');
    const motion = `      gsap.from(".schematic-line", {\n        drawSVG: 0,\n        duration: 1.5,\n        stagger: 0.05,\n        ease: "${ease}"\n      });`;
    const reduced = `      gsap.set(".schematic-line", {\n        drawSVG: "100%"\n      });\n      gsap.from(".schematic-line", {\n        opacity: 0,\n        duration: 0.5\n      });`;
    code = generateFrameworkTemplate(getCommonSetup(plugins), getMatchMediaCode(motion, reduced));
  } else if (preset === 'organic-path-morph') {
    plugins.push('MorphSVGPlugin');
    const motion = `      gsap.to(".morph-shape", {\n        morphSVG: ".target-shape",\n        duration: 2,\n        ease: "${ease}"\n      });`;
    const reduced = `      gsap.set(".morph-shape", {\n        morphSVG: ".target-shape"\n      });`;
    code = generateFrameworkTemplate(getCommonSetup(plugins), getMatchMediaCode(motion, reduced));
  } else if (preset === 'orbital-motion-path') {
    plugins.push('MotionPathPlugin');
    const motion = `      gsap.to(".orbiter", {\n        duration: 4,\n        ease: "${ease}",\n        motionPath: {\n          path: ".orbit-path",\n          align: ".orbit-path",\n          alignOrigin: [0.5, 0.5],\n          autoRotate: true\n        }\n      });`;
    const reduced = `      // No orbital motion, static position\n      gsap.set(".orbiter", {\n        opacity: 1\n      });`;
    code = generateFrameworkTemplate(getCommonSetup(plugins), getMatchMediaCode(motion, reduced));
  }

  return {
    preset,
    framework,
    plugins,
    code,
    a11yNotes
  };
}
