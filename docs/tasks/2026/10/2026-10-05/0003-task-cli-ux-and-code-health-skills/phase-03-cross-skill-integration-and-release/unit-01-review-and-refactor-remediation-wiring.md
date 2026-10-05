---
title: "Review & Refactor Remediation Wiring"
type: unit
parent: "0003/phase-03"
unit: "03.01"
branch: "task/0003/phase-03/remediation-wiring"
worktree: ".worktrees/0003/phase-03/remediation-wiring"
status: planned
created: "2026-10-05"
tags: [task, unit, skills, review, refactor, wiring]
depends_on: []
parallelizable_with: []
---

# Unit 03.01: Review & Refactor Remediation Wiring

> Phase: 0003/phase-03 · Depends on: none · Parallelizable with: none
> Worktree: .worktrees/0003/phase-03/remediation-wiring · Branch: task/0003/phase-03/remediation-wiring

## Objective

Update `skills/engineering/review/SKILL.md` (Gate 3 SOLID Audit and Gate 4 Language Rules Conformance) and `skills/engineering/refactor/SKILL.md` to establish explicit remediation routing to `/types` for static typing slop and `/perf` for query and runtime bottlenecks.

## Context packet

- Acceptance criteria: AC-06, AC-07.
- Decision ledger: D-03 in ADR 0028; ADR 0027 (Language Rule Lifecycle Binding).
- Relevant files:
  - `skills/engineering/review/SKILL.md`: Gate 3 (SOLID Audit) and Gate 4 (Language Rules Conformance Audit).
  - `skills/engineering/refactor/SKILL.md`: Modular refactoring workflows.

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure skill links and cross-references are bidirectional and valid.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Phase 2 complete (both `perf` and `types` skills exist).
- Dedicated git worktree and branch provisioned at declared path.
- Cut from `task/0003/phase-03-integration`.

## Scope

**In scope:** `skills/engineering/review/SKILL.md`, `skills/engineering/refactor/SKILL.md`.
**Out of scope:** Readme index updates (Unit 03.02), sync/doctor execution (Unit 03.02).

## Steps

1. In `skills/engineering/review/SKILL.md`:
   - Under Gate 3 (SOLID & Architecture Audit): Add remediation guidance stating that interface segregation violations and loose type abstractions should be dispatched to `/types` (`skills/engineering/types/SKILL.md`).
   - Under Gate 4 (Language Rules Conformance Audit): Add explicit anti-slop remediation rules:
     - If `any`, loose `as` casts, or omitted discriminated union exhaustiveness are found, mark FAIL and instruct the agent to execute `/types` (`skills/engineering/types/SKILL.md`) before checkpointing.
     - If unindexed queries, ORM N+1 loops, unbounded `Promise.all` waterfalls, or ESR violations are found, mark FAIL and instruct the agent to execute `/perf` (`skills/engineering/perf/SKILL.md`) before checkpointing.
2. In `skills/engineering/refactor/SKILL.md`:
   - Cross-reference `/types` for type-driven refactoring and `/perf` for hot-path and query-driven refactoring.
3. Validate markdown syntax and link validity.

## Verification

- Test type: Contract & documentation consistency test.
- Case 1: Search `skills/engineering/review/SKILL.md` for references to `skills/engineering/types/SKILL.md` and `skills/engineering/perf/SKILL.md`.
- Case 2: Search `skills/engineering/refactor/SKILL.md` for references to `skills/engineering/types/SKILL.md` and `skills/engineering/perf/SKILL.md`.

## Rollback

Revert changes to `skills/engineering/review/SKILL.md` and `skills/engineering/refactor/SKILL.md` via `git checkout`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-06, AC-07
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
