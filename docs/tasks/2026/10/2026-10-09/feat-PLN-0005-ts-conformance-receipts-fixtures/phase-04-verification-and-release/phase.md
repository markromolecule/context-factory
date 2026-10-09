---
title: "Phase 4 — Verification, Quality Gates, and Release"
type: phase
parent: "feat-PLN-0005-ts-conformance-receipts-fixtures"
phase: "04"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 4 — Verification, Quality Gates, and Release

## Objective

Synchronize inventory in `context-manifest.json`, generate fresh pinned digests in `context-lock.json`, execute end-to-end evaluations, ensure factory health is 100% PASS, and finalize the task execution ledger.

## Dependencies & Prerequisites

- Phase 03 completed (fixtures and tests passing).
- Task branch `feat/PLN-0005-ts-conformance-receipts-fixtures`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Manifest, Lockfile, Doctor Health, and Task Finalization | `unit-01-verification-and-release.md` | `feat/PLN-0005-ts-conformance-receipts-fixtures` | `03.01` | `planned` |

## Impacted Files & Components

- `context-manifest.json`
- `context-lock.json`
- `docs/tasks/2026/10/2026-10-09/feat-PLN-0005-ts-conformance-receipts-fixtures.md`

## Implementation Tasks

- [ ] Add new test file (`evals/tests/conformance/typescript-fixtures.test.mjs`) to `context-manifest.json` under `tools`.
- [ ] Add ADR 0035 to `context-manifest.json` under `decisions`.
- [ ] Regenerate `context-lock.json` via `node scripts/context.mjs lock`.
- [ ] Verify `npm run lint` and `node scripts/context.mjs doctor`.
- [ ] Complete Task PLN-0005 ledger.

## Verification & Testing

- `npm run lint`
- `node --test evals/tests/**/*.test.mjs`
- `node evals/run-evals.mjs`
- `node scripts/context.mjs doctor`

## Risks & Rollback

- Revert manifest and lock changes via `git checkout`.
