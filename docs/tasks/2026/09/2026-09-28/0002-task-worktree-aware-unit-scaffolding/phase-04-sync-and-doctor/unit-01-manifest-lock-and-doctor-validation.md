---
title: "Manifest Lock and Doctor Validation"
type: unit
parent: "phase-04-sync-and-doctor"
unit: "04.01"
branch: "task/0002/phase-04/unit-01-sync-and-doctor"
worktree: ".worktrees/0002/phase-04/unit-01-sync-and-doctor"
status: verified
created: "2026-09-28"
tags: [task, unit, sync, doctor, lock, manifest]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 04.01: Manifest Lock and Doctor Validation

> Phase: phase-04-sync-and-doctor · Depends on: 03.01 · Parallelizable with: none
> Worktree: .worktrees/0002/phase-04/unit-01-sync-and-doctor · Branch: task/0002/phase-04/unit-01-sync-and-doctor

## Objective

Synchronize the Context Factory manifest (`context-manifest.json`), regenerate `context-lock.json`, and run the comprehensive diagnostic suite via `node scripts/context.mjs doctor` to verify complete system health.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `context-manifest.json` tracks canonical factory files.
  - `context-lock.json` contains cryptographic sha256 digests.
- Acceptance Criteria Served:
  - `AC-05`: All test suites pass, manifest and lockfile are synchronized, and `doctor` reports 100% HEALTHY.
- Decisions Constraining Unit:
  - Doctor diagnostic must return exit code 0.

## Preconditions

- Phase 1, Phase 2, and Phase 3 completed and verified.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `context-manifest.json`, `context-lock.json`.
**Out of scope:** Modifying core CLI logic.

## Steps

1. If `evals/task-scaffold.test.mjs` was added, register it under `tools` or `evaluations` in `context-manifest.json` if needed.
2. Run `node scripts/context.mjs lock` to regenerate `context-lock.json`.
3. Run `node scripts/context.mjs doctor` and confirm:
   - Manifest & Syntax Lint: PASS
   - Lockfile Integrity: PASS
   - .agents Symlink Integrity: PASS
   - Evaluation Suite: PASS
4. Confirm `npm test` runs with 0 errors.

## Verification

- Test type(s):
  - Architecture & Health tests: Doctor diagnostic check.
- Commands: `node scripts/context.mjs doctor && npm test`
- Verification Evidence:
  - Command: `npm run sync` (PASS: manifest updated, 6 MOCs regenerated, lockfile generated)
  - Command: `npm test` (PASS: 22/22 evals passed in 87ms)
  - Command: `node --test tests/task-scaffold.test.mjs` (PASS: 4/4 passed in 87ms)
  - Command: `node --test evals/task-scaffold.test.mjs` (PASS: 3/3 passed in 306ms)
  - Command: `node scripts/context.mjs doctor` (PASS: 100% HEALTHY across all 4 diagnostic checks)
  - Pre-screening Review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert modifications to manifest and lockfile.

## Definition of done

- [x] Maps to acceptance criteria: AC-05
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
