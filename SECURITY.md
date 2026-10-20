# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Invariants

1. **Zero Runtime Dependencies**: `nongeneric` ships with zero runtime npm dependencies (`dependencies: {}`) to eliminate supply-chain risk.
2. **Strict DOM Safety**: Generated UI blueprints and examples never use `innerHTML`, `outerHTML`, `document.write()`, or `eval()`. All DOM updates use `document.createElement()`, `textContent`, `setAttribute()`, and `replaceChildren()`.
3. **Secret Isolation**: Cloud automation scripts (`scripts/jules/`) read `JULES_API_KEY` exclusively from git-ignored `.env` or environment variables.
4. **Safe Process Spawning**: All CLI child processes use `spawnSync` with explicit argument arrays (`shell: false`).

## Reporting a Vulnerability

Please report security issues privately via GitHub Security Advisories at `https://github.com/Kyaa-A/nongeneric/security/advisories/new`.
