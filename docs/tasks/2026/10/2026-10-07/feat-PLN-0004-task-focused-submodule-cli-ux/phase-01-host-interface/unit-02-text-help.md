---
title: "Text-first help and output"
type: unit
parent: "phase-01-host-interface"
unit: "01.02"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p01-text-help"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-01/text-help"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: []
parallelizable_with: ["01.01"]
---

# Unit 01.02: Text-first help and output

> Phase: 01-host-interface · Depends on: none · Parallelizable with: 01.01
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p01-text-help` · Worktree: `.worktrees/PLN-0004/phase-01/text-help`

## Objective

Replace the mascot-heavy first screen with a compact text hierarchy that exposes setup and quality commands accessibly.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** `showHelp()` in `app/cli/bin/context-cli.mjs` renders a banner, five-step card, wide tables, and emoji categories; it dispatches `preflight`/`conform` but omits them from the catalog. `core/formatter.mjs` owns wide box/card functions.
- **Acceptance criteria:** AC-05.
- **Binding decision:** ADR 0032 supersedes ADR 0028 only for mascot/default presentation. Keep detailed command help and existing aliases.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.solid.srp-single-actor-boundary][mode:evidence-blocking] rules/solid/single-responsibility.md sourceHash:sha256:e55efdc0a22162771f1a48e1ad4133da68843da3ce9535cadbf111f20a9ba90f
</language_rules>

**Rule-satisfaction mapping:** Record real output/exit codes; keep formatting separate from dispatch and domain decisions. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p01-text-help` at the correct task/phase base in `.worktrees/PLN-0004/phase-01/text-help` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `app/cli/bin/context-cli.mjs`
- `app/cli/core/formatter.mjs`
- `app/cli/core/mascot.mjs`
- `evals/tests/cli/help-output.test.mjs` (new)

**Out of scope:** Do not change command behavior, status semantics, perf/types skills, or third-party dependencies.

## Steps

1. Make default help a one-line identity and short setup/check/maintain/advanced actions; include `preflight` and `conform` with one exact example each.
2. Remove mascot rendering from CLI output and delete the unused mascot module only after checking imports; retain detailed help as an explicit action.
3. Use labels and line wrapping rather than color, emoji, or fixed-width alignment for meaning; respect `NO_COLOR`, `--no-color`, non-TTY, and narrow columns.
4. Keep existing command aliases and explicit flag parsing intact.

## Verification

- **Test type and reason:** CLI contract: snapshot semantic lines and exit codes across TTY-like, non-TTY, NO_COLOR, and narrow-width modes; this catches lost commands and raw ANSI/control output.
- **Named cases:** No mascot, visible quality journey, all existing commands discoverable, no color-dependent status, narrow wrapping.
- **Focused command:** `node --test evals/tests/cli/help-output.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 01.02 text-help" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/01.02/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Restore previous formatter/help presentation only; no policy or host artifact is affected.

## Definition of done

- [ ] AC-05 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
