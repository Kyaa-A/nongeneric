---
name: nongeneric-critique
description: >
  Unanchored Dual-Persona Design & Motion Critique skill. Evaluates any UI surface cold from both a
  Design Director perspective (5-pillar 0-100 scorecard) and a Skeptical Target Visitor perspective,
  followed by a prioritized P0-P3 remediation plan.
---

# NonGeneric Dual-Persona Critique

When asked to critique, review, or audit a UI:

1. **Inspect the Surface Cold**:
   Follow `../nongeneric/references/browser-verification.md` and inspect rendered evidence before reading the builder's rationale or static score. Mark unavailable evidence as not verified.
2. **Run the Deterministic Audit**:
   ```bash
   node scripts/nongeneric.js audit <target>
   ```
   This is a static-check score, not a visual or usability grade.
3. **Execute Unanchored Dual-Persona Evaluation**:
   - **Persona 1 (Design & Motion Director)**: Grade Typography (20), OKLCH Color & Atmosphere (20), Spatial Rhythm & 320px Responsive (20), GSAP Motion Choreography (20), and Copy Authenticity & Task Fit (20).
   - **Persona 2 (Skeptical Target Visitor)**: Evaluate according to Visitor Mode: offer and proof for persuade, task completion for operate, comprehension for read, participation and exit for experience. Execute the primary task and a relevant recovery path; report observed outcomes. This is expert review, not user research.
4. **Output Prioritized P0–P3 Remediation Plan**:
   - Follow the impact-based severity rules in `../nongeneric/references/critique-and-finish.md`. Task blockers, lost work, and false completion take priority over visual polish; keep these review priorities separate from CLI rule severities.
   - List exact file:line locations and concrete code replacements for every P0 and P1 issue.
   - Separate static findings from rendered observations. Include viewport/state coverage and unverified dimensions. Do not assign a visual score without rendered evidence.
