import { test } from "node:test";
import assert from "node:assert/strict";
import { QUICKTO_MAGNETIC_DOCK_PACK, generateQuicktoMagneticDockBlueprint } from "../../packs/motion/quickto-magnetic-dock.mjs";
import { scanTargets, detectInText } from "../../scripts/detector.js";

test("QUICKTO_MAGNETIC_DOCK_PACK exports valid motion pack metadata", () => {
  assert.equal(QUICKTO_MAGNETIC_DOCK_PACK.id, "quickto-magnetic-dock");
  assert.equal(QUICKTO_MAGNETIC_DOCK_PACK.category, "motion");
  assert.equal(QUICKTO_MAGNETIC_DOCK_PACK.typography.display, "Barlow Condensed");
});

test("generateQuicktoMagneticDockBlueprint generates cleanup-safe, reduced-motion-safe code across all frameworks", () => {
  for (const framework of ["vanilla", "react", "vue", "svelte"]) {
    const bp = generateQuicktoMagneticDockBlueprint({ framework });
    assert.equal(bp.id, "quickto-magnetic-dock");
    assert.equal(bp.framework, framework);
    assert.ok(bp.code.includes("gsap.matchMedia()"));
    assert.ok(bp.code.includes("prefers-reduced-motion: reduce"));
    const findings = detectInText(bp.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.equal(findings.length, 0, `Unexpected findings for ${framework}: ${JSON.stringify(findings)}`);
  }
});

test("examples/showcases/quickto-magnetic-dock.html passes detector with 0 primary findings", () => {
  const report = scanTargets(["examples/showcases/quickto-magnetic-dock.html"]);
  assert.equal(report.primaryCount, 0);
});
