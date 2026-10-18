---
title: Workflows
type: moc
tags: [workflow, delivery]
---

# Workflows

Workflows coordinate rules, skills, roles, artifacts, quality gates, and stop conditions across a development lifecycle. Load only the most-specific matching workflow and compose another only when the selected workflow requires it.

## Delivery

- [[skills/workflows/feature-delivery/SKILL|Feature Delivery]] — Deliver a product capability from scoped outcome through implementation, verification, documentation, and handoff (including greenfield systems and user capabilities).
- [[skills/workflows/defect-resolution/SKILL|Defect Resolution]] — Resolve a defect by reproducing it, establishing root cause, adding regression evidence, and applying the smallest safe fix.
- [[skills/workflows/commit-push-release/SKILL|Commit, Push & Release]] — Safely stage, craft conventional commits, push to remote repository, tag releases, and execute release verification.

## Architecture & Data Safety

- [[skills/workflows/architecture-change/SKILL|Architecture Change]] — Change durable system boundaries, dependency direction, shared patterns, or public contracts with explicit evidence, decisions, migration, and conformance checks.
- [[skills/workflows/database-migration/SKILL|Database Migration]] — Evolve schemas and production data through compatible, reviewed, observable, and recoverable migration phases.

## Factory

- [[skills/workflows/context-maintenance/SKILL|Context Maintenance]] — Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.

## Host-Native Workflow Discovery (Codex & Claude Code)

Each canonical workflow is exposed as a first-class skill:

- **Claude Code:** Project skills under `.claude/skills/workflow-<slug>`. Invoke directly in prompt:
  - `/workflow-feature-delivery` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]
  - `/workflow-defect-resolution` $\rightarrow$ [[skills/workflows/defect-resolution/SKILL|Defect resolution]]
  - `/workflow-architecture-change` $\rightarrow$ [[skills/workflows/architecture-change/SKILL|Architecture change]]
  - `/workflow-database-migration` $\rightarrow$ [[skills/workflows/database-migration/SKILL|Database migration]]
  - `/workflow-commit-push-release` $\rightarrow$ [[skills/workflows/commit-push-release/SKILL|Commit, push & release]]
  - `/workflow-context-maintenance` $\rightarrow$ [[skills/workflows/context-maintenance/SKILL|Context maintenance]]
- **Codex:** Discoverable under `.agents/skills/workflow-<slug>` via the `/skills` menu or referenced in prompt as `$workflow-<slug>` (e.g. `$workflow-feature-delivery`, `$workflow-defect-resolution`).

Each entry provides authoritative phases, quality gates, and stop conditions directly as a first-class skill.

## Internal Resolver Aliases & Prompt Triggers

These slash-prefixed strings and bracket prefix tags are internal resolver keywords recognized by `node scripts/context.mjs resolve` and prompt matching. They are NOT registered host slash commands:

- `/new-project`, `[NEW_PROJECT]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: progressive vertical-slice execution with grilling and planning
- `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: author and grill context specifications in `docs/context/`
- `/grill`, `[DISCOVERY]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: clarify 1 unknown at a time with `grill` before planning
- `/plan`, `[PLAN]`, `[FEATURE]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: scaffold task under `docs/tasks/` with `plan`, stop before coding
- `/execute`, `/exec`, `[EXEC]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: execute approved task phases incrementally with `execute`
- `/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: audit and optimize code adhering to quality rules
- `/fix`, `[HOTFIX]`, `[BUG]` $\rightarrow$ [[skills/workflows/defect-resolution/SKILL|Defect resolution]]: capture reproduction test before modifying code
- `/migrate`, `[MIGRATE]`, `[DB]` $\rightarrow$ [[skills/workflows/database-migration/SKILL|Database migration]]: plan forward migration, rollback script, and consumer types
- `/sec`, `[SEC]`, `[SECURITY]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: apply security guardrails and security skill to auth/trust boundaries
- `/arch`, `/adr`, `[ADR]` $\rightarrow$ [[skills/workflows/architecture-change/SKILL|Architecture change]]: scaffold durable decision under `docs/decisions/`
- `/deps`, `/upgrade`, `[UPGRADE]` $\rightarrow$ [[skills/workflows/architecture-change/SKILL|Architecture change]]: audit compatibility boundaries and run canary tests
- `/release`, `/verify`, `[RELEASE]`, `/ship`, `/commit-push-release`, `[SHIP]` $\rightarrow$ [[skills/workflows/commit-push-release/SKILL|Commit, push & release]]: stage, commit with conventional format, push to remote, tag release
- `/sync`, `/maintain`, `[MAINTENANCE]` $\rightarrow$ [[skills/workflows/context-maintenance/SKILL|Context maintenance]]: run `node scripts/harness-cli.mjs lock` and `doctor`
- `/doc`, `/docs`, `[DOC]`, `[DOCS]` $\rightarrow$ [[skills/workflows/feature-delivery/SKILL|Feature delivery]]: synthesize documentation or reports

## Selection rules

- Use feature delivery as the default for material feature work and greenfield capabilities.
- Prefer defect resolution when observed behavior is wrong; do not implement before establishing evidence.
- Use architecture change for cross-module boundary shifts, dependency direction changes, or ADR authoring.
- Use database migration for any persistent schema or data-shape change.
- Use commit-push-release to verify pre-flight checks, craft conventional commits, push upstream, and tag releases.
- Begin new-system and materially ambiguous capability work with [[skills/productivity/grill/SKILL|grill]], then synthesize the confirmed discovery record with [[skills/productivity/plan/SKILL|plan]] before coding.
- Use [[rules/global/1-3-1-rule|1-3-1]] inside a workflow only for a material unresolved decision.
- Use [[skills/productivity/plan/SKILL|plan]] for plan-only output and [[skills/engineering/execute/SKILL|execute]] when executing an existing task artifact.
