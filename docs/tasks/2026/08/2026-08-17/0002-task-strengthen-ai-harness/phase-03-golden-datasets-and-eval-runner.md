---
title: "Phase 3: Golden Datasets and Eval Runner"
type: phase
parent: "docs/tasks/2026/08/2026-08-17/0002-task-strengthen-ai-harness/README.md"
phase: "3"
status: completed
created: "2026-08-17"
tags: [task, phase, evals, datasets, golden]
---

# Phase 3: Golden Datasets and Eval Runner

## Objective

Create structured golden datasets under `evals/datasets/` across primary engineering workflows and implement the unified test harness in `evals/run-evals.mjs` for automated offline regression testing.

## Dependencies & Prerequisites

- Phase 1 & 2 completed (`orchestrator/validator.mjs` and `orchestrator/runner.mjs` ready).
- Existing context resolution cases in `evals/cases/`.

## Impacted Files & Components

- `evals/datasets/features/feature-delivery.json` (NEW): Golden dataset for feature delivery workflow.
- `evals/datasets/defects/defect-resolution.json` (NEW): Golden dataset for bug fix & regression workflow.
- `evals/datasets/refactors/architecture-change.json` (NEW): Golden dataset for architecture refactoring.
- `evals/run-evals.mjs` (NEW): Unified test runner supporting unit cases, golden datasets, and live model runs.

## Implementation Tasks

- [x] Task 3.1: Define golden dataset structure conforming to `evaluation-report.schema.json`.
- [x] Task 3.2: Create golden workflow datasets under `evals/datasets/` covering features, defects, and architecture changes.
- [x] Task 3.3: Implement `evals/run-evals.mjs` with `--unit`, `--datasets`, and `--live` flags, execution duration tracking, and diff generation.
- [x] Task 3.4: Validate that `evals/run-evals.mjs` executes all suites deterministically and exits with code 0 on pass, 1 on fail.

## Verification & Testing

- Executed `node evals/run-evals.mjs` validating 11/11 test cases across unit cases and golden workflow datasets in 37ms. Verified strict exit code 0 on pass.

## Risks & Rollback

- **Risk:** Stale golden datasets when workflows evolve.
- **Mitigation:** Include dataset verification in `context-maintenance` workflow and doctor checks.
- **Rollback:** Remove `evals/datasets/` and `evals/run-evals.mjs`.
