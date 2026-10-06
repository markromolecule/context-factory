---
title: "Lifecycle Skill, Workflow, and Template Contracts"
type: unit
parent: "phase-04-lifecycle-and-bridges"
unit: "04.01"
branch: "task/0001/phase-04/lifecycle-contracts"
worktree: ".worktrees/0001/phase-04/lifecycle-contracts"
status: planned
created: "2026-10-06"
tags: [task, unit, skills, workflows, templates]
depends_on: ["03.03"]
parallelizable_with: ["04.02"]
---

# Unit 04.01: Lifecycle Skill, Workflow, and Template Contracts

## Objective

Replace trust-based lifecycle language with explicit binding/report inputs and fail-closed gates while keeping rules, skills, and workflows in their distinct roles.

## Context packet

- ADR 0027 prompt proximity remains; ADR 0029 adds executable evidence.
- `context` identifies stack/scope, `plan` binds IDs, `plan-review` validates, `execute` runs, and `review`/`verify` consume reports.
- An LLM conformance statement is not a substitute for a report.
- AC-08 lifecycle portion.

<language_rules>
- `rules/global/architecture-conformance.md`: ADR 0029 and existing lifecycle boundaries remain authoritative.
- `rules/global/evidence-and-claims.md`: Completion language names the binding/report and distinguishes failed, unavailable, unsupported, waived, and manual evidence.
- `rules/global/code-quality.md`: Keep each skill procedural and each workflow lifecycle-oriented; do not duplicate rule prose.
</language_rules>

## Preconditions

- Phase 3 CLI semantics are stable.

## Scope

**In scope:** `orchestrator/SHARED.md`; `skills/productivity/context/SKILL.md`, `plan/SKILL.md`, `plan-review/SKILL.md`; `skills/engineering/execute/SKILL.md`, `review/SKILL.md`, `verify/SKILL.md`; `workflows/architecture-change.md`, `context-maintenance.md`; `docs/templates/Context.md`, `Task.md`, `Unit.md`.

**Out of scope:** rule prose/metadata, JavaScript implementation, bridges, and catalog indexes.

## Steps

1. Define required binding/report receipts and stop conditions once in SHARED.
2. Update planning artifacts to carry stable directive IDs/hashes, exact scope, and waiver references rather than copied vague bullets alone.
3. Make execute invoke preflight/conform and make review/verify reject missing or failed blocking reports.
4. Keep human evidence and waiver authorization explicit; no agent self-approval.
5. Update templates with the smallest contract fields needed by cold-start sessions.

## Verification

- **Contract inspection:** every lifecycle stage names its inputs, outputs, stop condition, and authority.
- **Architecture review:** no policy is duplicated inconsistently across rules/skills/workflows.
- Commands: `npm run lint`; focused `rg` assertions in `evals/lifecycle-conformance.test.mjs` after Unit 04.03.

## Rollback

Revert lifecycle/template text as one unit; executable CLI remains available but is not claimed mandatory.

## Definition of done

- [ ] AC-08 lifecycle contracts are explicit.
- [ ] No skill can claim completion without report evidence.
- [ ] ADR 0027 proximity requirement remains intact.
- [ ] Unit passes `/review`.
