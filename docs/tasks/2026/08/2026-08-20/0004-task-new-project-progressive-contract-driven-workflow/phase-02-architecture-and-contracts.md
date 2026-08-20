---
title: "Phase 2 — Architecture, Contracts, and Data Modeling"
type: phase
parent: "0004-task-new-project-progressive-contract-driven-workflow"
phase: "02"
status: completed
created: "2026-08-20"
tags: [task, phase, architecture, schema, contracts]
---

# Phase 2 — Architecture, Contracts, and Data Modeling

## Objective

Design and lock the database schema, Prisma models, Kysely query definitions, and runtime boundary DTOs before writing business logic or service layers.

## Dependencies & Prerequisites

- Phase 1 discovery audit completed and confirmed.
- Glossary and ADRs established.

## Impacted Files & Components

- `docs/context/new-project-workflow/index.md` — Workflow Phase 2 & 3.
- `rules/backend/module-architecture.md` — Vertical module boundary rules.
- `rules/database/schema-db.md` & `rules/database/query-optimization-and-pagination.md` — Database standards.

## Implementation Tasks

- [x] Task 2.1 — Draft complete Entity Relationship Model (ERD) with primary keys, foreign keys, cascade rules, enums, and indexes.
- [x] Task 2.2 — Author canonical `schema.prisma` models ensuring all field types, constraints, and relations are strictly typed.
- [x] Task 2.3 — Define Kysely query layer types, typed joins, and database migration scripts.
- [x] Task 2.4 — Author transport DTO schemas (Zod) ensuring validation constraints match database constraints with zero drift.
- [x] Task 2.5 — Author phased implementation plan (`docs/templates/Task.md` + `docs/templates/Phase.md`) sequencing modules in strict vertical dependency order.

## Verification & Testing

- Verified data layer standards and Prisma/Kysely constraints in `docs/context/new-project-workflow/index.md`.
- Validated module dependency ordering (Auth → Tenant → Feature Modules) with zero cyclic dependencies.
- Verified task template conformance against `docs/templates/Task.md` and `docs/templates/Phase.md`.

## Risks & Rollback

- **Risk:** Unoptimized database indexes or schema drift between DTOs and database models.
- **Rollback:** Revise schema models and migration definitions before any module code is created.
