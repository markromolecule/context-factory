---
title: "Branch and Worktree Path Interpolator"
type: unit
parent: "phase-01-scaffolding-engine"
unit: "01.02"
branch: "task/0002/phase-01/unit-02-path-interpolator"
worktree: ".worktrees/0002/phase-01/unit-02-path-interpolator"
status: verified
created: "2026-09-28"
tags: [task, unit, interpolation, templates, worktree, branch]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: Branch and Worktree Path Interpolator

> Phase: phase-01-scaffolding-engine · Depends on: 01.01 · Parallelizable with: none
> Worktree: .worktrees/0002/phase-01/unit-02-path-interpolator · Branch: task/0002/phase-01/unit-02-path-interpolator

## Objective

Implement template variable interpolation in `scripts/task-workflow.mjs` to dynamically replace `{{task_id}}`, `{{task_slug}}`, `{{parent_task}}`, `{{parent_phase}}`, `{{phase_number}}`, `{{unit_id}}`, `{{slug}}`, `{{worktree}}`, and `{{branch}}` across `Task.md`, `Phase.md`, and `Unit.md`, as well as rendering the `## Worktree & Branch Topology` table in `README.md`.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `docs/templates/Task.md` has `base_branch: "task/{{task_id}}-{{task_slug}}"` and `## Worktree & Branch Topology`.
  - `docs/templates/Phase.md` has `phase_branch: "task/{{parent_task}}/phase-{{phase_number}}"`.
  - `docs/templates/Unit.md` has `branch: "{{branch}}"` and `worktree: "{{worktree}}"`.
- Acceptance Criteria Served:
  - `AC-02`: Scaffolded `README.md`, `phase.md`, and `unit-*.md` have `branch` and `worktree` fields pre-populated with deterministic paths matching the 3-tier taxonomy.
- Decisions Constraining Unit:
  - `D-03`: Branch and worktree naming must adhere strictly to the 3-tier taxonomy in `skills/productivity/plan/SKILL.md`.

## Preconditions

- Unit 01.01 completed.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `scripts/task-workflow.mjs` (string replacement and template interpolation functions), `docs/templates/Phase.md`, `docs/templates/Unit.md`.
**Out of scope:** CLI argument parsing or evaluation test definitions.

## Steps

1. In `scripts/task-workflow.mjs`:
   - Replace tokens for task, phase, and unit templates.
   - Generate `## Worktree & Branch Topology` rows for all phases in `Task.md`.
   - Generate `## Finalization & Merge Ledger` rows in `Task.md`.
   - Render `Phase.md` with unit index table rows.
   - Render `Unit.md` with deterministic `branch:` and `worktree:` paths.
2. In `tests/task-scaffold.test.mjs`:
   - Add assertion verifying all double-brace tags `{{...}}` are completely resolved.
3. Verify all tests pass.

## Verification

- Test type(s):
  - Unit tests: Verifies that no raw `{{...}}` tags remain in generated artifacts and that branch/worktree paths adhere to `task/<id>/...` and `.worktrees/<id>/...`.
- Cases:
  - Case 1: Rendered `README.md` contains populated `base_branch: "task/0002-..."`.
  - Case 2: Rendered `unit-01-*.md` contains populated `branch:` and `worktree:` without unparsed braces.
- Commands: `node --test tests/task-scaffold.test.mjs`
- Verification Evidence:
  - Command: `node --test tests/task-scaffold.test.mjs` (PASS: 2/2 passed, 143ms)
  - Pre-screening Review: PASS (0 scope leaks, 0 SOLID violations)
  - Files modified: `scripts/task-workflow.mjs`, `docs/templates/Phase.md`, `docs/templates/Unit.md`, `tests/task-scaffold.test.mjs`

## Rollback

Revert additions in `scripts/task-workflow.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-02
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
