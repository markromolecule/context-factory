---
title: "Remove Laravel Adapter and Implement Decommissioned Stack Diagnostics"
type: unit
parent: "phase-02-adapters-and-orchestrator"
unit: "02.01"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, unit, adapters, cli]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Remove Laravel Adapter and Implement Decommissioned Stack Diagnostics

> Phase: phase-02-adapters-and-orchestrator · Depends on: 01.01 · Parallelizable with: none
> Task branch: refactor/PLN-0006-decommission-laravel-and-php-stack · Base commit: d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6

## Objective

Delete `orchestrator/conformance/adapters/laravel.mjs`, remove its registration from CLI conform and doctor commands, clean stack inference keywords in `scripts/context-core.mjs`, and implement an informative `BLOCKED` (exit code 2) diagnostic citing ADR 0036 when `--stack laravel` is requested.

## Context packet

- `orchestrator/conformance/adapters/laravel.mjs` currently implements `artisan test` and `composer check` conformance.
- `app/cli/commands/conform.mjs` imports `registerLaravelAdapter` and registers it alongside `registerTypeScriptAdapter`.
- `app/cli/commands/doctor.mjs` hardcodes `laravel` in adapter readiness diagnostics.
- `scripts/context-core.mjs` contains keyword mappings for `laravel`, `artisan`, `blade`, and `eloquent`.
- Discovery Q-01 and ADR 0036 specify that explicit `--stack laravel` queries must exit with code 2 (BLOCKED) explaining that Laravel was decommissioned in ADR 0036 and Context Factory is dedicated exclusively to TypeScript.
- Serves Acceptance Criteria AC-03 and AC-04.

<language_rules>
- [directive:cf.quality.delete-dead-code][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.quality.minimal-complete-change][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.arch.contracts][mode:evidence-blocking] rules/global/architecture-conformance.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` exactly matches `refactor/PLN-0006-decommission-laravel-and-php-stack`; stop if detached or mismatched.
- Unit 01.01 complete.

## Scope

**In scope:**
- `orchestrator/conformance/adapters/laravel.mjs`
- `app/cli/commands/conform.mjs`
- `app/cli/commands/doctor.mjs`
- `scripts/context-core.mjs`

**Out of scope:**
- `evals/` test fixtures and suites (handled in Unit 03.01)
- `context-manifest.json` and lockfile (handled in Unit 04.01)

## Steps

1. Delete `orchestrator/conformance/adapters/laravel.mjs`.
2. Update `app/cli/commands/conform.mjs`:
   - Remove `import { registerLaravelAdapter } from "../../../orchestrator/conformance/adapters/laravel.mjs";` and its registration call.
   - Add explicit check for `--stack laravel`: if stack is `"laravel"`, log diagnostic `"Stack 'laravel' is not supported. Laravel and PHP support was decommissioned in ADR 0036; Context Factory is dedicated exclusively to the TypeScript ecosystem."` and exit with code 2 (`BLOCKED`).
3. Update `app/cli/commands/doctor.mjs`:
   - Remove `laravel` from adapter readiness checks; report `Adapters: typescript (ready) | Stacks: none unsupported`.
4. Update `scripts/context-core.mjs`:
   - Remove `laravel`, `artisan`, `blade`, `eloquent` keyword mappings from stack inference logic.
5. Verify behavior with `node scripts/context.mjs conform --stack laravel` and `node scripts/context.mjs doctor`.

## Verification

- **Automated Tests:**
  - Test type(s): integration & contract tests — validates that the decommissioned adapter is completely unregistered and that the CLI enforces fail-closed exit code 2 when `--stack laravel` is invoked.
  - Cases: `conform --stack laravel` returns exit code 2 with the ADR 0036 message; `doctor` passes with single-stack typescript.
  - Commands: `node scripts/context.mjs conform --stack laravel`, `node scripts/context.mjs doctor`
- **Conformance Gate:**
  - Command: `context-cli conform --scope app/cli/commands/conform.mjs app/cli/commands/doctor.mjs scripts/context-core.mjs --out .context-runs/PLN-0006-U0201/conformance-report.json`
  - Conformance Report: `[report.id]` (Verdict: PASS)

## Rollback

- Revert changes to `conform.mjs`, `doctor.mjs`, `context-core.mjs`, and restore `laravel.mjs` from git.

## Definition of done

- [ ] Maps to acceptance criteria: AC-03, AC-04
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
- [ ] Conformance report passes (PASS) with zero blocking violations
