---
title: "Modernize Evals Suite and Add Decommissioned Stack Regression Test"
type: unit
parent: "phase-03-evals-fixtures-and-tests"
unit: "03.01"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, unit, evals, tests]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: Modernize Evals Suite and Add Decommissioned Stack Regression Test

> Phase: phase-03-evals-fixtures-and-tests · Depends on: 02.01 · Parallelizable with: none
> Task branch: refactor/PLN-0006-decommission-laravel-and-php-stack · Base commit: d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6

## Objective

Delete obsolete Laravel fixtures and test files, replace `evals/cases/laravel-resolution.json` with a dedicated TypeScript backend evaluation case, and add automated regression test coverage in `evals/tests/conformance/decommissioned-stack.test.mjs` verifying the exit code 2 (BLOCKED) behavior for `--stack laravel`.

## Context packet

- Existing tests (`laravel-adapter.test.mjs`, `unit-06-02-laravel-http-application.test.mjs`, `unit-06-03-laravel-data-security.test.mjs`) assert behavior of deleted Laravel adapter and rules.
- Fixtures under `evals/fixtures/laravel-conformance/` are orphaned.
- `evals/cases/laravel-resolution.json` tests resolution of Laravel prompts against deleted rules.
- ADR 0036 and Discovery Q-01 require deterministic regression testing of the fail-closed exit code 2 response when `--stack laravel` is requested.
- Serves Acceptance Criteria AC-05 and AC-06.

<language_rules>
- [directive:cf.quality.tests-for-behavior-changes][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.quality.delete-dead-code][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.quality.run-existing-checks][mode:evidence-blocking] rules/global/code-quality.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` exactly matches `refactor/PLN-0006-decommission-laravel-and-php-stack`; stop if detached or mismatched.
- Unit 02.01 complete.

## Scope

**In scope:**
- `evals/fixtures/laravel-conformance/`
- `evals/tests/conformance/laravel-adapter.test.mjs`
- `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs`
- `evals/tests/rules/unit-06-03-laravel-data-security.test.mjs`
- `evals/cases/laravel-resolution.json`
- `evals/cases/typescript-backend-resolution.json`
- `evals/tests/conformance/decommissioned-stack.test.mjs`

**Out of scope:**
- `context-manifest.json` and lockfile (handled in Unit 04.01)

## Steps

1. Delete `evals/fixtures/laravel-conformance/` directory and all fixture files.
2. Delete `evals/tests/conformance/laravel-adapter.test.mjs`.
3. Delete `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs` and `evals/tests/rules/unit-06-03-laravel-data-security.test.mjs`.
4. Delete `evals/cases/laravel-resolution.json` and create `evals/cases/typescript-backend-resolution.json` evaluating backend prompt resolution against TypeScript backend rules.
5. Author `evals/tests/conformance/decommissioned-stack.test.mjs`:
   - Test that executing `context-cli conform --stack laravel` or invoking conform CLI with `--stack laravel` returns exit code 2 (`BLOCKED`).
   - Test that stdout/stderr output contains informative explanation citing ADR 0036 and Context Factory dedication to TypeScript.
6. Execute `node --test evals/tests/conformance/decommissioned-stack.test.mjs` and `npm test` to verify complete test pass.

## Verification

- **Automated Tests:**
  - Test type(s): regression & integration tests — ensures that all legacy Laravel tests are purged and that new regression tests verify the fail-closed error contract for decommissioned stacks.
  - Cases: decommissioned stack returns exit code 2 and cites ADR 0036; full suite passes with 0 test failures.
  - Commands: `node --test evals/tests/conformance/decommissioned-stack.test.mjs`, `npm test`
- **Conformance Gate:**
  - Command: `context-cli conform --scope evals/tests/conformance/decommissioned-stack.test.mjs --out .context-runs/PLN-0006-U0301/conformance-report.json`
  - Conformance Report: `[report.id]` (Verdict: PASS)

## Rollback

- Restore deleted test files and evaluation cases via git checkout on the task branch.

## Definition of done

- [ ] Maps to acceptance criteria: AC-05, AC-06
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
- [ ] Conformance report passes (PASS) with zero blocking violations
