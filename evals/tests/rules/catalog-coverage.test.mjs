import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseRuleCatalog } from "../../../orchestrator/rules/descriptor-parser.mjs";

const REPO_ROOT = process.cwd();
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
    assert.equal(coverage.unsupportedCount, 20, "unmigrated guidance remains visible outside the TypeScript/global release scope");
    assert.equal(selected.length, 38);
    assert.equal(directives.length, 362);
    assert.equal(counts["automated-blocking"], 138);
    assert.equal(counts["evidence-blocking"], 147);
    assert.equal(counts.advisory, 77);
    assert.equal(counts.unsupported, 0);
    assert.equal(
      counts["automated-blocking"] + counts["evidence-blocking"] + counts.advisory,
      directives.length,
      "only classified modes are counted as enforced coverage"
    );
  });
});
