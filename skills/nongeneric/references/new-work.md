# New Work: From Product Truth to Committed Aesthetic World

This playbook governs greenfield builds, feature additions, and full redesigns.

For calm craft, consult [restrained-design.md](restrained-design.md); shared typography roles and intentional stillness are valid design decisions.

Before selecting a direction, follow [ux-workflow.md](ux-workflow.md): define the primary task, flow, information hierarchy, applicable states, and acceptance scenarios. Consult [interaction-patterns.md](interaction-patterns.md) for container selection, focus/dismissal contracts, mobile modality, and overlay motion. Specify form recovery using the UX workflow before styling. Preserve existing product conventions when extending a surface.

## 1. Product Authority (`PRODUCT.md`) vs. Visual Authority (`DESIGN.md`)

Never conflate what the product **is** with how the surface **looks**:
- **`PRODUCT.md`** records durable strategic truth:
  - Primary users, their operating situation, and the concrete job they are doing.
  - The product's differentiating mechanism (what a competitor could not truthfully claim).
  - Real evidence on hand (benchmarks, engine telemetry, actual workflows, pricing, legal/brand constraints).
  - **Strict Anti-Fabrication Law**: Never invent fake testimonials, fake star ratings, fake company logos, or placeholder names (`John Doe`, `Acme Corp`). When real social proof does not exist, prove value through a **live working demonstration** in the interface.
- **`DESIGN.md`** records the committed visual and motion system:
  - The chosen Aesthetic World, lineage, and optional signature detail.
  - OKLCH color tokens (ground, elevated, glass, primary/secondary/muted ink, primary/secondary accent, hairline border, semantic states).
  - Shared typography roles, chosen families, and responsive size/line-height/weight tokens; use a fluid display scale only where needed.
  - Motion decision (intentional stillness, CSS feedback, or justified choreography), shared timing/easing tokens when used, and the reduced-motion contract.

## 2. Breaking the LLM Ranking Rut with `nongeneric seed`

When an AI model brainstorms design directions without external entropy, its top-ranked candidate (#1) is almost always the statistical median of its training corpus: dark slate background, indigo/violet gradient, `Inter` font, pill badge above a centered headline, and three equal cards below.

To defeat this:
1. Draft 6 grounded directions tailored to the product's actual domain and audience.
2. Run `node scripts/nongeneric.js seed --scope direction --mode <persuade|operate|read|experience> --grain <product|flow|view|region>`.
3. Fuse the dealt **Challenger Worlds** with the product's real content and weigh them against your assigned grounded candidate on two strict axes:
   - **Axis 1: Audience Identification** — Would someone who lives in this domain immediately feel this was built for them?
   - **Axis 2: Product Clarity** — Does the form make the product's offer, data, or task faster to grasp and operate?
4. Even when a Challenger World is declined as the primary world, extract **one system discipline** it possesses that your chosen direction lacks (e.g., `swiss-railway-chronograph`'s zero-double-border hairline grid or `knightvision-editorial-telemetry`'s live candidate evaluation bars) and raise your chosen direction to match.

## 3. Visitor Mode Laws

### `persuade` (Landing Pages, Launches, Product Showcases)
- The opening viewport must make the offer unmistakable, expose the primary conversion action, and **demonstrate a working slice of the product** right in the hero.
- Material coverage is required: the world owns the background ground, surface borders, and headline voice.
- Keep real working HTML controls and clear product identity. Deliberate restrained neutrals are valid; do not substitute an unexamined template with an accent-color sticker for a direction.

### `operate` (Workbenches, Dashboards, Terminals, Tools)
- Task velocity and scannability come first.
- The world lends **up to four things**:
  1. **Typography** (e.g., tabular monospace numbers + crisp grotesque headers)
  2. **Palette** (committed ground, rail, and semantic state colors)
  3. **Density** (tight, scannable row/cell spacing)
  4. **At Most One Signature Detail** (e.g., inline depth histograms behind orderbook rows, or transit-map service health lines)
- Controls and navigation remain standard, keyboard-accessible platform controls.

### `read` (Documentation, Technical Specifications, Essays)
- The world owns the **frame** (masthead, sidebar tree, section openers, callout boxes, and marginalia rail).
- The **reading column** stays serene: `60ch–75ch` measure, `16px–18px` reading size, `1.55–1.65` line-height, and `>=7:1` ink-to-ground contrast.

### `experience` (Interactive Narratives, Exhibitions, Portfolios)
- The work itself leads from the first viewport.
- Use at most one dominant expressive interaction per section (e.g., pinned horizontal exhibition chamber or kinetic typography stage) while keeping surrounding chrome quiet.
