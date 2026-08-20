---
title: "Phase 2 — Architecture, Contracts, and Rule Authoring"
type: phase
parent: "0002-task-data-layer-optimization-and-system-performance-arc"
phase: "02"
status: completed
created: "2026-08-20"
tags: [task, phase, rules, backend, frontend, typescript]
---

# Phase 2 — Architecture, Contracts, and Rule Authoring

## Objective

Draft and refine the definitive performance and architecture rules across backend, frontend, and TypeScript domains according to the approved hybrid architecture.

## Dependencies & Prerequisites

- Phase 1 completed and ADR 0010 registered.

## Impacted Files & Components

- `rules/backend/query-optimization-and-pagination.md` [NEW]: Backend query performance standards, Kysely query patterns, cursor/keyset pagination, bounded offset limits, ESR indexing rules, and facet count isolation.
- `rules/frontend/custom-hooks.md` [NEW]: Custom hook architecture, separation of concerns, referential stability, memoization standards, and prohibition of server-state syncing in local state.
- `rules/typescript/async-discipline.md` [MODIFY]: Waterfall elimination, bounded concurrency pooling (`p-limit`), AbortSignal DB propagation, zero external I/O inside DB transactions, and contained background tasks.
- `rules/frontend/mutation-hooks.md` [MODIFY]: 3-stage optimistic mutation lifecycle (`onMutate` snapshot & patch, `onError` rollback, `onSettled` narrow invalidation), idempotency constraints, and typed transport isolation.
- `rules/backend/data-access-via-db.md` [MODIFY]: Cross-link query optimization and index-alignment invariants.

## Implementation Tasks

- [x] Task 2.1 — Author `rules/backend/query-optimization-and-pagination.md` with explicit frontmatter (`name`, `description`, `scope`, `alwaysApply: true`), query builder patterns, cursor-based pagination examples, ESR indexing discipline, and facet isolation rules.
- [x] Task 2.2 — Author `rules/frontend/custom-hooks.md` with explicit frontmatter (`name`, `description`, `scope`, `alwaysApply: false`), single responsibility guidelines, callback memoization rules, and antipattern prohibitions.
- [x] Task 2.3 — Enhance `rules/typescript/async-discipline.md` with concurrency pool limiting, waterfall avoidance (`Promise.all`/`allSettled`), AbortSignal forwarding to DB queries, and transaction execution constraints.
- [x] Task 2.4 — Enhance `rules/frontend/mutation-hooks.md` with strict 3-stage optimistic update protocol, typed context snapshots, rollback mechanics, and idempotency handling.
- [x] Task 2.5 — Update `rules/backend/data-access-via-db.md` to reference `query-optimization-and-pagination.md` and enforce index-aware queries.

## Verification & Testing

- Inspected frontmatter and structure of all 5 rule files against schema requirements.

## Risks & Rollback

- Risk: Rule syntax or frontmatter format failure.
- Rollback: Revert individual rule file changes.
