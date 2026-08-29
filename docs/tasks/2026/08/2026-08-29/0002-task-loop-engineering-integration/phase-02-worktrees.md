---
title: "Phase 2 — Worktrees"
type: phase
parent: "0002-task-loop-engineering-integration"
phase: "02"
status: completed
created: "2026-08-29"
tags: [task, phase, worktrees, concurrency, isolation, git]
---

# Phase 2 — Worktrees

## Objective

Implement the worktree isolation primitive: build `scripts/worktree.mjs` to create, list, remove, and clean up isolated git worktrees per concurrent agent, and update `orchestrator/SHARED.md` to mandate worktree isolation for parallel agent dispatches.

## Dependencies & Prerequisites

- Phase 1 completed.
- Git repository available with working tree.

## Impacted Files & Components

- `scripts/worktree.mjs` — Zero-dependency git worktree manager CLI and API.
- `orchestrator/SHARED.md` — Authoritative contract update mandating worktree isolation.
- `.gitignore` — Ignore `.worktrees/` directory.

## Implementation Tasks

- [x] Author `scripts/worktree.mjs` with subcommands: `create`, `remove`, `list`, `cleanup`.
- [x] Ensure `scripts/worktree.mjs` creates worktrees under `.worktrees/<agent-id>`, manages branch names (`agent/<agent-id>`), and handles teardown cleanly.
- [x] Update `orchestrator/SHARED.md` under "Execution & Harness Contract" with worktree isolation requirement.
- [x] Add `.worktrees/` to `.gitignore`.

## Verification & Testing

- Create worktree: `node scripts/worktree.mjs create test-agent --branch test-wt-branch`
- List worktrees: `node scripts/worktree.mjs list`
- Remove worktree: `node scripts/worktree.mjs remove test-agent --force --delete-branch`
- Verify `git branch` shows no orphaned `test-wt-branch`.

## Risks & Rollback

- **Risk:** Leftover worktrees or orphaned git branches on abnormal process exit.
- **Mitigation:** Comprehensive `cleanup` command and `git worktree prune` invocation.
