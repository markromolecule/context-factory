---
ruleId: cf-rule-ts-schema-db
name: schema-db
description: Evolve Prisma schemas and migrations while generating accurate Kysely runtime types.
scope: schema.prisma, prisma.config.ts, migrations, generated DB types, and database package exports.
stack: typescript
appliesTo: ["prisma/**/*.prisma", "src/**/db/**/*.ts"]
layers: ["database", "data"]
alwaysApply: false
---

# Prisma and Kysely Schema

- [directive:ts.schema.prisma-schema-kysely-runtime][mode:evidence-blocking][verifier:human-evidence] Use Prisma for schema ownership and migrations; use Kysely for runtime queries.
- [directive:ts.schema.generator-output-isolated][mode:automated-blocking][verifier:linter] Keep the `prisma-kysely` generator output inside the database package and never hand-edit generated types.
- [directive:ts.schema.connection-config][mode:advisory][verifier:none] Configure connection URLs through `prisma.config.ts` for Prisma 7+; keep secrets out of source control.
- [directive:ts.schema.backward-compatible-migrations][mode:evidence-blocking][verifier:human-evidence] Prefer additive, backward-compatible migrations. Split destructive changes into expand/migrate/contract phases.
- [directive:ts.schema.pascal-case-models][mode:automated-blocking][verifier:linter] Name models in PascalCase and map physical snake_case names only when required by database conventions.
- [directive:ts.schema.index-invariants][mode:evidence-blocking][verifier:human-evidence] Add indexes and unique constraints based on real access patterns and invariants.
- [directive:ts.schema.deliberate-nullability][mode:evidence-blocking][verifier:human-evidence] Choose nullability and defaults deliberately; do not hide missing migration/backfill decisions behind defaults.
- [directive:ts.schema.review-migration-sql][mode:evidence-blocking][verifier:human-evidence] Review generated SQL before applying a migration and document data backfills and rollback limitations.

After a schema change, run generation, typecheck all consumers, exercise the migration on disposable data, and update `.env.example` if configuration changed.
