---
title: "Phase 1 — Current State Mapping and Contract Pinning"
type: phase
parent: "refactor-PLN-0012-rebuild-orchestrator-engine"
phase: "01"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: planned
created: "2026-10-18"
tags: [task, phase, orchestrator, boundary-analysis]
---

# Phase 1 — Current State Mapping and Contract Pinning

## Objective

Establish immutable baseline verification, map all caller boundaries (`scripts/context-core.mjs`, `scripts/session-core.mjs`, `app/cli/commands/`, `evals/`), and pin the exact test assertions and contracts for `validator.mjs`, `rules/`, and `runner.mjs` before writing implementation code.

## Dependencies & Prerequisites

- Task branch `refactor/PLN-0012-rebuild-orchestrator-engine` checked out at base commit `6c438fe680f30ff876188e056618ee058f57abc9`.
- Baseline test suite passing (`npm test` -> 27/27 PASS).

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Current State Mapping and Contract Pinning | `unit-01-boundary-analysis.md` | `refactor/PLN-0012-rebuild-orchestrator-engine` | `none` | `planned` |

## Impacted Files & Components

- `evals/tests/rules/rule-contract-schema.test.mjs` (verified schema test coverage)
- `evals/tests/rules/rule-descriptor-parser.test.mjs` (verified parser test coverage)
- `evals/tests/rules/rule-binding.test.mjs` (verified binding compiler test coverage)
- `evals/tests/rules/prompt-compiler.test.mjs` (verified prompt compiler test coverage)
- `evals/tests/rules/code-generation-evaluation.test.mjs` (verified runner test coverage)

## Implementation Tasks

- [ ] Unit 01.01 — Audit and pin all public function signatures, parameter contracts, and existing test suites across the orchestrator modules.

## Verification & Testing

- Run test suites:
  ```bash
  node --test evals/tests/rules/rule-contract-schema.test.mjs
  node --test evals/tests/rules/rule-descriptor-parser.test.mjs
  node --test evals/tests/rules/rule-binding.test.mjs
  node --test evals/tests/rules/prompt-compiler.test.mjs
  npm test
  ```

## Risks & Rollback

- Reversible read-only analysis and test execution. If baseline fails, resolve test expectations before altering implementation code.
