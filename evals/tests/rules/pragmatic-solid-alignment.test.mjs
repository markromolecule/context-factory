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

describe("SOLID rule and knowledge reconciliation contract", () => {
  it("aligns OCP with present-need variation without mandating speculative strategies for single implementations", async () => {
    const { content, descriptor: rule } = await getDescriptor("rules/solid/open-closed.md");
    const ocpNote = await read("knowledge/principles/solid-ocp.md");

    const poly = findDirective(rule, "cf.solid.ocp-polymorphic-strategies");
    const stable = findDirective(rule, "cf.solid.ocp-stable-extension-interfaces");

    // Must mention present variation or current requirement
    assert.match(poly.statement, /present|observed|current/i);
    assert.match(stable.statement, /present|real variation|accepted contract/i);

    // Must NOT mandate speculation or praise variation expected over time
    assert.doesNotMatch(ocpNote, /expected to vary over time/i);
    assert.match(ocpNote, /present requirement|actual variation|observed variation/i);
  });

  it("aligns SRP layer separation and hook extraction with operation cohesion and pragmatic defaults", async () => {
    const { content, descriptor: rule } = await getDescriptor("rules/solid/single-responsibility.md");
    const srpNote = await read("knowledge/principles/solid-srp.md");

    const layers = findDirective(rule, "cf.solid.srp-layer-separation");
    const hooks = findDirective(rule, "cf.solid.srp-extract-async-hooks");
    const noDbInUi = findDirective(rule, "cf.solid.srp-no-db-in-ui-or-controllers");

    // Layer separation permits cohesive operation files or simple reads without forced file splits
    assert.match(layers.statement, /cohesive|operation|simple read|distinct file/i);

    // Hook extraction does not mandate hook extraction for trivial local state
    assert.match(hooks.statement, /non-trivial|reusable|cohesive|trivial/i);

    // Strict boundary: DB queries still forbidden in UI and controllers
    assert.equal(noDbInUi.mode, "automated-blocking");
    assert.match(noDbInUi.statement, /database queries|ORM calls/i);

    // SRP note acknowledges cohesion over artificial file fragmentation
    assert.match(srpNote, /cohesion|artificial file split|operation/i);
  });

  it("aligns DIP with pragmatic persistence while preserving strict policy-to-infrastructure boundaries", async () => {
    const { content, descriptor: rule } = await getDescriptor("rules/solid/dependency-inversion.md");
    const dipNote = await read("knowledge/principles/solid-dip.md");

    const ports = findDirective(rule, "cf.solid.dip-domain-ports-infrastructure-adapters");
    const noDirectClient = findDirective(rule, "cf.solid.dip-no-direct-client-instantiation");
    const isolateSdks = findDirective(rule, "cf.solid.dip-isolate-third-party-sdks");

    // Ports and adapters trigger on real architectural boundaries or variation, not forced on simple reads
    assert.match(ports.statement, /boundary|real|policy/i);

    // Strict boundary: High-level policy must NEVER directly instantiate concrete database clients
    assert.equal(noDirectClient.mode, "automated-blocking");
    assert.match(noDirectClient.statement, /directly instantiate/i);
    assert.match(isolateSdks.statement, /isolate|SDK/i);

    // DIP note mentions real boundary and present need
    assert.match(dipNote, /boundary|present need|contract/i);
  });
});
