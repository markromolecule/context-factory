---
title: "Deterministic Plan Checker Script Validation"
type: unit
parent: "0002/phase-04"
unit: "04.01"
branch: "task/0002/phase-04/plan-checker-validation"
worktree: ".worktrees/0002/phase-04/plan-checker-validation"
status: verified
created: "2026-10-05"
tags: [task, unit, scripts, plan-checker, tooling]
depends_on: []
parallelizable_with: ["04.02"]
---

# Unit 04.01: Deterministic Plan Checker Script Validation

> Phase: 0002/phase-04 · Depends on: none · Parallelizable with: 04.02
> Worktree: .worktrees/0002/phase-04/plan-checker-validation · Branch: task/0002/phase-04/plan-checker-validation

## Objective

Enhance `scripts/plan-check.mjs` to detect whether unit artifacts contain `<language_rules>` blocks and emit informational or warning diagnostics when language rule binding is missing.

## Context packet

- Current state: `scripts/plan-check.mjs` validates topological cycles (Kahn's algorithm) and disjoint parallel file scopes (`extractDeclaredScopes`). It does not inspect the unit content for `<language_rules>`.
- Acceptance criteria: AC-09.
- Decision ledger: D-01, D-02 in ADR 0027.

<language_rules>
- `rules/typescript/common/type-safety.md`: Pure ESM JavaScript/Node.js, avoid implicit conversions.
- `rules/global/code-quality.md`: Keep regex and parsing logic robust, deterministic, and well-tested.
</language_rules>

## Preconditions

- Phase 3 merged into `task/0002-language-rule-lifecycle-binding`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-04/plan-checker-validation`.

## Scope

**In scope:** `scripts/plan-check.mjs`
**Out of scope:** `scripts/context-core.mjs`, templates, skills.

## Steps

1. Inspect `scripts/plan-check.mjs` unit parsing logic.
2. Add a helper function `hasLanguageRulesBlock(unitContent)` that checks for the presence of `<language_rules>` and `</language_rules>` with non-empty content.
3. In `checkTaskPlan(taskDir)`, record whether each unit has a populated `<language_rules>` block.
4. If a unit lacks `<language_rules>`, surface a diagnostic warning in the plan check output:
   - `⚠️  Unit XX.XX is missing a <language_rules> block in ## Context packet`
5. Test against `docs/tasks/2026/10/2026-10-05/0002-task-language-rule-lifecycle-binding`.

## Verification

- Test type: Script execution & Unit testing.
- Case: Run `node scripts/context.mjs plan:check` against the current task directory and ensure zero false positives.
- Command: `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0002-task-language-rule-lifecycle-binding` (PASS: all units declare populated <language_rules> blocks)
- Files modified: `scripts/plan-check.mjs`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert changes to `scripts/plan-check.mjs` with `git checkout scripts/plan-check.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-09
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
