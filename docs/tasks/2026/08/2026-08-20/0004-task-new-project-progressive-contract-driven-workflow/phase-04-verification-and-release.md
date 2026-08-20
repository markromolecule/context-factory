---
title: "Phase 4 — Scalar Docs, Client Hooks, Outer Progression Loop, and Release Gate"
type: phase
parent: "0004-task-new-project-progressive-contract-driven-workflow"
phase: "04"
status: completed
created: "2026-08-20"
tags: [task, phase, scalar-docs, client-hooks, verification, outer-loop, release]
---

# Phase 4 — Scalar Docs, Client Hooks, Outer Progression Loop, and Release Gate

## Objective

Expose verified endpoints in Scalar interactive API documentation, execute live client-side contract smoke tests using typed `useQuery`/`useMutation` hooks, run the **Outer Progression Loop** (global regression check across completed modules), and release the gate to unlock frontend UI construction.

## Dependencies & Prerequisites

- Phase 3 backend module inner loop passing with 100% test and typecheck green.
- TypeScript compilation passing with zero type errors.

## Impacted Files & Components

- Scalar API documentation endpoint & OpenAPI definitions.
- `src/hooks/` — `use<Feature>Query.ts` and `use<Feature>Mutation.ts`.
- `rules/hooks/query-hooks.md` & `rules/hooks/mutation-hooks.md`.
- `rules/ui/frontend.md` — UI standards and components.

## Implementation Tasks

- [x] Task 4.1 — **Scalar Contract Synchronization:** Expose verified endpoints and DTO schemas in Scalar OpenAPI documentation with browsable types, parameters, and status codes.
- [x] Task 4.2 — **Typed Query Hook Construction:** Implement typed query hooks (`use<Feature>Query`) following `rules/hooks/query-hooks.md`.
- [x] Task 4.3 — **Typed Mutation Hook Construction:** Implement typed mutation hooks (`use<Feature>Mutation`) with cache invalidation and rollback patterns following `rules/hooks/mutation-hooks.md`.
- [x] Task 4.4 — **Client Hook Smoke Test Loop:** Execute an automated contract smoke test calling the frontend hook against the live/mock API to validate payload serialization, response parsing, error state propagation, and React Query cache updates.
- [x] Task 4.5 — **Outer Loop Regression Gate:** Execute the full test suite across all completed modules ($1 \dots N$) to guarantee zero regressions before advancing to the next module.
- [x] Task 4.6 — **DoD Audit & UI Gate Release:** Once all planned backend modules pass the outer loop, audit the Definition of Done and unlock Phase 8 for frontend UI drafting.

## Verification & Testing

- Verified Scalar OpenAPI documentation specifications in `docs/context/new-project-workflow/index.md`.
- Verified frontend hook guidelines against `rules/hooks/query-hooks.md` and `rules/hooks/mutation-hooks.md`.
- Verified Outer Loop progression criteria in `docs/decisions/0011-progressive-contract-driven-loop-engineering.md`.

## Risks & Rollback

- **Risk:** Frontend hook types diverging from backend Scalar contract or regressions introduced in previously completed modules.
- **Rollback:** Regenerate client types directly from OpenAPI schema / backend DTOs, and block promotion until the regression is resolved.
