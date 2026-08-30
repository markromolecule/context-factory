---
name: verify
description: Audit implementation and completion claims against acceptance criteria, source changes, fresh command output, unresolved findings, and skipped checks (/verify, [VERIFY], [QA]).
---

# Verification Review

## Procedure

1. Read the requested outcome, acceptance criteria, task record, and deviations.
2. Inspect the actual change set and map each criterion to its implementation boundary.
3. Re-run the narrowest authoritative checks when safe and available.
4. Classify every claimed result as verified, unsupported, contradicted, skipped, or blocked.
5. Review error paths, authorization, data integrity, compatibility, operations, and rollback proportionally to risk.
6. Produce a ready, not-ready, or blocked conclusion with evidence.

## Rules

- Independence means rechecking evidence, not trusting a developer summary.
- A passing test is not proof of behavior outside its assertions and environment.
- Do not downgrade a failed required check to a warning without authorized risk acceptance.
- Never infer deployment, migration application, external delivery, or user-visible success from local code alone.

## Completion

Every acceptance criterion has a status and evidence, all required checks are accounted for, and remaining risk has an owner or is explicitly blocking.
