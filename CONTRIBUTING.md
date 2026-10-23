# Contributing to NonGeneric

Contributions that sharpen anti-slop detection, add high-craft Aesthetic Worlds, or expand GSAP motion choreography blueprints are welcome.

UX guidance, accessibility improvements, documentation fixes, and reproducible bug reports are also welcome. Follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

- Search [existing issues](https://github.com/codewithasnari/nongeneric/issues) before opening a new one.
- For a large feature or new dependency, discuss the scope in an issue first.
- Report vulnerabilities privately using the [security policy](SECURITY.md).
- Use Node.js 20 or newer and npm. Fork the repository, clone your fork, and create a focused branch.

## Development Workflow

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Edit TypeScript sources in `src/` and compile to `scripts/`:
   ```bash
   npm run build
   ```
3. Run all verification gates before opening a PR:
   ```bash
   npm run typecheck
   npm run check:generated
   npm run check:json
   npm test
   ```

## Contribution Requirements

- Edit `src/` and include its generated `scripts/` output in the same PR.
- Keep the CLI free of runtime npm dependencies.
- Add regression tests for behavior changes. Detector tests should include both a matching case and a legitimate case that must not be flagged.
- Never add secrets or unsafe DOM sinks such as `innerHTML`, `outerHTML`, `document.write()`, or `eval()`.
- Preserve the crafted fixture's 100/S static score and the broken fixture's findings. Static scores do not establish visual quality.
- For skill or UX changes, update affected commands, agents, and reference links. For rendered examples, include browser evidence and state what was not verified.
- Pair expansion packs with tests and a showcase or playbook; see [the pack contract](packs/README.md).

## Pull Requests

Explain the problem, the resulting behavior, and how you verified it. Include screenshots for visual changes, the relevant CLI output for detector changes, and any compatibility changes. Keep unrelated refactors separate.

Use Conventional Commit subjects, for example `fix(audit): handle empty scan targets`. Keep subjects within 50 characters. Update [CHANGELOG.md](CHANGELOG.md) under Unreleased for user-facing changes.

Contributions are provided under the repository's [MIT license](LICENSE). Retain required attribution and identify any third-party material and its license.
