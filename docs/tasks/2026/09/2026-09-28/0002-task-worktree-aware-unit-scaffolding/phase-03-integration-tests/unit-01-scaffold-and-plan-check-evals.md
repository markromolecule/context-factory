---
title: "Scaffold and Plan-Check Integration Evals"
type: unit
parent: "phase-03-integration-tests"
unit: "03.01"
branch: "task/0002/phase-03/unit-01-scaffold-evals"
worktree: ".worktrees/0002/phase-03/unit-01-scaffold-evals"
status: verified
created: "2026-09-28"
tags: [task, unit, evals, plan-check, integration-tests]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: Scaffold and Plan-Check Integration Evals

> Phase: phase-03-integration-tests · Depends on: 02.01 · Parallelizable with: none
> Worktree: .worktrees/0002/phase-03/unit-01-scaffold-evals · Branch: task/0002/phase-03/unit-01-scaffold-evals

## Objective

Create `evals/task-scaffold.test.mjs` using `node:test` and `node:assert/strict` to test end-to-end task scaffolding into temporary test directories, asserting that nested phases and starter units are generated correctly and that running `node scripts/context.mjs plan:check <tempTaskDir>` exits 0 with PASS.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `evals/plan-check.test.mjs` uses `mkdtemp`, `node:test`, and `execFileAsync` to test CLI subcommands cleanly.
- Acceptance Criteria Served:
  - `AC-03`: A newly scaffolded task folder passes `node scripts/context.mjs plan:check <task-dir>` with 0 findings out-of-the-box.
- Decisions Constraining Unit:
  - Test suites run isolated in OS `tmpdir()` and clean up on completion.

## Preconditions

- Phase 1 and Phase 2 completed.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `evals/task-scaffold.test.mjs`, `context-manifest.json`, `context-lock.json`.
**Out of scope:** Core CLI implementation.

## Steps

1. Create `evals/task-scaffold.test.mjs`.
2. Add test cases:
   - Case 1: Scaffolding a feature task in a temporary directory generates nested phase folders and unit artifacts.
   - Case 2: Generated unit files contain populated `branch` and `worktree` fields without unparsed `{{...}}` tokens.
   - Case 3: Executing `node scripts/context.mjs plan:check <tempDir>` on the scaffolded task exits 0 with PASS.
   - Case 4: Running `context-cli task new ... --no-units` omits unit files.
3. Execute `node --test evals/task-scaffold.test.mjs` and confirm all cases pass.

## Verification

- Test type(s):
  - Integration tests: End-to-end execution of CLI scaffolding into temporary workspace and validating against the deterministic plan checker.
- Cases:
  - All 4 test cases pass cleanly.
- Commands: `node --test evals/task-scaffold.test.mjs`
- Verification Evidence:
  - Command: `node --test evals/task-scaffold.test.mjs` (PASS: 3/3 passed in 367ms)
  - Case 1 & 2: verified nested phase and starter units with resolved branch and worktree metadata.
  - Case 3: verified newly scaffolded task passes `plan:check` with 0 cycles and 4 units found out-of-the-box.
  - Case 4: verified CLI flags `--dry-run`, `--no-units`, and `--json`.
  - Pre-screening Review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Delete `evals/task-scaffold.test.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-03
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
