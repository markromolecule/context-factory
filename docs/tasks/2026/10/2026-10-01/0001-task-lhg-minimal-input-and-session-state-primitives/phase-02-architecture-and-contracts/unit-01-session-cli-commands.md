---
title: "Session CLI Commands & Harness Integration"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.01"
branch: "task/0001/phase-02/unit-01-session-cli-commands"
worktree: ".worktrees/0001/phase-02/unit-01-session-cli-commands"
status: verified
created: "2026-10-01"
tags: [task, unit, cli, session]
depends_on: ["01.02"]
parallelizable_with: ["02.02"]
---

# Unit 02.01: Session CLI Commands & Harness Integration

> Phase: phase-02-architecture-and-contracts · Depends on: 01.02 · Parallelizable with: 02.02  
> Worktree: .worktrees/0001/phase-02/unit-01-session-cli-commands · Branch: task/0001/phase-02/unit-01-session-cli-commands

## Objective

Expose the session state engine via `app/cli/commands/session.mjs` and wire subcommands (`session:save`, `session:resume`, `session:status`, `session:clear`) into `scripts/harness-cli.mjs`.

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Core Engine:** `scripts/session-core.mjs`
- **CLI Patterns:** `app/cli/commands/task.mjs`, `app/cli/commands/doctor.mjs`
- **Acceptance Criteria:** AC-03

## Preconditions

- Unit 01.02 completed (`scripts/session-core.mjs` available).
- Worktree provisioned at declared path.

## Scope

**In scope:**
- `app/cli/commands/session.mjs`
- `scripts/harness-cli.mjs`

**Out of scope:**
- Core serialization algorithm (`scripts/session-core.mjs`) or context resolver logic.

## Steps

1. Create `app/cli/commands/session.mjs` exporting `handleSessionCommand(args, flags)`.
2. Support `session:save [--name <id>]`, `session:resume [<id>]`, `session:status`, and `session:clear [<id>]`.
3. Format output cleanly using Context Factory CLI box/badge styling (`SAVE`, `RESUME`, `STATUS`, `CLEAR`).
4. Wire `session:*` command dispatch into `scripts/harness-cli.mjs`.
5. Update `usage()` in `scripts/harness-cli.mjs`.

## Verification

- **Test Type:** Integration test — executes CLI commands against mock session directory and validates stdout output codes.
- **Commands & Evidence:**
  - Red verification: Observed unrecognized command failure prior to routing implementation (exit code 1).
  - Green verification: Tested full CLI command lifecycle:
    - `node scripts/harness-cli.mjs session:save --name cli-test-session` -> `SAVED Session checkpoint saved`
    - `node scripts/harness-cli.mjs session:status` -> Formatted active sessions table
    - `node scripts/harness-cli.mjs session:resume cli-test-session` -> Cold-start prompt displayed
    - `node scripts/harness-cli.mjs session:clear cli-test-session` -> `CLEARED Removed session checkpoint`
  - Diff Review Pre-Screening: Gate 1 (0 scope leaks), Gate 2 (all CLI commands passing), Gate 3 (SOLID SRP confirmed), Gate 4 (DoD verified).
- **Files Modified:** `app/cli/commands/session.mjs`, `scripts/harness-cli.mjs`, `context-lock.json`.
- **Commit:** `7649113` on `task/0001/phase-02/unit-01-session-cli-commands`.

## Rollback

- Revert changes to `scripts/harness-cli.mjs` and remove `app/cli/commands/session.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-03
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`7649113`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
