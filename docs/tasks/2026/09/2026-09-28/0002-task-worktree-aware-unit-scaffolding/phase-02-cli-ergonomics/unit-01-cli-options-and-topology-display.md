---
title: "CLI Options and Topology Display"
type: unit
parent: "phase-02-cli-ergonomics"
unit: "02.01"
branch: "task/0002/phase-02/unit-01-cli-options"
worktree: ".worktrees/0002/phase-02/unit-01-cli-options"
status: verified
created: "2026-09-28"
tags: [task, unit, cli, flags, formatting]
depends_on: ["01.02"]
parallelizable_with: []
---

# Unit 02.01: CLI Options and Topology Display

> Phase: phase-02-cli-ergonomics · Depends on: 01.02 · Parallelizable with: none
> Worktree: .worktrees/0002/phase-02/unit-01-cli-options · Branch: task/0002/phase-02/unit-01-cli-options

## Objective

Update `app/cli/commands/task.mjs` and usage text in `scripts/harness-cli.mjs` to parse `--no-units`, pass `includeUnits: !flags.noUnits` to `scaffoldTask()`, and render a clear terminal table showing the created phase folders, starter unit files, and their designated worktree paths.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `app/cli/commands/task.mjs` handles `task new` command and prints files created.
  - `scripts/harness-cli.mjs` lists CLI usage.
- Acceptance Criteria Served:
  - `AC-04`: CLI flags `--no-units` and `--dry-run` operate reliably in `app/cli/commands/task.mjs`.
- Decisions Constraining Unit:
  - Units are included by default; `--no-units` allows opting out.

## Preconditions

- Phase 1 completed.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `app/cli/commands/task.mjs`, `scripts/harness-cli.mjs`, `scripts/task-workflow.mjs`, `tests/task-scaffold.test.mjs`.
**Out of scope:** Phase-3 integration evals.

## Steps

1. In `app/cli/commands/task.mjs`:
   - Extract `noUnits: Boolean(flags.noUnits || flags.units === false || flags["no-units"])` and pass `includeUnits: !noUnits` to `scaffoldTask()`.
   - Enhance console output upon task creation to show:
     - Task Directory
     - Base Branch
     - Table of scaffolded units with their branches and worktrees.
   - In JSON output mode (`--json`), include `units` array containing `{ id, path, branch, worktree }`.
2. In `scripts/harness-cli.mjs`:
   - Update `usage()` text: `task:new <title> [--type <...>] [--no-units] [--dry-run]`.
3. In `scripts/task-workflow.mjs`:
   - Support `includeUnits: true/false` parameter in `scaffoldTask`.
4. In `tests/task-scaffold.test.mjs`:
   - Add unit tests for `includeUnits: false` and default unit inclusion.

## Verification

- Test type(s):
  - Integration tests: Verifies command invocation with `--dry-run`, `--no-units`, and `--json`.
- Cases:
  - Case 1: `node scripts/context.mjs task:new "sample" --dry-run --json` returns valid JSON with `units` list.
  - Case 2: `node scripts/context.mjs task:new "sample" --dry-run --no-units --json` returns JSON with empty `units` array.
- Commands: `node --test tests/task-scaffold.test.mjs`
- Verification Evidence:
  - Command: `node --test tests/task-scaffold.test.mjs` (PASS: 4/4 passed in 93ms)
  - Command: `node scripts/harness-cli.mjs task:new "Sample Feature Task" --dry-run` (PASS: prints Base Branch and Worktree Topology table)
  - Command: `node scripts/harness-cli.mjs task:new "Sample Feature Task" --dry-run --no-units` (PASS: suppresses Worktree Topology table)
  - Command: `node scripts/harness-cli.mjs task:new "Sample Feature Task" --dry-run --json` (PASS: returns units array with 4 units)
  - Pre-screening Review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert modifications to `app/cli/commands/task.mjs`, `scripts/harness-cli.mjs`, and `scripts/task-workflow.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
