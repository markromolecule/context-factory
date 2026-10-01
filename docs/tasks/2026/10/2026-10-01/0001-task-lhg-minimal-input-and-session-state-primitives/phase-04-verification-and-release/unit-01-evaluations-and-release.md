---
title: "Automated E2E Suite, Evaluations, and Release"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
branch: "task/0001/phase-04/unit-01-evaluations-and-release"
worktree: ".worktrees/0001/phase-04/unit-01-evaluations-and-release"
status: planned
created: "2026-10-01"
tags: [task, unit, evals, doctor, release]
depends_on: ["03.01", "03.02"]
parallelizable_with: []
---

# Unit 04.01: Automated E2E Suite, Evaluations, and Release

> Phase: phase-04-verification-and-release · Depends on: 03.01, 03.02 · Parallelizable with: none  
> Worktree: .worktrees/0001/phase-04/unit-01-evaluations-and-release · Branch: task/0001/phase-04/unit-01-evaluations-and-release

## Objective

Create the end-to-end automated lifecycle test suite (`evals/session-checkpoint.test.mjs`), add the evaluation case (`evals/cases/session-management.json`), update documentation indexes (`docs/ARCHITECTURE.md`, `docs/Skills.md`), update `context-manifest.json`, regenerate `context-lock.json`, and verify healthy release status via `doctor`.

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Existing E2E Tests:** `evals/plan-check.test.mjs`, `evals/task-scaffold.test.mjs`
- **Acceptance Criteria:** AC-07

## Preconditions

- Phase 3 units completed and merged.
- Worktree provisioned at declared path.

## Scope

**In scope:**
- `evals/session-checkpoint.test.mjs`
- `evals/cases/session-management.json`
- `docs/ARCHITECTURE.md`
- `docs/Skills.md`
- `context-manifest.json`
- `context-lock.json`

**Out of scope:**
- Core engine or CLI command changes.

## Steps

1. Author `evals/session-checkpoint.test.mjs` covering:
   - Saving a session and asserting `.context/sessions/<id>.json` schema validity.
   - Asserting `.tmp/SESSION_RESUME.md` token length is <1,500 tokens.
   - Resuming session and reading back active task and git branch state.
   - Querying session status and clearing session.
   - Testing budget fence warning in `resolveContext`.
2. Author `evals/cases/session-management.json` asserting slash command `/session` resolves `skills/productivity/session/SKILL.md`.
3. Update `docs/ARCHITECTURE.md` and `docs/Skills.md` to document LHG minimal input and session state primitives.
4. Update `context-manifest.json` and regenerate `context-lock.json`.
5. Run `node scripts/context.mjs doctor` to verify 100% green diagnostics.

## Verification

- **Test Type:** Integration & E2E test — runs all test cases and doctor diagnostic.
- **Commands:**
  - `node evals/session-checkpoint.test.mjs`
  - `node scripts/context.mjs eval --unit`
  - `node scripts/context.mjs doctor`

## Rollback

- Revert manifest, lockfile, documentation, and delete new evaluation files.

## Definition of done

- [ ] Maps to acceptance criteria: AC-07
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
