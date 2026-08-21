---
title: "Phase 2: Scaffold High-Leverage Developer Skills"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0001-task-skill-taxonomy-and-ergonomics-optimization/README.md"
phase: "02"
status: planned
created: "2026-08-21"
tags: [task, phase, skills, development, scaffolding]
---

# Phase 2: Scaffold High-Leverage Developer Skills

## Objective

Create 4 essential, practical developer skills that dramatically accelerate daily coding and system design when `context-factory` is bridged into downstream frontend/backend repositories.

## Dependencies & Prerequisites

- Phase 1 skill renaming completed.

## Impacted Files & Components

- `skills/api-contract/SKILL.md` (NEW)
- `skills/database-query/SKILL.md` (NEW)
- `skills/component-craft/SKILL.md` (NEW)
- `skills/test-suite/SKILL.md` (NEW)

## Implementation Tasks

- [x] Create `skills/api-contract/SKILL.md`:
  - Frontmatter: `name: api-contract`, description covering REST/RPC API schema design, route definitions, OpenAPI/Scalar specification sync, and typed client SDK contracts.
  - Procedural workflow: Define input/output DTOs with Zod, bind to Hono/Express routes, generate OpenAPI/Scalar docs, export client contract types.
- [x] Create `skills/database-query/SKILL.md`:
  - Frontmatter: `name: database-query`, description covering high-performance query design, Kysely/Prisma construction, index optimization, and cursor-based pagination.
  - Procedural workflow: Query analysis (`EXPLAIN`), index coverage check, N+1 query elimination, deterministic keyset/cursor pagination implementation.
- [x] Create `skills/component-craft/SKILL.md`:
  - Frontmatter: `name: component-craft`, description covering modern React/Next.js UI component design with accessible ARIA, keyboard navigation, zero layout shift, and state resilience.
  - Procedural workflow: Layout skeleton design, interactive state modeling, focus management, responsive token alignment, micro-interaction transitions.
- [x] Create `skills/test-suite/SKILL.md`:
  - Frontmatter: `name: test-suite`, description covering automated 4-layer backend testing (`data`, `service`, `controller`, `routes`) and frontend React hook contract smoke tests.
  - Procedural workflow: Test fixture isolation, mock boundary establishment, happy path + boundary + error assertion matrix, type-check integration.

## Verification & Testing

- Validate that all 4 new `SKILL.md` files have proper frontmatter, structured procedures, and actionable outputs.
- Verify Markdown syntax and code blocks.

## Risks & Rollback

- Keep instructions focused on standard Node/TypeScript/React ecosystems without imposing heavy framework locks.
