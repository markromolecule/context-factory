---
title: Workflows
type: moc
tags: [workflow, delivery]
---

# Workflows

Workflows coordinate rules, skills, roles, artifacts, quality gates, and stop conditions across a development lifecycle. Load only the most-specific matching workflow and compose another only when the selected workflow requires it.

## Delivery

- [[skills/workflows/architecture-change/SKILL|Architecture Change]] — Change durable system boundaries, dependency direction, shared patterns, or public contracts with explicit evidence, decisions, migration, and conformance checks.
- [[skills/workflows/code-review-and-optimization/SKILL|Code Review and Optimization]] — Audit, suggest improvements for, and optimize code generated from implementation plans to ensure high performance, type safety, modularity, and clean architecture.
- [[skills/workflows/commit-push-release/SKILL|Commit, Push & Release]] — Safely stage, craft conventional commits, push to remote repository, tag releases, and execute release verification.
- [[skills/workflows/defect-resolution/SKILL|Defect Resolution]] — Resolve a defect by reproducing it, establishing root cause, adding regression evidence, and applying the smallest safe fix.
- [[skills/workflows/feature-delivery/SKILL|Feature Delivery]] — Deliver a product capability from scoped outcome through implementation, verification, documentation, and handoff.
- [[skills/workflows/new-project-delivery/SKILL|New Project Progressive Delivery]] — Deliver a greenfield system or major multi-module domain capability using progressive vertical-slice execution, pre-planning grilling discovery, 4-layer backend testing, client hook validation, and dual-loop engineering.
- [[skills/workflows/release-readiness/SKILL|Release Readiness]] — Decide whether a change set is ready to release using evidence across behavior, quality, operations, security, accessibility, and recovery.

## Risk-specific

- [[skills/workflows/database-migration/SKILL|Database Migration]] — Evolve schemas and production data through compatible, reviewed, observable, and recoverable migration phases.
- [[skills/workflows/dependency-upgrade/SKILL|Dependency Upgrade]] — Upgrade runtimes, frameworks, libraries, and tooling through bounded compatibility analysis and verified migration steps.
- [[skills/workflows/security-sensitive-change/SKILL|Security-Sensitive Change]] — Deliver changes across trust boundaries with explicit threat modeling, security gates, adversarial verification, and safe release controls.

## Factory

- [[skills/workflows/context-maintenance/SKILL|Context Maintenance]] — Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.

## Custom Workflows

- [[skills/workflows/docs/SKILL|Documentation & System Reporting Workflow]] — Synthesize evidence-backed development and system reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation with tables and conclusions.

## Host-Native Workflow Discovery (Codex & Claude Code)

Each canonical workflow is exposed as a first-class skill:

- **Claude Code:** Project skills under `.claude/skills/workflow-<slug>`. Invoke directly in prompt:
  - `/workflow-feature-delivery` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]
  - `/workflow-defect-resolution` $\rightarrow$ [[skills/workflows/defect-resolution/SKILL|Defect resolution]]
  - `/workflow-architecture-change` $\rightarrow$ [[skills/workflows/architecture-change/SKILL|Architecture change]]
  - `/workflow-context-maintenance` $\rightarrow$ [[skills/workflows/context-maintenance/SKILL|Context maintenance]]
  - `/workflow-release-readiness` $\rightarrow$ [[skills/workflows/release-readiness/SKILL|Release readiness]]
  - `/workflow-code-review-and-optimization` $\rightarrow$ [[skills/workflows/code-review-and-optimization/SKILL|Code review and optimization]]
  - `/workflow-commit-push-release` $\rightarrow$ [[skills/workflows/commit-push-release/SKILL|Commit, push & release]]
  - `/workflow-database-migration` $\rightarrow$ [[skills/workflows/database-migration/SKILL|Database migration]]
  - `/workflow-dependency-upgrade` $\rightarrow$ [[skills/workflows/dependency-upgrade/SKILL|Dependency upgrade]]
  - `/workflow-docs` $\rightarrow$ [[skills/workflows/docs/SKILL|Docs]]
  - `/workflow-new-project-delivery` $\rightarrow$ [[skills/workflows/new-project-delivery/SKILL|New project progressive delivery]]
  - `/workflow-security-sensitive-change` $\rightarrow$ [[skills/workflows/security-sensitive-change/SKILL|Security-sensitive change]]
