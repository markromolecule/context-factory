---
title: "Non-clobbering local hook"
type: unit
parent: "phase-02-safe-setup"
unit: "02.01"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p02-safe-hook"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-02/safe-hook"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: []
parallelizable_with: ["03.01"]
---

# Unit 02.01: Non-clobbering local hook

> Phase: 02-safe-setup · Depends on: none · Parallelizable with: 03.01
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p02-safe-hook` · Worktree: `.worktrees/PLN-0004/phase-02/safe-hook`

## Objective

Make optional pre-commit hook installation preserve an existing unrelated hook and report conflicts accurately.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** `handleHookCommand()` currently checks for `.git`, then writes `.git/hooks/pre-commit` unconditionally. Its script runs doctor only; it must not be described as a conformance pass.
- **Acceptance criteria:** AC-02.
- **Binding decision:** Hook remains a separate explicit opt-in. Existing host hook is user-owned; conflict is a blocked/skipped item with recovery.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md sourceHash:sha256:07fa2d10c26bc1fd7efdf216561ed2c23a3b5f618ff78202b01cdde32f140711
- [directive:ts.error.no-swallow-errors][mode:evidence-blocking] rules/typescript/common/error-handling.md sourceHash:sha256:fcac31d2075c06a1fc81dd3869372115b7054e2f686a415a400db152292b2bc9
</language_rules>

**Rule-satisfaction mapping:** Treat target filesystem/Git metadata as untrusted, preserve errors with cause, and record actual hook bytes/status. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p02-safe-hook` at the correct task/phase base in `.worktrees/PLN-0004/phase-02/safe-hook` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `app/cli/commands/hook.mjs`
- `evals/tests/cli/hook-safety.test.mjs` (new)

**Out of scope:** Do not change repository conformance policy or silently chain an unrelated hook.

## Steps

1. Resolve `.git` directory/file safely (worktrees may use a gitfile) and validate the selected host before computing the hook target.
2. Preview exact target and command; if an unrelated hook exists, return conflict without writing. If identical managed content exists, report already configured.
3. Create a new hook using exclusive file creation or an equivalent no-clobber check; handle a second writer racing after preview and read-only errors without false success.
4. Keep hook doctor coverage labeled as factory health, not per-change conformance.

## Verification

- **Test type and reason:** Integration + negative input: temporary Git repos with absent, identical, unrelated, gitfile, read-only, and raced hook targets; this catches overwrites and false installed status.
- **Named cases:** Opt-out causes no hook write; existing unrelated hook bytes unchanged; repeated install idempotent; race returns conflict.
- **Focused command:** `node --test evals/tests/cli/hook-safety.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 02.01 safe-hook" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/02.01/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Remove only a hook whose content matches the task-generated marker; preserve any pre-existing or edited hook.

## Definition of done

- [ ] AC-02 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
