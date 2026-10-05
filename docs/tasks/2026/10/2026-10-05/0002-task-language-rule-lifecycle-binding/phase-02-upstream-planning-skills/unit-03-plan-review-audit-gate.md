---
title: "Plan Review Audit Gate"
type: unit
parent: "0002/phase-02"
unit: "02.03"
branch: "task/0002/phase-02/plan-review-audit-gate"
worktree: ".worktrees/0002/phase-02/plan-review-audit-gate"
status: planned
created: "2026-10-05"
tags: [task, unit, plan-review, skills]
depends_on: []
parallelizable_with: ["02.01", "02.02"]
---

# Unit 02.03: Plan Review Audit Gate

> Phase: 0002/phase-02 · Depends on: none · Parallelizable with: 02.01, 02.02
> Worktree: .worktrees/0002/phase-02/plan-review-audit-gate · Branch: task/0002/phase-02/plan-review-audit-gate

## Objective

Update `skills/productivity/plan-review/SKILL.md` to add an explicit audit check within Gate 3 ("Cold-Start Executability & Context Packet Inspection") verifying that every unit artifact contains a populated `<language_rules>` block matching its declared file scope and that no planned step contradicts those rules.

## Context packet

- Current state: `skills/productivity/plan-review/SKILL.md` evaluates DAG cycles (Gate 1), AC mapping (Gate 2), Cold-Start Context Packets (Gate 3), and Test Types (Gate 4). Gate 3 does not verify the presence of `<language_rules>`.
- Acceptance criteria: AC-06.
- Decision ledger: D-01, D-02 in ADR 0027.

<language_rules>
- `rules/global/code-quality.md`: Keep review gate criteria objective, binary, and deterministic.
- `rules/global/evidence-and-claims.md`: Ensure gate failures produce actionable remediation instructions.
</language_rules>

## Preconditions

- Phase 1 merged into `task/0002-language-rule-lifecycle-binding`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-02/plan-review-audit-gate`.

## Scope

**In scope:** `skills/productivity/plan-review/SKILL.md`
**Out of scope:** `skills/productivity/context/SKILL.md`, `skills/productivity/plan/SKILL.md`, scripts.

## Steps

1. Inspect `skills/productivity/plan-review/SKILL.md` under `### Gate 3: Cold-Start Executability & Context Packet Inspection`.
2. Add a new check item:
   - `6. **Language Rule Binding & Precedence:** Verify that the unit's Context Packet contains a non-empty \`<language_rules>\` block positioned immediately before \`## Steps\`. Ensure the rules match the touched file scope (not a generic blank block or bloated catalog dump) with checkable directives, and confirm that no planned step contradicts those language rules.`
3. In Gate 3 Pass/Fail criteria, specify:
   - If any unit lacks a valid `<language_rules>` block or prescribes code patterns violating declared stack rules, flag **FAIL: Language Rule Binding Incomplete**.

## Verification

- Test type: Skill procedure inspection.
- Case: Confirm that `skills/productivity/plan-review/SKILL.md` includes the language rule binding check in Gate 3.
- Command: `grep -n "Language Rule Binding" skills/productivity/plan-review/SKILL.md`

## Rollback

Revert changes to `skills/productivity/plan-review/SKILL.md` with `git checkout skills/productivity/plan-review/SKILL.md`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-06
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
