---
title: "Phase 3: CLI Ergonomics, init Guided Scaffolding & Engine Unification"
type: phase
parent: "docs/tasks/2026/08/2026-08-28/0001-task-ide-bridging-and-sync-enhancements/README.md"
phase: "03"
status: completed
created: "2026-08-28"
tags: [task, phase, cli, init, ergonomics, unification, binary]
---

# Phase 3: CLI Ergonomics, init Guided Scaffolding & Engine Unification

## Objective

Introduce the user-friendly `context-cli init` command for interactive and flag-based scaffolding of new host projects, ensure global terminal execution via `npm link` / `bin` configuration, and unify `scripts/harness-cli.mjs` and `scripts/context.mjs` to delegate directly to modular `app/cli/commands/` handlers for clean single-source maintenance.

## Dependencies & Prerequisites

- Phase 1 & Phase 2 completed.

## Impacted Files & Components

- `app/cli/commands/init.mjs` (New): Interactive and flag-based initialization command for new projects.
- `app/cli/bin/context-cli.mjs` (Modified): Registered `init` command and updated help text.
- `app/cli/index.mjs` (Modified): Exported `handleInitCommand`.
- `scripts/harness-cli.mjs` (Modified): Refactored to delegate directly to `app/cli/commands/` handlers.
- `package.json` (Modified): Added `npm run init` script and verified `bin.context-cli`.

## Implementation Tasks

- [x] Task 3.1 — Create `app/cli/commands/init.mjs` with guided prompts for TTY interactive usage and non-interactive flag support.
- [x] Task 3.2 — Register `init` in `app/cli/bin/context-cli.mjs` and update help output and command dispatching.
- [x] Task 3.3 — Refactor `scripts/harness-cli.mjs` to delegate shared commands (`resolve`, `doctor`, `eval`, `lock`, `lint`, `validate`, `task`) to `app/cli/commands/` modules, eliminating duplicate code while retaining 100% backward compatibility for npm scripts.
- [x] Task 3.4 — Verify global CLI access via `npm link` in `context-factory` root.

## Verification & Testing

- Tested `context-cli init --target /tmp/test-init-app --ide antigravity --method linked --dry-run` (PASS).
- Tested command execution via `node scripts/context.mjs resolve "create user"` and `node scripts/context.mjs doctor` (PASS: verified clean delegation).
- `package.json` binary configuration verified for global linking.

## Risks & Rollback

- **Risk:** Refactoring `scripts/harness-cli.mjs` could impact existing npm scripts if arguments are parsed differently.
- **Mitigation:** Retained backward-compatible argument routing with verified delegation.
- **Rollback:** Revert modifications in `scripts/harness-cli.mjs` and `app/cli/bin/context-cli.mjs`.
