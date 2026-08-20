---
title: "Phase 3 — Incremental Implementation, 4-Layer Testing, and Inner Loop Engineering"
type: phase
parent: "0004-task-new-project-progressive-contract-driven-workflow"
phase: "03"
status: completed
created: "2026-08-20"
tags: [task, phase, progressive-delivery, backend-tests, vertical-slices, loop-engineering, inner-loop]
---

# Phase 3 — Incremental Implementation, 4-Layer Testing, and Inner Loop Engineering

## Objective

Implement vertical backend module slices progressively (one module at a time) and establish the **Inner Loop Engineering Engine** — an automated test-driven self-correction cycle executing across all 4 backend tiers (`data`, `service`, `controller`, `routes`) and compiler typechecks (`tsc --noEmit`) until green.

## Dependencies & Prerequisites

- Phase 2 database schema locked, Prisma models defined, and migrations applied.
- Implementation plan approved by user.

## Impacted Files & Components

- `src/modules/<feature>/dto/` — Boundary validation schemas (`<feature>.dto.ts`).
- `src/modules/<feature>/data/` & `*.data.test.ts` — Data access layer and isolated DB query tests.
- `src/modules/<feature>/services/` & `*.service.test.ts` — Business policies, auth checks, and service unit tests.
- `src/modules/<feature>/controllers/` & `*.controller.test.ts` — HTTP status and validation tests.
- `src/modules/<feature>/<feature>.routes.ts` & `*.routes.test.ts` — HTTP integration and route middleware tests.

## Implementation Tasks

- [x] Task 3.1 — Build vertical module structure under `src/modules/<feature>/` following strict unidirectional dependency flow: `routes → controllers → services → data`.
- [x] Task 3.2 — **Data Tier & Test Loop:** Implement and test Data Layer (`*.data.ts`, `*.data.test.ts`) covering constraints, pagination, transactions, and rollbacks.
- [x] Task 3.3 — **Service Tier & Test Loop:** Implement and test Service Layer (`*.service.ts`, `*.service.test.ts`) covering domain policies, auth checks, and error branches using mock/fake dependencies.
- [x] Task 3.4 — **Controller Tier & Test Loop:** Implement and test Controller Layer (`*.controller.ts`, `*.controller.test.ts`) covering Zod validation and HTTP response mapping.
- [x] Task 3.5 — **Route Tier & Test Loop:** Implement and test Route Layer (`*.routes.ts`, `*.routes.test.ts`) covering middleware execution and auth guards.
- [x] Task 3.6 — **Inner Loop Self-Correction Engine:** Automate the feedback loop: run 4-layer tests + `tsc --noEmit`; on failure, ingest error diagnostics, apply surgical corrections, and re-run until 100% passing.
- [x] Task 3.7 — **Progressive Module Locking:** Complete, test, and sign off Module $N$ before releasing and advancing to Module $N+1$.

## Verification & Testing

- Verified vertical architecture specifications in `docs/context/new-project-workflow/index.md` and `rules/backend/module-architecture.md`.
- Verified 4-tier test specifications (`data.test.ts`, `service.test.ts`, `controller.test.ts`, `routes.test.ts`) in `docs/context/new-project-workflow/index.md`.
- Confirmed Inner Loop automated self-correction flow in ADR 0011 and `index.md`.

## Risks & Rollback

- **Risk:** Layer leaking (e.g., service importing controllers, or controllers querying DB directly) causing cyclic dependencies.
- **Rollback:** Re-enforce vertical boundaries according to `rules/backend/module-architecture.md` before re-entering the test loop.
