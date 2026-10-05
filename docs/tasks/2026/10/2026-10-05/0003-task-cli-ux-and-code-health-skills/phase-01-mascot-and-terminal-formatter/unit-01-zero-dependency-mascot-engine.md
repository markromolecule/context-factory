---
title: "Zero-Dependency Octo-Agent Mascot Engine"
type: unit
parent: "0003/phase-01"
unit: "01.01"
branch: "task/0003/phase-01/mascot-engine"
worktree: ".worktrees/0003/phase-01/mascot-engine"
status: verified
created: "2026-10-05"
tags: [task, unit, cli, mascot, terminal, ansi]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Zero-Dependency Octo-Agent Mascot Engine

> Phase: 0003/phase-01 · Depends on: none · Parallelizable with: none
> Worktree: .worktrees/0003/phase-01/mascot-engine · Branch: task/0003/phase-01/mascot-engine

## Objective

Implement a native zero-dependency Octo-Agent mascot module (`app/cli/core/mascot.mjs`) that renders the orange octopus wearing the backwards `>_` terminal cap using ANSI TrueColor half-blocks (`▀`/`▄`), with terminal capability detection and graceful `--no-color` fallback.

## Context packet

- Current state: `app/cli/core/formatter.mjs` has standard colors, badges, and a plain ASCII box `banner()`. No mascot rendering exists.
- Acceptance criteria: AC-01, AC-02.
- Decision ledger: D-01 in ADR 0028.
- User reference image: `media_1791164877566.png` (Orange octopus with blue/black cap with `>_` prompt).

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure native Node.js ESM with zero new third-party dependencies.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
- `rules/solid/single-responsibility.md`: Isolate mascot pixel/color data and rendering logic from general string formatting.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Dedicated git worktree and branch provisioned at declared path.
- Cut from `task/0003/phase-01-integration`.

## Scope

**In scope:** `app/cli/core/mascot.mjs`.
**Out of scope:** CLI help layout changes (covered in Unit 01.02), skills, or command handlers.

## Steps

1. Create `app/cli/core/mascot.mjs` exporting `renderMascot({ compact, width })` and `getMascotLines()`.
2. Encode the pixel color matrix for the Octo-Agent (orange body `#FF6B35`, dark cap `#1E293B`, white eyes `#FFFFFF`, pupil `#0F172A`, terminal badge cyan `#38BDF8`).
3. Implement ANSI TrueColor half-block renderer combining top pixel (foreground `\x1b[38;2;R;G;Bm`) and bottom pixel (background `\x1b[48;2;R;G;Bm`) using `▀`.
4. Implement automatic fallback: if stdout is not a TTY, `process.env.NO_COLOR` is present, or terminal columns < 60, return empty or compact text glyph (`🐙`).
5. Export helper `renderMascotWithHeader(title, subtitle)` to support side-by-side or stacked layout.
6. Verify rendering with direct Node script execution.

## Verification

- Test type: Contract & unit test via command execution.
- Case 1: Run `node -e 'import { renderMascot } from "./app/cli/core/mascot.mjs"; console.log(renderMascot());'` and verify ANSI half-block rendering (PASS: rendered 26x10 ANSI TrueColor half-blocks).
- Case 2: Run with `NO_COLOR=1` and verify clean suppression without ANSI escapes (PASS: clean plain-text fallback).
- Case 3: Verify zero external npm dependencies are required (PASS: pure native Node.js ESM).
- Files modified: `app/cli/core/mascot.mjs`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Delete `app/cli/core/mascot.mjs` and reset git worktree.

## Definition of done

- [x] Maps to acceptance criteria: AC-01, AC-02
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
