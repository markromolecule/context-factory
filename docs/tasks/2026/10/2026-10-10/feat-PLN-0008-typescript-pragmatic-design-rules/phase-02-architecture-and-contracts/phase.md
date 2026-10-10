---
title: "Phase 02 — Shared TypeScript design rule"
type: phase
parent: "feat-PLN-0008-typescript-pragmatic-design-rules"
phase: "02"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, phase, typescript]
---

# Phase 02 — Shared TypeScript Design Rule

## Objective

Give TypeScript and TSX one concise rule owner for the four concepts, with a combined reach-through/decision check and justified exceptions.

## Dependencies & Prerequisites

Unit 01.01 must be reviewed and committed with valid canonical notes. Use only the current task branch. Shared wording should cite those notes and keep framework-specific examples in their existing owners.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 02.01 | TypeScript pragmatic design rule | `unit-01-architecture-and-contracts.md` | `feat/PLN-0008-typescript-pragmatic-design-rules` | 01.01 | planned |

## Impacted Files & Components

One new `rules/typescript/common/` file, `docs/Rules.md`, a focused rule contract test, manifest, and lock. No application runtime or public API changes.

## Implementation Tasks

- [ ] Add failing single-implementation, real-variant, reach-through, and DTO-exception contract cases.
- [ ] Add concise TypeScript directives with honest modes and metadata; synchronize catalog artifacts.

## Verification & Testing

Unit 02.01 requires failing-then-passing contract/binding tests, lint, doctor, exact-scope preflight/conformance PASS, and review. A rule marker or payload inclusion alone does not prove generated code obeys a subjective directive.

## Risks & Rollback

An always-applied rule can increase provider payload or leak to JavaScript. Keep text compact, measure selection later in Unit 04.01, and revert rule/test/catalog changes together if the selection contract fails.
