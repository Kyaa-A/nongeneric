# Unanchored Dual-Agent Critique & Finishing Protocol

Never grade your own work from memory alone. Before shipping a major surface, run both the deterministic audit (`node scripts/nongeneric.js audit`) and the **Unanchored Dual-Persona Critique**.

Follow [browser-verification.md](browser-verification.md) for evidence. Inspect the surface before reading the builder's rationale or static score to avoid anchoring. The CLI grade measures source patterns only. Keep any human/agent design score separate, explain the observations behind it, and leave unobserved dimensions unscored. A simulated visitor is not a substitute for user research.

---

## 1. Why Unanchored Critique Matters

When a reviewer agent is handed the builder's direction contract ("We built a Neo-Kinpaku luxury page, check if it matches"), the reviewer becomes a compliance rubber-stamp. Instead, critique must start **unanchored**:

### Persona A: The Design & Motion Director
Evaluates the surface cold across 5 pillars (20 points each = 100 total):
1. **Typography & Hierarchy (20 pts)**: Does the display face have unmistakable character? Are line lengths (`60–75ch`), heading line-heights (`1.06–1.18`), and tabular numerals (`tabular-nums`) dialed in?
2. **OKLCH Color & Material Atmosphere (20 pts)**: Does the palette commit to a cohesive material world with tinted neutrals and high-contrast ink, free of purple/indigo AI gradients and gray-on-color muddiness?
3. **Spatial Rhythm & 320px Responsive Integrity (20 pts)**: Does the topology avoid the 3-equal-card SaaS rut? Does it hold from `320px` to `1440px+` with zero horizontal overflow?
4. **GSAP Motion Choreography (20 pts)**: Are entrances, scroll triggers, and interactive state changes smooth (60fps compositor properties), purposeful, and `prefers-reduced-motion` safe?
5. **Copy Authenticity & Task Fit (20 pts)**: Does the surface support its visitor mode with truthful content? Persuade surfaces demonstrate the product; operate surfaces enable the task; read surfaces support comprehension; experience surfaces make participation discoverable.

### Persona B: The Skeptical Target Visitor
Arrives with a real job to do in the surface's **Visitor Mode** (`persuade`, `operate`, `read`, `experience`):
- **First 3-Second Test**: "What is this product, who is it for, and what can I do right now in the first viewport?"
- **Friction & Doubt Audit**: Flags any control that looks like a fake picture of a tool, any claim backed by fluff instead of proof, or any animation that gets in the way of completing the task.
- **Task & Recovery Test**: Execute the primary scenario and a relevant error/recovery scenario from [ux-workflow.md](ux-workflow.md). Report expected and observed outcomes, keyboard behavior, and any untested states.

---

## 2. Severity Triage (P0–P3)

| Priority | Classification | Examples | Gate Rule |
| :--- | :--- | :--- | :--- |
| **P0** | Blocking Defect / Breakage | Horizontal overflow at 320px, WCAG contrast failure, `gsap-layout-thrash`, `gsap-nested-scrolltrigger`, broken image, `unsafe-dom-sink` | **Must fix before completion** |
| **P1** | AI-Slop Fingerprint / Mode Violation | `gradient-text`, `purple-blue-gradient`, `side-tab`, `overused-font`, `marketing-buzzword`, `missing-reduced-motion` | **Must fix before completion** |
| **P2** | Craft & Rhythm Deficit | `monotonous-spacing`, `wide-tracking`, `transition-all`, `legacy-viewport-height` | **Fix in polish pass** |
| **P3** | Advisory Polish | Minor cadence refinements, secondary hover micro-interactions | **Address or waive with reason** |
