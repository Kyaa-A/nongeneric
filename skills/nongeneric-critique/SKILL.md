---
name: nongeneric-critique
description: >
  Unanchored Dual-Persona Design & Motion Critique skill. Evaluates any UI surface cold from both a
  Design Director perspective (5-pillar 0-100 scorecard) and a Skeptical Target Visitor perspective,
  followed by a prioritized P0-P3 remediation plan.
---

# NonGeneric Dual-Persona Critique

When asked to critique, review, or audit a UI:

1. **Run the Deterministic Audit First**:
   ```bash
   node scripts/nongeneric.js audit <target>
   ```
2. **Execute Unanchored Dual-Persona Evaluation**:
   - **Persona 1 (Design & Motion Director)**: Grade Typography (20), OKLCH Color & Atmosphere (20), Spatial Rhythm & 320px Responsive (20), GSAP Motion Choreography (20), and Copy Authenticity & Working Proof (20).
   - **Persona 2 (Skeptical Target Visitor)**: Evaluate the first viewport in 3 seconds according to its Visitor Mode (`persuade`, `operate`, `read`, `experience`). Does it prove its claim with a real interactive mechanism, or hide behind marketing buzzwords and decorative cards?
3. **Output Prioritized P0–P3 Remediation Plan**:
   - List exact file:line locations and concrete code replacements for every P0 and P1 issue.
