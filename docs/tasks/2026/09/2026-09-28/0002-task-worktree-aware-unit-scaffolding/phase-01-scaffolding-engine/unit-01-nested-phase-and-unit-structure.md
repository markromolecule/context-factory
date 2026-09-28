---
title: "Nested Phase and Unit Folder Structure"
type: unit
parent: "phase-01-scaffolding-engine"
unit: "01.01"
branch: "task/0002/phase-01/unit-01-nested-structure"
worktree: ".worktrees/0002/phase-01/unit-01-nested-structure"
status: planned
created: "2026-09-28"
tags: [task, unit, scaffolding, folders, units]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Nested Phase and Unit Folder Structure

> Phase: phase-01-scaffolding-engine · Depends on: none · Parallelizable with: none
> Worktree: .worktrees/0002/phase-01/unit-01-nested-structure · Branch: task/0002/phase-01/unit-01-nested-structure

## Objective

Refactor `scaffoldTask()` in `scripts/task-workflow.mjs` to create encapsulated phase directories (`phase-NN-<slug>/phase.md`) rather than flat phase files, and read `docs/templates/Unit.md` to scaffold an initial starter unit artifact (`unit-01-<slug>.md`) in each phase.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `scripts/task-workflow.mjs`: `scaffoldTask` currently creates flat files `${taskRelativeDir}/${phaseFilename}` with `phaseFilename = phase-${pNum}-${p.slug}.md`.
  - `docs/templates/Unit.md`: exists at root and provides frontmatter and structure for atomic units.
- Acceptance Criteria Served:
  - `AC-01`: `scripts/task-workflow.mjs` scaffolds phases as directories (`phase-<num>-<slug>/phase.md`) containing starter units (`unit-01-<slug>.md`).
- Decisions Constraining Unit:
  - `D-01`: Phases must be directories containing their own `phase.md` and unit files to match the unit execution model.
  - `D-02`: Exactly 1 starter unit per phase by default.

## Preconditions

- Dedicated git worktree and branch provisioned at declared path.
- Node.js v18+ runtime available.

## Scope

**In scope:** `scripts/task-workflow.mjs` (directory tree construction and file list assembly inside `scaffoldTask`).
**Out of scope:** CLI flag parsing (`app/cli/commands/task.mjs`) or graph cycle checking.

## Steps

1. In `scripts/task-workflow.mjs`, update `scaffoldTask()`:
   - Read `docs/templates/Unit.md` alongside `Task.md` and `Phase.md`.
   - Change phase path resolution from `${taskRelativeDir}/phase-${pNum}-${p.slug}.md` to `${taskRelativeDir}/phase-${pNum}-${p.slug}/phase.md`.
   - For each phase, generate a default starter unit artifact: `${taskRelativeDir}/phase-${pNum}-${p.slug}/unit-01-${p.slug}.md`.
2. Ensure directory creation (`mkdir(..., { recursive: true })`) handles parent directories for nested phase files.
3. Return the expanded list of created files in the return object.

## Verification

- Test type(s):
  - Unit tests: Verifies that calling `scaffoldTask()` produces file paths matching `phase-*/phase.md` and `phase-*/unit-01-*.md`.
- Cases:
  - Case 1: `scaffoldTask({ title: "auth service", type: "feature", dryRun: true })` returns file list containing nested `phase.md` and `unit-01-*.md` paths.
  - Case 2: Custom phases array generates corresponding phase directories and unit files.
- Commands: `node --test evals/task-scaffold.test.mjs`

## Rollback

Revert changes to `scripts/task-workflow.mjs`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
