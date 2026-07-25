---
name: schema-db
description: Evolve Prisma schemas and migrations while generating accurate Kysely runtime types.
scope: schema.prisma, prisma.config.ts, migrations, generated DB types, and database package exports.
alwaysApply: false
---

# Prisma and Kysely Schema

- Use Prisma for schema ownership and migrations; use Kysely for runtime queries.
- Keep the `prisma-kysely` generator output inside the database package and never hand-edit generated types.
- Configure connection URLs through `prisma.config.ts` for Prisma 7+; keep secrets out of source control.
- Prefer additive, backward-compatible migrations. Split destructive changes into expand/migrate/contract phases.
- Name models in PascalCase and map physical snake_case names only when required by database conventions.
- Add indexes and unique constraints based on real access patterns and invariants.
- Choose nullability and defaults deliberately; do not hide missing migration/backfill decisions behind defaults.
- Review generated SQL before applying a migration and document data backfills and rollback limitations.

After a schema change, run generation, typecheck all consumers, exercise the migration on disposable data, and update `.env.example` if configuration changed.
