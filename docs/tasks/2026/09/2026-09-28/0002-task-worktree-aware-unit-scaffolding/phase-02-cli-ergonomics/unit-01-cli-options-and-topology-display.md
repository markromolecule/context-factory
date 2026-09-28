---
title: "CLI Options and Topology Display"
type: unit
parent: "phase-02-cli-ergonomics"
unit: "02.01"
branch: "task/0002/phase-02/unit-01-cli-options"
worktree: ".worktrees/0002/phase-02/unit-01-cli-options"
status: planned
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

**In scope:** `app/cli/commands/task.mjs`, `scripts/harness-cli.mjs`.
**Out of scope:** Core file scaffolding logic (already in `scripts/task-workflow.mjs`).

## Steps

1. In `app/cli/commands/task.mjs`:
   - Extract `noUnits: Boolean(flags.noUnits)` and pass `includeUnits: !flags.noUnits` to `scaffoldTask()`.
   - Enhance console output upon task creation to show:
     - Task Directory
     - Base Branch
     - Table of scaffolded units with their branches and worktrees.
   - In JSON output mode (`--json`), include `units` array containing `{ id, path, branch, worktree }`.
2. In `scripts/harness-cli.mjs`:
   - Update `usage()` text: `task:new <title> [--type <...>] [--no-units] [--dry-run]`.

## Verification

- Test type(s):
  - Integration tests: Verifies command invocation with `--dry-run`, `--no-units`, and `--json`.
- Cases:
  - Case 1: `node scripts/context.mjs task:new "sample" --dry-run --json` returns valid JSON with `units` list.
  - Case 2: `node scripts/context.mjs task:new "sample" --dry-run --no-units --json` returns JSON with empty `units` array.
- Commands: `node --test evals/task-scaffold.test.mjs`

## Rollback

Revert modifications to `app/cli/commands/task.mjs` and `scripts/harness-cli.mjs`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-04
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
