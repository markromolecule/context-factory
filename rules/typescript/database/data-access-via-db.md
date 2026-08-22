---
name: data-access-via-db
description: Keep Kysely database access explicit, transaction-aware, parameterized, index-aligned, and isolated from transport concerns.
scope: Repositories, query functions, transactions, persistence mapping, query optimization, and database errors.
alwaysApply: true
---

# Data Access via Database

- Use the shared Kysely `DB` type generated from Prisma schema metadata.
- Accept a `Kysely<DB>` or transaction dependency instead of importing a hidden global when atomic composition is needed.
- Select explicit columns at public boundaries; strictly avoid schema coupling or memory bloat through `selectAll`.
- Keep queries parameterized and express dynamic filters strictly with the Kysely query builder.
- Follow `rules/database/query-optimization-and-pagination.md` for cursor/keyset pagination, limit enforcement, and ESR composite index alignment.
- Return domain-oriented results and define not-found semantics explicitly (`undefined`, `null`, or a domain error).
- Use transactions for multi-write invariants; pass the transaction through every participating function. Keep transactions free of external I/O or sleep operations.
- Translate only known constraint failures; preserve unexpected database errors for centralized handling.
- Do not put HTTP response logic or cross-domain orchestration in the data access layer.

Test query behavior, empty results, constraints, transaction rollback, and soft-delete visibility against an isolated database when SQL semantics matter.
