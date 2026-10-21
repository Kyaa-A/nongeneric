# Interaction Pattern Library

Choose the smallest interaction that lets the user finish the task with enough context. There is no universally best container. Preserve an established, accessible product pattern unless observed friction justifies a change. Use this guide with [ux-workflow.md](ux-workflow.md) before styling.

## Find the right pattern

| User need | Start with | Choose something else when |
| --- | --- | --- |
| Correct a value or resolve a local error | [Inline feedback](#inline-feedback-and-disclosure) | A separate decision must interrupt further work. |
| Reveal optional detail beside its context | [Disclosure](#inline-feedback-and-disclosure) | The information is required to make the primary decision: keep it visible. |
| Make a short, consequential decision | [Modal dialog](#modal-dialog) | The task needs extensive editing, navigation, or comparison with the page. |
| Inspect/edit a record while referring to a list | [Side panel / drawer](#side-panel-drawer-and-bottom-sheet) | The task needs a durable URL or more space: use a full page. |
| Navigate between product areas | [Sidebar](#navigation-sidebar) | On small screens, use the same navigation with its disclosure or modal-drawer adaptation below. |
| Adjust a nearby option or use a compact picker | [Popover](#popover-and-menu) | The content is long, consequential, or needs an independent destination. |
| Choose an action from a trigger | [Menu](#popover-and-menu) | The choices are form values: use a select, radio group, or combobox. |
| Explain a control with brief supplementary text | [Tooltip](#tooltip) | The content includes links, controls, or essential instructions. |
| Confirm a small action without interrupting | [Status / toast](#status-toast-and-banner) | The result needs to remain findable or the user must act. |
| Explain an ongoing service condition | [Persistent banner](#status-toast-and-banner) | The message belongs to a specific field or local task. |
| Complete a long task or retain a receipt | [Dedicated page](#dedicated-page-and-result-view) | A brief contextual action can safely stay in place. |

Before implementation, record: **task → chosen pattern → reason → focus/keyboard behavior → dismissal and unsaved work → mobile behavior → evidence scenario**. For a small change, one sentence is enough. Do not add every pattern to every product.

## Modal dialog

**Use:** A bounded task or decision that warrants pausing the surrounding work. Example: confirm deletion of a named record when undo is unavailable. Prefer undo for low-risk reversible actions when the product supports it.

**Avoid:** Routine saved feedback, field validation, long forms, or detail that users need to compare with the obscured page. A failed request alone is not a reason to open a modal.

**Contract:** Use a named dialog with real modal behavior: focus enters it, Tab stays inside, and the background is inert. Provide Escape and a visible cancel/close action with a safe result. Return focus to the trigger or the logical next control if the trigger disappeared. Choose initial focus for the content; for an irreversible decision, the safer action is usually appropriate. Do not label a nonmodal panel `aria-modal="true"`.

**Dismissal/mobile:** Backdrop dismissal is optional, not mandatory. Closing must not silently lose work: preserve the draft or explicitly resolve discard in the current surface. Avoid stacked dialogs. A narrow-screen sheet/fullscreen presentation still needs the same modal contract; keep its heading, controls, and focused input usable with the on-screen keyboard.

**Acceptance:** Open by keyboard, traverse forward/backward, cancel with Escape, reopen, and complete. Verify background inertness, focus return, and draft handling.

**See it:** [WAI-ARIA dialog examples and behavior](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · [React Aria interactive modal](https://react-aria.adobe.com/Modal).

## Side panel, drawer, and bottom sheet

**Use:** An inspector, filters, or a short edit related to the current workspace. “Drawer” and “sheet” describe placement; they do not determine modality. Decide explicitly whether the user can still operate the page.

**Avoid:** A cramped long workflow, nested drawers, or a panel that covers the very data the user needs to reference. Promote a substantial task to a page.

**Contract:** For a nonmodal inspector, leave the workspace operable, provide a labelled region and a reachable close control, and define a keyboard route between trigger and panel without trapping focus. If opening moves focus into the panel, closing returns it logically. A modal drawer uses the dialog contract above. Preserve selected-record context, and define whether filter changes apply immediately or after an explicit Apply; Cancel must match that choice.

**Mobile:** Reflow beside-page content into a page or modal sheet only when it no longer fits. If modality changes at a breakpoint, update focus behavior and background access too. Resizing must not lose a draft. Swiping cannot be the only way to close.

**Acceptance:** Inspect two records, return to the list, close using the keyboard, and resize while editing. Confirm the intended selection and draft behavior.

**See it:** [React Aria interactive sheet](https://react-aria.adobe.com/Sheet) demonstrates edge placement and dismissal. [Carbon UI shell source](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/UIShell/README.md) distinguishes side navigation from header action panels; a shell panel is not a universal record-inspector recipe.

## Navigation sidebar

**Use:** Stable navigation between product areas, with clear grouping and a visible current destination. This is different from a temporary detail panel.

**Avoid:** Replacing navigation links with an application menu merely because the layout is vertical. Keep familiar labels; do not hide every destination behind unexplained icons.

**Contract:** Use a named navigation landmark and links, with `aria-current="page"` for the current destination. Expandable groups use buttons with expanded state. Preserve normal link behavior and a way to skip repeated navigation. On mobile, use a labelled button toggle with `aria-expanded` reflecting visibility and `aria-controls` pointing to the navigation container. Collapsed links must be out of the tab order. For a nonmodal disclosure, keep normal page access; if navigation becomes a modal drawer, apply the modal contract and return focus when it closes.

**Acceptance:** Reach a destination without a pointer, identify the active page, and use Back. Test both expanded desktop navigation and the small-screen toggle.

**See it:** [WAI-ARIA disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) · [Carbon shell components](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/UIShell/README.md).

## Popover and menu

**Use:** A popover anchors compact content to its trigger, such as a date picker or formatting controls. A menu presents actions with menu-specific keyboard behavior. Choose the contained widget's semantics before the overlay's appearance.

**Avoid:** Treating every floating box as `role="menu"`, putting a long form in a tiny popup, or relying on hover to open interactive content. A popover may be modal or nonmodal depending on its implementation; inspect the actual component contract.

**Contract:** Use an accessible trigger and the appropriate expanded/popup state. Define focus on open, Escape dismissal, and focus after close. Menus use their documented arrow-key and item-navigation behavior; form controls retain their own keyboard model. Position content inside the viewport and keep it usable when scrolling or zooming. Outside-click dismissal must not discard meaningful edits.

**Mobile:** Use a sheet or page when anchoring leaves too little room. Keep an explicit trigger and exit; touch must not depend on a hover state.

**Acceptance:** Open from a viewport edge, operate by keyboard, dismiss, and verify focus. Check touch, zoom, and clipping inside scroll containers.

**See it:** [React Aria interactive popover](https://react-aria.adobe.com/Popover) · [WAI-ARIA menu button examples](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).

## Tooltip

**Use:** Brief supplementary information about a control. Keep a usable accessible name even when the tooltip is absent.

**Avoid:** Essential instructions, error messages, or interactive content. Put necessary guidance inline; use an appropriate popover for interactive help.

**Contract:** Reveal on keyboard focus as well as hover, allow Escape dismissal, and keep focus on the trigger. Hover content must remain reachable without disappearing as the pointer crosses to it. Do not require a touch user to discover a long press to understand the control.

**Acceptance:** Understand and operate the control without the tooltip, then verify focus/hover and Escape behavior.

**See it:** [WAI-ARIA tooltip draft guidance](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) · [React Aria interactive tooltip](https://react-aria.adobe.com/Tooltip).

## Inline feedback and disclosure

**Use:** Field errors, nearby recovery, optional explanation, and small contextual edits. Keep decision-critical information visible instead of hiding it in an accordion.

**Contract:** Associate errors with controls and preserve input. For failed submit, guide focus to an error summary or first invalid field according to the product's established pattern. A summary should link to the affected controls. Disclosures use semantic buttons with expanded state or native details/summary; closed content must not leave hidden controls in the tab order.

**Mobile:** Let content reflow in reading order. Ensure errors and expanded content are not obscured by sticky chrome or the keyboard.

**Acceptance:** Submit invalid data, navigate to and correct the error, and submit again without re-entering unrelated values. Toggle optional content by keyboard and verify focus order.

**See it:** [GOV.UK error summary examples](https://design-system.service.gov.uk/components/error-summary/) · [WAI-ARIA disclosure examples](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/). GOV.UK requires a summary for every validation error; [Primer's forms source](https://github.com/primer/design/blob/main/content/ui-patterns/forms/overview.mdx) also permits focusing the first invalid field. Use the host product's convention rather than copying a threshold blindly.

## Status, toast, and banner

**Use:** Local status or a toast for brief, nonblocking feedback; a persistent banner for an ongoing condition affecting a region or service. Announce routine status politely without moving focus. Reserve urgent announcements for information that actually requires immediate attention.

**Avoid:** A disappearing error as the only recovery path, an auto-dismissed toast as the only access to undo, repeated announcements, or a banner for every field error. Keep consequential outcomes findable in the page or activity history when supported.

**Contract/mobile:** Make the message understandable without color alone. Do not cover controls or steal focus. Actionable notifications must allow enough time and keyboard access; retain an equivalent persistent action when a transient message disappears. Follow the component's accessible timing and dismissal behavior.

**Acceptance:** Trigger while typing, verify focus stays put, find the result after the notification disappears, and exercise any action by keyboard.

**See it:** [GOV.UK banner examples and selection guidance](https://design-system.service.gov.uk/components/notification-banner/) · [React Aria toast demo](https://react-aria.adobe.com/Toast) (marked alpha when consulted; an illustration, not a dependency recommendation).

## Dedicated page and result view

**Use:** A long or multistep task, shareable/deep-linked record, or durable confirmation with reference information and next steps. A result page can be the correct end of a flow without leaving the original form visible behind an overlay.

**Contract:** Use a clear page title and heading, sensible route-change focus, and Back behavior that matches the task. Preserve relevant list context on return. Show only confirmed outcomes; distinguish pending or unknown results. Refresh must not silently replay a state-changing operation. Do not claim resumability or persistence the backend does not support.

**Mobile/acceptance:** Keep reading order and progress clear at narrow widths. Finish the flow, reload the result, return to the previous context, and test a direct link where supported.

**See it:** [GOV.UK confirmation page example](https://design-system.service.gov.uk/patterns/confirmation-pages/).

## Using the references

These are original selection guidelines informed by the linked public design systems, not copied component implementations. Consulted 2026-10-21. Live examples and APIs can change: check the installed library's current behavior before adopting code. Source repositories: [GOV.UK Design System](https://github.com/alphagov/govuk-design-system), [Primer design](https://github.com/primer/design), [Adobe React Spectrum / React Aria](https://github.com/adobe/react-spectrum), and [Carbon](https://github.com/carbon-design-system/carbon).

Use the links to explore a pattern, not as proof that your implementation works. Validate the selected behavior using [browser-verification.md](browser-verification.md), including a recovery path, and report what remains untested. Do not install another component library just to imitate an example.
