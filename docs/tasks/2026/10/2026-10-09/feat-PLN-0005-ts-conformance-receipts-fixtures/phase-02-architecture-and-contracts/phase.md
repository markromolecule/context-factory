---
title: "Phase 2 — Architecture, Contracts, and Data Modeling"
type: phase
parent: "feat-PLN-0005-ts-conformance-receipts-fixtures"
phase: "02"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 2 — Architecture, Contracts, and Data Modeling

## Objective

Implement strict host mode and offline fixture mode separation in `orchestrator/conformance/adapters/typescript.mjs`. Generate tamper-evident tool execution receipts recording tool name, argv array, effective config digest (from `tsc --showConfig`), exit code, and stdout/stderr excerpt. Enforce that missing host tools return `TOOL_UNAVAILABLE` in host mode.

## Dependencies & Prerequisites

- Phase 01 completed (ADR 0035 recorded).
- Task branch `feat/PLN-0005-ts-conformance-receipts-fixtures`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Host Conformance Adapter Receipts & Offline Fixture Runner Mode | `unit-01-architecture-and-contracts.md` | `feat/PLN-0005-ts-conformance-receipts-fixtures` | `none` | `planned` |

## Impacted Files & Components

- `orchestrator/conformance/adapters/typescript.mjs`
- `orchestrator/conformance/evidence-gate.mjs`

## Implementation Tasks

- [ ] Add `effectiveConfigDigest` computation in `checkStrictCompiler` using SHA-256 of canonical compilerOptions.
- [ ] Implement host mode enforcement: if `!capabilities.fixtureMode` and tools are missing, return `TOOL_UNAVAILABLE` for automated-blocking directives.
- [ ] Preserve static AST analysis when `capabilities.fixtureMode === true` for offline test suites.
- [ ] Format execution receipts in evidence objects with structured parameters (`tool`, `command`, `exitCode`, `effectiveConfigDigest`, `outputFragment`).

## Verification & Testing

- `node --test evals/tests/conformance/typescript-adapter.test.mjs`
- `node scripts/context.mjs doctor`

## Risks & Rollback

- Revert changes to `typescript.mjs` via git checkout on task branch.
