---
title: "Phase 04: Factory synchronization and evidence"
type: phase
parent: "0003-task-skill-lifecycle-handoffs-and-task-git-policy"
phase: "04"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
status: planned
created: "2026-10-06"
tags: [task, phase]
---

# Phase 04: Factory synchronization and evidence

## Objective

Synchronize shared guidance and prove the complete lifecycle against tests and doctor.

## Dependencies & Prerequisites

Previous phase verified and developer checkpoint accepted. Work sequentially on the task branch; recheck Git status and checkout mode before execution.

## Unit Index & Checkout Allocation

| Unit | Outcome | Artifact | Depends on | Execution | Status |
|---|---|---|---|---|---|
| 04.01 | Synchronize factory guidance and verify lifecycle | unit-01-verification-and-release.md | 03.03 | sequential | planned |

## Impacted Files & Components

Contract, adapters, maps, manifest, lock, evaluations. Exact file scopes and new files are listed in each unit.

## Implementation Tasks

- [ ] 04.01 Synchronize factory guidance and verify lifecycle

## Verification & Testing

Run the focused checks recorded in each unit. At phase end, inspect combined behavior, verify AC coverage for this phase, record command outputs and conformance receipts, and stop for developer inspection before the next phase.

## Risks, Checkout & Rollback

Preserve unrelated changes. Use one task branch in the recorded task worktree; the primary checkout currently holds another task. Never force-remove a dirty worktree. Roll back only the phase's commits and generated files after reviewing dependency effects; do not rewrite historical plans or ADRs.
