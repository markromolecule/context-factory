---
title: "Phase 03 — Honest TypeScript conformance"
type: phase
parent: "feat-PLN-0007-typescript-backend-rule-expansion"
phase: "03"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: completed
created: "2026-10-10"
tags: [task, phase]
---

# Phase 03 — Honest TypeScript Conformance

## Objective

Prevent unhandled blocking directives from producing a false PASS. Keep structural backend directives evidence-blocking until ID-specific verifiers are delivered in a later task.

## Dependencies & Prerequisites

- Units 01.01, 02.01, and 02.02 have reviewed rule IDs and synchronized catalog state. Read their actual committed directive modes before implementing dispatch.
- Execute on the single recorded task branch after verifying its identity and prior unit receipts.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 03.01 | Structural verifier and fail-closed fallback | `unit-01-implementation-and-tests.md` | `feat/PLN-0007-typescript-backend-rule-expansion` | 02.02 | verified |

## Impacted Files & Components

- `orchestrator/conformance/adapters/typescript.mjs` and, only if report handling requires it, `orchestrator/conformance/evidence-gate.mjs`.
- `evals/tests/conformance/typescript-adapter.test.mjs`, `evals/tests/conformance/conformance-gate.test.mjs`, and new backend fixtures under `evals/fixtures/typescript/backend/`.
- Backend rule modes/IDs, manifest, and lock only when verifier coverage changes their claims.

## Implementation Tasks

- [x] Demonstrate the current unhandled-automated false PASS with an adapter-plus-report test.
- [x] Record the user-approved deferral of ID-specific structural path, public-import, and naming verifiers; leave their directives evidence-blocking with named human review.
- [x] Make unresolved paths, missing tools, and semantic directives block or require named evidence; never represent advisory reporting as enforced.

## Verification & Testing

`node --test evals/tests/conformance/typescript-adapter.test.mjs evals/tests/conformance/conformance-gate.test.mjs` covers verifier results and aggregate verdict. Run lint, evaluations, doctor, and a fresh unit-scope conformance receipt before checkpoint. `FAIL`, `BLOCKED`, `TOOL_UNAVAILABLE`, and `NOT_AUTOMATABLE` without required evidence do not count as PASS.

## Risks & Rollback

Fail-closed handling may reveal pre-existing unverified rules and block host runs. Keep the honest verdict, narrow or reclassify rules through review, and record the impact; do not restore heuristic PASS to clear a checkpoint. Revert adapter, tests, and matching rule-mode/catalog changes together if the implementation is unsound.
