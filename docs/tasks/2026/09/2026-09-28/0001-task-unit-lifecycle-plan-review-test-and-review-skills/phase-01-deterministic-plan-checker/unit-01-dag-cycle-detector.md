---
title: "DAG Cycle Detector"
type: unit
parent: "phase-01-deterministic-plan-checker"
unit: "01.01"
status: verified
created: "2026-09-28"
tags: [task, unit, dag, cycle-detection, topological-sort]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: DAG Cycle Detector

> Phase: phase-01-deterministic-plan-checker · Depends on: none · Parallelizable with: none
> Worktree: .worktrees/0001/phase-01/unit-01-dag-cycle-detector · Branch: task/0001/phase-01/unit-01-dag-cycle-detector

## Objective

Implement the core graph builder and cycle detection algorithm in `scripts/plan-check.mjs` to deterministically verify that a plan's unit dependency graph is acyclic using topological sorting.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - Unit files located in `phase-*/unit-*.md` contain frontmatter: `unit: "<id>"`, `depends_on: ["<id>"]`.
  - Master plans contain dependency tables and graphs.
- Acceptance Criteria Served:
  - `AC-01`: `scripts/plan-check.mjs` deterministically detects cycles in `depends_on` graphs.
- Decisions Constraining Unit:
  - `D-02`: Cycle detection must be a small deterministic script, not LLM judgment. Pure Node.js standard library with zero external dependencies.

## Preconditions

Node.js v18+ runtime available.

## Scope

**In scope:** `scripts/plan-check.mjs` (functions: `parseUnitArtifacts`, `buildDependencyGraph`, `detectCycles`).
**Out of scope:** CLI flag parsing, file scope overlap checking, or executing plans.

## Steps

1. Create `scripts/plan-check.mjs`.
2. Implement `parseUnitArtifacts(taskDirPath)` using `node:fs/promises` and `frontmatter()` parser to locate all `phase-*/unit-*.md` files and extract unit IDs and `depends_on` arrays.
3. Implement `buildDependencyGraph(units)` to construct an adjacency list and in-degree map for all units.
4. Implement `detectCycles(graph)` using Kahn's algorithm (topological sort). If in-degree remains non-zero for any nodes after traversal, return the cycle path.
5. Export `checkPlanGraph(taskDirPath)` returning `{ valid: boolean, cycles: string[][], sortedOrder: string[] }`.

## Verification

- Test type(s):
  - Unit tests: Verifies cycle detection correctly flags circular dependencies (e.g. A->B->C->A) and passes valid acyclic DAGs without false positives.
- Cases:
  - Case 1: Pure linear dependency chain (A -> B -> C) -> valid.
  - Case 2: Diamond dependency graph (A -> B, A -> C, B -> D, C -> D) -> valid.
  - Case 3: Circular dependency (A -> B -> A) -> returns `{ valid: false, cycles: [...] }`.
  - Case 4: Disconnected subgraphs -> valid.
- Commands: `node --test evals/dag-cycle.test.mjs`
- Verification Evidence:
  - Command: `node --test evals/dag-cycle.test.mjs` (PASS: 4/4 passed, 85ms)
  - Files modified/created: `scripts/plan-check.mjs`, `evals/dag-cycle.test.mjs`

## Rollback

Delete `scripts/plan-check.mjs` or revert changes to it.

## Definition of done

- [x] Maps to acceptance criteria: AC-01
- [x] Topological sort correctly orders acyclic graphs
- [x] Cycles are deterministically detected and reported with exact node IDs
- [x] All listed verification passes
