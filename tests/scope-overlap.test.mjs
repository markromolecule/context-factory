import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractDeclaredScopes,
  findParallelUnitPairs,
  checkDisjointScopes,
  checkPlanScopes,
  buildDependencyGraph,
} from "../scripts/plan-check.mjs";

describe("extractDeclaredScopes", () => {
  it("extracts backticked file paths and excludes function names inside parentheses", () => {
    const markdown = `
## Scope

**In scope:** \`scripts/plan-check.mjs\` (functions: \`extractDeclaredScopes\`, \`findParallelUnitPairs\`, \`checkDisjointScopes\`).
**Out of scope:** Git operations or worktree creation.
`;
    const scopes = extractDeclaredScopes(markdown);
    assert.deepEqual(scopes, ["scripts/plan-check.mjs"]);
  });

  it("extracts multiple comma-separated file paths and normalizes leading ./", () => {
    const markdown = `
## Scope

**In scope:** \`./scripts/harness-cli.mjs\`, \`scripts/plan-check.mjs\`, \`evals/cases/plan-check.json\`.
**Out of scope:** Anything else.
`;
    const scopes = extractDeclaredScopes(markdown);
    assert.deepEqual(scopes, [
      "scripts/harness-cli.mjs",
      "scripts/plan-check.mjs",
      "evals/cases/plan-check.json",
    ]);
  });

  it("extracts file paths from bulleted lists under scope", () => {
    const markdown = `
## Scope

**In scope:**
- \`src/index.ts\`
- \`src/utils.ts\`
**Out of scope:**
- \`dist/\`
`;
    const scopes = extractDeclaredScopes(markdown);
    assert.deepEqual(scopes, ["src/index.ts", "src/utils.ts"]);
  });
});

describe("findParallelUnitPairs", () => {
  it("identifies independent parallel units within the same phase", () => {
    const units = [
      { id: "01.01", phase: "phase-01", dependsOn: [] },
      { id: "01.02", phase: "phase-01", dependsOn: [] },
    ];
    const graph = buildDependencyGraph(units);
    const pairs = findParallelUnitPairs(units, graph);
    assert.equal(pairs.length, 1);
    assert.equal(pairs[0].unitA.id, "01.01");
    assert.equal(pairs[0].unitB.id, "01.02");
  });

  it("excludes sequential units from parallel pairs when one depends on another", () => {
    const units = [
      { id: "01.01", phase: "phase-01", dependsOn: [] },
      { id: "01.02", phase: "phase-01", dependsOn: ["01.01"] },
    ];
    const graph = buildDependencyGraph(units);
    const pairs = findParallelUnitPairs(units, graph);
    assert.equal(pairs.length, 0);
  });

  it("excludes units in different phases from parallel pairs", () => {
    const units = [
      { id: "01.01", phase: "phase-01", dependsOn: [] },
      { id: "02.01", phase: "phase-02", dependsOn: [] },
    ];
    const graph = buildDependencyGraph(units);
    const pairs = findParallelUnitPairs(units, graph);
    assert.equal(pairs.length, 0);
  });
});

describe("checkDisjointScopes & checkPlanScopes", () => {
  it("Case 1: two parallel units touching completely different files -> valid", () => {
    const units = [
      {
        id: "01.01",
        phase: "phase-01",
        dependsOn: [],
        scope: ["scripts/dag.mjs"],
      },
      {
        id: "01.02",
        phase: "phase-01",
        dependsOn: [],
        scope: ["scripts/scope.mjs"],
      },
    ];
    const graph = buildDependencyGraph(units);
    const pairs = findParallelUnitPairs(units, graph);
    const result = checkDisjointScopes(pairs);

    assert.equal(result.valid, true);
    assert.deepEqual(result.conflicts, []);
  });

  it("Case 2: two parallel units both declaring scripts/context-core.mjs in scope -> fails with conflict", () => {
    const units = [
      {
        id: "01.01",
        phase: "phase-01",
        dependsOn: [],
        scope: ["scripts/context-core.mjs", "scripts/dag.mjs"],
      },
      {
        id: "01.02",
        phase: "phase-01",
        dependsOn: [],
        scope: ["scripts/context-core.mjs", "scripts/scope.mjs"],
      },
    ];
    const graph = buildDependencyGraph(units);
    const pairs = findParallelUnitPairs(units, graph);
    const result = checkDisjointScopes(pairs);

    assert.equal(result.valid, false);
    assert.equal(result.conflicts.length, 1);
    assert.equal(result.conflicts[0].unitA, "01.01");
    assert.equal(result.conflicts[0].unitB, "01.02");
    assert.deepEqual(result.conflicts[0].overlappingFiles, ["scripts/context-core.mjs"]);
  });

  it("Case 3: sequential units (B depends on A) touching the same file -> valid", () => {
    const units = [
      {
        id: "01.01",
        phase: "phase-01",
        dependsOn: [],
        scope: ["scripts/plan-check.mjs"],
      },
      {
        id: "01.02",
        phase: "phase-01",
        dependsOn: ["01.01"],
        scope: ["scripts/plan-check.mjs"],
      },
    ];
    const graph = buildDependencyGraph(units);
    const pairs = findParallelUnitPairs(units, graph);
    const result = checkDisjointScopes(pairs);

    assert.equal(result.valid, true);
    assert.deepEqual(result.conflicts, []);
  });
});
