---
title: "Context Token Budget Fencing"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.02"
branch: "task/0001/phase-02/unit-02-context-budget-fencing"
worktree: ".worktrees/0001/phase-02/unit-02-context-budget-fencing"
status: verified
created: "2026-10-01"
tags: [task, unit, budget, harness, context]
depends_on: ["01.02"]
parallelizable_with: ["02.01"]
---

# Unit 02.02: Context Token Budget Fencing

> Phase: phase-02-architecture-and-contracts · Depends on: 01.02 · Parallelizable with: 02.01  
> Worktree: .worktrees/0001/phase-02/unit-02-context-budget-fencing · Branch: task/0001/phase-02/unit-02-context-budget-fencing

## Objective

Enhance `scripts/context-core.mjs` with context size estimation and token budget fencing, ensuring that resolved context bundles report estimated token usage and emit warnings when context density exceeds thresholds.

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Existing Resolver:** `resolveContext` in `scripts/context-core.mjs`
- **Acceptance Criteria:** AC-04

## Preconditions

- Worktree provisioned at declared path.

## Scope

**In scope:**
- `scripts/context-core.mjs`

**Out of scope:**
- CLI commands (`app/cli/commands/session.mjs`) or skill markdown definitions.

## Steps

1. Add character-to-token heuristic estimation (~4 chars/token) to `scripts/context-core.mjs`.
2. Compute estimated token counts for base paths, selected rules, selected skills, and workflow.
3. Attach `budget: { estimatedTokens, ruleAndSkillTokens, maxRecommendedRuleTokens, densityStatus, warning }` to the resolution output object.
4. Flag warning if resolved rule/skill tokens exceed recommended ceiling.
5. Ensure zero breaking changes to existing `resolveContext()` callers and evaluations.

## Verification

- **Test Type:** Unit test — tests `resolveContext()` with standard queries and asserts `budget` metadata is populated accurately.
- **Commands & Evidence:**
  - Red verification: Observed missing budget field prior to implementation (exit code 1).
  - Green verification: Budget metadata populated with `estimatedTokens`, `ruleAndSkillTokens`, and `densityStatus`.
  - Eval regression test: `node scripts/context.mjs eval --unit` -> 19/19 passed (101ms).
  - Doctor check: 22/22 passed in 127ms.
  - Diff Review Pre-Screening: Gate 1 (0 scope leaks), Gate 2 (all tests passing), Gate 3 (SOLID SRP confirmed), Gate 4 (DoD verified).
- **Files Modified:** `scripts/context-core.mjs`, `context-lock.json`.
- **Commit:** `95e4752` on `task/0001/phase-02/unit-02-context-budget-fencing`.

## Rollback

- Revert changes to `scripts/context-core.mjs` and reset unit branch.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`95e4752`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
