---
title: "Phase 2 — CLI Ergonomics & Options"
type: phase
parent: "0002-task-worktree-aware-unit-scaffolding"
phase: "02"
phase_branch: "task/0002/phase-02/integration"
status: completed
created: "2026-09-28"
tags: [task, phase, cli, ergonomics, options]
---

# Phase 2 — CLI Ergonomics & Options

## Objective

Expose CLI options in `app/cli/commands/task.mjs` and `scripts/harness-cli.mjs` to control unit generation (`--no-units`), display the scaffolded worktree topology cleanly in terminal output, and return structured JSON when `--json` is supplied.

## Dependencies & Prerequisites

- Phase 1 complete (scaffolding engine supports unit generation and interpolation).

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | CLI Options & Topology Display | `unit-01-cli-options-and-topology-display.md` | `task/0002/phase-02/unit-01-cli-options` | `.worktrees/0002/phase-02/unit-01-cli-options` | `none` | `none` | `completed` |

## Impacted Files & Components

- `app/cli/commands/task.mjs`: Handle flags (`noUnits`, `dryRun`, `json`) and print structured terminal summary with worktree paths.
- `scripts/harness-cli.mjs`: Update usage instructions to document `--no-units`.

## Implementation Tasks

- [x] Unit 02.01 — Update CLI routing and terminal formatting.

## Verification & Testing

- `node scripts/context.mjs task:new "test task" --dry-run`: Verify dry-run output formatting.
- `node scripts/context.mjs task:new "test task" --dry-run --json`: Verify JSON output schema.

## Risks, Worktree Teardown & Rollback

- Revert changes to `app/cli/commands/task.mjs` and `scripts/harness-cli.mjs`.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force`, prune worktrees, and clean empty parent directories under `.worktrees/`.
