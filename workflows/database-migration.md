---
name: database-migration
description: Evolve schemas and production data through compatible, reviewed, observable, and recoverable migration phases.
scope: Schema changes, migrations, backfills, generated database types, destructive data operations, and consumer cutovers.
---

# Database Migration

## Triggers

Use for any persistent schema or data-shape change. Compose with feature delivery and security-sensitive change when the migration supports new behavior or sensitive data.

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
