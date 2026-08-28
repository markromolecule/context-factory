---
title: "Phase 1: Antigravity .agents Scaffolding & Cross-Platform Symlink Generator"
type: phase
parent: "docs/tasks/2026/08/2026-08-28/0001-task-ide-bridging-and-sync-enhancements/README.md"
phase: "01"
status: completed
created: "2026-08-28"
tags: [task, phase, bridge, symlinks, antigravity, generator]
---

# Phase 1: Antigravity .agents Scaffolding & Cross-Platform Symlink Generator

## Objective

Enhance `app/cli/core/bridge-generator.mjs` and `app/cli/commands/bridge.mjs` to generate the `.agents/` directory in host repositories with relative symbolic links to Context Factory subdirectories (`skills`, `rules`, `agents`, `workflows`, `AGENTS.md`, `GEMINI.md`). Provide a resilient cross-platform symlink helper with Windows junction and copy fallbacks, support granular `--ide` profile targeting (`antigravity`, `cursor`, `windsurf`, `claude`, `copilot`, `all`), and record configured profiles in `.context-bridge.json`.

## Dependencies & Prerequisites

- Grilled Context Specification: `docs/context/cli/ide-bridging-and-sync-enhancements.md`
- Master Task Plan: `docs/tasks/2026/08/2026-08-28/0001-task-ide-bridging-and-sync-enhancements/README.md`

## Impacted Files & Components

- `app/cli/core/bridge-generator.mjs` (Modified): Implement symlink creation helper, `.agents` folder scaffolding, relative target path resolution for submodule vs linked modes, and `--ide` profile filtering.
- `app/cli/commands/bridge.mjs` (Modified): Add support for `--ide` flag, update CLI summary output to display created symlinks with status badges.

## Implementation Tasks

- [x] Task 1.1 — Create cross-platform symlink creation helper in `bridge-generator.mjs` supporting relative targets, directory vs file symlink types, and graceful fallback on non-symlink environments.
- [x] Task 1.2 — Add `.agents/` directory and symlink generation items (`.agents/skills`, `.agents/rules`, `.agents/agents`, `.agents/workflows`, `.agents/AGENTS.md`, `.agents/GEMINI.md`) pointing to computed relative factory paths.
- [x] Task 1.3 — Implement `--ide` profile filtering:
  - `antigravity`: Generates `.agents/` symlinks, `AGENTS.md`, `GEMINI.md`, `docs/tasks/`, `docs/decisions/`, `rules/`, `.context-bridge.json`.
  - `cursor`: Generates `.cursorrules`, `AGENTS.md`, `docs/tasks/`, `docs/decisions/`, `rules/`, `.context-bridge.json`.
  - `windsurf`: Generates `.windsurfrules`, `AGENTS.md`, `docs/tasks/`, `docs/decisions/`, `rules/`, `.context-bridge.json`.
  - `claude`: Generates `CLAUDE.md`, `AGENTS.md`, `docs/tasks/`, `docs/decisions/`, `rules/`, `.context-bridge.json`.
  - `copilot`: Generates `.github/copilot-instructions.md`, `AGENTS.md`, `docs/tasks/`, `docs/decisions/`, `rules/`, `.context-bridge.json`.
  - `all`: Generates all of the above.
- [x] Task 1.4 — Update `.context-bridge.json` schema to record `ides`, `symlinks`, and `integrationMethod`.
- [x] Task 1.5 — Update `app/cli/commands/bridge.mjs` CLI output table to display symlink targets and status (`created`, `up to date`, `skipped`).

## Verification & Testing

- Dry-run bridge generation verified:
  - `node app/cli/bin/context-cli.mjs bridge --target /tmp/test-bridge-app --ide antigravity --dry-run` (PASS)
- Live bridge generation verified:
  - `node app/cli/bin/context-cli.mjs bridge --target /tmp/test-actual-bridge --ide antigravity` (PASS)
  - Inspected symlinks in `/tmp/test-actual-bridge/.agents`: all 6 symlinks created and pointing to relative factory targets.
- Idempotency verified: re-running on existing bridged directory reported `skipped (up to date)` and `skipped (exists)` without errors.

## Risks & Rollback

- **Risk:** Windows filesystems without developer mode may fail on directory symlinks.
- **Mitigation:** Used `junction` type for Windows directory links with graceful try/catch copy fallback.
- **Rollback:** Revert modifications in `app/cli/core/bridge-generator.mjs` and `app/cli/commands/bridge.mjs`.
