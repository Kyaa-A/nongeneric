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

Human/agent review priority follows observed user impact. These priorities do not change CLI rule severities or its static score. A strong visual score cannot offset a task blocker. Report the affected user, action, observed failure, and recovery before cosmetic findings; elevate any finding whose actual impact is more severe than its default category. Confirmed security defects (such as an unsafe DOM sink or exposed secret) remain P0 even without a visible symptom. Accessibility failures remain completion blockers even if a reviewer can finish the task.

| Priority | User impact | Examples | Gate rule |
| :--- | :--- | :--- | :--- |
| **P0** | Security defect, task blocked, work lost, or false completion | Keyboard cannot reach submit; save fails but reports success; dismissal silently loses entered work | **Must fix before completion** |
| **P1** | Accessibility failure, serious friction, or inaccessible recovery | Insufficient required contrast; clipped content on narrow screens or zoom; error cannot be located; dialog focus escapes; critical status disappears | **Must fix before completion** |
| **P2** | Craft or convention deficit without a task/access blocker | Inconsistent spacing, gratuitous interruption, unexamined typography, stylistic anti-pattern | **Fix in polish pass** |
| **P3** | Advisory refinement | Minor cadence, secondary hover treatment | **Address or waive with reason** |

For unknown behavior, state the scenario still needed; do not turn missing evidence into an invented observed defect. Use [interaction-patterns.md](interaction-patterns.md) to assess container choice and dismissal behavior in context.
