---
title: "Host Conformance Adapter Receipts & Offline Fixture Runner Mode"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.01"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, unit, conformance, adapter, receipts]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Host Conformance Adapter Receipts & Offline Fixture Runner Mode

> Phase: phase-02-architecture-and-contracts · Depends on: 01.01 · Parallelizable with: none
> Task branch: feat/PLN-0005-ts-conformance-receipts-fixtures · Base commit: 1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422

## Objective

Enhance `orchestrator/conformance/adapters/typescript.mjs` to strictly distinguish host execution from offline fixture mode, generating tamper-evident tool receipts and failing closed with `TOOL_UNAVAILABLE` when host tooling is missing.

## Context packet

- **Architectural Seam:** `orchestrator/conformance/adapters/typescript.mjs` exports `typeScriptAdapter` adhering to the `ConformanceAdapter` contract.
- **Host Execution Policy:** If running in a real host repository (`!capabilities?.fixtureMode`), automated-blocking directives require real tools (`tsc`, `eslint`). If tool or configuration is missing, return `TOOL_UNAVAILABLE` (`isBlocked: true`).
- **Offline Fixture Mode Policy:** If `capabilities?.fixtureMode === true`, static AST analysis is dispatched for standalone test suites without requiring global tool installations.
- **Tool Receipt Structure:** When a tool runs, record:
  - `verifierType`: `"tsc"` or `"eslint"`
  - `command`: JSON stringified array of argv tokens
  - `exitCode`: Integer process exit code
  - `effectiveConfigDigest`: SHA-256 digest of verified `compilerOptions` (for `tsc`)
  - `outputFragment`: Captured stdout/stderr fragment

<language_rules>
- [directive:cf.arch.solid][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.arch.contracts][mode:evidence-blocking] rules/global/architecture-conformance.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 01.01 completed and ADR 0035 recorded.
- Active branch matches `feat/PLN-0005-ts-conformance-receipts-fixtures`.

## Scope

**In scope:**
- `orchestrator/conformance/adapters/typescript.mjs`
- `orchestrator/conformance/evidence-gate.mjs`

**Out of scope:**
- Modifying test files (handled in Phase 03)
- Modifying `package.json` dependencies

## Steps

1. In `orchestrator/conformance/adapters/typescript.mjs`:
   - Update `toolResult` to accept `effectiveConfigDigest` and attach it to `evidence`.
   - In `checkStrictCompiler`:
     - If `capabilities?.tools?.tsc` and `capabilities?.hasTsConfig`:
       - Execute `--showConfig` and parse compiler options.
       - Compute `effectiveConfigDigest = "sha256:" + sha256(JSON.stringify(config.compilerOptions))`.
       - Execute `tsc --noEmit`. Return `PASS` or `FAIL` with tool receipt.
     - Else if `capabilities?.fixtureMode === true`:
       - Run static AST semantic analysis.
     - Else (host mode without tools):
       - Return `TOOL_UNAVAILABLE` with clear diagnostic: `"Host tool tsc or tsconfig.json is missing in host environment."`.
   - In `checkLint`:
     - If `capabilities?.tools?.eslint && capabilities?.commands?.eslint`:
       - Execute ESLint command with `@typescript-eslint` rules. Return `PASS` or `FAIL` with tool receipt.
     - Else if `capabilities?.fixtureMode === true`:
       - Run static AST analysis for floating promises.
     - Else (host mode without tools):
       - Return `TOOL_UNAVAILABLE` with diagnostic: `"Host tool eslint is missing in host environment."`.
   - Ensure `checkBanAny` and `checkRuntimeValidation` continue to fail closed across all scopes.

## Verification

- **Automated Tests:**
  - Unit tests: Verify adapter behavior in both host mode and fixture mode.
  - Command: `node --test evals/tests/conformance/typescript-adapter.test.mjs`
- **Conformance Gate:**
  - Command: `context-cli conform --scope orchestrator/conformance/adapters/typescript.mjs --out .context-runs/pln-0005-02-01/report.json`

## Rollback

Revert modifications to `orchestrator/conformance/adapters/typescript.mjs` via `git checkout`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-03, AC-04
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
