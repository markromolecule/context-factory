---
title: "Phase 4 — Factory Synchronization & Doctor"
type: phase
parent: "0002-task-worktree-aware-unit-scaffolding"
phase: "04"
phase_branch: "task/0002/phase-04"
status: planned
created: "2026-09-28"
tags: [task, phase, sync, doctor, manifest, lockfile]
---

# Phase 4 — Factory Synchronization & Doctor

## Objective

Register any new evaluation files in `context-manifest.json`, synchronize the lockfile via `node scripts/context.mjs lock`, and run `node scripts/context.mjs doctor` to verify complete factory health.

## Dependencies & Prerequisites

- Phase 1, Phase 2, and Phase 3 completed and verified.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Manifest Sync & Doctor Verification | `unit-01-manifest-lock-and-doctor-validation.md` | `task/0002/phase-04/unit-01-sync-and-doctor` | `.worktrees/0002/phase-04/unit-01-sync-and-doctor` | `none` | `none` | `planned` |

## Impacted Files & Components

- `context-manifest.json`
- `context-lock.json`

## Implementation Tasks

- [ ] Unit 04.01 — Synchronize manifest, generate lock, and run doctor.

## Verification & Testing

- `node scripts/context.mjs doctor`: 100% HEALTHY.
- `npm test`: All evaluations pass.

## Risks, Worktree Teardown & Rollback

- Revert manifest and lockfile changes.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force`, prune worktrees, and clean empty parent directories under `.worktrees/`.
