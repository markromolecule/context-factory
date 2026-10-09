---
title: "Manifest, Lockfile, Doctor Health, and Task Finalization"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, unit, verification, release]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 04.01: Manifest, Lockfile, Doctor Health, and Task Finalization

> Phase: phase-04-verification-and-release · Depends on: 03.01 · Parallelizable with: none
> Task branch: feat/PLN-0005-ts-conformance-receipts-fixtures · Base commit: 1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422

## Objective

Synchronize `context-manifest.json` with new test files and ADR 0035, regenerate `context-lock.json`, verify full test and evaluation suites with zero failures, and update the task execution ledger.

## Context packet

- **Inventory Invariant:** Every `.mjs` test file and `.md` ADR file must be declared in `context-manifest.json` under their respective sections.
- **Lockfile Integrity:** `context-lock.json` must be regenerated via `node scripts/context.mjs lock` whenever manifest items or canonical files change.
- **Doctor Diagnostic:** `node scripts/context.mjs doctor` must report `HEALTHY` across all 6 diagnostic checks before task finalization.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.completion][mode:evidence-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 03.01 completed and all test fixtures pass.
- Task branch matches `feat/PLN-0005-ts-conformance-receipts-fixtures`.

## Scope

**In scope:**
- `docs/tasks/2026/10/2026-10-09/feat-PLN-0005-ts-conformance-receipts-fixtures.md`
- `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md`
- `evals/tests/conformance/typescript-fixtures.test.mjs`

**Out of scope:**
- Code modifications (completed in prior phases).

## Steps

1. In `context-manifest.json`:
   - Add `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md` to `decisions`.
   - Add `evals/tests/conformance/typescript-fixtures.test.mjs` to `tools`.
2. Run `node scripts/context.mjs lock` to regenerate `context-lock.json`.
3. Run lint and test suites:
   - `npm run lint`
   - `node --test evals/tests/**/*.test.mjs`
   - `node evals/run-evals.mjs`
   - `node scripts/context.mjs doctor`
4. Update the Task PLN-0005 Master Plan Finalization & Merge Ledger with pass evidence and commit SHAs.

## Verification

- **Automated Tests:**
  - Full test runner: `node --test evals/tests/**/*.test.mjs`
  - Evaluation suite: `node evals/run-evals.mjs`
  - Linter: `npm run lint`
  - Health diagnostic: `node scripts/context.mjs doctor`
- **Conformance Gate:**
  - Command: `context-cli conform --scope evals/tests/conformance/typescript-fixtures.test.mjs --out .context-runs/pln-0005-04-01/report.json`

## Rollback

Restore manifest and lock via `git checkout`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-07
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
