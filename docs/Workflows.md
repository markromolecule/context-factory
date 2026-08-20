---
title: Workflows
type: moc
tags: [workflow, delivery]
---

# Workflows

Workflows coordinate rules, skills, roles, artifacts, quality gates, and stop conditions across a development lifecycle. Load only the most-specific matching workflow and compose another only when the selected workflow requires it.

## Delivery

- [[workflows/architecture-change|Architecture change]] — evolve durable boundaries and shared patterns safely
- [[workflows/feature-delivery|Feature delivery]] — deliver scoped behavior from evidence through handoff
- [[workflows/defect-resolution|Defect resolution]] — reproduce, diagnose, regress, and safely fix defects
- [[workflows/release-readiness|Release readiness]] — make an evidence-backed ready/not-ready decision

## Risk-specific

- [[workflows/security-sensitive-change|Security-sensitive change]] — threat-model and gate sensitive boundaries
- [[workflows/database-migration|Database migration]] — evolve schemas/data compatibly and recoverably
- [[workflows/dependency-upgrade|Dependency upgrade]] — migrate dependencies through bounded compatibility checks

## Factory

- [[workflows/context-maintenance|Context maintenance]] — evolve canonical agent behavior without drift

## Session Slash Commands & Prefix Triggers

Use leading slash commands or bracket prefix tags for instant, deterministic workflow activation:

- `/grill`, `[DISCOVERY]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: clarify 1 unknown at a time with `grill-with-docs` before planning
- `/plan`, `[PLAN]`, `[FEATURE]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: scaffold task under `docs/tasks/` with `implementation-plan`, stop before coding
- `/exec`, `[EXEC]` $\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: execute approved task phases incrementally with `execution-plan`
- `/fix`, `[HOTFIX]`, `[BUG]` $\rightarrow$ [[workflows/defect-resolution|Defect resolution]]: capture reproduction test before modifying code
- `/migrate`, `[MIGRATE]`, `[DB]` $\rightarrow$ [[workflows/database-migration|Database migration]]: plan forward migration, rollback script, and consumer types
- `/sec`, `[SEC]`, `[SECURITY]` $\rightarrow$ [[workflows/security-sensitive-change|Security-sensitive change]]: review auth, credentials, data isolation, and abuse cases
- `/arch`, `/adr`, `[ADR]` $\rightarrow$ [[workflows/architecture-change|Architecture change]]: scaffold durable decision under `docs/decisions/`
- `/deps`, `/upgrade`, `[UPGRADE]` $\rightarrow$ [[workflows/dependency-upgrade|Dependency upgrade]]: audit compatibility boundaries and run canary tests
- `/release`, `/verify`, `[RELEASE]` $\rightarrow$ [[workflows/release-readiness|Release readiness]]: verify tests, lint, typecheck, and readiness evidence
- `/context`, `[CONTEXT]` $\rightarrow$ [[workflows/context-maintenance|Context maintenance]]: run `node scripts/harness-cli.mjs lock` and `doctor`

## Selection rules

- Use feature delivery as the default for material feature work, not for routine one-file edits.
- Prefer defect resolution when observed behavior is wrong; do not implement before establishing evidence.
- Add a risk-specific workflow only when that risk is central to the change.
- Use release readiness to review and report; it does not authorize deployment.
- Begin new-system and materially ambiguous capability work with [[skills/grill-with-docs/SKILL|grill-with-docs]], then synthesize the confirmed discovery record with [[skills/implementation-plan/SKILL|implementation-plan]] before coding.
- Use [[rules/global/1-3-1-rule|1-3-1]] inside a workflow only for a material unresolved decision.
- Use [[skills/implementation-plan/SKILL|implementation-plan]] for plan-only output and [[skills/execution-plan/SKILL|execution-plan]] when executing an existing task artifact.
