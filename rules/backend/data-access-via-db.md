---
name: data-access-via-db
description: Keep Kysely database access explicit, transaction-aware, parameterized, and isolated from transport concerns.
scope: Repositories, query functions, transactions, persistence mapping, and database errors.
alwaysApply: true
---

# Data Access via Database

- Use the shared Kysely `DB` type generated from Prisma schema metadata.
- Accept a `Kysely<DB>` or transaction dependency instead of importing a hidden global when atomic composition is needed.
- Select explicit columns at public boundaries; avoid accidental schema coupling through `selectAll`.
- Keep queries parameterized and express filters with the query builder.
- Return domain-oriented results and define not-found semantics explicitly (`undefined`, `null`, or a domain error).
- Use transactions for multi-write invariants; pass the transaction through every participating function.
- Define pagination order deterministically and index fields used for filtering/joining.
- Translate only known constraint failures; preserve unexpected database errors for centralized handling.
- Do not put HTTP response logic or cross-domain orchestration in the repository layer.

Test query behavior, empty results, constraints, transaction rollback, and soft-delete visibility against an isolated database when SQL semantics matter.
