---
title: "Conform CLI persistence and verify"
type: unit
parent: "phase-03-conformance-receipts"
unit: "03.02"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p03-conform-cli"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-03/conform-cli"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: ["03.01", "01.02"]
parallelizable_with: []
---

# Unit 03.02: Conform CLI persistence and verify

> Phase: 03-conformance-receipts · Depends on: 03.01, 01.02 · Parallelizable with: none
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p03-conform-cli` · Worktree: `.worktrees/PLN-0004/phase-03/conform-cli`

## Objective

Expose content-bound conformance and strict report verification through stable, scriptable CLI commands.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** `handleConformCommand()` passes changed paths but no content identity and writes to ignored factory `.context-runs/` by default; write errors are swallowed. `--human-evidence` exists; missing named evidence yields BLOCKED.
- **Acceptance criteria:** AC-07, AC-08, AC-09.
- **Binding decision:** CI creates and verifies its report in the checkout. `--out` failure is fatal. Evidence is an explicit input and cannot be synthesized by workflow code.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md sourceHash:sha256:07fa2d10c26bc1fd7efdf216561ed2c23a3b5f618ff78202b01cdde32f140711
- [directive:ts.error.no-swallow-errors][mode:evidence-blocking] rules/typescript/common/error-handling.md sourceHash:sha256:fcac31d2075c06a1fc81dd3869372115b7054e2f686a415a400db152292b2bc9
</language_rules>

**Rule-satisfaction mapping:** Validate report and Git inputs, surface write/parse errors, and record exact command exit/evidence. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p03-conform-cli` at the correct task/phase base in `.worktrees/PLN-0004/phase-03/conform-cli` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `app/cli/commands/conform.mjs`
- `app/cli/bin/context-cli.mjs`
- `evals/tests/conformance/conformance-cli.test.mjs`

**Out of scope:** Do not change adapter verdict policy, auto-fill human evidence, or claim factory doctor proves code conformance.

## Steps

1. Add an explicit base/scope option for content identity; pass the computed digest and identity version to evaluation. Keep existing explicit flags and JSON structure compatible where feasible.
2. Make requested `--out` persistence failure return nonzero with a clear reason; report the artifact path and avoid success when the file is absent.
3. Add a strict verify path (subcommand or separate CLI action) that reads a report, validates schema, recomputes active binding and checkout identity, and maps PASS/FAIL/BLOCKED/stale/unavailable to stable exit codes.
4. Accept named human evidence only from an explicit reviewable argument/file supplied by a maintainer; never create a default string or waiver. Preserve existing governed waiver validation.
5. Ensure help and generated workflow can cite exact commands after the contract is settled.

## Verification

- **Test type and reason:** CLI contract + integration: temp Git checkout and report path for current PASS, same-path edit, missing report, unwritable output, malformed JSON, stale binding, absent human evidence, and governed waiver; this catches false zero exits.
- **Named cases:** Persistence error nonzero; unknown report cannot PASS; BLOCKED retains exit 2; no human evidence remains blocked.
- **Focused command:** `node --test evals/tests/conformance/conformance-cli.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 03.02 conform-cli" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/03.02/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Remove new strict CLI flags/verifier route together; retain old explicit `conform` behavior but do not ship generated strict CI.

## Definition of done

- [ ] AC-07, AC-08, AC-09 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
