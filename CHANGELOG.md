# Changelog

User-facing changes are recorded here. See [GitHub history](https://github.com/Kyaa-A/nongeneric/commits/main/) for the complete commit record.

## Unreleased

### Added

- Project banner for the README.

- UX workflow covering tasks, flows, interaction states, and recovery.
- Browser verification protocol with explicit evidence and unverified dimensions.
- Audit regression tests for empty pages, empty scans, and JSON CLI behavior.
- Contributor guidance, community templates, and expanded security and conduct policies.
- Interaction Pattern Library with contextual container selection, focus/dismissal contracts, mobile adaptations, and live examples.
- Form recovery and unknown-save-outcome guidance, plus sticky action bar checks.
- Direct shape, craft, harden, and new-work routing to interaction guidance; overlay motion rules keep closed content out of the tab order.
- Craft and motion guidance from the booking demo: the cream/serif/terracotta default, recomposing instead of repainting, color as state, accent text contrast, and CSS for binary UI state.
- Browser verification checks for settled captures, opacity-0 visibility false positives, multiple viewport heights, and touch hover.

### Changed

- Feedback placement follows the task and recovery location instead of requiring overlays for blocking interruptions and final results.
- Human critique uses impact-based P0–P3 triage, with task, security, and accessibility blockers ahead of visual polish; CLI severities remain unchanged.
- Audit scores now explicitly describe static source checks, not design quality.
- Audit JSON includes `scoreKind` and `verification` fields.
- Audits with no supported files return null `overallScore` and `grade`, empty `pillars`, and exit code 1. Consumers must handle nullable scores.
- Craft and finish-review instructions respect visitor modes; read and operate surfaces do not require interactive hero proofs.
- Critique and polish workflows require rendered evidence before claiming surface verification.
