---
title: "Phase 01 — Operation-first architecture contract"
type: phase
parent: "feat-PLN-0007-typescript-backend-rule-expansion"
phase: "01"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: completed
created: "2026-10-10"
tags: [task, phase, architecture]
---

# Phase 01 — Operation-first Architecture Contract

## Objective

Record the superseding architecture decision and make backend module, controller, and service guidance agree on operation folders and the bounded simple-read path.

## Dependencies & Prerequisites

- Released discovery brief and confirmed user decisions are current; active branch equals `feat/PLN-0007-typescript-backend-rule-expansion` at base `a1ffd01afeaff61e1ec2f649e60d23a51ed313a9`.
- No application implementation or host migration starts in this phase.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 01.01 | Superseding ADR and module boundaries | `unit-01-discovery-and-scenarios.md` | `feat/PLN-0007-typescript-backend-rule-expansion` | none | verified |

## Impacted Files & Components

- New `docs/decisions/0037-operation-first-backend-modules.md` (confirm number is still free), `docs/decisions/README.md`.
- `rules/typescript/backend/module-architecture.md`, `controllers-and-routes.md`, `service-layer.md`.
- New `evals/tests/rules/backend-module-architecture.test.mjs`; `context-manifest.json`, `context-lock.json` for new inventory/content.

## Implementation Tasks

- [x] Execute Unit 01.01 test-first; preserve ADR 0001 as history and state its successor.
- [x] Prove a create operation, simple read, and policy-bearing read have non-contradictory boundaries.

## Verification & Testing

- Architecture/contract test: `node --test evals/tests/rules/backend-module-architecture.test.mjs` catches old folder and direct sensitive-read guidance.
- Catalog: `npm run sync`, `npm run lint`, `node scripts/context.mjs doctor` after rule/ADR inventory changes.
- Phase checkpoint: `/review` scope audit and fresh conformance with named human evidence for semantic rules. No phase completion from doctor alone.

## Risks & Rollback

- New ADR and rule text must move together; otherwise two defaults compete. Revert the phase as one commit if the boundary test or host compatibility fails, leaving ADR 0001 authoritative.
- Execute serially on the recorded task branch; stop on wrong branch or missing evidence.
