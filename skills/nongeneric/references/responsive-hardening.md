# Responsive Hardening Playbook (`doesntbreak` Integration)

Every `nongeneric` surface is engineered mobile-first from `320px` up to `1440px+` ultrawide viewports.

---

## 1. The 7 Non-Negotiable Responsive Invariants

1. **Zero Horizontal Overflow (`viewport-width-overflow`, `rigid-desktop-width`)**:
   - `document.documentElement.scrollWidth <= document.documentElement.clientWidth` at `320px`, `375px`, `768px`, `1024px`, and `1440px`.
   - Never use `width: 100vw` (which includes the vertical scrollbar width on desktop); use `width: 100%`.
   - Never use fixed widths like `width: 480px`; use `width: min(100%, 480px)` or `max-width: 480px; width: 100%`.
2. **Flex & Grid Shrink Safety (`missing-min-w-0`)**:
   - Every flex child or CSS Grid item that contains long text, code, URLs, or `text-overflow: ellipsis` (`truncate`) MUST include `min-width: 0` (`min-w-0`).
3. **Intrinsic Auto-Fit Grids (`unbounded-grid-track`)**:
   - Always guard `minmax()` minimum tracks with `min()`:
     ```css
     grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
     ```
4. **Dynamic Viewport Units (`legacy-viewport-height`)**:
   - Never use bare `height: 100vh` or `min-height: 100vh` alone. Use `min-height: 100dvh` (or `100svh` for hero stages that shouldn't jump when mobile browser toolbars retract).
5. **No Fixed Heights on Text Containers (`fixed-height-text-box`)**:
   - Never set `height: Npx` on cards or sections containing text. Use `min-height` and padding so content expands gracefully when lines wrap on 320px screens or at 200% browser zoom.
6. **iOS Safari Input Floor (`ios-input-zoom`)**:
   - Every `<input>`, `<select>`, and `<textarea>` must have `font-size >= 16px` (`1rem`) on mobile viewports to prevent iOS Safari from auto-zooming the page on focus.
7. **Touch Target Floor (`tiny-tap-target`)**:
   - Every interactive button, link, keycap trigger, or toggle must provide at least a `44x44px` hit target on touch viewports.
