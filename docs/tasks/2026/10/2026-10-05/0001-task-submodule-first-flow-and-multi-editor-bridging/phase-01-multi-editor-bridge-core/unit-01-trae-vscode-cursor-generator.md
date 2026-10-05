---
title: "Trae, VS Code, and Cursor Generator Enhancements"
type: unit
parent: "phase-01-multi-editor-bridge-core"
unit: "01.01"
branch: "task/0001/phase-01/unit-01-bridge-core"
worktree: ".worktrees/0001/phase-01/unit-01-bridge-core"
status: planned
created: "2026-10-05"
tags: [task, unit, bridge, generator, trae, vscode, cursor]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Trae, VS Code, and Cursor Generator Enhancements

> Phase: phase-01-multi-editor-bridge-core · Depends on: none · Parallelizable with: none
> Worktree: .worktrees/0001/phase-01/unit-01-bridge-core · Branch: task/0001/phase-01/unit-01-bridge-core

## Objective

Enhance `generateBridge` in `app/cli/core/bridge-generator.mjs` to scaffold Trae project rules (`.trae/rules/project_rules.md`), VS Code configuration (`.github/copilot-instructions.md`, non-destructive `.vscode/settings.json`, `.vscode/extensions.json`), and modern Cursor rules (`.cursor/rules/context-factory.mdc`).

## Context packet

- Current bridge generator: `app/cli/core/bridge-generator.mjs` (`generateBridge`, `normalizeIdeProfiles`).
- Acceptance criteria: AC-01 (Trae, VS Code, Cursor generation), AC-02 (non-destructive JSON merge).
- Decision ledger: D-04 (Trae standard: `.trae/rules/project_rules.md`), D-05 (VS Code standard: Copilot instructions + `.vscode` settings/extensions), D-06 (modern Cursor `.mdc`).

## Preconditions

- Dedicated git worktree and branch provisioned at `.worktrees/0001/phase-01/unit-01-bridge-core`.

## Scope

- **In scope:**
  - `app/cli/core/bridge-generator.mjs`:
    - Extend `normalizeIdeProfiles` to recognize `vscode` and `trae`.
    - Include `vscode` and `trae` in `all` profile bundle.
    - Implement Trae rule file: `.trae/rules/project_rules.md`.
    - Implement VS Code files: `.github/copilot-instructions.md`, `.vscode/extensions.json`, and safe JSON merge for `.vscode/settings.json`.
    - Implement Cursor rules file: `.cursor/rules/context-factory.mdc` (`alwaysApply: true`) while keeping root `.cursorrules`.
- **Out of scope:**
  - CLI interactive prompts (handled in Phase 2).
  - Doctor diagnostics (handled in Phase 3).

## Steps

1. Update `normalizeIdeProfiles` in `app/cli/core/bridge-generator.mjs` to map `vscode` and `trae`.
2. Add helper function `mergeJsonFile(filePath, newProperties, dryRun)` that safely parses existing JSON or returns a formatted object.
3. In `generateBridge`, add file definitions for:
   - `trae`: `join(targetDir, ".trae", "rules", "project_rules.md")` referencing Context Factory's orchestrator contract and rules.
   - `vscode`: `join(targetDir, ".github", "copilot-instructions.md")`, `join(targetDir, ".vscode", "extensions.json")` (recommending Copilot, Cline, Roo Code), and `.vscode/settings.json` (setting file associations and agent defaults via `mergeJsonFile`).
   - `cursor`: `join(targetDir, ".cursor", "rules", "context-factory.mdc")` with YAML frontmatter `description: "Context Factory rules"`, `alwaysApply: true`.
4. Update `.context-bridge.json` generation to record `ides` including `trae` and `vscode`.
5. Run unit tests to verify file generation and merge behavior.

## Verification

- Test type: **Unit tests** — verifies file content formatting, profile normalization, and safe JSON property merging without clobbering existing settings.
- Cases:
  - `normalizeIdeProfiles(["vscode", "trae"])` returns `['vscode', 'trae']`.
  - `generateBridge` with `--ide trae` creates `.trae/rules/project_rules.md`.
  - `generateBridge` with `--ide vscode` merges `.vscode/settings.json` preserving pre-existing keys.
  - `generateBridge` with `--ide cursor` creates both `.cursorrules` and `.cursor/rules/context-factory.mdc`.
- Command: `node --test tests/bridge-generator.test.mjs`

## Rollback

Revert modifications to `app/cli/core/bridge-generator.mjs`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01, AC-02
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
