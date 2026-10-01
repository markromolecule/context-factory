---
title: "Phase 4: Verification, Quality Gates, and Release"
type: phase
parent: "0001-task-lhg-minimal-input-and-session-state-primitives"
phase: "04"
phase_branch: "task/0001/phase-04/integration"
status: completed
merge_commit: "4d50394"
created: "2026-10-01"
tags: [task, phase, verification, evals, doctor, release]
---

# Phase 4: Verification, Quality Gates, and Release

## Objective

Build the end-to-end automated test suite in `evals/session-checkpoint.test.mjs`, register evaluation test cases in `evals/cases/session-management.json`, update system architecture and skills documentation, synchronize manifest and lockfile, and verify healthy status via `node scripts/context.mjs doctor`.

## Dependencies & Prerequisites

- Phase 3 complete: `session` skill, contract updates, and rule density optimizations in place.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Automated E2E Suite, Evaluations, and Release | `unit-01-evaluations-and-release.md` | `task/0001/phase-04/unit-01-evaluations-and-release` | `.worktrees/0001/phase-04/unit-01-evaluations-and-release` | `03.01`, `03.02` | `none` | `merged` |

## Impacted Files & Components

- `evals/session-checkpoint.test.mjs`: E2E integration test suite for session save, resume, status, clear, and budget fencing.
- `evals/cases/session-management.json`: Evaluation case for session slash command routing.
- `docs/ARCHITECTURE.md`: Architecture map updated with LHG and Session Checkpoint primitives.
- `docs/Skills.md`: Skills index updated with `session` skill.
- `context-manifest.json`: Manifest updated with new skill, schema, and tool files.
- `context-lock.json`: Cryptographic lockfile regenerated.

## Implementation Tasks

- [x] **Unit 04.01:** Author `evals/session-checkpoint.test.mjs` and `evals/cases/session-management.json`.
- [x] **Unit 04.01:** Update `docs/ARCHITECTURE.md`, `docs/Skills.md`, `context-manifest.json`, and regenerate `context-lock.json`.
- [x] **Unit 04.01:** Execute `node scripts/context.mjs doctor` to verify 100% passing checks.

## Verification & Testing

- E2E Test: Run `node evals/session-checkpoint.test.mjs` and assert all lifecycle assertions pass.
- Eval suite: Run `node scripts/context.mjs eval --unit` and ensure 23/23 evaluations pass.
- Doctor check: Run `node scripts/context.mjs doctor` and ensure healthy status.

## Risks, Worktree Teardown & Rollback

- **Risk:** Stale lockfile digest or unindexed artifacts.
- **Mitigation:** Run `node scripts/context.mjs lock` and `doctor` diagnostic prior to final merge.
- **Teardown:** Prune `.worktrees/0001/phase-04/*` and clean branches after task merge.
