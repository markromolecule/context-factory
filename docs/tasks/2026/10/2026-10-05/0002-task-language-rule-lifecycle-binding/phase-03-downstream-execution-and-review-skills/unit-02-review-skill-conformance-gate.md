---
title: "Review Skill Conformance Gate"
type: unit
parent: "0002/phase-03"
unit: "03.02"
branch: "task/0002/phase-03/review-skill-conformance-gate"
worktree: ".worktrees/0002/phase-03/review-skill-conformance-gate"
status: verified
created: "2026-10-05"
tags: [task, unit, review, skills]
depends_on: []
parallelizable_with: ["03.01"]
---

# Unit 03.02: Review Skill Conformance Gate

> Phase: 0002/phase-03 · Depends on: none · Parallelizable with: 03.01
> Worktree: .worktrees/0002/phase-03/review-skill-conformance-gate · Branch: task/0002/phase-03/review-skill-conformance-gate

## Objective

Update `skills/engineering/review/SKILL.md` to introduce Gate 4 ("Language Rules Conformance Audit") before Definition of Done verification, ensuring that worktree diffs are rigorously audited against the unit's declared `<language_rules>` before any checkpoint is presented to the developer.

## Context packet

- Current state: `skills/engineering/review/SKILL.md` defines 4 gates: Gate 1 (Scope Fence), Gate 2 (Test Completeness), Gate 3 (SOLID Audit), and Gate 4 (Definition of Done Audit). It lacks a dedicated audit gate for language- and framework-specific rules.
- Acceptance criteria: AC-08.
- Decision ledger: D-01, D-05 in ADR 0027.

<language_rules>
- `rules/global/code-quality.md`: Keep review criteria clear, actionable, and structured with distinct pass/fail conditions.
- `rules/solid/single-responsibility.md`: Maintain review skill boundary (unit-level white-box diff auditing).
</language_rules>

## Preconditions

- Phase 2 merged into `task/0002-language-rule-lifecycle-binding`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-03/review-skill-conformance-gate`.

## Scope

**In scope:** `skills/engineering/review/SKILL.md`
**Out of scope:** `skills/engineering/execute/SKILL.md`, `skills/productivity/*`, templates.

## Steps

1. Inspect `skills/engineering/review/SKILL.md` under `## The Four-Gate Diff Review Procedure`.
2. Expand the procedure into a Five-Gate procedure, inserting Gate 4:
   - `### Gate 4: Language Rules Conformance Audit`
   - "Inspect the unit specification's declared `<language_rules>` block."
   - "Audit the worktree diff (`git diff HEAD~1` or against base integration branch) line-by-line against each listed rule:"
     - "Naming Conventions: Verify identifiers, files, and classes match stack rules."
     - "Type Safety & Runtime Validation: Ensure zero loose types (`any`), missing schemas, or unvalidated inputs."
     - "Architecture Boundaries: Ensure layer isolation (e.g. thin controllers, vertical slices, repository/action separation) matches rule directives."
     - "Error Handling & Async: Confirm proper exception classes, logging, and async discipline."
   - "If any violation is detected, mark FAIL with specific file and line numbers, and require remediation before advancing."
3. Renumber Definition of Done Audit to Gate 5.

## Verification

- Test type: Skill procedure inspection.
- Case: Confirm that `skills/engineering/review/SKILL.md` defines Gate 4 for Language Rules Conformance Audit.
- Command: `grep -n "Language Rules Conformance Audit" skills/engineering/review/SKILL.md` (PASS: line 65)
- Files modified: `skills/engineering/review/SKILL.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert changes to `skills/engineering/review/SKILL.md` with `git checkout skills/engineering/review/SKILL.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-08
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
