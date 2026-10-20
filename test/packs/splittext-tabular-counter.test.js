import { test } from "node:test";
import assert from "node:assert/strict";
import { SPLITTEXT_TABULAR_COUNTER_PACK, generateSplittextTabularCounterBlueprint } from "../../packs/motion/splittext-tabular-counter.mjs";
import { scanTargets, detectInText } from "../../scripts/detector.js";

test("SPLITTEXT_TABULAR_COUNTER_PACK exports valid motion pack metadata", () => {
  assert.equal(SPLITTEXT_TABULAR_COUNTER_PACK.id, "splittext-tabular-counter");
  assert.equal(SPLITTEXT_TABULAR_COUNTER_PACK.category, "motion");
  assert.equal(SPLITTEXT_TABULAR_COUNTER_PACK.typography.display, "Rajdhani");
});

test("generateSplittextTabularCounterBlueprint generates cleanup-safe, reduced-motion-safe code across all frameworks", () => {
  for (const framework of ["vanilla", "react", "vue", "svelte"]) {
    const bp = generateSplittextTabularCounterBlueprint({ framework });
    assert.equal(bp.id, "splittext-tabular-counter");
    assert.equal(bp.framework, framework);
    assert.ok(bp.code.includes("gsap.matchMedia()"));
    assert.ok(bp.code.includes("prefers-reduced-motion: reduce"));
    const findings = detectInText(bp.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.equal(findings.length, 0, `Unexpected findings for ${framework}: ${JSON.stringify(findings)}`);
  }
});

test("examples/showcases/splittext-tabular-counter.html passes detector with 0 primary findings", () => {
  const report = scanTargets(["examples/showcases/splittext-tabular-counter.html"]);
  assert.equal(report.primaryCount, 0);
});
