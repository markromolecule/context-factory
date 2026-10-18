---
title: "Unit 01.01: Empty and Remove Ephemeral Root Directories"
type: unit
parent: "phase-01-ephemeral-directory-removal"
unit: "01.01"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, unit, cleanup]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Empty and Remove Ephemeral Root Directories

> Phase: phase-01-ephemeral-directory-removal · Depends on: none · Parallelizable with: none  
> Task branch: refactor/PLN-0011-clean-ephemeral-dirs-and-conformance · Base commit: c7524e96a0e97bacdb848bdee05abd9203ef5e96

## Objective

Empty and remove `.agents/`, `.claude/`, and `.worktrees/` directories from the Context Factory root so that the workspace contains only canonical files and directories.

## Context packet

- `.worktrees/` contains 3 orphaned directories (`0001`, `0003`, `PLN-0004`) from past tasks; not active git worktrees.
- `.claude/` contains 12 tracked symlinks (`workflow-architecture-change` through `workflow-security-sensitive-change`).
- `.agents/` contains symlinks (`rules`, `agents`, `workflows`, `skills/*`) and `skills.json`.
- Serves Acceptance Criterion `AC-01`.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` exactly matches `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`.
- Working tree is clean.

## Scope

**In scope:**
- `.agents/`
- `.agents/skills.json`
- `.claude/`
- `.claude/skills/workflow-architecture-change`
- `.worktrees/`
- `docs/ARCHITECTURE.md`

**Out of scope:**
- Modifying canonical skills under `skills/`.
- Modifying `scripts/worktree.mjs` (retained for future on-demand agent worktree generation).

## Steps

1. Remove git tracking for `.claude`: `git rm -r .claude`.
2. Remove `.agents` directory: `rm -rf .agents`.
3. Remove `.worktrees` directory: `rm -rf .worktrees`.
4. Verify no remaining `.agents`, `.claude`, or `.worktrees` exist at root.

## Verification

- **Automated Tests:**
  - Test type: Architecture / hygiene check — asserts workspace is free of deprecated ephemeral and symlink directories.
  - Case: `git status --short` confirms `.claude` deletion and no untracked `.agents` or `.worktrees`.
  - Command: `git status --short`

## Rollback

- Restore `.claude`: `git checkout HEAD -- .claude`
- Re-run `npm run bridge` if `.agents` was needed.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01
- [ ] Executed on recorded task branch `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`
- [ ] Changes committed cleanly to task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] Verification command succeeds
