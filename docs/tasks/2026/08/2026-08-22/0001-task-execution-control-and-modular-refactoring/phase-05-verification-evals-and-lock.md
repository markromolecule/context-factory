---
title: "Phase 5 — Verification, Evaluations, and Lock Generation"
type: phase
parent: "0001-task-execution-control-and-modular-refactoring"
phase: "05"
status: completed
created: "2026-08-22"
tags: [task, phase, verification, evals, lock]
---

# Phase 5 — Verification, Evaluations, and Lock Generation

## Objective

Validate all changes across the Context Factory test suite and evaluations, regenerate the canonical lockfile `context-lock.json`, and run the context doctor to ensure 100% synchronization.

## Dependencies & Prerequisites

- Phases 1 through 4 completed.

## Impacted Files & Components

- `evals/cases/slash-commands.json` (updated if needed for `/execute` and `/refactor`).
- `context-lock.json` (regenerated).

## Implementation Tasks

- [x] Task 5.1 — Update evaluation cases in `evals/cases/` to assert resolution of `/execute`, `/optimize`, and `/refactor`.
- [x] Task 5.2 — Run evaluation suite via `node evals/run-evals.mjs` and ensure all unit and dataset cases pass.
- [x] Task 5.3 — Regenerate lockfile via `node scripts/context.mjs lock`.
- [x] Task 5.4 — Run `node scripts/context.mjs doctor` and verify that all inventory checks, schema validations, and lock digests match.

## Verification & Testing

- Command: `node scripts/context.mjs doctor` must output `Context Factory is healthy.` with 0 errors.

## Risks & Rollback

- If any evaluation fails, inspect diffs in `scripts/context-core.mjs` and correct routing weights.
