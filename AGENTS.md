# AGENTS.md — Working in `codewithasnari/nongeneric`

This repository contains the **NonGeneric** Designer & GSAP Motion Choreographer Skill Pack, Sub-Agents, and TypeScript Detector/Seed/Token/Motion CLI Engine.

## Repository Structure
- `src/`: TypeScript source files (`strict: true`, zero runtime dependencies).
- `scripts/`: Compiled ES2022 JavaScript output from `npm run build` (`tsc`). Always run `npm run build` after modifying any file in `src/` so `scripts/` stays in sync (`npm run check:generated` verifies this in CI).
- `skills/`: Canonical multi-harness skills (`nongeneric`, `nongeneric-gsap`, `nongeneric-critique`, `nongeneric-detector`, `nongeneric-worlds`).
- `agents/`: Specialized sub-agent definitions.
- `commands/`: 16 slash commands (`init`, `shape`, `craft`, `animate`, `overdrive`, `critique`, `audit`, `polish`, `typeset`, `colorize`, `layout`, `bolder`, `quieter`, `distill`, `harden`, `document`).
- `examples/`: Verification HTML fixtures (`crafted-knightvision.html` must always score 100/100 Grade S; `broken-ai-slop.html` must trigger slop/motion/responsive findings).
- `test/`: Node `node:test` test suite.

## Mandatory Verification Commands
Before committing or opening a pull request, run:
```bash
npm run build
npm run typecheck
npm run check:generated
npm run check:json
npm test
```

## Security & Code Quality Rules
1. Never add runtime npm dependencies to `package.json`.
2. Never use `innerHTML`, `outerHTML`, `document.write()`, or `eval()` in any code or example.
3. Never hardcode API keys or secrets in any tracked file.
