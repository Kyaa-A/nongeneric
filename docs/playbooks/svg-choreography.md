# SVG Choreography Engineering Playbook

This playbook documents the architecture, preparation, and animation patterns for scalable, accessible, and performant SVG motion choreography.

## SVG Preparation

### `vector-effect: non-scaling-stroke`
When designing responsive SVGs, scaling the entire SVG will normally scale stroke widths proportionally. To keep crisp 1px strokes regardless of SVG scale, always apply `vector-effect="non-scaling-stroke"` to your paths. This prevents blurry or overly thick lines on high-DPI displays or when scaled up dynamically.

### Path Normalization
Before applying complex SVG transformations, ensure paths are normalized. This involves:
- Expanding shapes (e.g. `<rect>`, `<circle>`, `<polygon>`) into `<path>` equivalents, especially when planning to use `MorphSVGPlugin`.
- Removing inline transform attributes within `<path>` definitions where possible (bake transforms into the path data).
- Validating path lengths to ensure predictability for draw animations.

## DrawSVGPlugin vs Native `stroke-dashoffset`

**Native `stroke-dasharray` and `stroke-dashoffset`:**
The vanilla CSS approach involves manually querying `path.getTotalLength()` and animating `stroke-dashoffset` from the total length down to 0. While zero-dependency and fast, it fails consistently across browsers due to scaling glitches, sub-pixel rendering bugs on iOS Safari, and complex paths containing multiple sub-paths.

**GSAP DrawSVGPlugin:**
We exclusively use `DrawSVGPlugin` because it abstracts away cross-browser inconsistencies. It can animate multiple paths without needing to manually calculate `getTotalLength()` for each, properly handles compound paths, and avoids layout trashing when recalculating path bounds.

## MorphSVGPlugin Rotational Alignment

When morphing between two paths using `MorphSVGPlugin`, the plugin attempts to align starting points automatically. However, when morphing complex organic shapes, the default heuristic can lead to twisting or rotating artifacts mid-morph.

To fix rotational issues:
- Use the `shapeIndex` property to manually define the starting vertex of the morph.
- Pass an array to `shapeIndex: [0, 5]` to align specific vertices if needed.
- Consider ensuring the source and target paths have a similar number of anchor points before exporting from Illustrator/Figma.

## MotionPathPlugin

`MotionPathPlugin` is used for binding elements (SVGs, DOM nodes) to complex bezier curves.
- **`path`**: Supply the target `<path>` selector.
- **`align`**: Usually set to the path itself, forcing the target element to snap its origin to the path.
- **`alignOrigin`**: Crucial for alignment. Defaults to top-left `[0, 0]`. Most of the time, set it to `[0.5, 0.5]` so the element’s exact center rests on the path.
- **`autoRotate`**: Set to `true` so the target orientates along the curve smoothly.

## Reduced-Motion Static Reveal Fallbacks

All SVG choreographies must include an explicit fallback for users with vestibular disorders or `prefers-reduced-motion` settings.

**Guidelines:**
1. Do not use spatial movement, complex drawing, or orbital motion.
2. Ensure the final state of the animation is the default static state.
3. Replace motion with a gentle opacity fade (`duration: 0.5`) or simply make it instant (`gsap.set`).

Example using GSAP `matchMedia`:
\`\`\`javascript
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Complex path morph
  gsap.to(".shape", { morphSVG: ".target", duration: 2 });
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Instant reveal
  gsap.set(".shape", { morphSVG: ".target", opacity: 1 });
});

return () => mm.revert();
\`\`\`
