---
title: "Phase 04 — Integrated Verification and Host Smoke"
type: phase
parent: "feat-PLN-0009-codex-and-claude-workflow-discovery"
phase: "04"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: verified
created: "2026-10-11"
tags: [task, phase]
---

# Phase 04 — Integrated Verification and Host Smoke

## Objective

Reconcile inventory and prove factory checks and both native hosts separately.

## Dependencies & Prerequisites

Units 02.01 and 03.01 pass and commit on the exact task branch. Execute serially on `feat/PLN-0009-codex-and-claude-workflow-discovery` from base `fa8f5db00cb0d113589190ed15d6752ab3612831`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 04.01 | Whole-diff and live-host evidence | `unit-01-verification-and-release.md` | `feat/PLN-0009-codex-and-claude-workflow-discovery` | 02.01, 03.01 | verified |

## Impacted Files & Components

manifest/maps/lock and integration test artifacts only if findings require; no unreviewed production expansion.

## Implementation Tasks

- [x] 04.01: Sync catalog and lock; run whole-diff checks and live Codex/Claude invocation with canonical gate evidence.

## Verification & Testing

Focused suite, full evals, doctor, receipt verification, live host smoke; stop on missing evidence. Record exact commands and outcomes in the unit checkpoint. A factory PASS does not prove native host behavior.

## Risks & Rollback

Revert task branch integration or owned entries only; no push/merge without separate authorization. Stop on a wrong branch, unrelated dirty state, or FAIL/BLOCKED conformance.
