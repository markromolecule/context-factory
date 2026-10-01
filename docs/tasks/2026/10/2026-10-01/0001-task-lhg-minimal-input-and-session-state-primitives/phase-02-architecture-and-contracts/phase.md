---
title: "Phase 2: Harness CLI and Budget Fencing"
type: phase
parent: "0001-task-lhg-minimal-input-and-session-state-primitives"
phase: "02"
phase_branch: "task/0001/phase-02/integration"
status: completed
merge_commit: "fb03fa6"
created: "2026-10-01"
tags: [task, phase, cli, budget, harness]
---

# Phase 2: Harness CLI and Budget Fencing

## Objective

Expose the session commands to developers and automated scripts via `app/cli/commands/session.mjs` and `scripts/harness-cli.mjs`, and implement context token budgeting and bundle density fencing in `scripts/context-core.mjs`.

## Dependencies & Prerequisites

- Phase 1 complete: `schemas/session-state.schema.json` and `scripts/session-core.mjs` integrated.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Session CLI Commands & Harness Integration | `unit-01-session-cli-commands.md` | `task/0001/phase-02/unit-01-session-cli-commands` | `.worktrees/0001/phase-02/unit-01-session-cli-commands` | `01.02` | `02.02` | `merged` |
| **Unit 02.02** | Context Token Budget Fencing | `unit-02-context-budget-fencing.md` | `task/0001/phase-02/unit-02-context-budget-fencing` | `.worktrees/0001/phase-02/unit-02-context-budget-fencing` | `01.02` | `02.01` | `merged` |

## Impacted Files & Components

- `app/cli/commands/session.mjs`: CLI command implementation for `session:save`, `session:resume`, `session:status`, `session:clear`.
- `scripts/harness-cli.mjs`: Routing subcommand dispatcher for session actions.
- `scripts/context-core.mjs`: Token density and context size budgeting logic.

## Implementation Tasks

- [x] **Unit 02.01:** Implement `session.mjs` CLI handler with formatted console output, flags, and schema validation.
- [x] **Unit 02.02:** Add context token budget calculation and diagnostic warnings when resolved context exceeds threshold.

## Verification & Testing

- Integration test: Execute `node scripts/context.mjs session:status` and verify CLI responses.
- Unit test: Verify budget fence warnings on intentionally bloated context mock inputs.

## Risks, Worktree Teardown & Rollback

- **Risk:** CLI flag conflicts with existing commands.
- **Mitigation:** Namespaced under `session:*` matching existing Context Factory conventions (`task:*`, `plan:*`).
- **Teardown:** Prune `.worktrees/0001/phase-02/*` and clean branches after phase merge.
