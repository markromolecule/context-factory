---
title: "Phase 01 — Canonical pragmatic design knowledge"
type: phase
parent: "feat-PLN-0008-typescript-pragmatic-design-rules"
phase: "01"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, phase, knowledge]
---

# Phase 01 — Canonical Pragmatic Design Knowledge

## Objective

Define four retrievable TypeScript concepts with explicit present-need triggers, counterexamples, and valid exceptions before writing rules that cite them.

## Dependencies & Prerequisites

The released discovery brief is valid and the task branch equals `feat/PLN-0008-typescript-pragmatic-design-rules` at base `298768ee210189f2f2221f3cf8f041bce2ad26bf`. No prior unit is required. The context specification is not a planning input; the brief carries its decisions.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 01.01 | Canonical principle notes | `unit-01-discovery-and-scenarios.md` | `feat/PLN-0008-typescript-pragmatic-design-rules` | none | planned |

## Impacted Files & Components

Four new `knowledge/principles/` notes, `knowledge/README.md`, `docs/Wiki.md`, inventory, and lock. No host source, API, schema, deployment, or observability change.

## Implementation Tasks

- [ ] Write YAGNI and KISS as distinct concepts and add composition and combined Demeter/tell-don't-ask notes with TypeScript examples.
- [ ] Link active canonical notes from both knowledge maps, validate metadata and retrieval, and synchronize inventory/lock.

## Verification & Testing

Unit 01.01 verifies the knowledge contract through schema lint, retrieval inspection, and doctor. Review examples for legitimate DTO/serialization exceptions and for no speculative interface or mandatory subclass. Phase completion requires a named semantic review and a fresh PASS unit conformance receipt.

## Risks & Rollback

An overbroad concept may be read as a new unconditional rule. Keep knowledge explanatory and scope metadata to TypeScript; revert the four notes and catalog links together if validation or review fails. Execute on the one task branch.
