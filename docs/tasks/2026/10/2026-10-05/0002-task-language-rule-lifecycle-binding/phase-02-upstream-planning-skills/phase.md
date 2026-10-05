---
title: "Phase 2 — Upstream Planning Skills (context, plan, plan-review)"
type: phase
parent: "0002"
phase: "02"
phase_branch: "task/0002/phase-02"
status: planned
created: "2026-10-05"
tags: [task, phase, skills, planning]
---

# Phase 2 — Upstream Planning Skills (context, plan, plan-review)

## Objective

Wire active language rule identification, unit-scoped rule binding, and pre-execution auditing into the upstream planning skills: `skills/productivity/context/SKILL.md`, `skills/productivity/plan/SKILL.md`, and `skills/productivity/plan-review/SKILL.md`.

## Dependencies & Prerequisites

- Phase 1 integration merged into `task/0002-language-rule-lifecycle-binding`.
- Templates updated with `<language_rules>` blocks and language sections.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Context Skill Language Resolution | `unit-01-context-skill-language-resolution.md` | `task/0002/phase-02/context-skill-resolution` | `.worktrees/0002/phase-02/context-skill-resolution` | `none` | `Unit 02.02`, `Unit 02.03` | `planned` |
| **Unit 02.02** | Plan Skill Scoped Rule Binding | `unit-02-plan-skill-scoped-rule-binding.md` | `task/0002/phase-02/plan-skill-rule-binding` | `.worktrees/0002/phase-02/plan-skill-rule-binding` | `none` | `Unit 02.01`, `Unit 02.03` | `planned` |
| **Unit 02.03** | Plan Review Audit Gate | `unit-03-plan-review-audit-gate.md` | `task/0002/phase-02/plan-review-audit-gate` | `.worktrees/0002/phase-02/plan-review-audit-gate` | `none` | `Unit 02.01`, `Unit 02.02` | `planned` |

## Impacted Files & Components

- `skills/productivity/context/SKILL.md`: Instructs agent to resolve language stack and pin applicable rules into context specifications.
- `skills/productivity/plan/SKILL.md`: Instructs agent to bind unit-scoped rule subsets (2–4 rules matching touched files) into `<language_rules>` blocks and explain how each rule is satisfied.
- `skills/productivity/plan-review/SKILL.md`: Adds audit check in Gate 3 verifying that every unit has populated `<language_rules>`.

## Implementation Tasks

- [ ] Unit 02.01 — Update `skills/productivity/context/SKILL.md` with language stack resolution directives.
- [ ] Unit 02.02 — Update `skills/productivity/plan/SKILL.md` with unit-scoped rule binding and checkable directives.
- [ ] Unit 02.03 — Update `skills/productivity/plan-review/SKILL.md` with rule block auditing criteria.

## Verification & Testing

- Validate markdown syntax and frontmatter across modified skill files.
- Run `npm run lint`.

## Risks, Worktree Teardown & Rollback

- Reversible skill markdown updates.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
