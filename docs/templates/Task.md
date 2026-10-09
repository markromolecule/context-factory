---
title: "{{title}}"
type: task
status: draft
plan_contract_version: 3
plan_id: "{{task_id}}"
created: "{{date}}"
tags: [task]
target_branch: "{{target_branch}}"
task_branch: "{{task_branch}}"
base_commit: "{{base_commit}}"
---

# {{title}}

## Outcome

## Pre-planning record

### Actors and goals

### Domain language

Link the canonical glossary; do not duplicate implementation details here.

### Language stack and applicable rules

- **Declared Stack:** e.g. `typescript`, `laravel`, `flutter`
- **Rule Binding ID & Hash:** `binding-{{task_id}}` (`sha256:...`) compiled via `context-cli preflight`
- **Active Directives:**

| Directive ID | Mode | Rule Path | Verifier |
|---|---|---|---|
| `ts.type-safety.ban-any` | automated-blocking | `rules/typescript/common/type-safety.md` | `ts-type-checker` |

- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|

### Unknowns and blockers

- None.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|

## Scope

## Non-goals

## Constraints and decisions

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
|---|---|---|
| | | |

## Task branch

| Field | Recorded decision |
|---|---|
| Target branch | `{{target_branch}}` |
| Task branch | `{{task_branch}}` |
| Base commit | `{{base_commit}}` |

## Phases

- [ ] `phase-01-<feature>.md` — Phase 1: concrete outcome
- [ ] `phase-02-<feature>.md` — Phase 2: concrete outcome

## Verification

Record the command or inspection, outcome, and the acceptance criterion it supports. Do not mark a result verified from an unrun check.

## Deviations

## Plan done-check

- [ ] Acceptance criteria map to units and verification.
- [ ] Blockers are resolved or absent.
- [ ] Risks and dependencies are recorded.
- [ ] Task branch and target base are verified.

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Conformance Report | Verification Command |
|---|---|---|---|---|
| Phase 01 Verification | `{{task_branch}}` | pending | pending | `npm test` |
| Task Finalization | `{{task_branch}}` to `{{target_branch}}` | pending | pending | `node scripts/context.mjs doctor` |

## Result
