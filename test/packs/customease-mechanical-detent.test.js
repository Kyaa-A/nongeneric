import { test } from "node:test";
import assert from "node:assert/strict";
import { CUSTOMEASE_MECHANICAL_DETENT_PACK, generateCustomeaseMechanicalDetentBlueprint } from "../../packs/motion/customease-mechanical-detent.mjs";
import { scanTargets, detectInText } from "../../scripts/detector.js";

test("CUSTOMEASE_MECHANICAL_DETENT_PACK exports valid motion pack metadata", () => {
  assert.equal(CUSTOMEASE_MECHANICAL_DETENT_PACK.id, "customease-mechanical-detent");
  assert.equal(CUSTOMEASE_MECHANICAL_DETENT_PACK.category, "motion");
  assert.equal(CUSTOMEASE_MECHANICAL_DETENT_PACK.typography.display, "Rajdhani");
});

test("generateCustomeaseMechanicalDetentBlueprint generates cleanup-safe, reduced-motion-safe code across all frameworks", () => {
  for (const framework of ["vanilla", "react", "vue", "svelte"]) {
    const bp = generateCustomeaseMechanicalDetentBlueprint({ framework });
    assert.equal(bp.id, "customease-mechanical-detent");
    assert.equal(bp.framework, framework);
    assert.ok(bp.code.includes("gsap.matchMedia()"));
    assert.ok(bp.code.includes("prefers-reduced-motion: reduce"));
    const findings = detectInText(bp.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.equal(findings.length, 0, `Unexpected findings for ${framework}: ${JSON.stringify(findings)}`);
  }
});

test("examples/showcases/customease-mechanical-detent.html passes detector with 0 primary findings", () => {
  const report = scanTargets(["examples/showcases/customease-mechanical-detent.html"]);
  assert.equal(report.primaryCount, 0);
});
