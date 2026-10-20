import { test } from "node:test";
import { strict as assert } from "node:assert";
import { CARTOGRAPHIC_CLIMATE_PACK, generateCartographicClimateBlueprint } from "../../packs/worlds/cartographic-climate.mjs";
import { detectInText, scanTargets } from "../../scripts/detector.js";

test("cartographic-climate pack validity", async (t) => {
  await t.test("CARTOGRAPHIC_CLIMATE_PACK has required shape", () => {
    assert.equal(CARTOGRAPHIC_CLIMATE_PACK.id, "cartographic-climate");
    assert.equal(CARTOGRAPHIC_CLIMATE_PACK.title, "Earth Observation, Climate & Cartographic Atlas World");
    assert.equal(CARTOGRAPHIC_CLIMATE_PACK.category, "worlds");
    assert.equal(CARTOGRAPHIC_CLIMATE_PACK.typography.display, "Newsreader");
    assert.equal(CARTOGRAPHIC_CLIMATE_PACK.typography.body, "Work Sans");
    assert.equal(CARTOGRAPHIC_CLIMATE_PACK.typography.mono, "Space Mono");
    assert.ok(CARTOGRAPHIC_CLIMATE_PACK.tokens.background.includes("oklch"));
    assert.ok(CARTOGRAPHIC_CLIMATE_PACK.gsapRecipe);
  });

  const frameworks = ["vanilla", "react", "vue", "svelte"];
  for (const framework of frameworks) {
    await t.test(`generateCartographicClimateBlueprint(${framework}) generates clean code`, () => {
      const blueprint = generateCartographicClimateBlueprint({ framework });
      assert.equal(blueprint.id, "cartographic-climate");
      assert.equal(blueprint.framework, framework);
      assert.ok(blueprint.code.includes("gsap"));

      const findings = detectInText(blueprint.code, "test.js", { scopes: ["motion", "security"] });
      assert.equal(findings.length, 0, `Expected 0 findings in generated code for ${framework}, got ${findings.map(f => f.ruleId).join(", ")}`);
    });
  }

  await t.test("cartographic-climate.html showcase passes strict slop detection", () => {
    const report = scanTargets(["examples/showcases/cartographic-climate.html"]);
    assert.equal(report.primaryCount, 0, `Expected 0 primary findings in HTML showcase, got ${report.findings.map(f => f.ruleId).join(", ")}`);
  });
});
