---
title: "Phase 1 — Ephemeral Root Directory Removal"
type: phase
parent: "refactor-PLN-0011-clean-ephemeral-dirs-and-conformance"
phase: "01"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, phase, cleanup]
---

# Phase 1 — Ephemeral Root Directory Removal

## Objective

Remove ephemeral and legacy symlink/worktree directories (`.agents`, `.claude`, `.worktrees`) from the repository root, ensuring that only standard project configuration and canonical source directories remain visible.

## Dependencies & Prerequisites

- Task branch `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` checked out from base commit `c7524e96a0e97bacdb848bdee05abd9203ef5e96`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Empty and Remove Ephemeral Root Directories | `unit-01-ephemeral-directory-removal.md` | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | `none` | `planned` |

## Impacted Files & Components

- `.agents/` (entire directory of symlinks and configs: delete)
- `.claude/` (entire git-tracked directory of workflow symlinks: delete from git and filesystem)
- `.worktrees/` (entire directory of orphaned worktrees `0001`, `0003`, `PLN-0004`: delete)

## Implementation Tasks

- [ ] Unit 01.01 — Delete `.agents/`, `.claude/`, and `.worktrees/` from the repository root.

## Verification & Testing

- `test ! -d .agents && test ! -d .claude && test ! -d .worktrees`
- `git status --short` confirms no lingering untracked or tracked files under `.agents`, `.claude`, or `.worktrees`.

## Risks & Rollback

- Re-creation of symlinks if bridge commands are run prematurely. Mitigation: complete Phase 3 tooling updates before regenerating bridges.
- Rollback: `git restore --staged .claude && git checkout -- .claude` if needed.
