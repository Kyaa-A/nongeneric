import { test } from "node:test";
import assert from "node:assert/strict";
import { SCROLLTRIGGER_BATCH_LEDGER_PACK, generateScrolltriggerBatchLedgerBlueprint } from "../../packs/motion/scrolltrigger-batch-ledger.mjs";
import { scanTargets, detectInText } from "../../scripts/detector.js";

test("SCROLLTRIGGER_BATCH_LEDGER_PACK exports valid motion pack metadata", () => {
  assert.equal(SCROLLTRIGGER_BATCH_LEDGER_PACK.id, "scrolltrigger-batch-ledger");
  assert.equal(SCROLLTRIGGER_BATCH_LEDGER_PACK.category, "motion");
  assert.equal(SCROLLTRIGGER_BATCH_LEDGER_PACK.typography.display, "Newsreader");
});

test("generateScrolltriggerBatchLedgerBlueprint generates cleanup-safe, reduced-motion-safe code across all frameworks", () => {
  for (const framework of ["vanilla", "react", "vue", "svelte"]) {
    const bp = generateScrolltriggerBatchLedgerBlueprint({ framework });
    assert.equal(bp.id, "scrolltrigger-batch-ledger");
    assert.equal(bp.framework, framework);
    assert.ok(bp.code.includes("gsap.matchMedia()"));
    assert.ok(bp.code.includes("prefers-reduced-motion: reduce"));
    const findings = detectInText(bp.code, "Component.tsx", { scopes: ["motion", "security"] });
    assert.equal(findings.length, 0, `Unexpected findings for ${framework}: ${JSON.stringify(findings)}`);
  }
});

test("examples/showcases/scrolltrigger-batch-ledger.html passes detector with 0 primary findings", () => {
  const report = scanTargets(["examples/showcases/scrolltrigger-batch-ledger.html"]);
  assert.equal(report.primaryCount, 0);
});
