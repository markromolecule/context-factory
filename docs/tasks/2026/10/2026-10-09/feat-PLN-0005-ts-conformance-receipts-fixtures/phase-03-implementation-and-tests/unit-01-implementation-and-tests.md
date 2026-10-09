---
title: "Paired Good/Bad Test Fixtures & Conformance Suite Integration"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.01"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, unit, conformance, fixtures, tests]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: Paired Good/Bad Test Fixtures & Conformance Suite Integration

> Phase: phase-03-implementation-and-tests · Depends on: 02.01 · Parallelizable with: none
> Task branch: feat/PLN-0005-ts-conformance-receipts-fixtures · Base commit: 1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422

## Objective

Create standardized paired positive and negative TypeScript fixtures covering all 4 violation classes, implement the automated fixture test suite `evals/tests/conformance/typescript-fixtures.test.mjs`, and update adapter unit tests to assert host mode vs fixture mode behavior.

## Context packet

- **Requirement from Brief:** Build a representative good/bad fixture catalog proving zero false-passes across ban-any, strict compiler settings, floating promises, and boundary validation.
- **Fixture Directory Structure:**
  - `evals/fixtures/typescript/good/`: valid, conforming TypeScript files that must yield `PASS`.
  - `evals/fixtures/typescript/bad/`: invalid TypeScript files that must yield `FAIL` with specific rule diagnostics.
- **Adapter Execution Under Test:**
  - When `capabilities.fixtureMode = true`, adapter processes fixtures via static checks.
  - When `capabilities.fixtureMode` is false/absent and tools are omitted, adapter returns `TOOL_UNAVAILABLE`.

<language_rules>
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 02.01 completed and adapter supports `fixtureMode` and host receipts.
- Task branch matches `feat/PLN-0005-ts-conformance-receipts-fixtures`.

## Scope

**In scope:**
- `evals/fixtures/typescript/good/type-safety.ts`
- `evals/fixtures/typescript/bad/type-safety.ts`
- `evals/tests/conformance/typescript-fixtures.test.mjs`
- `evals/tests/conformance/typescript-adapter.test.mjs`

**Out of scope:**
- Manifest locking (handled in Phase 04).

## Steps

1. Create fixture files:
   - `evals/fixtures/typescript/good/type-safety.ts`: fully typed without any, strict properties.
   - `evals/fixtures/typescript/bad/type-safety.ts`: contains `type Unsafe = any;`.
   - `evals/fixtures/typescript/good/async-discipline.ts`: promises awaited or returned.
   - `evals/fixtures/typescript/bad/async-discipline.ts`: unhandled floating `fetch("/save");`.
   - `evals/fixtures/typescript/good/runtime-validation.ts`: Zod/schema parsed boundary payload.
   - `evals/fixtures/typescript/bad/runtime-validation.ts`: unvalidated `(await fetch()).json()`.
   - `evals/fixtures/typescript/good/compiler-strict.ts`: sound annotations.
   - `evals/fixtures/typescript/bad/compiler-strict.ts`: primitive type mismatch `const n: number = "wrong";`.
2. Create test suite `evals/tests/conformance/typescript-fixtures.test.mjs`:
   - Run each bad fixture against `typeScriptAdapter` with `capabilities.fixtureMode = true`; assert `status === "FAIL"`.
   - Run each good fixture against `typeScriptAdapter` with `capabilities.fixtureMode = true`; assert `status === "PASS"`.
3. Update `evals/tests/conformance/typescript-adapter.test.mjs`:
   - Add tests verifying that host mode (`fixtureMode: false`) returns `TOOL_UNAVAILABLE` when `tsc` or `eslint` is absent.
   - Add tests verifying receipt fields (`command`, `exitCode`, `effectiveConfigDigest`).

## Verification

- **Automated Tests:**
  - Fixture tests: `node --test evals/tests/conformance/typescript-fixtures.test.mjs`
  - Adapter tests: `node --test evals/tests/conformance/typescript-adapter.test.mjs`
  - Conformance test suite: `node --test evals/tests/conformance/*.test.mjs`
- **Conformance Gate:**
  - Command: `context-cli conform --scope evals/tests/conformance/typescript-fixtures.test.mjs --out .context-runs/pln-0005-03-01/report.json`

## Rollback

Revert added fixtures and test files via `git rm` or `git checkout`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-02, AC-05, AC-06
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
