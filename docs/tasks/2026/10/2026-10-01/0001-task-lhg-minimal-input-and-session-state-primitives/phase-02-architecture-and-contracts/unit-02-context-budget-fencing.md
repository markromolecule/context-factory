---
title: "Context Token Budget Fencing"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.02"
branch: "task/0001/phase-02/unit-02-context-budget-fencing"
worktree: ".worktrees/0001/phase-02/unit-02-context-budget-fencing"
status: planned
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
3. Attach `budget: { estimatedTokens, densityStatus, warning }` to the resolution output object.
4. Flag warning if resolved rule/skill tokens exceed 5,000 tokens (or ~50% recommended context budget).
5. Ensure zero breaking changes to existing `resolveContext()` callers and evaluations.

## Verification

- **Test Type:** Unit test — tests `resolveContext()` with standard queries and asserts `budget` metadata is populated accurately.
- **Command:** `node -e "import('./scripts/context-core.mjs').then(c => c.resolveContext('fix auth bug').then(r => console.log('Budget:', r.budget)))"`

## Rollback

- Revert changes to `scripts/context-core.mjs` and reset unit branch.

## Definition of done

- [ ] Maps to acceptance criteria: AC-04
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
