---
title: "Host interface and accessible CLI"
type: phase
parent: "feat-PLN-0004-task-focused-submodule-cli-ux"
phase: "01"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
phase_branch: "task/PLN-0004/phase-01-integration"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; use the isolated task and unit worktrees."
checkout_path: ".worktrees/PLN-0004/task-base"
status: planned
created: "2026-10-07"
tags: [task, phase, cli]
---

# Host interface and accessible CLI

## Objective

Give the developer a host-aware state and compact task-focused first screen while preserving the existing command core.

## Shared context and prerequisites

Source is the released `docs/discovery/submodule-first-developer-cli-ux/brief.md` and ADRs 0026, 0029, 0032. Existing Node ESM CLI remains the command core. Released brief and ADR 0032; no implementation unit dependency. Each unit copies its own evidence, scope, rule hashes, and verification so a fresh executor need not read this phase first. Recheck Git state and compile execution-time `preflight` before source changes.

## Unit Index & Checkout Allocation

| Unit | Title | Artifact | Task branch | Checkout mode | Depends on | Parallelizable with | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01.01 | Host state and actionable status | `unit-01-host-state.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | none | 01.02 | planned |
| 01.02 | Text-first help and output | `unit-02-text-help.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | none | 01.01 | planned |

## Impacted files and components

Existing `app/cli/commands/status.mjs`, `app/cli/bin/context-cli.mjs`, `app/cli/core/formatter.mjs`; new `app/cli/core/host-state.mjs`, `evals/tests/cli/host-status.test.mjs`, `evals/tests/cli/help-output.test.mjs`.

## Implementation tasks

- [ ] 01.01 — Host state and actionable status.
- [ ] 01.02 — Text-first help and output.

## Verification & Testing

`node --test evals/tests/cli/host-status.test.mjs evals/tests/cli/help-output.test.mjs`; review TTY, `NO_COLOR`, non-TTY, narrow output, and JSON state parity. Check both unit scope fences and the combined phase diff before integration. Do not claim a conformance receipt from plan-time rule references.

## Risks, Worktree Teardown & Rollback

Keep inventory detail available and preserve status JSON consumers. Roll back host-state command wiring and text presentation separately; do not alter rule policy. Integrate unit branches into `task/PLN-0004/phase-01-integration` in numeric order, run the combined phase suite and final-diff conformance, then merge that phase branch into the task base at its checkpoint. Inspect untracked/ignored work, remove only task-owned files, remove clean unit worktrees without `--force`, prune Git metadata, and remove empty `.worktrees/PLN-0004/phase-01/` directories.
