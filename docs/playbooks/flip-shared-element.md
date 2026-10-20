# Flip Shared Element

The **Flip Shared Element** playbook covers the nuances of orchestrating seamless transitions between unassociated DOM elements utilizing GSAP's \`Flip\` plugin. This is critical for transitions like morphing a grid card into a full-screen dossier sheet, fitting a specimen into a lightbox, or expanding a dock item into an inspector panel.

## Core Concepts

### 1. The \`data-flip-id\` Attribute
To seamlessly animate between states, identical \`data-flip-id\` values must be applied to the initial and target states of the element. This establishes a structural bridge, allowing GSAP Flip to map the geometry of the origin element to the destination element.

### 2. Nested Content Counter-Scaling
When a parent element scales during a Flip animation, nested text or icons can warp. To prevent this, apply \`nested: true\` in the \`Flip.from()\` or \`Flip.fit()\` configuration. Ensure nested elements are also tracked by \`Flip.getState()\`, allowing Flip to counter-scale them against the parent's distortion.

### 3. Layering & \`zIndex\` Management
During morph sequences, it's common for an expanding element to slip underneath adjacent sibling nodes. Ensure you configure the flip animation to artificially elevate the \`zIndex\` while it transitions, using \`absolute: true\` to extract the element from the normal document flow and float it on top.

### 4. Accessibility: Keyboard \`Escape\` & Focus Management
An expanded component acting as a modal or a primary overlay must be dismissible via the \`Escape\` key. Furthermore, the focus MUST be managed correctly. Once the element transitions back to its closed state, focus should be explicitly returned to the trigger button to preserve the user's navigational state.

### 5. \`prefers-reduced-motion\` Compliance
Instead of performing the complex geometric interpolation, users preferring reduced motion should experience an instant state switch. We achieve this by wrapping the \`Flip.from()\` call in a \`gsap.matchMedia()\` block targeting \`(prefers-reduced-motion: no-preference)\`. If reduced motion is requested, the framework's standard DOM update handles the instant display of the target state without further animation.
