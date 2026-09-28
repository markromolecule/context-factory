---
title: "Branch and Worktree Path Interpolator"
type: unit
parent: "phase-01-scaffolding-engine"
unit: "01.02"
branch: "task/0002/phase-01/unit-02-path-interpolator"
worktree: ".worktrees/0002/phase-01/unit-02-path-interpolator"
status: planned
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
  - `docs/templates/Unit.md` has `branch: "task/{{task_id}}/{{parent_phase}}/{{unit_id}}-{{slug}}"` and `worktree: ".worktrees/{{task_id}}/{{parent_phase}}/{{unit_id}}-{{slug}}"`.
- Acceptance Criteria Served:
  - `AC-02`: Scaffolded `README.md`, `phase.md`, and `unit-*.md` have `branch` and `worktree` fields pre-populated with deterministic paths matching the 3-tier taxonomy.
- Decisions Constraining Unit:
  - `D-03`: Branch and worktree naming must adhere strictly to the 3-tier taxonomy in `skills/productivity/plan/SKILL.md`.

## Preconditions

- Unit 01.01 completed.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `scripts/task-workflow.mjs` (string replacement and template interpolation functions).
**Out of scope:** CLI argument parsing or evaluation test definitions.

## Steps

1. In `scripts/task-workflow.mjs`:
   - Create helper `renderTemplate(template, vars)` that replaces all `{{key}}` occurrences with corresponding values.
2. In `scaffoldTask()`:
   - Construct topology rows for `README.md` and unit allocation tables for `phase.md`.
   - Render `Task.md` with `taskId`, `taskSlug`, `dateStr`, and the generated topology table.
   - For each phase, render `Phase.md` with `parent_task: taskFolderName`, `phase_number: pNum`, and `phase_branch: task/${taskId}/phase-${pNum}`.
   - For each starter unit, render `Unit.md` with:
     - `task_id: taskId`
     - `parent_phase: "phase-" + pNum + "-" + p.slug`
     - `unit_id: pNum + ".01"`
     - `slug: p.slug`
     - `branch: "task/" + taskId + "/phase-" + pNum + "/unit-01-" + p.slug`
     - `worktree: ".worktrees/" + taskId + "/phase-" + pNum + "/unit-01-" + p.slug`
3. Verify all placeholders in rendered output are replaced with non-empty values.

## Verification

- Test type(s):
  - Unit tests: Verifies that no raw `{{...}}` tags remain in generated artifacts and that branch/worktree paths adhere to `task/<id>/...` and `.worktrees/<id>/...`.
- Cases:
  - Case 1: Rendered `README.md` contains populated `base_branch: "task/0002-..."`.
  - Case 2: Rendered `unit-01-*.md` contains populated `branch:` and `worktree:` without unparsed braces.
- Commands: `node --test evals/task-scaffold.test.mjs`

## Rollback

Revert additions in `scripts/task-workflow.mjs`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-02
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
