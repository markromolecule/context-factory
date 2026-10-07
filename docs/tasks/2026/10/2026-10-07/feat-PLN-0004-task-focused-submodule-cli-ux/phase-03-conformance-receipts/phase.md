---
title: "Content-bound conformance receipts"
type: phase
parent: "feat-PLN-0004-task-focused-submodule-cli-ux"
phase: "03"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
phase_branch: "task/PLN-0004/phase-03-integration"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; use the isolated task and unit worktrees."
checkout_path: ".worktrees/PLN-0004/task-base"
status: planned
created: "2026-10-07"
tags: [task, phase, cli]
---

# Content-bound conformance receipts

## Objective

Bind conformance reports to changed code contents and active rules, then make report persistence and verification fail closed.

## Shared context and prerequisites

Source is the released `docs/discovery/submodule-first-developer-cli-ux/brief.md` and ADRs 0026, 0029, 0032. Existing Node ESM CLI remains the command core. 03.02 depends on 03.01 identity/verifier contract and 01.02 because both edit CLI dispatch/help. 03.01 can proceed independently of setup units. Each unit copies its own evidence, scope, rule hashes, and verification so a fresh executor need not read this phase first. Recheck Git state and compile execution-time `preflight` before source changes.

## Unit Index & Checkout Allocation

| Unit | Title | Artifact | Task branch | Checkout mode | Depends on | Parallelizable with | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 03.01 | Change identity and report verifier | `unit-01-receipt-identity.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | none | 02.01 | planned |
| 03.02 | Conform CLI persistence and verify | `unit-02-conform-cli.md` | `feat/PLN-0004-task-focused-submodule-cli-ux` | worktree | 03.01, 01.02 | none | planned |

## Impacted files and components

Existing `orchestrator/conformance/conformance-orchestrator.mjs`, `schemas/conformance-report.schema.json`, `app/cli/commands/conform.mjs`; new identity/verifier modules and focused tests.

## Implementation tasks

- [ ] 03.01 — Change identity and report verifier.
- [ ] 03.02 — Conform CLI persistence and verify.

## Verification & Testing

`node --test evals/tests/conformance/receipt-identity.test.mjs evals/tests/conformance/conformance-cli.test.mjs`; negative fixtures for same-path edit, missing report, stale binding, unavailable tool, and absent human evidence. Check both unit scope fences and the combined phase diff before integration. Do not claim a conformance receipt from plan-time rule references.

## Risks, Worktree Teardown & Rollback

Legacy path-only reports must remain readable where needed but never satisfy strict CI. Roll back additive CLI/schema fields without changing ADR 0029's baseline fail-closed policy. Integrate unit branches into `task/PLN-0004/phase-03-integration` in numeric order, run the combined phase suite and final-diff conformance, then merge that phase branch into the task base at its checkpoint. Inspect untracked/ignored work, remove only task-owned files, remove clean unit worktrees without `--force`, prune Git metadata, and remove empty `.worktrees/PLN-0004/phase-03/` directories.
