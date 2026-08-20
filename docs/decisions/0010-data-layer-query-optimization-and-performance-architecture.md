---
title: Data Layer Query Optimization and System Performance Architecture
type: decision
status: accepted
created: 2026-08-20
tags: [adr, performance, optimization, queries, pagination, kysely, prisma, async, hooks]
---

# 0010 — Data Layer Query Optimization and System Performance Architecture

## Context

As the Context Factory architecture expanded across complex domain entities, high-throughput list endpoints, and reactive client user interfaces, four systemic performance challenges emerged:
1. **Unbounded and Inefficient Database Queries:** Ambiguity between Prisma Client and Kysely led to runtime object hydration overhead, accidental N+1 queries, unindexed dynamic filtering, and inefficient full-table scans during nested data retrieval.
2. **Degrading Pagination & Faceting:** Uncapped offset pagination (`OFFSET 100000`) and combining expensive `COUNT(*)` aggregations on every page request caused linear degradation and database CPU saturation at scale.
3. **Async Execution Hazards:** Unbounded `Promise.all` loops exhausted database connection pools, uncancelled queries continued executing after client HTTP disconnects, and long-lived open transactions held locks across external network calls.
4. **Frontend State Desynchronization & Hook Instability:** Unstructured mutation lifecycles resulted in broken optimistic UI rollbacks, broad cache invalidation storms, and anti-patterns such as copying server state into local `useState`/`useEffect` synchronization loops.

A clear, enforceable architectural boundary was required across backend querying, async concurrency, and frontend custom/mutation hooks.

## Options considered

1. **Strict Division of Labor, Keyset Pagination, Concurrency Pools, and 3-Stage Optimistic Hooks (Adopted):**
   - *Backend Data Access:* Prisma strictly for schema DDL, migrations, seeders, and type generation (`prisma-kysely`); Kysely as the sole runtime query builder for all read/write queries with explicit column selections.
   - *Pagination & Facets:* Default to cursor/keyset pagination with `limit + 1` for `hasMore`; allow bounded offset only for shallow admin tables (max offset 10k, max limit 100); enforce the ESR (Equality, Sort, Range) indexing rule; decouple heavy facet counts from list queries.
   - *Async Discipline:* Eliminate waterfalls via `Promise.all`/`allSettled`; enforce concurrency pool limiters (`p-limit`, concurrency 10–25) for batch I/O to protect database connection pools; propagate incoming `AbortSignal` to database queries; prohibit external I/O inside open DB transactions.
   - *Hook Architecture:* Isolate UI rendering from complex state in custom hooks; enforce 3-stage mutation lifecycle (`onMutate` snapshot & patch, `onError` rollback, `onSettled` narrow invalidation); prohibit syncing server cache in local state.
2. **Hybrid Prisma/Kysely Runtime with Offset Pagination Everywhere:**
   - Use Prisma for simple CRUD and Kysely only for complex queries; use standard offset pagination across all endpoints.
   - *Trade-off:* High risk of developers accidentally expanding Prisma queries with nested `include`s, producing hidden N+1 queries and slow pagination at scale.
3. **Monolithic Ad-hoc Approach:**
   - Leave data access, pagination, async concurrency, and hook composition to individual developer preference without standardized rules.
   - *Trade-off:* Inconsistent API contracts, database connection pool exhaustion, and frequent client cache state bugs.

## Decision

Adopt Option 1. Implement:
1. **Dedicated Query Optimization & Pagination Rule (`rules/backend/query-optimization-and-pagination.md`):** Mandate Kysely runtime queries, keyset pagination, DTO limit validation (`min(1).max(100)`), ESR indexing, and isolated facet queries.
2. **Dedicated Custom Hooks Rule (`rules/frontend/custom-hooks.md`):** Mandate separation of UI from business logic, callback/value memoization, and prohibition of server-state duplication.
3. **Enhanced Async Discipline (`rules/typescript/async-discipline.md`):** Enforce waterfall elimination, `p-limit` connection protection, `AbortSignal` database query cancellation, and zero external I/O inside transactions.
4. **Enhanced Mutation Hooks Discipline (`rules/frontend/mutation-hooks.md`):** Enforce typed 3-stage optimistic lifecycle with pre-mutation snapshots, safe rollbacks, narrow cache invalidation, and idempotency constraints.
5. **Context Synchronization:** Register all new rules in `context-manifest.json`, synchronize entrypoint contracts, and lock context inventory.

## Consequences

- Database queries remain deterministic, index-covered, and free of ORM hydration overhead or N+1 query loops.
- API endpoints scale predictably with constant-time cursor lookups (`O(1)`) rather than degrading offset scans (`O(N)`).
- Database connection pools are protected from concurrency spikes via bounded pool limiters and request cancellation signals.
- Frontend user interfaces provide instant optimistic feedback with guaranteed, glitch-free error rollback.

## Validation and review date

Review after 50 feature/data-layer implementations or by 2027-02-20. Measure query latency percentiles (p95/p99), database connection pool utilization, and error rollback fidelity.
