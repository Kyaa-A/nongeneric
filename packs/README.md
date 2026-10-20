# NonGeneric Expansion Packs (`packs/`)

This directory houses modular, zero-dependency expansion packs for **NonGeneric**:

- `packs/worlds/*.mjs` — Curated Aesthetic World packs (`AestheticWorld` schema + OKLCH token compilers).
- `packs/motion/*.mjs` — Curated GSAP Motion Choreography blueprint packs (`ScrollTrigger`, `Flip`, `SplitText`, `Observer`, `Draggable`, SVG, and WebGL uniform bridges).

## Pack Isolation Contract

Every expansion pack is self-contained and paired with:
1. A deterministic test suite in `test/packs/<pack-id>.test.js`
2. Either an interactive zero-slop HTML showcase in `examples/showcases/<pack-id>.html` (verified by `scanTargets()` with `0` primary findings) or an engineering playbook in `docs/playbooks/<pack-id>.md`.
