---
title: "Phase 4 — Tooling Verification & Release"
type: phase
parent: "0002"
phase: "04"
phase_branch: "task/0002/phase-04"
status: planned
created: "2026-10-05"
tags: [task, phase, tooling, verification, release]
---

# Phase 4 — Tooling Verification & Release

## Objective

Enhance the deterministic plan validation script (`scripts/plan-check.mjs`) to optionally audit unit files for `<language_rules>` blocks, run full repository synchronization via `npm run sync`, and verify Context Factory diagnostic health with `npm run doctor`.

## Dependencies & Prerequisites

- Phase 3 integration merged into `task/0002-language-rule-lifecycle-binding`.
- All template and skill updates completed.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Deterministic Plan Checker Script Validation | `unit-01-deterministic-plan-checker-enhancement.md` | `task/0002/phase-04/plan-checker-validation` | `.worktrees/0002/phase-04/plan-checker-validation` | `none` | `Unit 04.02` | `planned` |
| **Unit 04.02** | Full Lifecycle Synchronization & Doctor Verification | `unit-02-sync-and-doctor-verification.md` | `task/0002/phase-04/sync-and-doctor` | `.worktrees/0002/phase-04/sync-and-doctor` | `Unit 04.01` | `none` | `planned` |

## Impacted Files & Components

- `scripts/plan-check.mjs`: Enhance plan check logic to inspect `<language_rules>` blocks in unit artifacts.
- `context-manifest.json`, `context-lock.json`: Synchronized inventory and lockfile digests.

## Implementation Tasks

- [ ] Unit 04.01 — Enhance `scripts/plan-check.mjs` to validate `<language_rules>` presence.
- [ ] Unit 04.02 — Execute `npm run sync`, run `npm run doctor`, and verify clean diagnostic health.

## Verification & Testing

- `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0002-task-language-rule-lifecycle-binding`
- `npm run sync`
- `npm run doctor`

## Risks, Worktree Teardown & Rollback

- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
