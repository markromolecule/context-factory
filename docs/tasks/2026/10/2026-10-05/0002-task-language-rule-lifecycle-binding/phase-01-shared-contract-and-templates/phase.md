---
title: "Phase 1 — Shared Orchestration Contract & Lifecycle Templates"
type: phase
parent: "0002"
phase: "01"
phase_branch: "task/0002/phase-01"
status: planned
created: "2026-10-05"
tags: [task, phase, contract, templates]
---

# Phase 1 — Shared Orchestration Contract & Lifecycle Templates

## Objective

Establish the core authority and structural foundation for language rules by updating the model-neutral orchestration contract (`orchestrator/SHARED.md`) and modernizing the context, task, and unit markdown templates to include first-class `<language_rules>` blocks and precedence specifications.

## Dependencies & Prerequisites

- Context Specification: `docs/context/rules/language-rule-lifecycle-binding.md`
- Accepted ADR: `docs/decisions/0027-language-rule-lifecycle-binding-and-verification.md`

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Orchestrator Precedence & Shared Contract | `unit-01-orchestrator-precedence-and-contract.md` | `task/0002/phase-01/orchestrator-precedence` | `.worktrees/0002/phase-01/orchestrator-precedence` | `none` | `Unit 01.02` | `planned` |
| **Unit 01.02** | Context, Task, and Unit Templates Modernization | `unit-02-context-task-unit-templates.md` | `task/0002/phase-01/templates-modernization` | `.worktrees/0002/phase-01/templates-modernization` | `none` | `Unit 01.01` | `planned` |

## Impacted Files & Components

- `orchestrator/SHARED.md`: Update `## Conflict order` and `## Working contract` to enforce that language rules supersede conflicting plan steps.
- `docs/templates/Context.md`: Add Language Stack & Applicable Rules section.
- `docs/templates/Task.md`: Add Language Stack & Rules inventory in Pre-planning.
- `docs/templates/Unit.md`: Add `<language_rules>` block positioned immediately before `## Steps`.

## Implementation Tasks

- [ ] Unit 01.01 — Codify conflict precedence and language rule semantics in `orchestrator/SHARED.md`.
- [ ] Unit 01.02 — Inject `<language_rules>` blocks and language stack sections across `Context.md`, `Task.md`, and `Unit.md`.

## Verification & Testing

- Validate markdown syntax and file integrity.
- Run `npm run lint` and `npm run validate`.

## Risks, Worktree Teardown & Rollback

- Reversible markdown edits.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
