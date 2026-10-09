---
title: "Phase 3 — Incremental Implementation and Tests"
type: phase
parent: "feat-PLN-0005-ts-conformance-receipts-fixtures"
phase: "03"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 3 — Incremental Implementation and Tests

## Objective

Create the standardized paired positive ("good") and negative ("bad") TypeScript fixture catalog in `evals/fixtures/typescript/`, author `evals/tests/conformance/typescript-fixtures.test.mjs` verifying 100% defect detection with zero false passes, and update adapter unit tests to validate host mode tool unavailability and receipt emissions.

## Dependencies & Prerequisites

- Phase 02 completed (adapter supports host receipts and fixture mode).
- Task branch `feat/PLN-0005-ts-conformance-receipts-fixtures`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Paired Good/Bad Test Fixtures & Conformance Suite Integration | `unit-01-implementation-and-tests.md` | `feat/PLN-0005-ts-conformance-receipts-fixtures` | `02.01` | `planned` |

## Impacted Files & Components

- `evals/fixtures/typescript/good/` (conforming snippets)
- `evals/fixtures/typescript/bad/` (deliberately violating snippets)
- `evals/tests/conformance/typescript-fixtures.test.mjs` (fixture test runner)
- `evals/tests/conformance/typescript-adapter.test.mjs` (updated unit tests)

## Implementation Tasks

- [ ] Create paired fixtures for 4 violation classes:
  1. Ban-any: `any-usage.bad.ts` vs `any-clean.good.ts`
  2. Strict compiler: `type-mismatch.bad.ts` vs `type-sound.good.ts`
  3. Floating promises: `floating-fetch.bad.ts` vs `handled-fetch.good.ts`
  4. Boundary validation: `raw-cast.bad.ts` vs `schema-parsed.good.ts`
- [ ] Create `evals/tests/conformance/typescript-fixtures.test.mjs` running the test matrix in fixture mode.
- [ ] Update `evals/tests/conformance/typescript-adapter.test.mjs` asserting that host mode with missing tools returns `TOOL_UNAVAILABLE`.

## Verification & Testing

- `node --test evals/tests/conformance/typescript-fixtures.test.mjs`
- `node --test evals/tests/conformance/typescript-adapter.test.mjs`
- `node --test evals/tests/conformance/*.test.mjs`

## Risks & Rollback

- Revert fixture files and test suite via `git checkout`.
