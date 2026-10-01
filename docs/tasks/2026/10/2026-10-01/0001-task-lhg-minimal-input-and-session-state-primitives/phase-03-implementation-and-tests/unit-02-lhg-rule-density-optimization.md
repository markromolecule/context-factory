---
title: "LHG Minimal Input Rule Density Optimization"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.02"
branch: "task/0001/phase-03/unit-02-lhg-rule-density-optimization"
worktree: ".worktrees/0001/phase-03/unit-02-lhg-rule-density-optimization"
status: planned
created: "2026-10-01"
tags: [task, unit, rules, density, lhg]
depends_on: ["02.02"]
parallelizable_with: ["03.01"]
---

# Unit 03.02: LHG Minimal Input Rule Density Optimization

> Phase: phase-03-implementation-and-tests · Depends on: 02.02 · Parallelizable with: 03.01  
> Worktree: .worktrees/0001/phase-03/unit-02-lhg-rule-density-optimization · Branch: task/0001/phase-03/unit-02-lhg-rule-density-optimization

## Objective

Audit and refactor core global rules (`rules/global/evidence-and-claims.md`, `rules/global/architecture-conformance.md`) to strip conversational fluff, eliminate narrative preamble, and convert instructions into ultra-high-density constraint tables that minimize input tokens while maximizing adherence.

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Existing Rules:** `rules/global/evidence-and-claims.md`, `rules/global/architecture-conformance.md`
- **Acceptance Criteria:** AC-06

## Preconditions

- Unit 02.02 completed (`scripts/context-core.mjs` budget checks operational).
- Worktree provisioned at declared path.

## Scope

**In scope:**
- `rules/global/evidence-and-claims.md`
- `rules/global/architecture-conformance.md`

**Out of scope:**
- Skill markdown or orchestrator contracts.

## Steps

1. Review `rules/global/evidence-and-claims.md` and convert prose into high-density constraint matrices without losing negative constraints or classification semantics.
2. Review `rules/global/architecture-conformance.md` and condense into concise tabular directives.
3. Validate that token count of these rules is reduced by 30–50% without altering normative meaning.
4. Run evaluation suite to verify that existing behavioral assertions remain 100% passing.

## Verification

- **Test Type:** Architecture test — diff review confirming high-density structure and verification via evaluation suite.
- **Command:** `node scripts/context.mjs eval --unit`

## Rollback

- Restore original rule files from master branch and reset unit branch.

## Definition of done

- [ ] Maps to acceptance criteria: AC-06
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
