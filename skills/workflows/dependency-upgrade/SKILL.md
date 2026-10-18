---
name: dependency-upgrade
description: Upgrade runtimes, frameworks, libraries, and tooling through bounded compatibility analysis and verified migration steps.
scope: Dependency additions/upgrades/removals, lockfiles, runtime versions, framework migrations, and generated configuration changes.
primaryAgent: devops-agent
participatingAgents: [architect-agent, threat-agent]
rules:
  - rules/global/code-quality.md
  - rules/global/security-guardrails.md
  - rules/typescript/common/type-safety.md
skills:
  - explore
  - plan
  - execute
  - verify
---

# Dependency Upgrade

## Triggers

Use when dependency resolution or supported runtime behavior changes. Security-only emergency updates also use the security-sensitive workflow.

## Required inputs

- Current and target versions, lockfile/package manager, runtime matrix, direct usage, transitive risk, and migration reason.
- Official release/migration guidance and known consumer/deployment constraints.

## Applicable rules and skills

Load code-quality, security, and touched-domain rules. Use an implementation plan for major framework/runtime migrations or staged consumer updates.

## Phases

1. Inventory declared and actual usage, version constraints, peer dependencies, generated files, and runtime/CI assumptions.
2. Read primary release notes, migration guides, advisories, and compatibility requirements.
3. Separate mechanical version changes from required behavioral migrations.
4. Upgrade the smallest coherent set and regenerate the lockfile with the established package manager.
5. Apply migrations without unrelated refactors and inspect automated transformations.
6. Run typecheck, tests, lint, build, runtime smoke checks, and security/dependency scans available to the project.
7. Document breaking behavior, configuration changes, deployment order, and rollback version.

## Quality gates

- No blind bulk upgrade or unexplained lockfile churn.
- Primary-source compatibility guidance supports the chosen target.
- Removed/deprecated APIs and peer/runtime constraints are resolved.
- Generated code and configuration are reviewed.

## Stop and escalation conditions

Stop when the target breaks an unknown external contract, required migration guidance is unavailable, a license/policy decision is needed, production runtime compatibility is unknown, or a security advisory cannot be safely mitigated in scope.

## Artifacts and completion

Use a task for multi-package/staged upgrades. Report version changes, migration behavior, lockfile impact, verification, advisories, deployment requirements, and rollback path.