- **Codex:** Discoverable under `.agents/skills/workflow-<slug>` via the `/skills` menu or referenced in prompt as `$workflow-<slug>` (e.g. `$workflow-feature-delivery`, `$workflow-defect-resolution`).

Each entry provides authoritative phases, quality gates, and stop conditions directly as a first-class skill.

## Internal Resolver Aliases & Prompt Triggers

These slash-prefixed strings and bracket prefix tags are internal resolver keywords recognized by `node scripts/context.mjs resolve` and prompt matching. They are NOT registered host slash commands:

- `/new-project`, `[NEW_PROJECT]` $\rightarrow$ [[skills/workflows/new-project-delivery/SKILL|New project progressive delivery]]: progressive vertical-slice execution with grilling and 4-layer tests
- `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: author and grill context specifications in `docs/context/`
- `/grill`, `[DISCOVERY]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: clarify 1 unknown at a time with `grill` before planning
- `/plan`, `[PLAN]`, `[FEATURE]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: scaffold task under `docs/tasks/` with `plan`, stop before coding
- `/execute`, `/exec`, `[EXEC]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: execute approved task phases incrementally with `execute`
- `/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]` $\rightarrow$ [[skills/workflows/code-review-and-optimization/SKILL|Code review and optimization]]: audit, optimize, and refactor plan-affected code
- `/fix`, `[HOTFIX]`, `[BUG]` $\rightarrow$ [[skills/workflows/defect-resolution/SKILL|Defect resolution]]: capture reproduction test before modifying code
- `/migrate`, `[MIGRATE]`, `[DB]` $\rightarrow$ [[skills/workflows/database-migration/SKILL|Database migration]]: plan forward migration, rollback script, and consumer types
- `/sec`, `[SEC]`, `[SECURITY]` $\rightarrow$ [[skills/workflows/security-sensitive-change/SKILL|Security-sensitive change]]: review auth, credentials, data isolation, and abuse cases
- `/arch`, `/adr`, `[ADR]` $\rightarrow$ [[skills/workflows/architecture-change/SKILL|Architecture change]]: scaffold durable decision under `docs/decisions/`
- `/deps`, `/upgrade`, `[UPGRADE]` $\rightarrow$ [[skills/workflows/dependency-upgrade/SKILL|Dependency upgrade]]: audit compatibility boundaries and run canary tests
- `/release`, `/verify`, `[RELEASE]` $\rightarrow$ [[skills/workflows/release-readiness/SKILL|Release readiness]]: verify tests, lint, typecheck, and readiness evidence
- `/ship`, `/commit-push-release`, `[SHIP]` $\rightarrow$ [[skills/workflows/commit-push-release/SKILL|Commit, push & release]]: stage, commit with conventional format, push to remote, tag release
- `/sync`, `/maintain`, `[MAINTENANCE]` $\rightarrow$ [[skills/workflows/context-maintenance/SKILL|Context maintenance]]: run `node scripts/harness-cli.mjs lock` and `doctor`

## Selection rules

- Use feature delivery as the default for material feature work, not for routine one-file edits.
- Prefer defect resolution when observed behavior is wrong; do not implement before establishing evidence.
- Add a risk-specific workflow only when that risk is central to the change.
- Use release readiness to review and report; it does not authorize deployment.
- Begin new-system and materially ambiguous capability work with [[skills/productivity/grill/SKILL|grill]], then synthesize the confirmed discovery record with [[skills/productivity/plan/SKILL|plan]] before coding.
- Use [[rules/global/1-3-1-rule|1-3-1]] inside a workflow only for a material unresolved decision.
- Use [[skills/productivity/plan/SKILL|plan]] for plan-only output and [[skills/engineering/execute/SKILL|execute]] when executing an existing task artifact.
