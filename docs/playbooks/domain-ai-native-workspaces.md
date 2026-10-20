# Domain: AI-Native Workspaces

This playbook describes how to design non-generic AI products, outlining why chat bubbles and purple sparkle icons are lazy AI slop, and how to instead design spatial artifact workbenches, inline diff lenses, confidence/provenance indicators, and keyboard-first command palettes.

## The Problem: Lazy AI Slop

Generic AI interfaces rely heavily on a chat interface, turning everything into a conversational bottleneck. They often use:
- **Chat Bubbles:** Reduces complex, structured data into long blocks of text that require linear reading.
- **Purple Sparkle Icons (✨):** Empty "magic" aesthetic that doesn't explain what the AI is actually doing or how it arrived at its conclusions.
- **Gradient "Ask AI" Pills:** A generic call-to-action that interrupts the flow of work rather than assisting inline.

This is "lazy AI slop" because it fails to leverage spatial understanding, direct manipulation, and the actual context of the user's workflow. It forces the user to interact with the AI as an external agent rather than integrating intelligence directly into the workspace.

## Designing Non-Generic Workspaces

Instead of conversational bottlenecks, AI interfaces should be designed as **Spatial Artifact Workbenches**. Here is how to approach it:

### Spatial Artifact Workbenches
Move away from chat logs to canvases.
- **Direct Artifact Inspection:** The AI output (code, design, text, data) is the primary focus. Users interact directly with the artifact rather than talking about it in a separate chat window.
- **Spatial Layouts:** Use canvas layouts, side-by-side comparison views, or grid structures to allow users to see the context and the AI's suggestions simultaneously.
- **The Artifact is the Interface:** Don't talk to the AI about the document; the document itself should have intelligence embedded within it.

### Inline Diff Lenses
Show, don't tell, what the AI has done.
- **Contextual Changes:** When AI makes a suggestion or an edit, display it inline using diff lenses.
- **Clear Modifications:** Highlight additions, deletions, and modifications clearly within the artifact itself, similar to a Git diff but designed for the specific domain (e.g., visual diffs for UI changes, text diffs for copy).
- **Direct Acceptance/Rejection:** Allow users to accept, reject, or modify the changes directly within the diff view.

### Confidence and Provenance Indicators
Build trust by explaining the AI's reasoning.
- **Provenance Tokens:** Clearly show where the AI sourced its information. If it generated a block of code, indicate if it used an internal library, documentation, or public code.
- **Confidence Scores:** Visually indicate the AI's confidence in its output. Lower confidence outputs should invite user review more strongly.
- **Explainability:** Provide tooltips or expandable sections that explain *why* the AI made a certain decision, linking back to the user's original intent or the system's rules.

### Keyboard-First Command Palettes
Prioritize speed and power for operators.
- **Command K / Palette:** Implement a robust command palette (e.g., accessed via Cmd+K) that allows users to quickly issue commands to the AI without leaving the keyboard.
- **Context-Aware Commands:** The commands available should be relevant to the currently selected artifact or text.
- **Frictionless Action:** Actions should be instantaneous, avoiding the "type and wait" conversational loop whenever possible.
