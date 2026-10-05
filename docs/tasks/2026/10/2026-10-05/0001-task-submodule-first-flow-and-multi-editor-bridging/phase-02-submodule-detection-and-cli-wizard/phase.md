---
title: "Phase 2: Submodule Detection & CLI Wizard"
type: phase
parent: "0001-task-submodule-first-flow-and-multi-editor-bridging"
phase: "02"
phase_branch: "task/0001/phase-02/integration"
status: completed
created: "2026-10-05"
tags: [task, phase, cli, init, wizard, submodule, multi-select]
---

# Phase 2: Submodule Detection & CLI Wizard

## Objective

Equip `context-cli init` and `bridge` with intelligent environment detection (auto-targeting parent host repository when running from within `.context-factory`, offering hybrid assistant for `git submodule add`), installed IDE folder scanning, and an interactive numbered multi-select prompt for `[VS Code, Antigravity, Cursor, Trae, All IDEs]`.

## Dependencies & Prerequisites

- Phase 1 completed (`unit-01-trae-vscode-cursor-generator.md` merged).

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Submodule Environment Auto-Detection and Hybrid Assistant | `unit-01-submodule-auto-detection.md` | `task/0001/phase-02/unit-01-submodule-detection` | `.worktrees/0001/phase-02/unit-01-submodule-detection` | `01.01` | `none` | `merged` |
| **Unit 02.02** | Installed IDE Folder Scanner & Numbered Multi-Select Onboarding Menu | `unit-02-interactive-editor-wizard.md` | `task/0001/phase-02/unit-02-editor-wizard` | `.worktrees/0001/phase-02/unit-02-editor-wizard` | `02.01` | `none` | `merged` |

## Impacted Files & Components

- `app/cli/core/bridge-generator.mjs`:
  - `detectSubmoduleContext`: Helper to determine if target or CWD is a git submodule and identify host root.
  - `detectInstalledIdes`: Scanner for `.vscode/`, `.cursor/`, `.trae/`, `.agents/`.
- `app/cli/commands/init.mjs`:
  - Submodule hybrid prompt (auto-run `git submodule add` or print command).
  - Multi-select editor menu (`[1] VS Code, [2] Antigravity, [3] Cursor, [4] Trae, [5] All IDEs`).
- `app/cli/commands/bridge.mjs`:
  - Support `--ide vscode`, `--ide trae`, comma-separated flags, and updated summary tables.

## Implementation Tasks

- [x] Unit 02.01 — Implement submodule environment auto-detection and hybrid assistant in `bridge-generator.mjs` and `init.mjs`.
- [x] Unit 02.02 — Implement IDE directory scanner, interactive multi-select menu, and updated bridge CLI flags.

## Verification & Testing

- Interactive CLI unit tests with mock TTY streams.
- Dry-run verification: `node app/cli/bin/context-cli.mjs init --dry-run`.

## Risks, Worktree Teardown & Rollback

- **Risk:** Erroneous parent path resolution if invoked from deep arbitrary directories.
- **Mitigation:** Verify `.git` or `.gitmodules` marker before assuming parent directory is the host repo.
- **Teardown:** Prune `.worktrees/0001/phase-02/*` after phase integration merge.
