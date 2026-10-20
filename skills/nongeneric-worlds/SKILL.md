---
name: nongeneric-worlds
description: >
  Aesthetic World & Concept Seed Engine skill. Use to roll deterministic creative seeds, explore
  curated Aesthetic Worlds (KnightVision Editorial Telemetry, Swiss Chronograph, Field Operator,
  Neo-Kinpaku, Archival Monograph, etc.), and export OKLCH design tokens.
---

# NonGeneric Aesthetic Worlds & Concept Seed

1. **Roll a Concept Seed**:
   ```bash
   node scripts/nongeneric.js seed --scope direction --mode <persuade|operate|read|experience> --grain <product|flow|view|region>
   ```
2. **List All Curated Worlds & Structural Compositions**:
   ```bash
   node scripts/nongeneric.js worlds
   ```
3. **Export OKLCH Tokens & Fluid Scales**:
   ```bash
   node scripts/nongeneric.js tokens --world <world-id> --format <css|json|tailwind>
   ```
