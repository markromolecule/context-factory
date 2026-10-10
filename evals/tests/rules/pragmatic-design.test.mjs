import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseRuleDescriptor } from "../../../orchestrator/rules/descriptor-parser.mjs";
import { compileRuleBinding } from "../../../orchestrator/rules/binding-compiler.mjs";

const repoRoot = process.cwd();

async function read(path) {
  return readFile(join(repoRoot, path), "utf8");
}

async function getDescriptor(path) {
  const content = await read(path);
  const result = parseRuleDescriptor(content, path);
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.level === "error");
  assert.deepEqual(errors, [], `Rule descriptor errors in ${path}: ${errors.map((error) => error.message).join("; ")}`);
  return { content, descriptor: result.descriptor };
}

function findDirective(rule, id) {
  const found = rule.directives.find((candidate) => candidate.id === id);
  assert.ok(found, `Expected directive ${id} in rule ${rule.ruleId}`);
  return found;
}

describe("TypeScript pragmatic design rules contract", () => {
  it("defines the shared pragmatic design rule with four distinct directive IDs", async () => {
    const { content, descriptor: rule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");

    assert.equal(rule.id, "cf-rule-ts-pragmatic-design");
    assert.equal(rule.stack, "typescript");
    assert.match(content, /alwaysApply:\s*true/);

    const expectedIds = [
      "ts.pragmatic.yagni-present-need",
      "ts.pragmatic.kiss-minimal-implementation",
      "ts.pragmatic.composition-over-inheritance",
      "ts.pragmatic.demeter-tell-dont-ask",
    ];

    const actualIds = rule.directives.map((d) => d.id);
    assert.deepEqual(actualIds, expectedIds);

    for (const id of expectedIds) {
      const d = findDirective(rule, id);
      assert.equal(d.mode, "evidence-blocking", `Directive ${id} must be evidence-blocking`);
      assert.equal(d.verifier.type, "human-evidence", `Directive ${id} requires named human evidence`);
      assert.deepEqual(d.applicability.paths, ["**/*.ts", "**/*.tsx"]);
    }

    // Verify distinctions in directive content
    assert.match(content, /YAGNI|You Aren't Gonna Need It/i);
    assert.match(content, /KISS|Keep It Simple/i);
    assert.match(content, /Composition over Inheritance/i);
    assert.match(content, /Law of Demeter|Tell, Don't Ask/i);
  });

  it("handles Demeter and Tell, Don't Ask as one combined directive with explicit DTO and transform exceptions", async () => {
    const { content, descriptor: rule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");
    const d = findDirective(rule, "ts.pragmatic.demeter-tell-dont-ask");

    // Must be one single directive covering both concepts
    const demeterDirectives = rule.directives.filter((candidate) =>
      candidate.id.includes("demeter") || candidate.id.includes("tell-dont-ask")
    );
    assert.equal(demeterDirectives.length, 1, "Must have exactly one combined Demeter / Tell Don't Ask directive");

    // Statement must prohibit reach-through caller decisions while allowing DTOs, parsing, and serialization
    assert.match(d.statement, /reach(?:ing)? through|reach-through/i);
    assert.match(d.statement, /tell|owner/i);
    assert.match(d.statement, /DTO|serialization|validation|transform/i);

    // Rule body must contain explicit DTO mapping and domain owner examples
    assert.match(content, /mapUserDtoToResponse|CreateUserDto|DTO/i);
    assert.match(content, /applyLoyaltyPromotion|tell the owner/i);
  });

  it("accepts a direct one-implementation design and allows composition for real variation", async () => {
    const { content, descriptor: rule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");
    const yagni = findDirective(rule, "ts.pragmatic.yagni-present-need");
    const composition = findDirective(rule, "ts.pragmatic.composition-over-inheritance");

    assert.match(yagni.statement, /present requirement|current requirement/i);
    assert.match(yagni.statement, /hypothetical/i);
    assert.match(composition.statement, /single concrete implementation|one implementation/i);
    assert.match(composition.statement, /collaborator|composed/i);

    // Body shows single implementation without strategy vs real variant with composition
    assert.match(content, /findUserById/i);
    assert.match(content, /AuditLogger|Notifier|collaborators/i);
  });

  it("binds to TypeScript (.ts, .tsx) and excludes plain JavaScript (.js)", async () => {
    const { descriptor: rule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");

    // Binding for TypeScript files
    const { binding: tsBinding } = await compileRuleBinding({
      stack: "typescript",
      affectedScope: ["src/services/user-service.ts"],
      descriptors: [rule],
    });

    assert.ok(tsBinding, "Expected valid binding for .ts scope");
    const tsDirectiveIds = tsBinding.directives.map((d) => d.id);
    assert.ok(tsDirectiveIds.includes("ts.pragmatic.yagni-present-need"));
    assert.ok(tsDirectiveIds.includes("ts.pragmatic.kiss-minimal-implementation"));
    assert.ok(tsDirectiveIds.includes("ts.pragmatic.composition-over-inheritance"));
    assert.ok(tsDirectiveIds.includes("ts.pragmatic.demeter-tell-dont-ask"));

    // Binding for TSX files
    const { binding: tsxBinding } = await compileRuleBinding({
      stack: "typescript",
      affectedScope: ["src/components/UserProfile.tsx"],
      descriptors: [rule],
    });

    assert.ok(tsxBinding, "Expected valid binding for .tsx scope");
    const tsxDirectiveIds = tsxBinding.directives.map((d) => d.id);
    assert.ok(tsxDirectiveIds.includes("ts.pragmatic.yagni-present-need"));

    // Plain JavaScript files must NOT bind this rule
    const { binding: jsBinding } = await compileRuleBinding({
      stack: "typescript",
      affectedScope: ["legacy/script.js"],
      descriptors: [rule],
    });

    assert.ok(jsBinding, "Expected valid binding object for .js scope");
    const jsDirectiveIds = jsBinding.directives.map((d) => d.id);
    assert.equal(
      jsDirectiveIds.filter((id) => id.startsWith("ts.pragmatic.")).length,
      0,
      "Plain JavaScript scope must not receive ts.pragmatic.* directives"
    );
  });
});
