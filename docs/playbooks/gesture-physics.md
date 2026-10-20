# Gesture Physics Playbook

This reference guide covers creating cleanup-safe, reduced-motion-safe, and highly accessible gesture-based interactions using GSAP's \`Observer\` and \`Draggable\` plugins.

## 1. GSAP Observer & Draggable
Both \`Observer\` and \`Draggable\` are excellent for creating rich, physics-based interactions in the DOM.

- **Observer**: Best for responding to wheel, touch, and pointer events universally.
- **Draggable**: Best for explicit drag/drop, bounded movement, and inertia.

## 2. Best Practices

### Cleanup on Unmount
Frameworks like React, Vue, and Svelte require explicit cleanup to avoid memory leaks or duplicated event listeners.

- In React: Always use \`useGSAP\` which automatically cleans up.
- In Vue/Svelte/Vanilla: Wrap logic in \`gsap.context()\` and call \`ctx.revert()\` when unmounting.

### Wheel and Touch Debouncing
When using \`Observer\`, it frequently fires \`onUp\`, \`onDown\`, etc.
If triggering a large animation or timeline transition, either debounce the callback or check a boolean \`isAnimating\` flag to prevent overlapping animations and scroll jank.

### Snap Grids
\`Draggable\` has built-in support for snapping. Use \`liveSnap: true\` and the \`snap\` function to round values to specific increments. For example, a dial snap:
\`\`\`js
Draggable.create(element, {
  type: "rotation",
  liveSnap: true,
  snap: (value) => Math.round(value / 90) * 90
});
\`\`\`

## 3. Keyboard Parity and Accessibility (WCAG 2.2)

A crucial aspect of WCAG 2.2 is ensuring that drag/swipe gestures are fully operable via keyboard. Do not rely solely on pointer events!

**Requirements:**
1. The draggable container must have \`tabindex="0"\`.
2. Attach \`keydown\` listeners for \`ArrowUp\`, \`ArrowDown\`, \`ArrowLeft\`, and \`ArrowRight\`.
3. Provide equivalent movement or transitions within these keydown listeners that mimic the gesture.

Example implementation:
\`\`\`js
function handleKeyDown(e) {
  if (e.key === 'ArrowRight') { gsap.to(target, { x: '+=50', ease: 'expo.out' }); }
  else if (e.key === 'ArrowLeft') { gsap.to(target, { x: '-=50', ease: 'expo.out' }); }
  // Provide up/down as necessary
}
\`\`\`

Always check \`prefers-reduced-motion\` and clear animations out completely via \`gsap.matchMedia()\` for users who have requested reduced motion.
