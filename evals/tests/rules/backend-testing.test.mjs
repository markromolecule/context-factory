import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseRuleDescriptor } from "../../../orchestrator/rules/descriptor-parser.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

const repoRoot = process.cwd();
const rulePath = "rules/typescript/backend/testing.md";

async function loadRule() {
  const content = await readFile(join(repoRoot, rulePath), "utf8");
  const result = parseRuleDescriptor(content, rulePath);
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.level === "error");
  assert.deepEqual(errors, [], `Rule descriptor errors: ${errors.map((error) => error.message).join("; ")}`);
  return { content, rule: result.descriptor };
}

function directive(rule, id) {
  const found = rule.directives.find((candidate) => candidate.id === id);
  assert.ok(found, `Expected directive ${id}`);
  return found;
}

describe("TypeScript backend module testing guidance", () => {
  it("selects operation-local test guidance for .test.ts and established .spec.ts hosts", async () => {
    const { rule } = await loadRule();
    const testResult = await resolveContext("Test a tenant-sensitive order read", {
      stack: "typescript",
      scope: ["src/modules/orders/get-order/get-order.test.ts"],
    });
    const specResult = await resolveContext("Test an adopted spec host", {
      stack: "typescript",
      scope: ["src/features/orders/get-order/get-order.spec.ts"],
    });

    const paths = directive(rule, "ts.backend-testing.operation-test-discovery").applicability.paths;
    assert.ok(paths.includes("src/modules/**/*.test.ts"));
    assert.ok(paths.includes("src/features/**/*.spec.ts"));
    assert.ok(testResult.binding.directives.some((candidate) => candidate.id === "ts.backend-testing.service-policy-cases"));
    assert.ok(specResult.binding.directives.some((candidate) => candidate.id === "ts.backend-testing.service-policy-cases"));
  });

  it("assigns one test purpose per operation boundary without requiring absent layers", async () => {
    const { content, rule } = await loadRule();

    for (const id of [
      "ts.backend-testing.service-policy-cases",
      "ts.backend-testing.controller-mapping-cases",
      "ts.backend-testing.data-boundary-cases",
      "ts.backend-testing.route-composition-cases",
      "ts.backend-testing.public-contract-cases",
    ]) {
      assert.equal(directive(rule, id).mode, "evidence-blocking", `${id} needs human evidence until a verifier exists`);
    }

    assert.match(content, /fake dependenc/i);
    assert.match(content, /malformed.*input/i);
    assert.match(content, /route.*middleware|middleware.*route/i);
    assert.match(content, /public.*index|index.*public/i);
    assert.match(content, /do not require.*absent layer|absent layer.*do not require/i);
  });

  it("keeps isolated database and network mechanics with the data-adapter owner", async () => {
    const { content } = await loadRule();
    const dataRule = await readFile(join(repoRoot, "rules/typescript/database/testing-data-access-layer.md"), "utf8");

    assert.match(content, /ts\.test-data\.isolated-db-instance/);
    assert.match(content, /ts\.test-data\.mock-network-boundary/);
    assert.match(dataRule, /\.spec\.ts/);
    assert.match(dataRule, /src\/modules\/\*\*\/data\/\*\*\/\*\.test\.ts/);
  });
});
