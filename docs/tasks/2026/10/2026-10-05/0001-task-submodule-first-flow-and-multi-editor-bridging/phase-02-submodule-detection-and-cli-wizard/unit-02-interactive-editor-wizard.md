---
title: "Installed IDE Folder Scanner & Numbered Multi-Select Onboarding Menu"
type: unit
parent: "phase-02-submodule-detection-and-cli-wizard"
unit: "02.02"
branch: "task/0001/phase-02/unit-02-editor-wizard"
worktree: ".worktrees/0001/phase-02/unit-02-editor-wizard"
status: verified
created: "2026-10-05"
tags: [task, unit, cli, init, wizard, multi-select, ide]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 02.02: Installed IDE Folder Scanner & Numbered Multi-Select Onboarding Menu

> Phase: phase-02-submodule-detection-and-cli-wizard · Depends on: 02.01 · Parallelizable with: none
> Worktree: .worktrees/0001/phase-02/unit-02-editor-wizard · Branch: task/0001/phase-02/unit-02-editor-wizard

## Objective

Build the smart IDE scanner and interactive numbered multi-select prompt `[1] VS Code, [2] Antigravity, [3] Cursor, [4] Trae, [5] All IDEs` in `app/cli/commands/init.mjs`, supporting comma-separated inputs (e.g., `1, 4`) and updating `bridge.mjs` flags.

## Context packet

- Current `init.mjs` IDE prompt: lines 52-69 currently only list `1) All IDEs, 2) Antigravity, 3) Cursor, 4) Claude Code`.
- Current `bridge.mjs`: parses `--ide` flag.
- Acceptance criteria: AC-04 (scanner, numbered menu, comma-separated choices).
- Decision ledger: D-03 (multi-select with smart detection).

## Preconditions

- Unit 02.01 completed and merged into `task/0001/phase-02/integration`.
- Dedicated git worktree and branch provisioned at `.worktrees/0001/phase-02/unit-02-editor-wizard`.

## Scope

- **In scope:**
  - `app/cli/core/bridge-generator.mjs`:
    - Add `detectInstalledIdes(targetDir)`: checks for existence of `.vscode/`, `.cursor/`, `.trae/`, `.agents/`, returning array of detected editor names.
  - `app/cli/commands/init.mjs`:
    - Display detected editor environments in wizard.
    - Render updated menu:
      `[1] VS Code        (Copilot instructions, .vscode settings & extensions, AGENTS.md)`
      `[2] Antigravity    (.agents/ live symlinks, AGENTS.md, GEMINI.md)`
      `[3] Cursor         (.cursor/rules/context-factory.mdc, .cursorrules, AGENTS.md)`
      `[4] Trae           (.trae/rules/project_rules.md, AGENTS.md)`
      `[5] All IDEs       (Bridge for all team editors)`
    - Parse user input supporting single digits (`1`), multiple comma/space separated digits (`1, 4` or `1 3`), or names (`vscode,trae`).
  - `app/cli/commands/bridge.mjs`:
    - Ensure `--ide vscode`, `--ide trae`, and comma-separated lists are passed smoothly to `generateBridge`.
    - Update completion message table and next-steps guidance to reference selected editors.
- **Out of scope:**
  - Doctor diagnostics (handled in Phase 3).

## Steps

1. In `app/cli/core/bridge-generator.mjs`, implement `detectInstalledIdes(targetDir)`.
2. In `app/cli/commands/init.mjs`, call `detectInstalledIdes(target)` and display detected badges.
3. Replace the legacy IDE prompt in `init.mjs` with the numbered menu `[1] VS Code, [2] Antigravity, [3] Cursor, [4] Trae, [5] All IDEs`.
4. Implement input parser mapping tokens (`1` -> `vscode`, `2` -> `antigravity`, `3` -> `cursor`, `4` -> `trae`, `5` -> `all`).
5. Update `app/cli/commands/bridge.mjs` to format output for all 4 editor artifacts.
6. Verify via mock readline tests.

## Verification

- Test type: **Unit tests & CLI tests** — verifies option parsing and TTY input handling.
- Cases:
  - Input `"1, 4"` returns `['vscode', 'trae']`.
  - Input `"5"` returns `['all']`.
  - Empty input defaults to detected editors, or `all` if none detected.
  - Target containing `.vscode` and `.cursor` is detected accurately.
- Command: `node --test tests/editor-wizard.test.mjs`
- Result: **PASS** (2/2 unit tests passed in 3.8ms). Commit: `5e34e02`.

## Rollback

Revert modifications to `app/cli/commands/init.mjs` and `app/cli/commands/bridge.mjs`.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`5e34e02`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes (2/2 unit tests, 23/23 evaluations)
