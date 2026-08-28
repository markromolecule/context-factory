---
title: "Phase 3 — Package Manager Detection & Git Hook CLI"
type: phase
parent: "0001-task-synchronization-and-package-manager-modernization"
phase: "03"
status: completed
created: "2026-08-29"
tags: [task, phase, pnpm, package-manager, cli, git-hook]
---

# Phase 3 — Package Manager Detection & Git Hook CLI

## Objective

Enhance `context-cli bridge`, `init`, and `app/cli/core/bridge-generator.mjs` to auto-detect target repository package managers (`pnpm`, `yarn`, `bun`, `npm`) via lockfile detection and inject tailored scripts. Add `context-cli hook install` (`app/cli/commands/hook.mjs`) to install a zero-dependency `.git/hooks/pre-commit` health check.

## Dependencies & Prerequisites

- Phase 2 completed.
- Existing `bridge-generator.mjs` and `init.mjs`.

## Impacted Files & Components

- [app/cli/core/bridge-generator.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/core/bridge-generator.mjs) — Add package manager detection and dynamic script formatting.
- [app/cli/commands/init.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/commands/init.mjs) — Add package manager option / prompt in interactive wizard.
- [app/cli/commands/bridge.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/commands/bridge.mjs) — Support `--pm` flag in bridge CLI.
- [app/cli/commands/hook.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/commands/hook.mjs) — New command handler for git hook installation.
- [app/cli/bin/context-cli.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/bin/context-cli.mjs) — Register `hook` command and update help text.
- [package.json](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/package.json) — Add `"hook:install"` script.

## Implementation Tasks

- [x] Task 3.1 — Implement `detectPackageManager(targetDir)` in `app/cli/core/bridge-generator.mjs` probing for `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, and `package-lock.json`.
- [x] Task 3.2 — Update script generator in `bridge-generator.mjs` to format `"context:update"` using the detected or specified package manager (`pnpm run context:doctor`, etc.).
- [x] Task 3.3 — Implement `app/cli/commands/hook.mjs` (`handleHookCommand`) to install executable `.git/hooks/pre-commit` hook.
- [x] Task 3.4 — Register `hook` in `app/cli/bin/context-cli.mjs` and add `"hook:install"` to `package.json`.

## Verification & Testing

- `node app/cli/bin/context-cli.mjs hook install --dry-run`: Verified pre-commit hook generation and permissions in dry-run mode.
- `node app/cli/bin/context-cli.mjs hook install`: Installed live `.git/hooks/pre-commit` pre-commit guardrail.
- `pnpm run doctor`:
  - Manifest & Syntax Lint: PASS (35 rules, 10 skills, 11 workflows verified)
  - Lockfile Integrity: PASS
  - .agents Symlink Integrity: PASS (6/6 healthy)
  - Evaluation Suite: PASS (19/19 passed in 58ms)

## Risks & Rollback

- **Risk:** Existing bridges in host repositories may have custom package.json scripts.
- **Mitigation:** Existing scripts are preserved unless `--force` is provided.
- **Rollback:** Delete `.git/hooks/pre-commit` if hook installation needs removal.


