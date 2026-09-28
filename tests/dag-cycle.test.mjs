import test from "node:test";
import assert from "node:assert/strict";
import { buildDependencyGraph, detectCycles } from "../scripts/plan-check.mjs";

test("buildDependencyGraph constructs valid adjacency list and in-degree map", () => {
  const units = [
    { id: "01.01", dependsOn: [] },
    { id: "01.02", dependsOn: [] },
    { id: "01.03", dependsOn: ["01.01", "01.02"] },
  ];

  const graph = buildDependencyGraph(units);
  assert.equal(graph.nodes.size, 3);
  assert.deepEqual(graph.adjList.get("01.01"), ["01.03"]);
  assert.deepEqual(graph.adjList.get("01.02"), ["01.03"]);
  assert.deepEqual(graph.adjList.get("01.03"), []);
  assert.equal(graph.inDegree.get("01.01"), 0);
  assert.equal(graph.inDegree.get("01.02"), 0);
  assert.equal(graph.inDegree.get("01.03"), 2);
});

test("detectCycles returns valid topological sort for acyclic graphs", () => {
  const units = [
    { id: "01.01", dependsOn: [] },
    { id: "01.02", dependsOn: [] },
    { id: "01.03", dependsOn: ["01.01", "01.02"] },
    { id: "02.01", dependsOn: ["01.03"] },
  ];

  const graph = buildDependencyGraph(units);
  const result = detectCycles(graph);
  assert.equal(result.valid, true);
  assert.equal(result.cycles.length, 0);
  assert.equal(result.sortedOrder.length, 4);
  // 01.01 and 01.02 before 01.03, 01.03 before 02.01
  assert.ok(result.sortedOrder.indexOf("01.01") < result.sortedOrder.indexOf("01.03"));
  assert.ok(result.sortedOrder.indexOf("01.02") < result.sortedOrder.indexOf("01.03"));
  assert.ok(result.sortedOrder.indexOf("01.03") < result.sortedOrder.indexOf("02.01"));
});

test("detectCycles detects direct 2-node cycle (A -> B -> A)", () => {
  const units = [
    { id: "A", dependsOn: ["B"] },
    { id: "B", dependsOn: ["A"] },
  ];

  const graph = buildDependencyGraph(units);
  const result = detectCycles(graph);
  assert.equal(result.valid, false);
  assert.ok(result.cycles.length > 0);
});

test("detectCycles detects indirect 3-node cycle (A -> B -> C -> A)", () => {
  const units = [
    { id: "A", dependsOn: ["C"] },
    { id: "B", dependsOn: ["A"] },
    { id: "C", dependsOn: ["B"] },
    { id: "D", dependsOn: ["C"] },
  ];

  const graph = buildDependencyGraph(units);
  const result = detectCycles(graph);
  assert.equal(result.valid, false);
  assert.ok(result.cycles.length > 0);
});
