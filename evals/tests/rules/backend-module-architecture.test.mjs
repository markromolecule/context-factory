import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseRuleDescriptor } from "../../../orchestrator/rules/descriptor-parser.mjs";

const repoRoot = process.cwd();

async function read(path) {
  return readFile(join(repoRoot, path), "utf8");
}

async function descriptor(path) {
  const content = await read(path);
  const result = parseRuleDescriptor(content, path);
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.level === "error");
  assert.deepEqual(errors, [], `Rule descriptor errors in ${path}: ${errors.map((error) => error.message).join("; ")}`);
  return { content, descriptor: result.descriptor };
}

function directive(rule, id) {
  const found = rule.directives.find((candidate) => candidate.id === id);
  assert.ok(found, `Expected directive ${id}`);
  return found;
}

describe("TypeScript backend operation-first module architecture", () => {
  it("records a superseding decision without rewriting ADR 0001", async () => {
    const index = await read("docs/decisions/README.md");
    const decision = await read("docs/decisions/0037-operation-first-backend-modules.md");

    assert.match(index, /0037-operation-first-backend-modules/);
    assert.match(decision, /Supersedes:\s*0001/i);
    assert.match(decision, /Status\s*\n+\s*Accepted/i);
    assert.match(decision, /src\/modules\/<feature>\/<operation>/);
    assert.match(decision, /src\/features\/<feature>/);
  });

  it("makes operation folders the default while retaining explicit host compatibility", async () => {
    const { content, descriptor: rule } = await descriptor("rules/typescript/backend/module-architecture.md");
    const decision = await read("docs/decisions/0037-operation-first-backend-modules.md");

    assert.deepEqual(
      directive(rule, "ts.module.operation-first-layout").applicability.paths,
      ["src/modules/**/*.ts", "src/features/**/*.ts"],
    );
    assert.match(content, /src\/modules\/<feature>\/<operation>\//);
    assert.match(content, /src\/features\/<feature>/);
    assert.match(content, /index\.ts/);
    assert.match(content, /sideways operation imports/i);
    assert.match(content, /shared by multiple operations/i);
    assert.match(content, /Default layout[\s\S]*src\/modules\/<feature>\/<operation>\//i);
    assert.match(content, /Layer-based alternative[\s\S]*established host convention/i);
    assert.match(decision, /layer-based folders remain allowed for an established host convention/i);
  });

  it("keeps transport, policy, and persistence roles separate across simple and sensitive reads", async () => {
    const { descriptor: moduleRule } = await descriptor("rules/typescript/backend/module-architecture.md");
    const { content: controllerContent, descriptor: controllerRule } = await descriptor("rules/typescript/backend/controllers-and-routes.md");
    const { content: serviceContent, descriptor: serviceRule } = await descriptor("rules/typescript/backend/service-layer.md");

    assert.match(controllerContent, /simple read/i);
    assert.match(controllerContent, /no business policy, authorization-sensitive decision, or orchestration/i);
    assert.match(controllerContent, /policy-bearing read|authorization-sensitive read/i);
    assert.match(serviceContent, /(?:policy-bearing reads and commands|commands and policy-bearing reads)/i);
    assert.match(serviceContent, /transaction context/i);
    assert.match(serviceContent, /external side effects.*after/i);

    assert.equal(directive(moduleRule, "ts.module.operation-first-layout").mode, "evidence-blocking");
    assert.equal(directive(moduleRule, "ts.module.cross-module-public-contract").mode, "evidence-blocking");
    assert.equal(directive(controllerRule, "ts.controllers.direct-data-for-simple-read").mode, "evidence-blocking");
    assert.equal(directive(serviceRule, "ts.service.policy-bearing-operations").mode, "evidence-blocking");
  });

  it("does not call unimplemented path, import, or filename checks automated", async () => {
    const { content, descriptor: rule } = await descriptor("rules/typescript/backend/module-architecture.md");

    for (const id of [
      "ts.module.no-upward-imports",
      "ts.module.file-suffix-convention",
      "ts.module.no-generic-filenames",
    ]) {
      const item = directive(rule, id);
      assert.equal(item.mode, "evidence-blocking", `${id} needs named evidence until Phase 3 supplies its verifier`);
    }

    for (const suffix of [".types.ts", ".errors.ts", ".mapper.ts", ".schema.ts", ".policy.ts", ".events.ts"]) {
      assert.match(content, new RegExp(suffix.replaceAll(".", "\\.")));
    }
    assert.doesNotMatch(content, /\[directive:ts\.module\.(?:no-upward-imports|file-suffix-convention|no-generic-filenames)\]\[mode:automated-blocking\]/);
  });
});
