---
title: "CLI Harness & Eval Tests"
type: unit
parent: "phase-01-deterministic-plan-checker"
unit: "01.03"
status: verified
created: "2026-09-28"
tags: [task, unit, cli, harness, evals, plan-check]
depends_on: ["01.01", "01.02"]
parallelizable_with: []
---

# Unit 01.03: CLI Harness & Eval Tests

> Phase: phase-01-deterministic-plan-checker · Depends on: 01.01, 01.02 · Parallelizable with: none

## Objective

Expose the plan checker via the CLI harness as `node scripts/context.mjs plan:check <task-dir>` and create comprehensive automated test cases in the evaluation suite.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `scripts/harness-cli.mjs` routes CLI commands (`task:new`, `doctor`, `lock`, etc.).
  - `evals/` contains automated unit and dataset evaluations.
- Acceptance Criteria Served:
  - `AC-01`: CLI command `node scripts/context.mjs plan:check <task-dir>` exits 0 on valid plans and non-zero on cyclic or overlapping plans.
- Decisions Constraining Unit:
  - `D-02`: Clean CLI command output with structured error reporting (JSON or formatted console).

## Preconditions

Units 01.01 and 01.02 completed.

## Scope

**In scope:** `scripts/harness-cli.mjs`, `scripts/plan-check.mjs` (CLI runner function), `evals/cases/plan-check.json` (or `evals/plan-check.test.mjs`).
**Out of scope:** Modifying `doctor` command.

## Steps

1. In `scripts/harness-cli.mjs`:
   - Add `plan:check` to usage text and route to `handlePlanCheckCommand(parsedArgs, flags)`.
2. Implement CLI formatting in `scripts/plan-check.mjs`:
   - Print clean pass/fail banners with unit counts, batch lists, and any cycle or overlap findings.
   - Return exit code 0 on success, exit code 1 on findings.
3. Author evaluation test cases in `evals/plan-check.test.mjs` testing:
   - Synthetic valid task folder (acyclic, disjoint scopes).
   - Synthetic cyclic task folder (fails with cycle error).
   - Synthetic overlapping task folder (fails with overlap error).
4. Run `npm test` and verify tests pass.

## Verification

- Test type(s):
  - Integration tests: Verifies CLI execution against mock plan folders in a temporary/scratch directory, asserting exit codes and output formatting.
- Cases:
  - Case 1: `node scripts/context.mjs plan:check <valid-dir>` exits 0.
  - Case 2: `node scripts/context.mjs plan:check <cyclic-dir>` exits 1 with cycle trace.
  - Case 3: `node scripts/context.mjs plan:check <overlap-dir>` exits 1 with colliding file names.
- Commands: `node --test evals/plan-check.test.mjs`
- Evidence: 4/4 integration tests passed in 315ms. `npm test` evaluation suite (22/22) passed in 95ms. `node scripts/context.mjs doctor` returned 100% HEALTHY.

## Rollback

Revert additions in `scripts/harness-cli.mjs` and remove test files.

## Definition of done

- [x] Maps to acceptance criteria: AC-01
- [x] `node scripts/context.mjs plan:check` works as an executable CLI subcommand
- [x] Integration tests verify CLI output and exit codes
- [x] All listed verification passes
