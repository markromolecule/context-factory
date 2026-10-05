---
title: "Context Skill Language Resolution"
type: unit
parent: "0002/phase-02"
unit: "02.01"
branch: "task/0002/phase-02/context-skill-resolution"
worktree: ".worktrees/0002/phase-02/context-skill-resolution"
status: verified
created: "2026-10-05"
tags: [task, unit, context, skills]
depends_on: []
parallelizable_with: ["02.02", "02.03"]
---

# Unit 02.01: Context Skill Language Resolution

> Phase: 0002/phase-02 · Depends on: none · Parallelizable with: 02.02, 02.03
> Worktree: .worktrees/0002/phase-02/context-skill-resolution · Branch: task/0002/phase-02/context-skill-resolution

## Objective

Update `skills/productivity/context/SKILL.md` to instruct agents during context formulation to resolve the project's active language stack (`node scripts/context.mjs resolve ...`) and explicitly document applicable language rules in the context specification.

## Context packet

- Current state: `skills/productivity/context/SKILL.md` covers embedded grilling, user stories, technical context (affected layers), but does not mandate resolving or pinning the active language stack rules.
- Acceptance criteria: AC-04.
- Decision ledger: D-01 in ADR 0027.

<language_rules>
- `rules/global/code-quality.md`: Keep skill instructions concise, actionable, and imperatively phrased.
- `rules/global/evidence-and-claims.md`: Ensure step references correspond to actual CLI commands and template headers.
</language_rules>

## Preconditions

- Phase 1 merged into `task/0002-language-rule-lifecycle-binding`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-02/context-skill-resolution`.

## Scope

**In scope:** `skills/productivity/context/SKILL.md`
**Out of scope:** `skills/productivity/plan/SKILL.md`, `skills/productivity/plan-review/SKILL.md`, templates.

## Steps

1. Inspect `skills/productivity/context/SKILL.md` under `### 3. Structure & Document Context Sections`.
2. Under Technical & Architectural Context, add:
   - `- **Language Stack & Rules:** Identify the active technology stack (via \`node scripts/context.mjs resolve "<task description>"\` or \`.context-bridge.json\`) and record the specific rule files and key constraints that govern this feature.`
3. Under `### 4. Quality Audit & Readiness Gate`, add readiness checkpoint:
   - `- Applicable language stack rules are identified and key constraints recorded.`

## Verification

- Test type: Skill procedure inspection.
- Case: Verify that `skills/productivity/context/SKILL.md` contains the language stack resolution directives.
- Command: `grep -n "Language Stack & Rules" skills/productivity/context/SKILL.md` (PASS: line 49)
- Files modified: `skills/productivity/context/SKILL.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert changes to `skills/productivity/context/SKILL.md` with `git checkout skills/productivity/context/SKILL.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
