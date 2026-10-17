import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseRuleDescriptor } from "../../../orchestrator/rules/descriptor-parser.mjs";

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
  assert.ok(found, `Expected directive ${id} in rule ${rule.id}`);
  return found;
}

describe("SOLID principles and pragmatic rules reconciliation contract", () => {
  it("aligns OCP principle with pragmatic-design rules without mandating speculative strategies", async () => {
    const { descriptor: pragmaticRule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");
    const ocpNote = await read("knowledge/principles/open-closed.md");

    const comp = findDirective(pragmaticRule, "ts.pragmatic.composition-over-inheritance");
    assert.match(comp.statement, /polymorphic|composed|collaborator/i);

    // Principle note must NOT mandate speculation or praise variation expected over time
    assert.doesNotMatch(ocpNote, /expected to vary over time/i);
    assert.match(ocpNote, /present requirement|actual variation|observed variation/i);
  });

  it("aligns SRP knowledge note with architecture conformance and pragmatic defaults", async () => {
    const { descriptor: archRule } = await getDescriptor("rules/global/architecture-conformance.md");
    const { descriptor: qualityRule } = await getDescriptor("rules/global/code-quality.md");
    const srpNote = await read("knowledge/principles/single-responsibility.md");

    const solidArch = findDirective(archRule, "cf.arch.solid");
    const solidQuality = findDirective(qualityRule, "cf.quality.solid-compliance");
    const layers = findDirective(archRule, "cf.arch.layers");

    assert.equal(solidArch.mode, "automated-blocking");
    assert.equal(solidQuality.mode, "evidence-blocking");
    assert.match(layers.statement, /transport, domain, persistence, UI separation/i);

    // SRP note acknowledges cohesion over artificial file fragmentation
    assert.match(srpNote, /cohesion|artificial file split|operation/i);
  });

  it("aligns DIP knowledge note with architecture conformance while preserving strict boundaries", async () => {
    const { descriptor: archRule } = await getDescriptor("rules/global/architecture-conformance.md");
    const dipNote = await read("knowledge/principles/dependency-inversion.md");

    const direction = findDirective(archRule, "cf.arch.direction");
    const contracts = findDirective(archRule, "cf.arch.contracts");

    assert.equal(direction.mode, "automated-blocking");
    assert.match(direction.statement, /Point inward; circular dependencies forbidden/i);
    assert.equal(contracts.mode, "evidence-blocking");

    // DIP note mentions real boundary and present need
    assert.match(dipNote, /boundary|present need|contract/i);
  });
});
