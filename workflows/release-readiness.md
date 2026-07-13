---
name: release-readiness
description: Decide whether a change set is ready to release using evidence across behavior, quality, operations, security, accessibility, and recovery.
scope: Pre-release reviews, deployment candidates, milestone completion, and production handoffs.
---

# Release Readiness

## Triggers

Use before a production release, handoff, or claim that a material feature/migration is complete. This workflow reviews and reports; it does not authorize deployment unless the user requests it.

## Required inputs

- Release scope, acceptance criteria, change set, environment/deployment plan, owners, and verification evidence.
- Migrations, configuration, feature flags, observability, rollback/mitigation, and known issues.

## Applicable rules and skills

Load rules for changed domains and use `security-review` for sensitive scope. Consume evidence from feature, migration, dependency, and frontend workflows rather than repeating work without reason.

## Phases

1. Reconcile release scope with commits/diffs, acceptance criteria, tasks, decisions, and documentation.
2. Confirm required typecheck, tests, lint, builds, generated artifacts, and environment-specific smoke checks.
3. Review migrations/configuration, secrets, compatibility, feature flags, and deployment ordering.
4. Review security, privacy, accessibility, performance, and operational findings proportionally to risk.
5. Confirm logs/metrics/alerts identify success and failure, and name the release owner and rollback trigger.
6. Classify unresolved findings as blocking, accepted risk requiring authority, or follow-up with an owner.
7. Produce a ready/not-ready decision backed by evidence.

## Quality gates

- Acceptance criteria and required checks are complete and traceable.
- No unresolved critical/high security or data-integrity finding.
- Forward deployment and rollback/mitigation are executable and owned.
- Documentation, configuration examples, migrations, and public contracts match the release.

## Stop and escalation conditions

Mark not ready and stop when evidence is missing, required checks fail, a blocking finding remains, migration/rollback ownership is absent, or risk acceptance requires an authorized human decision.

## Artifacts and completion

Report the readiness decision, evidence, blockers, accepted risks with owner, deployment/rollback notes, monitoring signals, and post-release checks. Never infer that deployment occurred.
