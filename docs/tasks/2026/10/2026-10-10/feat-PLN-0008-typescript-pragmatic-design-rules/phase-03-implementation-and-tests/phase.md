---
title: "Phase 03 — Reconcile existing TypeScript rules"
type: phase
parent: "feat-PLN-0008-typescript-pragmatic-design-rules"
phase: "03"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, phase, architecture]
---

# Phase 03 — Reconcile Existing TypeScript Rules

## Objective

Remove contradictory unconditional TypeScript design mandates from SOLID examples and applicable backend/UI rules while preserving real policy and dependency boundaries.

## Dependencies & Prerequisites

Unit 02.01 must be reviewed and committed; its stable directive IDs and concise common rule are the comparison point. Unit 03.02 waits for 03.01's catalog/lock state because both synchronize those files. No host code changes.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 03.01 | SOLID rule and knowledge reconciliation | `unit-01-implementation-and-tests.md` | `feat/PLN-0008-typescript-pragmatic-design-rules` | 02.01 | planned |
| 03.02 | Backend, UI, and global scope audit | `unit-02-backend-ui-alignment.md` | `feat/PLN-0008-typescript-pragmatic-design-rules` | 03.01 | planned |

## Impacted Files & Components

OCP/SRP/DIP rule and knowledge owners, relevant global quality/architecture wording only where TypeScript scope can be preserved, backend service/module and UI organization rules, focused architecture tests, catalog inventory, and lock.

## Implementation Tasks

- [ ] Make a conflict matrix for each existing directive/example, its present trigger, valid exception, and retained ID/mode.
- [ ] Replace speculative abstractions and universal file splitting with current-need decisions; keep authorization, tenant, data, and trust boundaries explicit.
- [ ] Prove JavaScript selection is unchanged and TypeScript good/bad cases bind the reconciled guidance.

## Verification & Testing

Each unit uses a focused architecture/contract test and explicit manual boundary review. After each rule edit, synchronize inventory/lock, run lint and doctor, and obtain a fresh PASS receipt with named semantic evidence. Phase completion requires both unit commits and scope review.

## Risks & Rollback

Generic wording might weaken other stacks or blur backend policy ownership. Keep global directives unchanged unless a TypeScript-only clarification is provable; an architecture-boundary change requires a separate ADR decision. Revert each unit's rule, knowledge, test, and catalog edits together. Execute serially on the task branch.
