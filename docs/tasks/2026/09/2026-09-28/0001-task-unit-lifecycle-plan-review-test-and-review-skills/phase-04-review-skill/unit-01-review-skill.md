---
title: "Author review Skill"
type: unit
parent: "phase-04-review-skill"
unit: "04.01"
status: verified
created: "2026-09-28"
tags: [task, unit, skill, review, diff, scope-fence, solid]
depends_on: []
parallelizable_with: ["01.01", "01.02", "01.03", "02.01", "03.01"]
---

# Unit 04.01: Author review Skill

> Phase: phase-04-review-skill · Depends on: none · Parallelizable with: 01.01, 01.02, 01.03, 02.01, 03.01

## Objective

Author `skills/engineering/review/SKILL.md` and its agent interface YAML, establishing the independent white-box diff review procedure that screens unit worktrees for out-of-scope edits, missing tests, SOLID violations, and incomplete Definitions of Done before developer checkpoints.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `skills/engineering/verify/SKILL.md` performs black-box acceptance and release auditing, but does not enforce intra-worktree file scope fences or pre-screen diffs for developer checkpoints.
  - Unit artifacts (`docs/templates/Unit.md`) declare `In scope`, `Out of scope`, and `Definition of done`.
- Acceptance Criteria Served:
  - `AC-04`: `skills/engineering/review/SKILL.md` conducts independent diff reviews checking scope fences, missing tests, SOLID principles, and Definition of Done.
- Decisions Constraining Unit:
  - `D-01`: Dedicated `review` skill distinct from `verify`. Must output pre-screened diff findings before the developer checkpoint in `execute`.

## Preconditions

None (independent skill authoring).

## Scope

**In scope:** `skills/engineering/review/SKILL.md`, `skills/engineering/review/agents/openai.yaml`, `skills/engineering/README.md`.
**Out of scope:** Modifying `verify` skill.

## Steps

1. Create directory `skills/engineering/review/` and `skills/engineering/review/agents/`.
2. Author `skills/engineering/review/SKILL.md`:
   - Frontmatter: `name: review`, `description: Independent diff review of a unit worktree against its unit file to check for out-of-scope file edits, missing tests, SOLID violations, and unmet definitions of done before developer checkpoints (/review, [REVIEW]).`
   - Gate 1 (Scope Fence): Compare `git diff --name-only` against `In scope`. Flag any unlisted file as a scope boundary violation.
   - Gate 2 (Test Completeness): Verify every test type and case in unit's `Verification` section exists and passes.
   - Gate 3 (SOLID Audit): Audit newly introduced classes against `rules/solid/` (Single Responsibility, Open/Closed, Dependency Inversion).
   - Gate 4 (Definition of Done): Audit completion claims against actual git diff and test output.
   - Output: Pre-Screening Review Report (Ready for Developer Review / Remediation Required).
3. Author `skills/engineering/review/agents/openai.yaml`:
   - `display_name: "Unit Diff Review"`
   - `short_description: "Audit unit worktree diffs for scope leaks and SOLID rules"`
   - `default_prompt: "Use $review to audit the active unit worktree diff against its unit file."`
4. Update `skills/engineering/README.md` to link `review/SKILL.md`.

## Verification

- Test type(s):
  - Contract / Interface tests: Verifies frontmatter schema, folder name match, 25-64 char short_description, and engineering group README link using `node scripts/context.mjs lint`.
- Cases:
  - Frontmatter name and description format valid.
  - `openai.yaml` length within 25-64 chars.
  - Engineering group index link valid.
- Commands: `node scripts/context.mjs lint`
- Evidence: `node scripts/context.mjs lint` passed with 0 errors. `node scripts/context.mjs doctor` passed with 100% HEALTHY (15 skills, 21 symlinks, 22 evaluations).

## Rollback

Delete `skills/engineering/review/` and revert `skills/engineering/README.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Skill document contains concrete audit steps for scope fence, missing tests, SOLID, and DoD
- [x] Agent interface YAML valid with zero lint errors
- [x] All listed verification passes
