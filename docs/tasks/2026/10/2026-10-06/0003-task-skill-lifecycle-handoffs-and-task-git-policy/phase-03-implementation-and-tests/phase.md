---
title: "Phase 03: Access and reviewed execution handoffs"
type: phase
parent: "0003-task-skill-lifecycle-handoffs-and-task-git-policy"
phase: "03"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
status: planned
created: "2026-10-06"
tags: [task, phase]
---

# Phase 03: Access and reviewed execution handoffs

## Objective

Check declared skill boundaries, stale inputs, packet approval, and safe checkout behavior.

## Dependencies & Prerequisites

Previous phase verified and developer checkpoint accepted. Work sequentially on the task branch; recheck Git status and checkout mode before execution.

## Unit Index & Checkout Allocation

| Unit | Outcome | Artifact | Depends on | Execution | Status |
|---|---|---|---|---|---|
| 03.01 | Lint skill access declarations | unit-01-implementation-and-tests.md | 02.02 | sequential | planned |
| 03.02 | Verify discovery briefs and execution packets | unit-02-handoff-freshness.md | 03.01 | sequential | planned |
| 03.03 | Consume reviewed packets and preserve worktrees | unit-03-reviewed-execution.md | 03.02 | sequential | planned |

## Impacted Files & Components

Boundary lint, freshness contract, reviewer and executor skills. Exact file scopes and new files are listed in each unit.

## Implementation Tasks

- [ ] 03.01 Lint skill access declarations
- [ ] 03.02 Verify discovery briefs and execution packets
- [ ] 03.03 Consume reviewed packets and preserve worktrees

## Verification & Testing

Run the focused checks recorded in each unit. At phase end, inspect combined behavior, verify AC coverage for this phase, record command outputs and conformance receipts, and stop for developer inspection before the next phase.

## Risks, Checkout & Rollback

Preserve unrelated changes. Use one task branch in the recorded task worktree; the primary checkout currently holds another task. Never force-remove a dirty worktree. Roll back only the phase's commits and generated files after reviewing dependency effects; do not rewrite historical plans or ADRs.
