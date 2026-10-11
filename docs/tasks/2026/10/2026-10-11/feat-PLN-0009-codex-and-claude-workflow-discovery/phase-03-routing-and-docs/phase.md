---
title: "Phase 03 — Implicit Routing and Documentation"
type: phase
parent: "feat-PLN-0009-codex-and-claude-workflow-discovery"
phase: "03"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: verified
created: "2026-10-11"
tags: [task, phase]
---

# Phase 03 — Implicit Routing and Documentation

## Objective

Keep action-sensitive natural-language routing and document native entry syntax accurately.

## Dependencies & Prerequisites

Unit 01.01 supplies entry names; independent of Unit 02.01 implementation. Execute serially on `feat/PLN-0009-codex-and-claude-workflow-discovery` from base `fa8f5db00cb0d113589190ed15d6752ab3612831`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 03.01 | Resolver boundaries and host guidance | `unit-01-implementation-and-tests.md` | `feat/PLN-0009-codex-and-claude-workflow-discovery` | 01.01 | verified |

## Impacted Files & Components

resolver, resolver eval dataset/tests, indexer docs generator, README and generated docs.

## Implementation Tasks

- [x] 03.01: Test positive, direct-question, and ambiguous routing; change only proven resolver gaps; correct generated and hand-written guidance.

## Verification & Testing

Resolver contract/evaluation tests; generated-doc consistency and doctor. Record exact commands and outcomes in the unit checkpoint. A factory PASS does not prove native host behavior.

## Risks & Rollback

Revert routing/docs together; preserve existing explicit aliases as internal compatibility inputs. Stop on a wrong branch, unrelated dirty state, or FAIL/BLOCKED conformance.
