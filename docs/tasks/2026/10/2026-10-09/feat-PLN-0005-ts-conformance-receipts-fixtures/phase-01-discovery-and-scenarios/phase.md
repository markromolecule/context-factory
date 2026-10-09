---
title: "Phase 1 — Discovery, Scenarios, and Boundary Analysis"
type: phase
parent: "feat-PLN-0005-ts-conformance-receipts-fixtures"
phase: "01"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 1 — Discovery, Scenarios, and Boundary Analysis

## Objective

Establish architectural boundaries, contract specifications, and the fixture catalog matrix for host TypeScript conformance verification. Author ADR 0035 codifying strict host `TOOL_UNAVAILABLE` gating versus dedicated offline fixture modes, and specify the paired positive/negative test fixture taxonomy.

## Dependencies & Prerequisites

- Released discovery brief in `docs/discovery/typescript-web-rule-quality/brief.md` (verified via `verifyDiscoveryBrief`).
- Clean task branch `feat/PLN-0005-ts-conformance-receipts-fixtures` based on `master` at `1ed301a`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | ADR 0035 & Conformance Receipt / Fixture Contract Specifications | `unit-01-discovery-and-scenarios.md` | `feat/PLN-0005-ts-conformance-receipts-fixtures` | `none` | `planned` |

## Impacted Files & Components

- `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md` (new architecture decision record)
- `docs/decisions/README.md` (index update)
- `docs/tasks/2026/10/2026-10-09/feat-PLN-0005-ts-conformance-receipts-fixtures/`

## Implementation Tasks

- [ ] Author ADR 0035 defining host mode tool execution receipts, effective config verification, and offline fixture runner mode.
- [ ] Document the paired positive/negative fixture catalog matrix across shared TypeScript and 3 web frameworks (React, Next.js, SolidJS).

## Verification & Testing

- `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-09/feat-PLN-0005-ts-conformance-receipts-fixtures`
- `node scripts/context.mjs doctor`

## Risks & Rollback

- Revert ADR 0035 additions via git checkout on the task branch.
