# Contributing to NonGeneric

Contributions that sharpen anti-slop detection, add high-craft Aesthetic Worlds, or expand GSAP motion choreography blueprints are welcome.

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
