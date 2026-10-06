---
ruleId: cf-rule-ts-data-access-via-db
name: data-access-via-db
description: Keep Kysely database access explicit, transaction-aware, parameterized, index-aligned, and isolated from transport concerns.
scope: Repositories, query functions, transactions, persistence mapping, query optimization, and database errors.
stack: typescript
appliesTo: ["src/**/db/**/*.ts", "src/**/repositories/**/*.ts", "**/*.repository.ts"]
layers: ["database", "data"]
alwaysApply: true
---

# Data Access via Database

- [directive:ts.db.shared-type][mode:automated-blocking][verifier:typechecker] Use the shared Kysely `DB` type generated from Prisma schema metadata.
- [directive:ts.db.inject-client][mode:advisory][verifier:none] Accept a `Kysely<DB>` or transaction dependency instead of importing a hidden global when atomic composition is needed.
- [directive:ts.db.explicit-columns][mode:automated-blocking][verifier:linter] Select explicit columns at public boundaries; strictly avoid schema coupling or memory bloat through `selectAll`.
- [directive:ts.db.parameterized-queries][mode:automated-blocking][verifier:linter] Keep queries parameterized and express dynamic filters strictly with the Kysely query builder.
- [directive:ts.db.follow-query-rules][mode:evidence-blocking][verifier:human-evidence] Follow `rules/database/query-optimization-and-pagination.md` for cursor/keyset pagination, limit enforcement, and ESR composite index alignment.
- [directive:ts.db.explicit-not-found][mode:automated-blocking][verifier:test] Return domain-oriented results and define not-found semantics explicitly (`undefined`, `null`, or a domain error).
- [directive:ts.db.transaction-isolation][mode:evidence-blocking][verifier:human-evidence] Use transactions for multi-write invariants; pass the transaction through every participating function. Keep transactions free of external I/O or sleep operations.
- [directive:ts.db.translate-constraints][mode:automated-blocking][verifier:test] Translate only known constraint failures; preserve unexpected database errors for centralized handling.
- [directive:ts.db.no-http-in-data-layer][mode:automated-blocking][verifier:linter] Do not put HTTP response logic or cross-domain orchestration in the data access layer.

Test query behavior, empty results, constraints, transaction rollback, and soft-delete visibility against an isolated database when SQL semantics matter.
