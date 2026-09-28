---
title: "Scope Overlap Checker"
type: unit
parent: "phase-01-deterministic-plan-checker"
unit: "01.02"
status: verified
created: "2026-09-28"
tags: [task, unit, scope, disjoint-sets, overlap-detection]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: Scope Overlap Checker

> Phase: phase-01-deterministic-plan-checker · Depends on: 01.01 · Parallelizable with: none

## Objective

Implement file scope extraction and disjoint-set validation in `scripts/plan-check.mjs` to ensure that parallel units (units that can execute concurrently) have zero overlapping file paths in their declared `In scope` boundaries.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - Unit files (`docs/templates/Unit.md`) declare file boundaries under `## Scope`:
    ```markdown
    ## Scope
    **In scope:** exact files/functions/endpoints/schemas.
    **Out of scope:** explicitly excluded...
    ```
- Acceptance Criteria Served:
  - `AC-01`: `scripts/plan-check.mjs` deterministically detects file overlap between parallel units.
- Decisions Constraining Unit:
  - `D-02`: Overlap check must be deterministic code (set intersection), not LLM inference.
  - Parallel units must have disjoint file sets to prevent worktree merge collisions.

## Preconditions

Node.js v18+ runtime available.

## Scope

**In scope:** `scripts/plan-check.mjs` (functions: `extractDeclaredScopes`, `findParallelUnitPairs`, `checkDisjointScopes`).
**Out of scope:** Git operations or worktree creation.

## Steps

1. Implement `extractDeclaredScopes(unitContent)` in `scripts/plan-check.mjs` to parse the `## Scope` section and extract normalized file paths listed after `**In scope:**`.
2. Implement `findParallelUnitPairs(units, graph)`:
   - Identify units within the same phase that do not have a directed path between each other (neither $u_1 \to^* u_2$ nor $u_2 \to^* u_1$).
3. Implement `checkDisjointScopes(parallelPairs)`:
   - For each pair $(u_1, u_2)$, calculate $\text{Scope}(u_1) \cap \text{Scope}(u_2)$.
   - If intersection is non-empty, record an overlap conflict with the offending file paths.
4. Export `checkPlanScopes(taskDirPath)` returning `{ valid: boolean, conflicts: Array<{ unitA: string, unitB: string, overlappingFiles: string[] }> }`.

## Verification

- Test type(s):
  - Unit tests: Verifies set intersection logic accurately flags shared files across parallel units while ignoring sequential dependencies (units where B depends on A can safely touch the same files).
- Cases:
  - Case 1: Two parallel units touching completely different files -> valid.
  - Case 2: Two parallel units both declaring `scripts/context-core.mjs` in scope -> fails with conflict reported.
  - Case 3: Sequential units (B depends on A) touching the same file -> valid (sequential edit is permitted).
- Commands: `node --test tests/scope-overlap.test.mjs`
- Evidence: 9/9 tests passed in 86ms. `node scripts/context.mjs doctor` passed with 100% HEALTHY.

## Rollback

Revert changes to `scripts/plan-check.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-01
- [x] Correctly extracts file paths from `## Scope` section
- [x] Only flags file overlaps between concurrent/parallel units, not sequential ones
- [x] All listed verification passes
