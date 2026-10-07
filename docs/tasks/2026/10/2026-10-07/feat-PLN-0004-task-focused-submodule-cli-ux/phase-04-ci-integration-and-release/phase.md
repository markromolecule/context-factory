---
title: "GitHub Actions integration and release guidance"
type: phase
parent: "feat-PLN-0004-task-focused-submodule-cli-ux"
phase: "04"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
phase_branch: "task/PLN-0004/phase-04-integration"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; use the isolated task and unit worktrees."
checkout_path: ".worktrees/PLN-0004/task-base"
status: planned
created: "2026-10-07"
tags: [task, phase, cli]
---

# GitHub Actions integration and release guidance

## Objective

Generate the optional host GitHub Actions gate only after receipt verification works, then document and verify the full developer journey.

## Shared context and prerequisites

Source is the released `docs/discovery/submodule-first-developer-cli-ux/brief.md` and ADRs 0026, 0029, 0032. Existing Node ESM CLI remains the command core. 04.01 depends on 02.02 and 03.02. 04.02 depends on 04.01 and 01.02. Each unit copies its own evidence, scope, rule hashes, and verification so a fresh executor need not read this phase first. Recheck Git state and compile execution-time `preflight` before source changes.

## Unit Index & Checkout Allocation

| Unit | Title | Artifact | Task branch | Checkout mode | Depends on | Parallelizable with | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 04.01 | Optional GitHub Actions gate | `unit-01-github-gate.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | 02.02, 03.02 | none | planned |
| 04.02 | Docs and end-to-end release checks | `unit-02-release-guidance.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | 04.01, 01.02 | none | planned |

## Impacted files and components

Existing `app/cli/commands/init.mjs`, `app/cli/README.md`, `README.md`, `docs/guide/cross-workspace-integration.md`; new `app/cli/core/github-gate-generator.mjs` and workflow tests; generated host workflow is a runtime output, not a factory-source file.

## Implementation tasks

- [ ] 04.01 — Optional GitHub Actions gate.
- [ ] 04.02 — Docs and end-to-end release checks.

## Verification & Testing

`node --test evals/tests/cli/github-gate.test.mjs`; full `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`, lock check, and final-diff conformance after documentation synchronization. Check both unit scope fences and the combined phase diff before integration. Do not claim a conformance receipt from plan-time rule references.

## Risks, Worktree Teardown & Rollback

Workflow conflicts remain blocked; no provider-specific file for non-GitHub CI. Roll back only the generated task-owned workflow and its CLI opt-in path, preserving host-owned files. Integrate unit branches into `task/PLN-0004/phase-04-integration` in numeric order, run the combined phase suite and final-diff conformance, then merge that phase branch into the task base at its checkpoint. Inspect untracked/ignored work, remove only task-owned files, remove clean unit worktrees without `--force`, prune Git metadata, and remove empty `.worktrees/PLN-0004/phase-04/` directories.
