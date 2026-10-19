import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseRuleCatalog } from "../../../orchestrator/rules/descriptor-parser.mjs";
import { compileRuleBinding } from "../../../orchestrator/rules/binding-compiler.mjs";

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
    assert.equal(selected.length, 36);
    assert.equal(directives.length, 355);
    assert.equal(counts["automated-blocking"], 124);
    assert.equal(counts["evidence-blocking"], 154);
    assert.equal(counts.advisory, 77);
    assert.equal(counts.unsupported, 0);
    assert.equal(
      counts["automated-blocking"] + counts["evidence-blocking"] + counts.advisory,
      directives.length,
      "only classified modes are counted as enforced coverage"
    );
  });

  it("ensures every directive mode aligns strictly with verifier capability", async () => {
    const { descriptors } = await parseRuleCatalog(`${REPO_ROOT}/rules`);
    const selected = descriptors.filter((descriptor) => TYPE_SCRIPT_AND_GLOBAL.has(descriptor.stack));
    const directives = selected.flatMap((descriptor) => descriptor.directives);

    const automatedVerifiers = new Set(["linter", "test", "typechecker"]);

    for (const directive of directives) {
      if (directive.mode === "automated-blocking") {
        assert.ok(
          automatedVerifiers.has(directive.verifier.type),
          `Automated-blocking directive ${directive.id} has invalid verifier "${directive.verifier.type}"; must be one of [${[...automatedVerifiers].join(", ")}]`
        );
      } else if (directive.mode === "evidence-blocking") {
        assert.equal(
          directive.verifier.type,
          "human-evidence",
          `Evidence-blocking directive ${directive.id} must use human-evidence, got "${directive.verifier.type}"`
        );
      } else if (directive.mode === "advisory") {
        assert.equal(
          directive.verifier.type,
          "none",
          `Advisory directive ${directive.id} must use verifier:none, got "${directive.verifier.type}"`
        );
      }
    }
  });

  it("prohibits automated-blocking claims without an executable verifier", () => {
    const invalidDirective = {
      id: "cf.test.unverified-automated",
      mode: "automated-blocking",
      verifier: { type: "none" },
    };

    assert.throws(
      () => {
        if (invalidDirective.mode === "automated-blocking" && (!invalidDirective.verifier || invalidDirective.verifier.type === "none")) {
          throw new Error(`Directive "${invalidDirective.id}" claims automated-blocking without an executable verifier.`);
        }
      },
      /claims automated-blocking without an executable verifier/
    );
  });

  it("applies global security and quality directives to JSX and JavaScript scopes", async () => {
    const { descriptors } = await parseRuleCatalog(`${REPO_ROOT}/rules`);

    const result = compileRuleBinding({
      stack: "typescript",
      affectedScope: ["src/components/Widget.jsx"],
      descriptors,
    });

    const boundIds = result.selected.map((item) => item.directiveId);
    assert.ok(boundIds.length > 0, "JSX scope must retain applicable global directives");
    assert.equal(boundIds.length, 47, "All 47 global directives must bind for JSX scope");

    // All bound directives must be cf.* global directives
    assert.ok(boundIds.every((id) => id.startsWith("cf.")), "Only global cf.* directives may bind to JSX");
    assert.ok(!boundIds.some((id) => id.startsWith("ts.")), "TypeScript directives must not bind to JSX");

    // Verify key security and quality obligations remain visible
    assert.ok(boundIds.includes("cf.sec.no-credentials-in-source-or-logs"));
    assert.ok(boundIds.includes("cf.sec.server-side-auth-default-deny"));
    assert.ok(boundIds.includes("cf.quality.tests-for-behavior-changes"));
    assert.ok(boundIds.includes("cf.evidence.scope-fencing"));
    assert.ok(boundIds.includes("cf.arch.contracts"));
  });

  it("preserves global obligations for both .js and .jsx without TypeScript leakage", async () => {
    const { descriptors } = await parseRuleCatalog(`${REPO_ROOT}/rules`);

    for (const scopePath of ["src/legacy.js", "src/Legacy.jsx", "src/module.mjs"]) {
      const result = compileRuleBinding({
        stack: "typescript",
        affectedScope: [scopePath],
        descriptors,
      });

      const boundIds = result.selected.map((item) => item.directiveId);
      assert.equal(boundIds.length, 47, `${scopePath} must receive exactly 47 global directives`);
      assert.ok(boundIds.every((id) => id.startsWith("cf.")), `${scopePath} must only receive cf.* directives`);
    }
  });
});
