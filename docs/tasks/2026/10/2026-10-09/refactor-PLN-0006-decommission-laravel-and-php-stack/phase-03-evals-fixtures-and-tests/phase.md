---
title: "Phase 3 — Evals, Fixtures, and Test Suite Modernization"
type: phase
parent: "refactor-PLN-0006-decommission-laravel-and-php-stack"
phase: "03"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 3 — Evals, Fixtures, and Test Suite Modernization

## Objective

Delete legacy Laravel conformance fixtures and test suites, replace `evals/cases/laravel-resolution.json` with a dedicated TypeScript backend evaluation case, and add automated regression testing for the decommissioned `--stack laravel` CLI error contract.

## Dependencies & Prerequisites

- Phase 2 completed (Unit 02.01 done).
- Task branch `refactor/PLN-0006-decommission-laravel-and-php-stack` active.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Modernize Evals Suite and Add Decommissioned Stack Regression Test | `unit-01-evals-and-test-suite-modernization.md` | `refactor/PLN-0006-decommission-laravel-and-php-stack` | `02.01` | `planned` |

## Impacted Files & Components

- `evals/fixtures/laravel-conformance/`: Deleted (all mock files).
- `evals/tests/conformance/laravel-adapter.test.mjs`: Deleted.
- `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs`: Deleted.
- `evals/tests/rules/unit-06-03-laravel-data-security.test.mjs`: Deleted.
- `evals/cases/laravel-resolution.json`: Replaced with `evals/cases/typescript-backend-resolution.json`.
- `evals/tests/conformance/decommissioned-stack.test.mjs`: New regression test asserting `--stack laravel` returns exit code 2 with the ADR 0036 message.

## Implementation Tasks

- [ ] Unit 03.01 — Remove Laravel evals/fixtures, replace evaluation case, and add regression tests.

## Verification & Testing

- `node --test evals/tests/conformance/decommissioned-stack.test.mjs`
- `npm test`

## Risks & Rollback

- Revert unit changes via git on the task branch.
