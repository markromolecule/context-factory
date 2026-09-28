---
title: "Phase 3 — Integration Tests"
type: phase
parent: "0002-task-worktree-aware-unit-scaffolding"
phase: "03"
phase_branch: "task/0002/phase-03/integration"
status: completed
created: "2026-09-28"
tags: [task, phase, tests, evals, integration]
---

# Phase 3 — Integration Tests

## Objective

Author end-to-end integration evaluations in `evals/task-scaffold.test.mjs` verifying that `task:new` creates valid directory structures, populates worktree/branch metadata, and that freshly scaffolded task folders pass `node scripts/context.mjs plan:check <task-dir>` with 0 findings.

## Dependencies & Prerequisites

- Phase 1 and Phase 2 complete.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Scaffold & Plan-Check Integration Evals | `unit-01-scaffold-and-plan-check-evals.md` | `task/0002/phase-03/unit-01-scaffold-evals` | `.worktrees/0002/phase-03/unit-01-scaffold-evals` | `none` | `none` | `completed` |

## Impacted Files & Components

- `evals/task-scaffold.test.mjs`: New automated test suite.

## Implementation Tasks

- [x] Unit 03.01 — Write and run automated evaluation test cases.

## Verification & Testing

- `node --test evals/task-scaffold.test.mjs`: All assertions pass.

## Risks, Worktree Teardown & Rollback

- Delete `evals/task-scaffold.test.mjs`.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force`, prune worktrees, and clean empty parent directories under `.worktrees/`.
