---
title: "Branch-Only Task Lifecycle"
type: decision
status: accepted
created: "2026-10-08"
tags: [adr, skills, planning, execution, git]
supersedes: ["0031"]
---

# Branch-Only Task Lifecycle

## Context

ADR 0031 established one task branch by default while retaining conditional worktrees. The user reports that extra directories, environment setup, cleanup, and context switching outweigh the isolation benefit for this workflow. The handoff ownership, review packet, test-first practice, conformance receipts, and phase checkpoints remain required. The decision concerns new plans; historical artifacts remain readable.

## Options considered

1. Retain conditional worktrees. This preserves concurrent checkout isolation but keeps the overhead that motivated the change.
2. Use one task branch and have each downstream skill switch to it. This reduces checkout setup but allows a later skill to move or obscure unrelated local changes.
3. Have `plan` alone create one task branch after grounding and brief release; downstream skills verify the exact branch and stop on mismatch. This removes checkout management while preserving visible, fail-closed Git identity.

## Decision

Adopt Option 3 for new plans. Name branches `<type>/PLN-NNNN-<slug>` using the existing type vocabulary, atomic plan ID, and lowercase 3–40 character slug. The planner checks clean state, attached HEAD, intended base, existing branch identity, and ancestry before branch creation. A conflicting state stops planning without stashing or resetting. All units run serially on the task branch. `plan-review`, `execute`, and later writing skills verify the branch before changes. New plan metadata records the task branch and base commit; historical v2 plans retain their recorded metadata.

## Consequences

Concurrent tasks cannot share one checkout. A developer must finish or park one task before switching this checkout to another. Reuse of an existing task branch requires an identity and ancestry check. Plan ID reservation and branch creation must remain coordinated before plan writing. The skill text, shared contract, templates, checker, map, lock, and evaluations must agree.

## Validation and review date

Validate with branch mismatch, detached HEAD, dirty checkout, duplicate branch, wrong base, new-plan metadata, historical-plan compatibility, context doctor, and evaluation checks. Review when concurrent task throughput becomes a recurring need. Review date: 2026-10-08.
