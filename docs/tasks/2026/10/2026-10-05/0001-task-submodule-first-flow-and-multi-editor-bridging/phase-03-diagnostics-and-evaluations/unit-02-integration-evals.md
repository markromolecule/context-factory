---
title: "Automated Integration Evaluations for Multi-Editor Bridging"
type: unit
parent: "phase-03-diagnostics-and-evaluations"
unit: "03.02"
branch: "task/0001/phase-03/unit-02-integration-evals"
worktree: ".worktrees/0001/phase-03/unit-02-integration-evals"
status: verified
created: "2026-10-05"
tags: [task, unit, evals, tests, integration, verification]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: Automated Integration Evaluations for Multi-Editor Bridging

> Phase: phase-03-diagnostics-and-evaluations · Depends on: 03.01 · Parallelizable with: none
> Worktree: .worktrees/0001/phase-03/unit-02-integration-evals · Branch: task/0001/phase-03/unit-02-integration-evals

## Objective

Author automated evaluation cases and unit test suites covering the end-to-end multi-editor bridging lifecycle: single-editor bridging, multi-editor bridging (`vscode` + `trae` + `cursor`), non-destructive `.vscode/settings.json` merging, and doctor self-healing.

## Context packet

- Evaluation suite location: `evals/cases/` and `tests/`.
- Acceptance criteria: AC-01, AC-02, AC-03, AC-04, AC-05.
- Existing tests: `evals/task-scaffold.test.mjs`, `evals/cases/`.

## Preconditions

- Unit 03.01 completed and merged into `task/0001/phase-03/integration`.
- Dedicated git worktree and branch provisioned at `.worktrees/0001/phase-03/unit-02-integration-evals`.

## Scope

- **In scope:**
  - Create `tests/bridge-multi-editor.test.mjs` verifying:
    - Scaffolding of `.trae/rules/project_rules.md`.
    - Scaffolding of `.github/copilot-instructions.md`, `.vscode/extensions.json`, and `.vscode/settings.json`.
    - Merging behavior when `.vscode/settings.json` already contains custom user properties.
    - Scaffolding of modern `.cursor/rules/context-factory.mdc` alongside `.cursorrules`.
    - Submodule path auto-detection.
  - Create evaluation dataset entry in `evals/cases/` or `evals/` if applicable.
- **Out of scope:**
  - Updating general documentation files (handled in Phase 4).

## Steps

1. Create temporary directory scaffolding utility in `tests/bridge-multi-editor.test.mjs`.
2. Write test for Trae bridge file generation and contents.
3. Write test for VS Code bridge generation and safe JSON merging.
4. Write test for Cursor modern rule generation.
5. Write test for combined multi-select (`--ide vscode,trae,cursor`).
6. Run `node --test tests/bridge-multi-editor.test.mjs` and ensure 100% assertions pass.

## Verification

- Test type: **Integration tests** — end-to-end execution of bridging commands against isolated temporary test directories.
- Cases:
  - Multi-editor flag generates all expected files without error.
  - Pre-existing settings in `.vscode/settings.json` (`editor.fontSize`, `workbench.colorTheme`) are completely preserved after bridge run.
- Command: `node --test tests/bridge-multi-editor.test.mjs`
- Result: **PASS** (4/4 tests passed in 366ms). Commit: `dea864c`.

## Rollback

Remove test file `tests/bridge-multi-editor.test.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-01, AC-02, AC-05
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`dea864c`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes (4/4 integration tests, 32/32 tests, 23/23 evaluations)
