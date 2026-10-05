---
title: "{{title}}"
type: task
status: planned
created: "{{date}}"
tags: [task]
target_branch: main
base_branch: "task/{{task_id}}-{{task_slug}}"
---

# {{title}}

## Outcome

## Pre-planning record

### Actors and goals

### Domain language

Link the canonical glossary; do not duplicate implementation details here.

### Language stack and applicable rules

- **Declared Stack:** e.g. `typescript`, `laravel`, `flutter`
- **Applicable Rules:** List rule paths (e.g. `rules/typescript/common/type-safety.md`, `rules/typescript/backend/service-layer.md`) to be bound across units.
- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|

### Unknowns and blockers

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|

## Scope

## Non-goals

## Constraints and decisions

## Worktree & Branch Topology

| Phase | Unit ID | Unit Title | Branch Name | Worktree Directory | Merge Target | Status |
|---|---|---|---|---|---|---|
| phase-01 | 01.01 | [Unit Title] | `task/{{task_id}}/phase-01/[slug]` | `.worktrees/{{task_id}}/phase-01/[slug]` | `task/{{task_id}}/phase-01` | planned |

## Phases

- [ ] `phase-01-<feature>.md` — Phase 1: concrete outcome
- [ ] `phase-02-<feature>.md` — Phase 2: concrete outcome

## Verification

Record the command or inspection, outcome, and the acceptance criterion it supports. Do not mark a result verified from an unrun check.

## Deviations

## Finalization & Merge Ledger

| Stage | Source Branch | Target Branch | Merge Commit SHA | Worktree Cleaned | Verification Command |
|---|---|---|---|---|---|
| Phase 01 Integration | `task/{{task_id}}/phase-01` | `task/{{task_id}}-{{task_slug}}` | pending | [ ] | `npm test` |
| Task Base Finalization | `task/{{task_id}}-{{task_slug}}` | `main` | pending | [ ] | `node scripts/context.mjs doctor` |

## Result
