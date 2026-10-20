# UX Workflow: From Task to Recoverable Interaction

Before choosing an aesthetic direction, establish the smallest complete user journey. For a focused change, cover the affected journey rather than redesigning the whole product.

## 1. Define the task

Record the intended user, operating context, entry point, primary task, and observable successful outcome. Use product facts; label assumptions and ask only when a missing fact changes the interaction. Identify existing navigation, components, terminology, and brand constraints to preserve.

## 2. Map the flow and information hierarchy

Describe entry → decision → action → feedback → next step. Put the information needed for each decision beside its control. Keep the primary action obvious, name actions by their outcome, and provide a clear way back. Check what happens when the user revisits, refreshes, or abandons the flow.

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

## 4. Check interaction access

Use semantic controls and accessible names. Define keyboard order, visible focus, dialog focus entry/return, and status announcements. Provide an alternative to drag-only actions. Check long content, text zoom, and applicable locale/RTL requirements. Preserve existing accessible component behavior.

## 5. Define acceptance evidence

Write a short task scenario with expected outcomes, including at least one relevant failure/recovery path. Execute it using the [browser verification protocol](browser-verification.md). A persona critique is an expert review, not observed user research.
