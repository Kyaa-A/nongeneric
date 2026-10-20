# Browser Verification and Evidence

Static checks detect source patterns. They do not establish visual quality, accessible interaction, task completion, or animation performance.

## 1. Open the actual surface

Use the browser tools available in the host environment and follow the project's browser instructions. Record the URL/route, tested revision or working-tree state, viewport, and data state. Use a safe local or preview environment for state-changing tests. Do not invent a browser command when no tool is available.

## 2. Inspect the rendered result

- Inspect screenshots at 320px, 375px, 768px, 1024px, and 1440px widths for major surfaces; for a focused change, cover the affected breakpoints and explain the scope.
- Check hierarchy, readable text, clipped content, sticky overlays, long labels, and image loading. Measure page overflow with `document.documentElement.scrollWidth <= document.documentElement.clientWidth`; inspect intended internal scrollers separately.
- Inspect at 200% text/browser zoom. Check actual foreground/background contrast with a suitable tool, including hover, focus, disabled, and error states where applicable.
- Save or reference screenshots with viewport and state labels. A screenshot alone does not verify interaction.

## 3. Complete the task

Run the primary scenario and a relevant failure/recovery path from the UX checklist. Verify actual outcomes, not merely button clicks. Test keyboard-only navigation, visible focus, accessible names, dialog focus return, and status feedback. Use available accessibility tooling and targeted assistive-technology checks; state the tested coverage rather than claiming full compliance.

## 4. Verify motion and runtime behavior

Test reduced motion and normal motion. Confirm essential content stays visible and tasks remain usable. Exercise resize, navigation, repeated interactions, and mount/unmount where relevant. Check console errors and observable cleanup failures. If claiming a frame-rate target, record a performance trace and the device/test conditions; source patterns cannot prove 60fps.

## 5. Report evidence and iterate

Report each dimension separately:

| Dimension | Evidence |
| --- | --- |
| Static checks | Command, files/scopes, score, findings, and justified suppressions. |
| Visual quality | Screenshots inspected, viewport/state coverage, and reviewer observations. |
| Usability | Scenario, expected/observed outcomes, and recovery path tested. |
| Accessibility | Keyboard, contrast, zoom, and assistive-tool checks actually performed. |
| Runtime behavior | Motion settings, lifecycle checks, console results, and performance measurements if taken. |

For each dimension use **verified within stated scope**, **issues found**, or **not verified**. Fix observed blockers and rerun affected checks. Preserve remaining limitations in the completion report.

If browser access or a running app is unavailable, complete useful source work and provide the exact remaining scenarios. Mark the relevant dimensions **not verified**; do not claim the surface passed the completion gate or fabricate screenshots, task results, or performance evidence. CLI JSON remains a static report; attach browser evidence separately.
