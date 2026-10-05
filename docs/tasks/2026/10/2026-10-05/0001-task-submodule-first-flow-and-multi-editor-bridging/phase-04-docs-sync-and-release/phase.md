---
title: "Phase 4: Docs, Sync & Release"
type: phase
parent: "0001-task-submodule-first-flow-and-multi-editor-bridging"
phase: "04"
phase_branch: "task/0001/phase-04/integration"
status: completed
created: "2026-10-05"
tags: [task, phase, docs, sync, release, doctor]
---

# Phase 4: Docs, Sync & Release

## Objective

Synchronize documentation across the repository (`app/cli/README.md`, `README.md`, `docs/guide/cross-workspace-integration.md`), run Context Factory inventory synchronization (`sync`), and verify 100% HEALTHY status across manifest, lockfile, symlinks, and evaluation suites with `doctor`.

## Dependencies & Prerequisites

- Phase 3 completed (`unit-02-integration-evals.md` merged).

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Documentation, Factory Sync & Release Validation | `unit-01-docs-sync-and-health.md` | `task/0001/phase-04/unit-01-docs-sync-release` | `.worktrees/0001/phase-04/unit-01-docs-sync-release` | `03.02` | `none` | `merged` |

## Impacted Files & Components

- `app/cli/README.md`: Document the 3-step onboarding flow, editor selection menu, and new flags.
- `docs/guide/cross-workspace-integration.md`: Update host repository integration guide with Trae, VS Code, and Cursor instructions.
- `README.md`: Update CLI commands and editor coverage.
- `context-manifest.json`, `context-lock.json`: Synchronized inventory.

## Implementation Tasks

- [x] Unit 04.01 — Update documentation, run `context-cli sync`, and confirm all doctor checks pass.

## Verification & Testing

- `node app/cli/bin/context-cli.mjs sync`
- `node app/cli/bin/context-cli.mjs doctor`
- `npm test`

## Risks, Worktree Teardown & Rollback

- **Risk:** Stale lockfile or uncommitted docs.
- **Mitigation:** Run `sync` and `doctor` before marking complete.
- **Teardown:** Prune `.worktrees/0001/phase-04/*` after phase integration merge.
