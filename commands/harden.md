---
description: Harden an interface for 320px-1440px responsiveness, keyboard navigation, WCAG contrast, and reduced-motion safety.
argument-hint: "[target]"
---

Load `skills/nongeneric/references/responsive-hardening.md`. Fix all `320px` horizontal overflows, add `min(100%, Npx)`, `min-width: 0`, `100dvh`/`100svh`, `>=16px` input font sizes, `>=44x44px` tap targets, `:focus-visible` rings, and `@media (prefers-reduced-motion: reduce)` fallbacks.
