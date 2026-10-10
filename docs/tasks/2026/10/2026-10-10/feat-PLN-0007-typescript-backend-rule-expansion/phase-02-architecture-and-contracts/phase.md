---
title: "Phase 02 — DTO and backend-testing rule owners"
type: phase
parent: "feat-PLN-0007-typescript-backend-rule-expansion"
phase: "02"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, phase, typescript]
---

# Phase 02 — DTO and Backend-testing Rule Owners

## Objective

Add two small backend rule owners for transport mapping and module testing while keeping existing runtime-validation and data-adapter test rules authoritative for their current concerns.

## Dependencies & Prerequisites

- Unit 01.01 is reviewed and its operation-first/public-contract semantics are stable.
- Both units use the single task branch and execute serially because they share catalog map, inventory, and lock files. Unit 02.02 waits for the DTO contract and inventory produced by 02.01.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 02.01 | DTO and response serialization owner | `unit-01-architecture-and-contracts.md` | `feat/PLN-0007-typescript-backend-rule-expansion` | 01.01 | planned |
| 02.02 | Backend module testing owner | `unit-02-backend-testing.md` | `feat/PLN-0007-typescript-backend-rule-expansion` | 02.01 | planned |

## Impacted Files & Components

- New `rules/typescript/backend/dto-and-serialization.md` and `rules/typescript/backend/testing.md`.
- Existing `rules/typescript/backend/module-architecture.md`, `rules/typescript/common/runtime-validation.md` (read for ownership), and `rules/typescript/database/testing-data-access-layer.md` (narrow applicability correction).
- New focused rule tests under `evals/tests/rules/`; `docs/Rules.md`, `context-manifest.json`, `context-lock.json`.

## Implementation Tasks

- [ ] Unit 02.01 writes the request/domain/persistence/output seam and failure cases, test first.
- [ ] Unit 02.02 defines test-layer responsibilities and suffix compatibility, test first.
- [ ] After each catalog-changing unit, synchronize inventory/lock and report focused tests plus doctor; phase completion requires both units' review/conformance receipts.

## Verification & Testing

- `node --test evals/tests/rules/backend-dto-serialization.test.mjs evals/tests/rules/backend-testing.test.mjs` verifies distinct owners and scope.
- `node --test evals/tests/rules/rule-binding.test.mjs` checks selection regression; `node scripts/context.mjs doctor` checks synchronized catalog.
- Human evidence is still needed for semantics that cannot be inferred from Markdown or filenames.

## Risks & Rollback

- Duplicating input parsing or adapter-test policy would expand model context and confuse precedence; revert the responsible new rule and catalog entries together if ownership tests fail.
- `.spec.ts` support must be scoped to adopted hosts; it must not silently remove `.test.ts` behavior.
