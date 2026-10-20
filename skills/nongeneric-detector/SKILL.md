---
name: nongeneric-detector
description: >
  Deterministic 82-rule Anti-Slop, Motion & Responsive Detector skill. Use to scan HTML, CSS, SCSS,
  JSX, TSX, Vue, Svelte, and Astro files for AI design clichés, typography mistakes, GSAP bugs, and
  320px mobile overflow hazards.
---

# NonGeneric Deterministic Detector

Run the static detector CLI on any file or directory:

```bash
node scripts/nongeneric.js detect <target>
node scripts/nongeneric.js detect --json <target>
node scripts/nongeneric.js detect --scope slop,motion,responsive <target>
```

### Exit Codes
- `0`: Zero primary anti-patterns found.
- `1`: Operational/usage error.
- `2`: Primary anti-patterns detected (must be fixed before shipping).

### Audit Scope

`node scripts/nongeneric.js audit <target>` reports a **static-check** score. JSON includes `scoreKind: "static-checks"` and `verification` fields for visual quality, usability, accessibility, and runtime behavior, all marked `not-verified`. An empty-body page may have no recognized anti-patterns; that does not establish good design.

When no supported files are scanned, audit returns `overallScore: null`, `grade: null`, no pillar scores, and exit code `1`. Browser evidence is reported separately using `../nongeneric/references/browser-verification.md`.
