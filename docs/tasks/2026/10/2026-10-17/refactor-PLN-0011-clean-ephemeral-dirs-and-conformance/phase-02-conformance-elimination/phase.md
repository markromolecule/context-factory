---
title: "Phase 2 — Conformance and Adapter Subsystem Elimination"
type: phase
parent: "refactor-PLN-0011-clean-ephemeral-dirs-and-conformance"
phase: "02"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, phase, refactor, conformance]
---

# Phase 2 — Conformance and Adapter Subsystem Elimination

## Objective

Completely eliminate the runtime language conformance and stack adapter system from Context Factory. This includes deleting `orchestrator/conformance/`, removing `app/cli/commands/conform.mjs`, deleting conformance schemas, purging all 16 conformance test/dataset files, and updating `evals/run-evals.mjs` and `context-cli.mjs`.

## Dependencies & Prerequisites

- Phase 1 completed (`.agents`, `.claude`, `.worktrees` removed).

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Purge Conformance Subsystem, Adapters, CLI Command, and Test Suites | `unit-01-conformance-elimination.md` | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | `01.01` | `planned` |

## Impacted Files & Components

- `orchestrator/conformance/` (8 files: delete entire directory)
- `app/cli/commands/conform.mjs` (delete)
- `app/cli/bin/context-cli.mjs` (remove conform command import, routing, and command cards)
- `schemas/conformance-report.schema.json` (delete)
- `schemas/conformance-result.schema.json` (delete)
- `evals/tests/conformance/` (8 test files: delete)
- `evals/datasets/conformance/` (8 dataset files: delete)
- `evals/run-evals.mjs` (remove conformance runner integration)

## Implementation Tasks

- [ ] Unit 02.01 — Delete `orchestrator/conformance/`, CLI command, schemas, tests, and update evaluation runner.

## Verification & Testing

- `npm test` runs the evaluation suite and passes all remaining 27 evaluations (21 units + 6 datasets).
- `git status` verifies all conformance files cleanly removed.

## Risks & Rollback

- Stray imports of conformance modules in other CLI files. Mitigation: search and scrub all imports across `app/cli/` and `evals/`.
