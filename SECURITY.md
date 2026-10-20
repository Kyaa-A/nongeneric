# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | Yes |

## Security Invariants

1. **Zero Runtime Dependencies**: The CLI has no runtime npm dependencies, reducing its dependency surface. Development tools, agent hosts, and libraries used by generated interfaces have their own security considerations.
2. **Strict DOM Safety**: Generated UI blueprints and examples never use `innerHTML`, `outerHTML`, `document.write()`, or `eval()`. All DOM updates use `document.createElement()`, `textContent`, `setAttribute()`, and `replaceChildren()`.
3. **Secret Isolation**: Cloud automation scripts (`scripts/jules/`) read `JULES_API_KEY` exclusively from git-ignored `.env` or environment variables.
4. **Safe Process Spawning**: All CLI child processes use `spawnSync` with explicit argument arrays (`shell: false`).

## Reporting a Vulnerability

Please report security issues privately through [GitHub Security Advisories](https://github.com/Kyaa-A/nongeneric/security/advisories/new). Include affected versions, reproduction steps, impact, and a minimal example with secrets removed. Avoid publishing exploit details in public issues while a report is being assessed.

If private reporting is unavailable, open an issue asking the maintainer to enable a private reporting channel without including vulnerability details. There is no guaranteed response time.

## Scope and Limits

The static detector is not a security audit or accessibility certification. Review generated code before running or deploying it.

Core scan, seed, token, and motion-plan commands operate locally. Plugin session hooks can request version metadata from this repository on GitHub. Optional Jules automation calls Google's Jules API and requires a user-provided API key; it is not needed for the core CLI. Keep credentials out of reports, fixtures, and commits.
