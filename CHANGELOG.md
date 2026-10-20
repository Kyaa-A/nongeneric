# Changelog

User-facing changes are recorded here. See [GitHub history](https://github.com/Kyaa-A/nongeneric/commits/main/) for the complete commit record.

## Unreleased

### Added

- Project banner for the README.

- UX workflow covering tasks, flows, interaction states, and recovery.
- Browser verification protocol with explicit evidence and unverified dimensions.
- Audit regression tests for empty pages, empty scans, and JSON CLI behavior.
- Contributor guidance, community templates, and expanded security and conduct policies.

### Changed

- Audit scores now explicitly describe static source checks, not design quality.
- Audit JSON includes `scoreKind` and `verification` fields.
- Audits with no supported files return null `overallScore` and `grade`, empty `pillars`, and exit code 1. Consumers must handle nullable scores.
- Craft and finish-review instructions respect visitor modes; read and operate surfaces do not require interactive hero proofs.
- Critique and polish workflows require rendered evidence before claiming surface verification.
