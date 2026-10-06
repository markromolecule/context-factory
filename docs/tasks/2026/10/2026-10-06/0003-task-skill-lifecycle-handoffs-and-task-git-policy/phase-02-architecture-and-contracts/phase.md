---
title: "Phase 02: Plan identity and checkout policy"
type: phase
parent: "0003-task-skill-lifecycle-handoffs-and-task-git-policy"
phase: "02"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
status: in_progress
created: "2026-10-06"
tags: [task, phase]
---

# Phase 02: Plan identity and checkout policy

## Objective

Create unique named plans and reject incomplete or unjustified checkout choices.

## Dependencies & Prerequisites

Previous phase verified and developer checkpoint accepted. Work sequentially on the task branch; recheck Git status and checkout mode before execution.

## Unit Index & Checkout Allocation

| Unit | Outcome | Artifact | Depends on | Execution | Status |
|---|---|---|---|---|---|
| 02.01 | Reserve repo-wide plan IDs and scaffold named plans | unit-01-architecture-and-contracts.md | 01.02 | sequential | verified |
| 02.02 | Apply task-branch policy and plan done-check | unit-02-planning-contract.md | 02.01 | sequential | planned |

## Impacted Files & Components

Existing scaffold, listing, plan skill, templates, plan checker. Exact file scopes and new files are listed in each unit.

## Implementation Tasks

- [x] 02.01 Reserve repo-wide plan IDs and scaffold named plans
- [ ] 02.02 Apply task-branch policy and plan done-check

## Verification & Testing

Run the focused checks recorded in each unit. At phase end, inspect combined behavior, verify AC coverage for this phase, record command outputs and conformance receipts, and stop for developer inspection before the next phase.

## Risks, Checkout & Rollback

Preserve unrelated changes. Use one task branch in the recorded task worktree; the primary checkout currently holds another task. Never force-remove a dirty worktree. Roll back only the phase's commits and generated files after reviewing dependency effects; do not rewrite historical plans or ADRs.
