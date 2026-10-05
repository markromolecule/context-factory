---
title: "Execute Skill Generation Anchor & Precedence"
type: unit
parent: "0002/phase-03"
unit: "03.01"
branch: "task/0002/phase-03/execute-skill-anchor"
worktree: ".worktrees/0002/phase-03/execute-skill-anchor"
status: verified
created: "2026-10-05"
tags: [task, unit, execute, skills]
depends_on: []
parallelizable_with: ["03.02"]
---

# Unit 03.01: Execute Skill Generation Anchor & Precedence

> Phase: 0002/phase-03 · Depends on: none · Parallelizable with: 03.02
> Worktree: .worktrees/0002/phase-03/execute-skill-anchor · Branch: task/0002/phase-03/execute-skill-anchor

## Objective

Update `skills/engineering/execute/SKILL.md` to instruct agents during unit implementation to re-read the unit's `<language_rules>` block immediately before generating code, and enforce the invariant that language rules strictly override contradictory plan text.

## Context packet

- Current state: `skills/engineering/execute/SKILL.md` under Step 3 ("Minimal Functional Implementation") instructs agents to follow applicable domain rules from `rules/`, but does not anchor attention on the unit's `<language_rules>` immediately before generation nor explicitly declare that language rules override plan steps.
- Acceptance criteria: AC-07.
- Decision ledger: D-01, D-03, D-04 in ADR 0027.

<language_rules>
- `rules/global/code-quality.md`: Keep instructions imperative, unambiguous, and directly actionable.
- `rules/solid/single-responsibility.md`: Maintain execution skill boundary (execution and unit verification, not multi-phase orchestration).
</language_rules>

## Preconditions

- Phase 2 merged into `task/0002-language-rule-lifecycle-binding`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-03/execute-skill-anchor`.

## Scope

**In scope:** `skills/engineering/execute/SKILL.md`
**Out of scope:** `skills/engineering/review/SKILL.md`, `skills/productivity/*`, templates.

## Steps

1. Inspect `skills/engineering/execute/SKILL.md` under `## Execute Each Unit`.
2. Under Step 3 ("Minimal Functional Implementation (Green)"), update the procedure:
   - "Before emitting code, re-read the unit's `<language_rules>` block positioned directly above the steps. Treat these rules as active hard invariants for code generation."
   - "Apply the Precedence Rule: If a written step in the unit artifact contradicts an applicable language rule (e.g. step asks for a loose array return, but the language rule mandates a typed DTO/Resource), the language rule strictly takes precedence. Implement the code conforming to the language rule and note the precedence override in the unit log."
3. In Step 6 ("Commit & Verification Logging"), instruct agents to log language rule compliance alongside test counts in the unit's Verification section.

## Verification

- Test type: Skill procedure inspection.
- Case: Confirm that `skills/engineering/execute/SKILL.md` mandates re-reading `<language_rules>` and enforces rule precedence over plan text.
- Command: `grep -n "Precedence Rule" skills/engineering/execute/SKILL.md` (PASS: line 49)
- Files modified: `skills/engineering/execute/SKILL.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert changes to `skills/engineering/execute/SKILL.md` with `git checkout skills/engineering/execute/SKILL.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-07
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
