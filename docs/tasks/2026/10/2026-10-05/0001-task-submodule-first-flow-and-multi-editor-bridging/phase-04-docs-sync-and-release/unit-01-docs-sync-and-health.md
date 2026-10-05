---
title: "Documentation, Factory Sync & Release Validation"
type: unit
parent: "phase-04-docs-sync-and-release"
unit: "04.01"
branch: "task/0001/phase-04/unit-01-docs-sync-release"
worktree: ".worktrees/0001/phase-04/unit-01-docs-sync-release"
status: verified
created: "2026-10-05"
tags: [task, unit, docs, sync, release, validation]
depends_on: ["03.02"]
parallelizable_with: []
---

# Unit 04.01: Documentation, Factory Sync & Release Validation

> Phase: phase-04-docs-sync-and-release · Depends on: 03.02 · Parallelizable with: none
> Worktree: .worktrees/0001/phase-04/unit-01-docs-sync-release · Branch: task/0001/phase-04/unit-01-docs-sync-release

## Objective

Update Context Factory documentation to document the 3-step submodule onboarding flow and multi-editor bridging for VS Code, Antigravity, Cursor, and Trae, run `context-cli sync`, and confirm 100% HEALTHY diagnostics in `doctor`.

## Context packet

- Current docs: `app/cli/README.md`, `README.md`, `docs/guide/cross-workspace-integration.md`.
- Acceptance criteria: AC-06.
- Synchronizer: `app/cli/bin/context-cli.mjs sync`, `scripts/validate-context.mjs`.

## Preconditions

- Unit 03.02 completed and merged into `task/0001/phase-04/integration`.
- Dedicated git worktree and branch provisioned at `.worktrees/0001/phase-04/unit-01-docs-sync-release`.

## Scope

- **In scope:**
  - `app/cli/README.md`: Document the 3-step onboarding flow (`git submodule add`, `context-cli init`, editor selection) and new flags `--ide vscode`, `--ide trae`.
  - `docs/guide/cross-workspace-integration.md`: Add sections for Trae and VS Code bridging.
  - `README.md`: Highlight native multi-editor support for VS Code, Antigravity, Cursor, and Trae.
  - `context-manifest.json` and `context-lock.json`: Synchronize via `context-cli sync`.
- **Out of scope:**
  - Writing code in `bridge-generator.mjs` or `init.mjs` (handled in earlier phases).

## Steps

1. Update `app/cli/README.md` with the new interactive onboarding walkthrough and editor flags.
2. Update `docs/guide/cross-workspace-integration.md` with Trae and VS Code configuration examples.
3. Update `README.md` editor compatibility list.
4. Execute `node app/cli/bin/context-cli.mjs sync`.
5. Execute `node app/cli/bin/context-cli.mjs doctor` to verify 100% HEALTHY state.
6. Commit changes to unit branch.

## Verification

- Test type: **Architecture tests & Lint** — verifies lockfile currency, manifest completeness, and symlink integrity.
- Cases:
  - `node scripts/context.mjs doctor` passes with 0 failures.
  - `npm test` passes all evaluations.
- Command: `node scripts/context.mjs doctor && npm test`
- Result: **PASS** (100% HEALTHY diagnostics, 32/32 tests, 23/23 evals passed). Commit: `e97d18d`.

## Rollback

Revert documentation changes and re-run `context-cli sync`.

## Definition of done

- [x] Maps to acceptance criteria: AC-06
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`e97d18d`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
