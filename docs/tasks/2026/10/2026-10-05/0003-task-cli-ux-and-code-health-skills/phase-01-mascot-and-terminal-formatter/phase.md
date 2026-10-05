---
title: "Phase 1 — Mascot Graphic Engine & Terminal Formatter"
type: phase
parent: "0003"
phase: "01"
phase_branch: "task/0003/phase-01-integration"
status: planned
created: "2026-10-05"
tags: [task, phase, cli, mascot, terminal, formatter]
---

# Phase 1 — Mascot Graphic Engine & Terminal Formatter

## Objective

Build a native zero-dependency Octo-Agent mascot rendering engine using ANSI TrueColor half-blocks (`▀`/`▄`), and modernize the Context Factory CLI formatter and help interface with categorized cards, badges, and quick-start recipes.

## Dependencies & Prerequisites

- Target base branch `master` clean and synchronized.
- ADR 0028 accepted.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Zero-Dependency Octo-Agent Mascot Engine | `unit-01-zero-dependency-mascot-engine.md` | `task/0003/phase-01/mascot-engine` | `.worktrees/0003/phase-01/mascot-engine` | `none` | `none` | `planned` |
| **Unit 01.02** | CLI Card Formatter & Help Modernization | `unit-02-cli-card-formatter-modernization.md` | `task/0003/phase-01/cli-formatter-modernization` | `.worktrees/0003/phase-01/cli-formatter-modernization` | `Unit 01.01` | `none` | `planned` |

## Impacted Files & Components

- `app/cli/core/mascot.mjs`: New module delivering the ANSI half-block Octo-Agent graphic, color matrix, and capability detection.
- `app/cli/core/formatter.mjs`: Add `card()`, `categoryBadge()`, enhanced `banner()` integrating the mascot, and styled example formatters.
- `app/cli/bin/context-cli.mjs`: Update `showHelp()` to render structured category cards and quick-start sections.

## Implementation Tasks

- [ ] Unit 01.01 — Implement `app/cli/core/mascot.mjs` with ANSI half-block TrueColor mascot and terminal capability detection.
- [ ] Unit 01.02 — Modernize `app/cli/core/formatter.mjs` and `app/cli/bin/context-cli.mjs` with card layouts and categorized command help.

## Verification & Testing

- `node app/cli/bin/context-cli.mjs` (Verify colored mascot and structured cards appear).
- `node app/cli/bin/context-cli.mjs --no-color` (Verify plain text fallback with zero ANSI escape artifacts).
- Terminal width checks (< 60 cols).

## Risks, Worktree Teardown & Rollback

- Risk: ANSI escape sequences breaking in non-TTY or narrow terminals.
  - Mitigation: Capability check inside `mascot.mjs` suppresses half-blocks when `NO_COLOR`, non-TTY, or width < 60 columns.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
