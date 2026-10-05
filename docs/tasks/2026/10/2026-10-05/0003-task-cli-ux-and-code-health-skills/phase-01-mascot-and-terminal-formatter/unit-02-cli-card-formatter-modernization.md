---
title: "CLI Card Formatter & Help Modernization"
type: unit
parent: "0003/phase-01"
unit: "01.02"
branch: "task/0003/phase-01/cli-formatter-modernization"
worktree: ".worktrees/0003/phase-01/cli-formatter-modernization"
status: verified
created: "2026-10-05"
tags: [task, unit, cli, formatter, cards, ux]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: CLI Card Formatter & Help Modernization

> Phase: 0003/phase-01 · Depends on: 01.01 · Parallelizable with: none
> Worktree: .worktrees/0003/phase-01/cli-formatter-modernization · Branch: task/0003/phase-01/cli-formatter-modernization

## Objective

Modernize `app/cli/core/formatter.mjs` with card and category layout helpers, and update `app/cli/bin/context-cli.mjs` `showHelp()` to integrate the Octo-Agent mascot banner, categorized command cards with visual badges, and high-frequency quick-start guidance.

## Context packet

- Current state: `app/cli/bin/context-cli.mjs` prints a simple text list of commands in standard ANSI cyan.
- Acceptance criteria: AC-01, AC-02, AC-03.
- Decision ledger: D-01 in ADR 0028.
- Dependency output: `app/cli/core/mascot.mjs` (Unit 01.01).

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure native Node.js ESM with zero new third-party dependencies.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
- `rules/solid/single-responsibility.md`: Keep formatting primitives decoupled from CLI routing and command execution.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 01.01 merged into `task/0003/phase-01-integration`.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `app/cli/core/formatter.mjs`, `app/cli/bin/context-cli.mjs`.
**Out of scope:** Individual command handlers (`commands/*.mjs`), skills authoring.

## Steps

1. In `app/cli/core/formatter.mjs`:
   - Add `card(title, items, { badge, borderColor })` for rendering framed command cards.
   - Update `banner()` to integrate `renderMascot()` from `mascot.mjs` alongside version and title.
   - Add quick-start highlight box formatter `quickStartBox()`.
2. In `app/cli/bin/context-cli.mjs`:
   - Refactor `showHelp()` to group commands into distinct sections:
     - `📦 PROJECT BRIDGING & SETUP` (`init`, `bridge`, `pull`, `hook`)
     - `🛠️ CORE MAINTENANCE` (`doctor`, `sync`, `diff`, `lock`, `build`, `lint`, `eval`, `status`)
     - `🤖 AGENT ORCHESTRATION` (`resolve`, `run`, `task new`, `task list`, `validate`)
     - `⏱️ SESSION CHECKPOINTS (LHG)` (`session save`, `session resume`, `session status`, `session clear`)
   - Add a high-visibility `🚀 QUICK START` section showing recommended workflows (`init`, `doctor`, `sync`, `task new`).
3. Verify that running `node app/cli/bin/context-cli.mjs` outputs the new visual card design with the mascot.
4. Verify that running `node app/cli/bin/context-cli.mjs --no-color` outputs clean plain text without ANSI escape sequences.

## Verification

- Test type: Contract & CLI output test.
- Case 1: Run `node app/cli/bin/context-cli.mjs` and confirm the mascot, category cards, and quick-start block render properly (PASS: rendered side-by-side Octo-Agent banner, 4 category cards, and quick-start box).
- Case 2: Run `node app/cli/bin/context-cli.mjs --no-color` and confirm zero ANSI escape codes or garbled characters (PASS: clean plain-text box and structured text cards).
- Case 3: Run `node app/cli/bin/context-cli.mjs -h` and confirm consistent output (PASS).
- Files modified: `app/cli/bin/context-cli.mjs`, `app/cli/core/formatter.mjs`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert changes to `app/cli/core/formatter.mjs` and `app/cli/bin/context-cli.mjs` via `git checkout`.

## Definition of done

- [x] Maps to acceptance criteria: AC-01, AC-02, AC-03
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
