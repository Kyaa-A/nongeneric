---
description: Run the deterministic 82-rule NonGeneric detector and technical quality audit across slop, typography, color, motion, and 320px responsiveness.
argument-hint: "[target path]"
---

Execute `node scripts/nongeneric.js audit <target>` and `node scripts/nongeneric.js detect <target>`. Label the score as static checks, report scanned files and scopes, and remediate P0/P1 findings or document justified suppressions. Follow `skills/nongeneric/references/browser-verification.md` for requested surface verification. Report visual quality, usability, accessibility, and runtime behavior separately; absent browser evidence means not verified.
