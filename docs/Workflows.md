---
title: Workflows
type: moc
tags: [workflow, delivery]
---

# Workflows

Workflows coordinate rules, skills, roles, artifacts, quality gates, and stop conditions across a development lifecycle. Load only the most-specific matching workflow and compose another only when the selected workflow requires it.

## Delivery

- [[workflows/architecture-change|Architecture Change]] — Change durable system boundaries, dependency direction, shared patterns, or public contracts with explicit evidence, decisions, migration, and conformance checks.
- [[workflows/code-review-and-optimization|Code Review and Optimization]] — Audit, suggest improvements for, and optimize code generated from implementation plans to ensure high performance, type safety, modularity, and clean architecture.
- [[workflows/commit-push-release|Commit, Push & Release]] — Safely stage, craft conventional commits, push to remote repository, tag releases, and execute release verification.
- [[workflows/defect-resolution|Defect Resolution]] — Resolve a defect by reproducing it, establishing root cause, adding regression evidence, and applying the smallest safe fix.
- [[workflows/docs|Documentation & Reporting]] — Synthesize evidence-backed development and system reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation with tables and conclusions.
- [[workflows/feature-delivery|Feature Delivery]] — Deliver a product capability from scoped outcome through implementation, verification, documentation, and handoff.
- [[workflows/new-project-delivery|New Project Progressive Delivery]] — Deliver a greenfield system or major multi-module domain capability using progressive vertical-slice execution, pre-planning grilling discovery, 4-layer backend testing, client hook validation, and dual-loop engineering.
- [[workflows/release-readiness|Release Readiness]] — Decide whether a change set is ready to release using evidence across behavior, quality, operations, security, accessibility, and recovery.

## Risk-specific

- [[workflows/database-migration|Database Migration]] — Evolve schemas and production data through compatible, reviewed, observable, and recoverable migration phases.
- [[workflows/dependency-upgrade|Dependency Upgrade]] — Upgrade runtimes, frameworks, libraries, and tooling through bounded compatibility analysis and verified migration steps.
- [[workflows/security-sensitive-change|Security-Sensitive Change]] — Deliver changes across trust boundaries with explicit threat modeling, security gates, adversarial verification, and safe release controls.

## Factory

- [[workflows/context-maintenance|Context Maintenance]] — Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.

## Session Slash Commands & Prefix Triggers

Use leading slash commands or bracket prefix tags for instant, deterministic workflow activation:

- `/new-project`, `[NEW_PROJECT]` $\rightarrow$ [[workflows/new-project-delivery|New project progressive delivery]]: progressive vertical-slice execution with grilling and 4-layer tests
- `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: author and grill context specifications in `docs/context/`
- `/grill`, `[DISCOVERY]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: clarify 1 unknown at a time with `grill` before planning
- `/plan`, `[PLAN]`, `[FEATURE]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: scaffold task under `docs/tasks/` with `plan`, stop before coding
- `/doc`, `/docs`, `[DOC]`, `[DOCS]`, `/documentation` $\rightarrow$ [[workflows/docs|Documentation & reporting]]: synthesize evidence-backed reports and summaries
- `/execute`, `/exec`, `[EXEC]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: execute approved task phases incrementally with `execute`
- `/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]` $\rightarrow$ [[workflows/code-review-and-optimization|Code review and optimization]]: audit, optimize, and refactor plan-affected code
- `/fix`, `[HOTFIX]`, `[BUG]` $\rightarrow$ [[workflows/defect-resolution|Defect resolution]]: capture reproduction test before modifying code
- `/migrate`, `[MIGRATE]`, `[DB]` $\rightarrow$ [[workflows/database-migration|Database migration]]: plan forward migration, rollback script, and consumer types
- `/sec`, `[SEC]`, `[SECURITY]` $\rightarrow$ [[workflows/security-sensitive-change|Security-sensitive change]]: review auth, credentials, data isolation, and abuse cases
- `/arch`, `/adr`, `[ADR]` $\rightarrow$ [[workflows/architecture-change|Architecture change]]: scaffold durable decision under `docs/decisions/`
- `/deps`, `/upgrade`, `[UPGRADE]` $\rightarrow$ [[workflows/dependency-upgrade|Dependency upgrade]]: audit compatibility boundaries and run canary tests
- `/release`, `/verify`, `[RELEASE]` $\rightarrow$ [[workflows/release-readiness|Release readiness]]: verify tests, lint, typecheck, and readiness evidence
- `/ship`, `/commit-push-release`, `[SHIP]` $\rightarrow$ [[workflows/commit-push-release|Commit, push & release]]: stage, commit with conventional format, push to remote, tag release
- `/sync`, `/maintain`, `[MAINTENANCE]` $\rightarrow$ [[workflows/context-maintenance|Context maintenance]]: run `node scripts/harness-cli.mjs lock` and `doctor`

## Selection rules

- Use feature delivery as the default for material feature work, not for routine one-file edits.
- Prefer defect resolution when observed behavior is wrong; do not implement before establishing evidence.
- Add a risk-specific workflow only when that risk is central to the change.
- Use release readiness to review and report; it does not authorize deployment.
- Begin new-system and materially ambiguous capability work with [[skills/productivity/grill/SKILL|grill]], then synthesize the confirmed discovery record with [[skills/productivity/plan/SKILL|plan]] before coding.
- Use [[rules/global/1-3-1-rule|1-3-1]] inside a workflow only for a material unresolved decision.
- Use [[skills/productivity/plan/SKILL|plan]] for plan-only output and [[skills/engineering/execute/SKILL|execute]] when executing an existing task artifact.
