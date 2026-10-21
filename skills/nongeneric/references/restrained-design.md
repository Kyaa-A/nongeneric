# Restrained Design: Precision Before Spectacle

Use this reference for clean, calm, premium interfaces and whenever a motion or typography choice adds noise. Distinction can come from composition, material, content, and precise interaction feedback. A static surface can be fully finished.

## Choose the amount of expression

- **Operate / read:** Default to quiet controls and stable content. Keep frequent navigation, typing, focus changes, and data inspection immediate. A signature detail is optional and may be static.
- **Persuade:** Let a truthful product demonstration or strong composition carry the first impression. Use motion only when it explains the product or clarifies a change.
- **Experience:** A more expressive sequence may serve the work, but preserve an accessible exit, reduced-motion path, and discoverable interaction.

Before adding an effect, state its purpose, expected frequency, and what would be lost if it were removed. If nothing useful is lost, omit it. Do not introduce a decorative cursor, continuous loop, scroll hijack, blur transition, or stagger merely to make a surface feel expensive. Keep at most one dominant expressive treatment in a viewport; zero is valid.

## Small interactions that feel considered

Adapted selectively from Emil Kowalski's design-engineering guidance linked below:

- Repeated interactions deserve less motion. Keep keyboard-driven task execution and focus immediate; do not replay a presentation entrance on every revisit.
- Give controls clear press, hover, focus, selected, disabled, and pending states as applicable. Feedback can be a color or border change; scaling every button is not required. Gate pointer hover effects so touch does not get stuck in a hover state.
- If a popover scales, anchor its transform origin to the actual trigger placement; centered dialogs can remain centered. Avoid large zooms or entrances from zero size.
- Prefer retargetable CSS transitions for simple reversible state changes. Preserve the current visual position during rapid toggles instead of restarting the entrance. Use existing component behavior and tokens before adding another animation library.
- Choose easing that responds promptly to input. Keep constant-rate progress linear only when it represents constant progress. Use the existing [motion timing defaults](interaction-patterns.md#motion-and-interaction-state), shortening or removing motion for frequent actions.
- Keep reduced-motion state changes immediate and preserve the closed-state/focus contract. Inspect interrupted exits, repeated clicks, and preference changes; visual smoothness never overrides keyboard access.

GSAP remains available for sequences, coordinated timelines, and scroll storytelling that earn their complexity. Do not install it for a static page or simple CSS feedback. Existing accessible components and the host design system take precedence over stylistic recipes.

## Typography and component consistency

Follow the role tokens in [craft-floor.md](craft-floor.md). The static detector still flags some common fonts heuristically; for an intentional brand/type choice, document the existing [contextual waiver](anti-slop-catalog.md#inline-waiver-syntax) instead of swapping families to chase a score. One well-chosen family may cover headings and body; add another only for a specific job. Use monospace for code or data that benefits from it, not as decorative telemetry everywhere.

Consistency means the same role uses the same size, line-height, weight, and tracking across screens. It does not mean a heading and an input share one size. Reuse spacing, radius, icon size, and control-height tokens as well. Check the same component in default, selected, error, and loading states for accidental size changes.

## Study references without inheriting their problems

Use [Awwwards typography](https://www.awwwards.com/websites/typography/) and [clean design](https://www.awwwards.com/websites/clean/) as discovery galleries. For a new direction, inspect two or three relevant live sites when browser access is available; record the URL, observation, and the specific principle worth adapting. Study alignment, image treatment, hierarchy, spacing, and interaction response. A screenshot does not establish keyboard behavior, performance, or task completion.

Do not copy branding, protected assets, or an entire composition. Do not claim an award, endorsement, or guaranteed award-winning result. If a reference cannot be opened, label it uninspected and work from verified product constraints. Use references appropriate to the visitor mode rather than applying an exhibition site's choreography to a settings form.

## Acceptance scenarios

| Surface | What a successful restrained treatment demonstrates |
| --- | --- |
| Settings form | Shared label/input sizes, visible validation, immediate focus, and no entrance replay after saving. |
| Documentation page | Stable reading column, consistent heading roles, visible navigation, and no decorative motion needed to read. |
| Product launch | A clear offer and truthful working proof; any animation explains rather than delays the action. |
| Repeated popover interaction | Correct origin if animated, immediate usable focus, safe interruption and dismissal, and an instant reduced-motion path. |

Critique the rendered result using [browser-verification.md](browser-verification.md). An intentional absence of motion or a single-family type system is not a missing craft feature.

## Source and adaptation boundary

Selected principles adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) at commit `2d228630ba1446365f614a108cb8252f1feda202` (consulted 2026-10-22): [design engineering](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/emil-design-eng/SKILL.md) and [finding animation opportunities](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/find-animation-opportunities/SKILL.md). Copyright (c) 2026 Emil Kowalski; [MIT license notice](emil-skills-LICENSE.txt).

This is a curated adaptation, not a bundled copy of every upstream skill. NonGeneric retains its task-first interaction contracts, instant reduced-motion behavior, and performance verification. Upstream numeric frequency cutoffs, blanket bans on keyboard-triggered animation, layout/blur recipes, and framework-specific performance claims are not imported as universal rules. Awwwards is an external inspiration source, not licensed content bundled here or an endorsement.
