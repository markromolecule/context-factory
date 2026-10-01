---
title: "Automated E2E Suite, Evaluations, and Release"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
branch: "task/0001/phase-04/unit-01-evaluations-and-release"
worktree: ".worktrees/0001/phase-04/unit-01-evaluations-and-release"
status: verified
commit: "c9eeb92"
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
  - `node --test evals/session-checkpoint.test.mjs` (PASS: 6/6 passed)
  - `node scripts/context.mjs eval --unit` (PASS: 20/20 passed)
  - `node scripts/context.mjs doctor` (PASS: 100% HEALTHY)
- **Output:**
  ```text
  ▶ Session Checkpoint & LHG Minimal Input E2E Suite
    ✔ saveSessionState creates valid machine state and ultra-compact briefing (67.3ms)
    ✔ resumeSessionState restores saved state accurately (0.3ms)
    ✔ inspectSessionStatus returns active session entry (5.9ms)
    ✔ clearSessionState removes machine state and cleans resume briefing (1.0ms)
    ✔ resolveContext includes budget metrics and densityStatus (17.7ms)
    ✔ executes session:save, session:status, session:resume, session:clear via CLI (343.3ms)
  ✔ Session Checkpoint & LHG Minimal Input E2E Suite (437.2ms)
  ℹ tests 6, suites 4, pass 6, fail 0

  --- Context Factory Evaluation Suite [unit] ---
     SUITE PASSED  20/20 passed (128ms).

  ╔════════════════════════════════════════════════════════════════╗
    CONTEXT FACTORY DOCTOR DIAGNOSTIC  v3.14.0
  ╚════════════════════════════════════════════════════════════════╝
     HEALTHY  Context Factory is completely synchronized, valid, and healthy.
  ```

## Rollback

- Revert manifest, lockfile, documentation, and delete new evaluation files.

## Definition of done

- [x] Maps to acceptance criteria: AC-07
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`c9eeb92`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
