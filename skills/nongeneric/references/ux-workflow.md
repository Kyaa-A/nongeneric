# UX Workflow: From Task to Recoverable Interaction

Before choosing an aesthetic direction, establish the smallest complete user journey. For a focused change, cover the affected journey rather than redesigning the whole product.

## 1. Define the task

Record the intended user, operating context, entry point, primary task, and observable successful outcome. Use product facts; label assumptions and ask only when a missing fact changes the interaction. Identify existing navigation, components, terminology, and brand constraints to preserve.

## 2. Map the flow and information hierarchy

Describe entry → decision → action → feedback → next step. Put the information needed for each decision beside its control. Keep the primary action obvious, name actions by their outcome, and provide a clear way back. Define Back, refresh, deep-link, and abandonment behavior. Preserve relevant filters, selection, and list position on return where supported. State what unsaved work survives and how loss is prevented; do not promise persistence the product does not provide. Keep sensitive form values out of URLs.

Match the visitor mode:

- **Persuade:** understand the offer, inspect credible evidence, and take the conversion action.
- **Operate:** find the relevant record, complete the task, and confirm the saved result.
- **Read:** locate the answer, understand it, and follow useful navigation or references.
- **Experience:** discover the interaction, participate, and retain an accessible exit or alternate path.

## 3. Specify states before implementation

Use a compact checklist or table in the working response. For each applicable state, identify its trigger, visible feedback, available action, and recovery path:

| State | Required behavior |
| --- | --- |
| Initial / empty | Explain what belongs here and offer a useful next action. |
| Loading / pending | Indicate progress, preserve context, and prevent accidental duplicate submissions. |
| Success | Confirm the actual outcome and show the next useful action. |
| Validation error | Identify the field and correction; retain entered values and associate the error with the control. |
| Service error / offline | Explain what failed, preserve work, and offer retry when supported. |
| No results | Distinguish filtered results from missing data; offer clear filters or a revised query. |
| Permission denied | Explain the restriction and legitimate next step without exposing restricted data. |
| Destructive action | State the affected item and consequence; use confirmation or undo appropriate to the action. |

Mark irrelevant states with a reason. Do not invent backend functionality or show a successful save without evidence. Label simulated data and behavior explicitly.

## 4. Place feedback by its job

Choose placement using [interaction-patterns.md](interaction-patterns.md). Match the feedback to where the user can act, rather than treating every failure or final result as a modal.

| Feedback | Placement | Recovery |
| --- | --- | --- |
| Field validation | Beside the field; use an error summary for a form with dispersed errors or when the product convention requires it | Link errors to controls; after failed submit, focus the summary or first invalid field. |
| Recoverable conflict (for example, a taken slot) | In the affected region when the user can resolve it there | Keep entered data, explain the unavailable choice, and expose actual alternatives. |
| Decision that must precede further work | Named modal dialog with a clear cancel/exit path | Explain consequences and provide the decision inside it. |
| Service failure / offline | Persistent message in the affected form or region | Preserve work and distinguish a confirmed failure from an unknown save outcome before offering retry. |
| Completed flow | Dedicated result view for a durable receipt; local confirmation for a small completed action | Confirm the actual result and make the next action available. |
| Passive status (saved, copied) | Polite status region or nonblocking toast | Do not steal focus or make a transient message the only record of an important outcome. |

When a dialog is appropriate, follow the library's focus and dismissal rules. Do not stack dialogs or automatically close on backdrop click when doing so would lose work. A bottom sheet is a presentation choice, not a different accessibility model.

For a sticky action bar, reserve real layout space as well as scroll padding for its height. Verify the last control can scroll fully above it, including with the mobile keyboard open and at zoom. Do not force the primary action into the initial viewport at the expense of decision-critical information.

## 5. Make forms understandable and recoverable

- Ask only for information needed for the task. Group related inputs and keep the reading and keyboard sequence predictable; reveal optional detail without hiding required information or consequences.
- Keep visible labels, required/optional indicators, format hints, and errors associated with controls. Use appropriate input types and autocomplete; allow paste and password managers.
- Validate on submit by default. If earlier feedback helps, wait until the user has finished the relevant input; avoid showing errors on untouched fields or announcing every keystroke. Recheck corrected fields and clear obsolete errors.
- Explain what is wrong and how to correct it. Set `aria-invalid` on invalid fields and connect errors with `aria-describedby`, retaining any still-relevant hint references.
- An unexplained disabled submit button is not validation feedback. Prevent duplicate pending submissions while making progress and failure visible. Restore a usable action after a confirmed failure; reconcile an unknown outcome before repeating an operation that could create duplicates.

## 6. Check interaction access

Use semantic controls and accessible names. Define keyboard order, visible focus, dialog focus entry/return, and status announcements. Provide an alternative to drag-only actions. Check long content, text zoom, and applicable locale/RTL requirements. Preserve existing accessible component behavior.

## 7. Define acceptance evidence

Write a short task scenario with expected outcomes, including at least one relevant failure/recovery path. Execute it using the [browser verification protocol](browser-verification.md). A persona critique is an expert review, not observed user research.

Use the applicable examples as scenario templates, replacing the domain and expected result with product facts:

| Scenario | Expected outcome |
| --- | --- |
| Submit a form with an invalid field, then correct it | The error is discoverable by keyboard, links to the field, retains other values, and clears after correction. |
| A selected booking slot becomes unavailable | No false confirmation; entered details remain; another available slot can be selected without restarting. |
| A save request times out | The UI reports uncertainty, preserves input, and checks the outcome before allowing an unsafe retry. |
| Open a record from a filtered list, then go Back | Relevant list context returns as specified; refresh and deep-link behavior match the declared contract. |
| Open and dismiss a dialog by keyboard | Focus enters and stays within the modal, then returns logically; dismissal does not silently discard work. |

Record observed behavior, not just a checklist tick. For a redesign, compare the same task before and after: successful completion, errors/recovery, and avoidable steps. Do not invent user-study results or universal completion-time targets.
