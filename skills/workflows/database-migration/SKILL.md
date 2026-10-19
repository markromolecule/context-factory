---
name: database-migration
description: Evolve schemas and production data through compatible, reviewed, observable, and recoverable migration phases.
scope: Schema changes, migrations, backfills, generated database types, destructive data operations, and consumer cutovers.
primaryAgent: data-agent
participatingAgents: [architect-agent, devops-agent]
rules:
  - rules/typescript/database/schema-db.md
  - rules/typescript/database/data-access-via-db.md
  - rules/typescript/database/query-optimization-and-pagination.md
  - rules/typescript/database/testing-data-access-layer.md
  - rules/global/security-guardrails.md
skills:
  - plan
  - execute
  - test
  - perf
---

# Database Migration

## Triggers

Use for any persistent schema or data-shape change. Compose with feature delivery and security-sensitive change when the migration supports new behavior or sensitive data.

- **T0 (Schema Queries):** Inspecting table structures, indexes, or queries requires no workflow; answer directly from database schema files.
- **T1:** Persistent schema alterations and production data migrations carry operational and data-loss risk and are never classified as T1.
- **T2 (Additive Schema Changes):** Adding nullable columns, new tables, or non-blocking indexes with backwards compatibility. Requires a task plan under `docs/tasks/`, migration scripts, and automated migration/rollback tests.
- **T3 (Destructive / Multi-Phase Migrations):** Dropping columns, modifying existing data types, large backfills, or table drops. Requires pre-planning discovery (`context` / `grill`), expand-and-contract planning, explicit data loss authorization, and staged consumer cutovers.


## Required inputs

- Current schema, data volume/distribution, consumers, availability requirements, and deployment model.
- Target shape, compatibility window, backfill needs, ownership, and rollback/mitigation expectations.

## Applicable rules and skills

Load schema/database, data-access, testing, security, naming, and code-quality rules. Use an implementation plan for multi-deploy expand-and-contract work.

## Phases

1. Inspect schema, migrations, queries, generated types, indexes, and every known consumer.
2. Choose additive, expand-and-contract, or maintenance-window delivery based on compatibility and operational risk.
3. Create and review migration SQL for locks, scans, defaults, constraints, indexes, and reversibility.
4. Build bounded, idempotent, restartable, observable backfills when needed.
5. Regenerate types and update readers/writers in a compatible order.
6. Verify migration and rollback/mitigation against representative data and failure interruption.
7. Deploy in phases, observe correctness/performance, then remove compatibility code only after old consumers are gone.

## Quality gates

- Forward and rollback/mitigation steps are documented.
- Migration SQL and generated artifacts are reviewed rather than trusted blindly.
- Backfills have batching, checkpoints, rate control, progress metrics, and safe restart semantics when scale requires them.
- Constraints and destructive cleanup occur only after compatible data and consumers are verified.

## Stop and escalation conditions

Stop when data loss is possible without explicit approval, production volume or lock impact is unknown, rollback assumptions are false, required backups are unavailable, or active consumers cannot be identified.

## Artifacts and completion

Record phases and evidence in a task artifact. Report migration files, generated types, compatibility order, data verification, operational commands, rollback/mitigation, and cleanup still pending.
