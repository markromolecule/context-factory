---
title: "Phase 1 — Scaffolding Engine Upgrades"
type: phase
parent: "0002-task-worktree-aware-unit-scaffolding"
phase: "01"
phase_branch: "task/0002/phase-01"
status: planned
created: "2026-09-28"
tags: [task, phase, scaffolding, engine, templates]
---

# Phase 1 — Scaffolding Engine Upgrades

## Objective

Upgrade the core task generator in `scripts/task-workflow.mjs` to create nested phase directory structures (`phase-NN-<slug>/phase.md`), load `docs/templates/Unit.md`, and interpolate deterministic branch names and worktree directories across all generated artifacts.

## Dependencies & Prerequisites

- `docs/templates/Task.md`, `Phase.md`, and `Unit.md` contain updated worktree and branch placeholders.
- Node.js v18+ runtime available.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Nested Structure Scaffolder | `unit-01-nested-phase-and-unit-structure.md` | `task/0002/phase-01/unit-01-nested-structure` | `.worktrees/0002/phase-01/unit-01-nested-structure` | `none` | `none` | `planned` |
| **Unit 01.02** | Path & Topology Interpolator | `unit-02-branch-and-worktree-interpolator.md` | `task/0002/phase-01/unit-02-path-interpolator` | `.worktrees/0002/phase-01/unit-02-path-interpolator` | `01.01` | `none` | `planned` |

## Impacted Files & Components

- `scripts/task-workflow.mjs`: `scaffoldTask()` function refactored to generate nested directories and parse unit templates.

## Implementation Tasks

- [ ] Unit 01.01 — Implement directory creation for phases (`phase-NN-<slug>/`) and scaffold unit files.
- [ ] Unit 01.02 — Implement template interpolation for `branch`, `worktree`, and topology tables.

## Verification & Testing

- `node --test evals/task-scaffold.test.mjs`: Test generation of nested phase folders and unit artifacts.

## Risks, Worktree Teardown & Rollback

- Revert changes to `scripts/task-workflow.mjs`.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force`, prune worktrees, and clean empty parent directories under `.worktrees/`.
