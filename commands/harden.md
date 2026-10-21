---
description: Harden an interface for 320px-1440px responsiveness, keyboard navigation, WCAG contrast, and reduced-motion safety.
argument-hint: "[target]"
---

Load `skills/nongeneric/references/responsive-hardening.md`. Fix all `320px` horizontal overflows, add `min(100%, Npx)`, `min-width: 0`, `100dvh`/`100svh`, `>=16px` input font sizes, `>=44x44px` tap targets, `:focus-visible` rings, and `@media (prefers-reduced-motion: reduce)` fallbacks.

Consult `skills/nongeneric/references/interaction-patterns.md` for container selection, focus/dismissal contracts, mobile modality changes, and overlay motion. Use `skills/nongeneric/references/ux-workflow.md` for form validation, retained input, and recovery. Verify closed content is not focusable, focus returns logically, and reduced motion applies state changes immediately; test form correction and recovery with the keyboard.
