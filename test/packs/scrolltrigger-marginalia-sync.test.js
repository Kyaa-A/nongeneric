import { test } from "node:test";
import assert from "node:assert/strict";
import { SCROLLTRIGGER_MARGINALIA_SYNC_PACK, generateScrolltriggerMarginaliaSyncBlueprint } from "../../packs/motion/scrolltrigger-marginalia-sync.mjs";
import { scanTargets, detectInText } from "../../scripts/detector.js";

test("SCROLLTRIGGER_MARGINALIA_SYNC_PACK exports valid motion pack metadata", () => {
  assert.equal(SCROLLTRIGGER_MARGINALIA_SYNC_PACK.id, "scrolltrigger-marginalia-sync");
  assert.equal(SCROLLTRIGGER_MARGINALIA_SYNC_PACK.category, "motion");
  assert.equal(SCROLLTRIGGER_MARGINALIA_SYNC_PACK.typography.display, "Shippori Mincho");
});

test("generateScrolltriggerMarginaliaSyncBlueprint generates cleanup-safe, reduced-motion-safe code across all frameworks", () => {
  for (const framework of ["vanilla", "react", "vue", "svelte"]) {
    const bp = generateScrolltriggerMarginaliaSyncBlueprint({ framework });
    assert.equal(bp.id, "scrolltrigger-marginalia-sync");
    assert.equal(bp.framework, framework);
    assert.ok(bp.code.includes("gsap.matchMedia()"));
    assert.ok(bp.code.includes("prefers-reduced-motion: reduce"));
    const findings = detectInText(bp.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.equal(findings.length, 0, `Unexpected findings for ${framework}: ${JSON.stringify(findings)}`);
  }
});

test("examples/showcases/scrolltrigger-marginalia-sync.html passes detector with 0 primary findings", () => {
  const report = scanTargets(["examples/showcases/scrolltrigger-marginalia-sync.html"]);
  assert.equal(report.primaryCount, 0);
});
