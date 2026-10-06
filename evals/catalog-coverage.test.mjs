import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseRuleCatalog } from "../orchestrator/rules/descriptor-parser.mjs";

const REPO_ROOT = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
const TYPE_SCRIPT_AND_GLOBAL = new Set(["typescript", "global"]);
const MODE_NAMES = ["automated-blocking", "evidence-blocking", "advisory", "unsupported"];

describe("TypeScript release catalog coverage", () => {
  it("accounts for every TypeScript/global directive without treating unsupported guidance as enforced", async () => {
    const { descriptors, catalogDiagnostics, coverage } = await parseRuleCatalog(`${REPO_ROOT}/rules`);
    const selected = descriptors.filter((descriptor) => TYPE_SCRIPT_AND_GLOBAL.has(descriptor.stack));
    const directives = selected.flatMap((descriptor) => descriptor.directives);
    const counts = Object.fromEntries(MODE_NAMES.map((mode) => [mode, 0]));

    for (const directive of directives) counts[directive.mode] += 1;

    assert.equal(catalogDiagnostics.length, 0);
    assert.equal(coverage.unsupportedCount, 399, "unmigrated guidance remains visible outside the TypeScript/global release scope");
    assert.equal(selected.length, 35);
    assert.equal(directives.length, 343);
    assert.equal(counts["automated-blocking"], 138);
    assert.equal(counts["evidence-blocking"], 130);
    assert.equal(counts.advisory, 75);
    assert.equal(counts.unsupported, 0);
    assert.equal(
      counts["automated-blocking"] + counts["evidence-blocking"] + counts.advisory,
      directives.length,
      "only classified modes are counted as enforced coverage"
    );
  });
});
