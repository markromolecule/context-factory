---
name: database-query
description: Optimize SQL queries, design performant Kysely/Prisma data access patterns, configure indexes, and implement deterministic cursor-based pagination (/database-query, /query, [QUERY]).
---

# Database Query Optimization & Data Access

Use this skill when diagnosing slow database queries, designing complex SQL joins, tuning index strategies, eliminating N+1 queries, or building cursor-based keyset pagination.

## Workflow

1. **Analyze Query Plan & Performance:**
   - Inspect raw SQL or generated ORM queries with `EXPLAIN (ANALYZE, BUFFERS)`.
   - Identify sequential scans, expensive joins, nested loops, and unindexed filters.
2. **Design Targeted Indexes:**
   - Propose B-tree indexes for equality and range filters (`WHERE`, `ORDER BY`).
   - Create composite indexes honoring left-prefix ordering (`(tenant_id, status, created_at)`).
   - Use partial/filtered indexes for sparse states (e.g. `WHERE deleted_at IS NULL`).
3. **Eliminate N+1 & Over-Fetching:**
   - Replace loop queries with single batch `WHERE IN (...)` or relational joins.
   - Restrict selected columns to required fields; avoid `SELECT *`.
4. **Implement Keyset / Cursor Pagination:**
   - Avoid `OFFSET / LIMIT` for large datasets due to $O(N)$ scan overhead.
   - Implement deterministic keyset pagination using stable tuple comparisons:
     ```sql
     WHERE (created_at, id) < ($last_created_at, $last_id)
     ORDER BY created_at DESC, id DESC
     LIMIT $page_size
     ```
5. **Kysely & Prisma Data Layer Construction:**
   - Write strongly typed query builders in the data access layer (`*.data.ts`).
   - Inject db connection pools and return typed domain records without leaking raw ORM models to controllers.

## Output

Report:
- Optimized SQL / Kysely / Prisma query code.
- Index creation DDL with migration scripts.
- Benchmark and query execution plan evidence.
