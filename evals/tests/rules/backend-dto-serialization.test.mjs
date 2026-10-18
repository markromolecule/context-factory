import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseRuleDescriptor } from "../../../orchestrator/rules/descriptor-parser.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

const repoRoot = process.cwd();
const rulePath = "rules/typescript/backend/dto-and-serialization.md";

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

describe("TypeScript backend DTO and serialization guidance", () => {
  it("selects one DTO owner for operation schemas, controllers, and mappers", async () => {
    const { rule } = await loadRule();
    const result = await resolveContext("Add a create-order DTO and response mapper", {
      stack: "typescript",
      scope: ["src/modules/orders/create-order/create-order.mapper.ts"],
    });

    assert.equal(rule.id, "cf-rule-ts-dto-and-serialization");
    const paths = directive(rule, "ts.dto.public-response-whitelist").applicability.paths;
    assert.ok(paths.includes("src/modules/**/*.schema.ts"));
    assert.ok(paths.includes("src/modules/**/*.mapper.ts"));
    assert.ok(paths.includes("src/features/**/*.controller.ts"));
    assert.ok(result.binding.directives.some((candidate) => candidate.id === "ts.dto.public-response-whitelist"));
  });

  it("keeps validated requests, domain values, persistence inputs, and public responses distinct", async () => {
    const { content, rule } = await loadRule();

    for (const id of [
      "ts.dto.request-schema-boundary",
      "ts.dto.domain-persistence-separation",
      "ts.dto.public-response-whitelist",
      "ts.dto.nullable-output-contract",
    ]) {
      assert.equal(directive(rule, id).mode, "evidence-blocking", `${id} needs human evidence until a verifier exists`);
    }

    assert.match(content, /request schema/i);
    assert.match(content, /domain value/i);
    assert.match(content, /persistence input/i);
    assert.match(content, /public response/i);
    assert.match(content, /do not pass.*req.*res/i);
    assert.match(content, /explicitly map/i);
    assert.match(content, /undefined.*null|nullable.*missing/i);
  });

  it("protects malformed input and internal fields without duplicating common validation policy", async () => {
    const { content } = await loadRule();

    assert.match(content, /malformed input.*service|service.*malformed input/i);
    assert.match(content, /internal.*field.*not.*serializ|not.*serializ.*internal/i);
    assert.match(content, /ts\.runtime-validation\.parse-boundary-data/);
    assert.match(content, /ts\.controllers\.no-leak-internals/);
    assert.doesNotMatch(content, /safeParse\(/);
    assert.doesNotMatch(content, /RFC 7807/);
  });
});
