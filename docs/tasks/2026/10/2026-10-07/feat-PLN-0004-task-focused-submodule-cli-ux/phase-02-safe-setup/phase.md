---
title: "Safe opt-in host setup"
type: phase
parent: "feat-PLN-0004-task-focused-submodule-cli-ux"
phase: "02"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
phase_branch: "task/PLN-0004/phase-02-integration"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; use the isolated task and unit worktrees."
checkout_path: ".worktrees/PLN-0004/task-base"
status: planned
created: "2026-10-07"
tags: [task, phase, cli]
---

# Safe opt-in host setup

## Objective

Make local hook installation non-clobbering and make `init` show selected host writes before applying them.

## Shared context and prerequisites

Source is the released `docs/discovery/submodule-first-developer-cli-ux/brief.md` and ADRs 0026, 0029, 0032. Existing Node ESM CLI remains the command core. 02.02 depends on 01.01 host detection/state and 02.01 hook contract. 02.01 can be built independently. Each unit copies its own evidence, scope, rule hashes, and verification so a fresh executor need not read this phase first. Recheck Git state and compile execution-time `preflight` before source changes.

## Unit Index & Checkout Allocation

| Unit | Title | Artifact | Task branch | Checkout mode | Depends on | Parallelizable with | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 02.01 | Non-clobbering local hook | `unit-01-safe-hook.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | none | 03.01 | planned |
| 02.02 | Explicit init choices and preview | `unit-02-init-preview.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | 01.01, 02.01 | none | planned |

## Impacted files and components

Existing `app/cli/commands/hook.mjs`, `app/cli/commands/init.mjs`, `app/cli/commands/bridge.mjs`, `app/cli/core/bridge-generator.mjs`; new focused hook/init tests.

## Implementation tasks

- [ ] 02.01 — Non-clobbering local hook.
- [ ] 02.02 — Explicit init choices and preview.

## Verification & Testing

`node --test evals/tests/cli/hook-safety.test.mjs evals/tests/cli/init-preview.test.mjs`; temp-host integration checks for existing files, races, read-only targets, and no-editor non-TTY. Check both unit scope fences and the combined phase diff before integration. Do not claim a conformance receipt from plan-time rule references.

## Risks, Worktree Teardown & Rollback

Do not overwrite pre-existing host hooks or editor files. Roll back only generated task-owned artifacts after inspecting host changes; never delete an unrelated file. Integrate unit branches into `task/PLN-0004/phase-02-integration` in numeric order, run the combined phase suite and final-diff conformance, then merge that phase branch into the task base at its checkpoint. Inspect untracked/ignored work, remove only task-owned files, remove clean unit worktrees without `--force`, prune Git metadata, and remove empty `.worktrees/PLN-0004/phase-02/` directories.
