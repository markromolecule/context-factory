---
title: "Phase 3 — Validation, Doctor & Tooling Alignment"
type: phase
parent: "refactor-PLN-0011-clean-ephemeral-dirs-and-conformance"
phase: "03"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, phase, tooling, validation, doctor]
---

# Phase 3 — Validation, Doctor & Tooling Alignment

## Objective

Update repository tooling, validators, doctor diagnostics, preflight command, and bridge evaluations to operate cleanly without requiring `.agents`, `.claude`, or conformance adapters in Context Factory.

## Dependencies & Prerequisites

- Phase 2 completed (conformance subsystem deleted).

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Align Validator, Doctor, Preflight, and Bridge Evaluations | `unit-01-tooling-alignment.md` | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | `02.01` | `planned` |

## Impacted Files & Components

- `scripts/validate-context.mjs` (remove lines 586-652 validating `.agents` and `.agents/skills/`)
- `app/cli/commands/doctor.mjs` (remove adapter registration, adapter list queries, and Conformance Enforcement check row)
- `app/cli/commands/preflight.mjs` (scrub lingering references to conform)
- `evals/tests/bridge/workflow-entry-contract.test.mjs` (assert canonical skills/workflows directly)
- `evals/tests/bridge/bridge-conformance.test.mjs` (remove conform CLI command assertions)

## Implementation Tasks

- [ ] Unit 03.01 — Update `validate-context.mjs`, `doctor.mjs`, `preflight.mjs`, and bridge tests.

## Verification & Testing

- `node scripts/validate-context.mjs` passes without reporting missing `.agents`.
- `node --test evals/tests/bridge/workflow-entry-contract.test.mjs` passes.
- `node --test evals/tests/bridge/bridge-conformance.test.mjs` passes.

## Risks & Rollback

- Tests asserting symlink creation failing. Mitigation: ensure tests distinguish factory-native structure from host-repository bridge operations.
