# Text Scramble Telemetry Playbook

This playbook documents the Text Scramble motion pack (`packs/motion/text-scramble-telemetry.mjs`). This motion pattern is used in tactical, operation-focused, or telemetry-heavy aesthetic worlds (e.g., `knightvision-editorial-telemetry`, `field-operator-teenage-eng`) where data appears to decrypt, calculate, or lock onto a coordinate in real-time.

## Presets

The motion pack exports three distinct structural presets via `TEXT_SCRAMBLE_PRESETS`:

1.  **`cipher-glyph-decode`**: Cryptographic letter-by-letter decryption. Replaces characters with a sequence of scrambled symbols (`!<>-_\\/[]{}—=+*^?#_`) before settling on the final cleartext.
2.  **`tabular-odometer-roll`**: Numeric combination locks or telemetry updates.
3.  **`coordinate-lock-reveal`**: Geolocation or status code reveals.

## Core Principles & Craft Mandates

### 1. `textContent` Only (Zero `innerHTML`)
To guarantee an anti-slop, secure architecture, this blueprint strictly uses the `.textContent` property for DOM updates.
*   **Never use `innerHTML`** for dynamic scrambled text.
*   This ensures zero findings in the `detectInText` security scanner (`unsafe-dom-sink`).

### 2. Screen-Reader Safety
Rapidly changing characters can cause screen-readers to read out chaotic, meaningless garbage symbols to visually impaired users.
*   **Mandate**: The parent container must have an `aria-label` with the decoded meaning (e.g. `aria-label="Decoded Data"`).
*   **Mandate**: The animating text span itself must have `aria-hidden="true"`.
*   This ensures the screen reader smoothly announces the intent/final text once, completely bypassing the visual noise.

### 3. Layout Stability with `tabular-nums`
Because characters vary in width (especially in proportional fonts), swapping symbols rapidly causes violent horizontal layout thrashing.
*   **Mandate**: Always apply `font-variant-numeric: tabular-nums;` (or the utility class `tabular-nums`) to the animating span.
*   If using a monospace font, this is naturally handled.

### 4. Reduced-Motion Discipline
*   **Mandate**: All scrambles must be wrapped in `gsap.matchMedia()`.
*   Under `(prefers-reduced-motion: reduce)`, the blueprint instantly assigns `target.textContent = finalString` and returns an empty cleanup function.

## Integration Example

```javascript
import { generateTextScrambleBlueprint } from '../../packs/motion/text-scramble-telemetry.mjs';

const blueprint = generateTextScrambleBlueprint({
    preset: 'cipher-glyph-decode',
    framework: 'react',
    ease: 'power2.out'
});

console.log(blueprint.code);
```
