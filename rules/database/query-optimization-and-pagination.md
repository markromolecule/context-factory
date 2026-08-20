---
name: query-optimization-and-pagination
description: Enforce high-performance database querying, Kysely runtime standards, cursor/keyset pagination, bounded limits, ESR composite indexing, and isolated facet aggregations.
scope: Repositories, query builders, pagination DTOs, multi-table joins, search facets, and query indexes.
alwaysApply: true
---

# Query Optimization and Pagination

## Runtime query layer boundary

- Use Prisma exclusively for schema definitions (`schema.prisma`), migrations, seeders, and generated TypeScript types (`prisma-kysely`).
- Use Kysely as the sole runtime query builder for all read and write queries (simple lookups, multi-table joins, dynamic filters, aggregations, CTEs, and bulk mutations).
- Never use Prisma Client for runtime queries in production data layers to prevent runtime object hydration bloat and unmonitored N+1 query loops.
- Select explicit columns at public boundaries (`select(['id', 'title', 'status'])`); strictly prohibit `selectAll()` across tables or relations.

## Keyset and cursor pagination

- Default to **cursor/keyset pagination** for all collections, infinite scrolls, public API lists, and datasets exceeding 1,000 rows.
- Build deterministic composite cursor conditions on ordered tuples (e.g. `(created_at, id)`):
  ```sql
  WHERE (created_at < :cursor_created_at)
     OR (created_at = :cursor_created_at AND id < :cursor_id)
  ORDER BY created_at DESC, id DESC
  LIMIT :limit + 1
  ```
- Fetch `limit + 1` records to determine `hasMore` without executing a full-table `COUNT(*)`.
- Allow **offset pagination** only on shallow administrative tables where explicit page jumping is strictly required, with an enforced maximum offset cap (e.g. `offset <= 10,000`) and maximum limit (e.g. `limit <= 100`).

## Limits and dynamic filtering

- Validate and strictly bound all pagination parameters in transport DTO schemas:
  - `limit`: `z.coerce.number().int().min(1).max(100).default(20)`
  - `cursor`: `z.string().optional()`
  - `offset`: `z.coerce.number().int().min(0).max(10000).default(0)`
- Never execute unbounded queries (`SELECT` without `LIMIT`).

## Indexing discipline (The ESR Rule)

- Structure composite database indexes following the **Equality, Sort, Range (ESR)** order:
  1. **Equality (`=`):** Columns matched on exact equality in `WHERE` clauses (e.g., `tenant_id`, `status`).
  2. **Sort (`ORDER BY`):** Columns determining query sort ordering (e.g., `created_at DESC`, `id DESC`).
  3. **Range (`<`, `>`, `BETWEEN`, `IN`):** Columns filtered by inequality or ranges.
- Reject dynamic sorting on arbitrary, unindexed user columns.

## Facets and aggregations

- Decouple item list queries from multi-dimensional facet counts and total row calculations.
- Compute facet counts in separate, dedicated aggregation queries or materialized CTEs rather than scanning the entire table on each pagination request.
- For high-cardinality collections, return approximate or cached counts instead of executing an exact `COUNT(*)` across millions of rows.

## Verification

Test cursor pagination forward and backward traversals, limit boundary capping (`limit=0`, `limit=101`), index seek efficiency via `EXPLAIN ANALYZE`, and empty result handling.
