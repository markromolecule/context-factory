---
title: "Context, Task, and Unit Templates Modernization"
type: unit
parent: "0002/phase-01"
unit: "01.02"
branch: "task/0002/phase-01/templates-modernization"
worktree: ".worktrees/0002/phase-01/templates-modernization"
status: verified
created: "2026-10-05"
tags: [task, unit, templates, scaffolding]
depends_on: []
parallelizable_with: ["01.01"]
---

# Unit 01.02: Context, Task, and Unit Templates Modernization

> Phase: 0002/phase-01 · Depends on: none · Parallelizable with: 01.01
> Worktree: .worktrees/0002/phase-01/templates-modernization · Branch: task/0002/phase-01/templates-modernization

## Objective

Modernize `docs/templates/Context.md`, `docs/templates/Task.md`, and `docs/templates/Unit.md` by embedding standardized `<language_rules>` blocks, language stack sections, and checkable directive prompts.

## Context packet

- Current state:
  - `docs/templates/Context.md` has Section 3 (Technical & Architectural Context) without explicit language stack & rules declaration.
  - `docs/templates/Task.md` has Pre-planning record without stack rules binding.
  - `docs/templates/Unit.md` has `## Context packet` with raw text bullets, missing `<language_rules>` tags and precedence notes.
- Acceptance criteria: AC-02, AC-03.
- Decision ledger: D-02, D-04, D-06 in ADR 0027.

<language_rules>
- `rules/global/naming-conventions.md`: Maintain consistent markdown heading and XML tag naming.
- `rules/global/code-quality.md`: Ensure templates remain clear, concise, and non-redundant.
</language_rules>

## Preconditions

- Dedicated git worktree provisioned at `.worktrees/0002/phase-01/templates-modernization`.
- Clean branch cut from `task/0002/phase-01`.

## Scope

**In scope:** `docs/templates/Context.md`, `docs/templates/Task.md`, `docs/templates/Unit.md`
**Out of scope:** `orchestrator/SHARED.md`, skill files, scripts.

## Steps

1. Update `docs/templates/Context.md`:
   - Under `## 3. Technical & Architectural Context`, add a dedicated subsection:
     - `**Language Stack & Rules:** Active project stack (e.g. \`typescript\`, \`laravel\`) and resolved rule set (e.g. \`rules/typescript/*\`).`
2. Update `docs/templates/Task.md`:
   - Under `## Pre-planning record`, add a `### Language stack and applicable rules` subsection.
3. Update `docs/templates/Unit.md`:
   - In `## Context packet`, add a standard `<language_rules>` block at the very end of the packet, immediately preceding `## Preconditions` / `## Steps`:
     ```markdown
     <language_rules>
     - Rule 1: Concrete checkable directive (e.g., "no implicit any", "FormRequest validation required")
     - Rule 2: Concrete checkable directive
     </language_rules>
     ```
   - Add a note: *Precedence invariant: If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.*

## Verification

- Test type: Template inspection & linting.
- Case: Ensure all three templates contain the new sections and `<language_rules>` XML tags without markdown syntax errors.
- Command: `npm run lint` (PASS)
- Files modified: `docs/templates/Context.md`, `docs/templates/Task.md`, `docs/templates/Unit.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert modifications to `docs/templates/Context.md`, `docs/templates/Task.md`, and `docs/templates/Unit.md` with `git checkout docs/templates/`.

## Definition of done

- [x] Maps to acceptance criteria: AC-02, AC-03
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
