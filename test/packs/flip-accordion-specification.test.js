import { test } from "node:test";
import assert from "node:assert/strict";
import { FLIP_ACCORDION_SPECIFICATION_PACK, generateFlipAccordionSpecificationBlueprint } from "../../packs/motion/flip-accordion-specification.mjs";
import { scanTargets, detectInText } from "../../scripts/detector.js";

test("FLIP_ACCORDION_SPECIFICATION_PACK exports valid motion pack metadata", () => {
  assert.equal(FLIP_ACCORDION_SPECIFICATION_PACK.id, "flip-accordion-specification");
  assert.equal(FLIP_ACCORDION_SPECIFICATION_PACK.category, "motion");
  assert.equal(FLIP_ACCORDION_SPECIFICATION_PACK.typography.display, "Playfair Display");
});

test("generateFlipAccordionSpecificationBlueprint generates cleanup-safe, reduced-motion-safe code across all frameworks", () => {
  for (const framework of ["vanilla", "react", "vue", "svelte"]) {
    const bp = generateFlipAccordionSpecificationBlueprint({ framework });
    assert.equal(bp.id, "flip-accordion-specification");
    assert.equal(bp.framework, framework);
    assert.ok(bp.code.includes("gsap.matchMedia()"));
    assert.ok(bp.code.includes("prefers-reduced-motion: reduce"));
    const findings = detectInText(bp.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.equal(findings.length, 0, `Unexpected findings for ${framework}: ${JSON.stringify(findings)}`);
  }
});

test("examples/showcases/flip-accordion-specification.html passes detector with 0 primary findings", () => {
  const report = scanTargets(["examples/showcases/flip-accordion-specification.html"]);
  assert.equal(report.primaryCount, 0);
});
