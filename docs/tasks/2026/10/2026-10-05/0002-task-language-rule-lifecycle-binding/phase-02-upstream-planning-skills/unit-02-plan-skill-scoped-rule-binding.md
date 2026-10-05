---
title: "Plan Skill Scoped Rule Binding"
type: unit
parent: "0002/phase-02"
unit: "02.02"
branch: "task/0002/phase-02/plan-skill-rule-binding"
worktree: ".worktrees/0002/phase-02/plan-skill-rule-binding"
status: verified
created: "2026-10-05"
tags: [task, unit, plan, skills]
depends_on: []
parallelizable_with: ["02.01", "02.03"]
---

# Unit 02.02: Plan Skill Scoped Rule Binding

> Phase: 0002/phase-02 · Depends on: none · Parallelizable with: 02.01, 02.03
> Worktree: .worktrees/0002/phase-02/plan-skill-rule-binding · Branch: task/0002/phase-02/plan-skill-rule-binding

## Objective

Update `skills/productivity/plan/SKILL.md` to instruct agents during unit decomposition to bind a focused, unit-scoped subset of language rules (typically 2–4 rules matching touched files) directly into each unit's `<language_rules>` block with concrete, checkable directives and state how the unit satisfies them.

## Context packet

- Current state: `skills/productivity/plan/SKILL.md` instructs agents to perform SOLID audits (Step 8) and assign test types (Step 11), but does not mandate binding language rules into unit context packets.
- Acceptance criteria: AC-05.
- Decision ledger: D-01, D-02, D-04, D-06 in ADR 0027.

<language_rules>
- `rules/global/code-quality.md`: Keep instructions concrete and actionable with checkable examples.
- `rules/solid/single-responsibility.md`: Ensure the planning skill maintains single responsibility (planning, not executing).
</language_rules>

## Preconditions

- Phase 1 merged into `task/0002-language-rule-lifecycle-binding`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-02/plan-skill-rule-binding`.

## Scope

**In scope:** `skills/productivity/plan/SKILL.md`
**Out of scope:** `skills/productivity/context/SKILL.md`, `skills/productivity/plan-review/SKILL.md`, execution skills.

## Steps

1. Inspect `skills/productivity/plan/SKILL.md` under `## Workflow`.
2. In Step 11/12 (Unit decomposition), add explicit instruction:
   - "For every unit, identify the specific subset of language/framework rules (`rules/<stack>/*`) matching the files touched by that unit (typically 2–4 rules). Inline them into the unit's `<language_rules>` block at the end of `## Context packet` with concrete checkable directives (e.g., 'no implicit any', 'typed FormRequest', 'Zod safeParse'). Avoid inlining full rule catalogs to prevent token bloat and attention dilution. In the unit steps, state explicitly how each rule is satisfied."
3. In `## Plan requirements`, add:
   - "- unit-scoped language rule binding (`<language_rules>`) with checkable directives and explicit satisfaction mapping in unit steps;"
4. In `## Completion`, add:
   - "- every unit contains a populated `<language_rules>` block matching its touched files;"

## Verification

- Test type: Skill procedure inspection.
- Case: Confirm that `skills/productivity/plan/SKILL.md` mandates unit-scoped rule subsets and checkable directives.
- Command: `grep -n "<language_rules>" skills/productivity/plan/SKILL.md` (PASS: lines 69, 83, 98)
- Files modified: `skills/productivity/plan/SKILL.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert changes to `skills/productivity/plan/SKILL.md` with `git checkout skills/productivity/plan/SKILL.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-05
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
