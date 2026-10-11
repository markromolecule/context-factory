---
title: "Phase 02 — Host Bridge and Diagnostics"
type: phase
parent: "feat-PLN-0009-codex-and-claude-workflow-discovery"
phase: "02"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: planned
created: "2026-10-11"
tags: [task, phase]
---

# Phase 02 — Host Bridge and Diagnostics

## Objective

Install and audit workflow entries in linked and submodule hosts without touching unowned files.

## Dependencies & Prerequisites

Unit 01.01 passes and commits; host bridge source and fixture conventions inspected. Execute serially on `feat/PLN-0009-codex-and-claude-workflow-discovery` from base `fa8f5db00cb0d113589190ed15d6752ab3612831`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 02.01 | Ownership-aware host bridge and repair | `unit-01-architecture-and-contracts.md` | `feat/PLN-0009-codex-and-claude-workflow-discovery` | 01.01 | planned |

## Impacted Files & Components

bridge generator/repair/audit, focused bridge tests (and bridge CLI wrapper only if a failing test proves necessary).

## Implementation Tasks

- [ ] 02.01: Extend Codex and Claude link generation; enforce ownership and collision checks; report repair routes; correct editor detection.

## Verification & Testing

Integration and contract tests for host modes, collision, concurrency, idempotence, broken targets, and editor classification. Record exact commands and outcomes in the unit checkpoint. A factory PASS does not prove native host behavior.

## Risks & Rollback

Revert bridge changes and remove only known-generated host fixture entries; never delete unowned files. Stop on a wrong branch, unrelated dirty state, or FAIL/BLOCKED conformance.
