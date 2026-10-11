---
title: "Phase 01 — Canonical Adapter Contract and Factory Discovery"
type: phase
parent: "feat-PLN-0009-codex-and-claude-workflow-discovery"
phase: "01"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: planned
created: "2026-10-11"
tags: [task, phase]
---

# Phase 01 — Canonical Adapter Contract and Factory Discovery

## Objective

Build one deterministic thin entry per canonical workflow and make factory discovery auditable.

## Dependencies & Prerequisites

Released brief, ADR 0038, and current 12-entry manifest. Execute serially on `feat/PLN-0009-codex-and-claude-workflow-discovery` from base `fa8f5db00cb0d113589190ed15d6752ab3612831`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 01.01 | Canonical workflow adapter inventory | `unit-01-discovery-and-scenarios.md` | `feat/PLN-0009-codex-and-claude-workflow-discovery` | none | verified |

## Impacted Files & Components

skills/workflow-entries/ (new), .agents/skills/workflow-* (new), .claude/skills/workflow-* (new), manifest, inventory validator, focused contract tests.

## Implementation Tasks

- [x] 01.01: Enumerate canonical workflows; create thin entries and links; add inventory/target checks and failing tests first.

## Verification & Testing

Contract and architecture tests for one-to-one mapping, unique names, valid targets, and no copied gates. Record exact commands and outcomes in the unit checkpoint. A factory PASS does not prove native host behavior.

## Risks & Rollback

Remove only new owned entries and revert manifest/validator changes; keep canonical workflows. Stop on a wrong branch, unrelated dirty state, or FAIL/BLOCKED conformance.
