---
title: "TypeScript Conformance Receipts and Fixture Harness"
type: task
status: planned
plan_contract_version: 3
plan_id: "PLN-0005"
created: "2026-10-09"
tags: [task, typescript, conformance, receipts, fixtures]
target_branch: "master"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
---

# TypeScript Conformance Receipts and Fixture Harness

## Outcome

Establish rigorous host compiler/linter execution receipts and a paired positive/negative fixture test harness for TypeScript web rule conformance, strictly separating host `TOOL_UNAVAILABLE` gating from dedicated offline static fixture testing per the released brief [docs/discovery/typescript-web-rule-quality/brief.md](../../../../../discovery/typescript-web-rule-quality/brief.md).

## Pre-planning record

### Actors and goals

- **Host TypeScript developer:** Receives deterministic, inspectable feedback from local checks with proof of effective compiler settings.
- **CI pipeline:** Enforces automated-blocking conformance gates; fails closed with `TOOL_UNAVAILABLE` (`BLOCKED`, exit code 2) if required tooling is missing, preventing false-pass heuristic evasion.
- **AI agent:** Generates React, Next.js, and SolidJS code adhering to canonical directives, validated by paired test fixtures.
- **Maintainer:** Reviews verifiable execution receipts (argv, exit code, config digest) rather than trusting unverified exit codes.

### Domain language

- **Tool Execution Receipt:** An immutable record in conformance evidence containing tool name, exact command argv array, effective config digest, exit code, and stdout/stderr excerpt.
- **Host Mode:** Conformance execution in a real host project where `tsc` and `eslint` are required; missing tools produce `TOOL_UNAVAILABLE`.
- **Fixture Mode:** Dedicated offline evaluation mode (`capabilities.fixtureMode = true`) where static AST fallback analysis is permitted for standalone test suites without global tooling.
- **Paired Fixtures:** Exact matching pairs of valid ("good") and deliberately invalid ("bad") TypeScript code snippets exercising specific directive rules.

### Language stack and applicable rules

- **Declared Stack:** `typescript` (Context Factory Node.js ESM core governing host TypeScript applications).
- **Rule Binding ID & Hash:** `binding-PLN-0005`
- **Active Directives:**

| Directive ID | Mode | Rule Path | Verifier |
|---|---|---|---|
| `ts.type-safety.ban-any` | automated-blocking | `rules/typescript/common/type-safety.md` | `ts-type-checker` |
| `ts.type-safety.strict-compiler-settings` | automated-blocking | `rules/typescript/common/type-safety.md` | `tsc` |
| `ts.async.no-floating-promises` | automated-blocking | `rules/typescript/common/async-discipline.md` | `eslint` |
| `ts.runtime-validation.parse-boundary-data` | automated-blocking | `rules/typescript/common/runtime-validation.md` | `runtime-validation-linter` |

- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S-01 | Host project with strict `tsc` | `tsc` present, `tsconfig.json` has `strict: true` | Conforming code emits receipt and PASS | Invalid config reports explicit error and FAIL | covered |
| S-02 | Host project missing `tsc` | Host run without `tsc` | Returns `TOOL_UNAVAILABLE`, exit code 2 (BLOCKED) | Developer installs tool or obtains human waiver | covered |
| S-03 | Host project with `strict: false` | `tsconfig.json` disables strict | Effective config inspection flags error and FAIL | Fix tsconfig options to satisfy directive | covered |
| S-04 | Offline test runner in fixture mode | `capabilities.fixtureMode = true` | Fast static AST check executes without host tool | Catches violation and returns FAIL with line | covered |
| S-05 | Paired bad fixture execution | Negative snippet with floating promise | Deterministic detection returns FAIL | N/A (expected negative test assertion) | covered |
| S-06 | Paired good fixture execution | Positive conforming snippet | Deterministic PASS with zero false positives | N/A (expected positive test assertion) | covered |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | Host missing tool behavior | Strict separation: host runs return `TOOL_UNAVAILABLE`; static AST checks reserved for fixture mode | ADR 0029; Q-01 user resolution on 2026-10-09 | Uniform static fallback (masks missing host tools); Mandatory host toolchain (breaks minimal CI) | ADR 0035 |
| D-02 | Effective compiler configuration validation | Inspect `--showConfig` output rather than raw file parsing to resolve extends/overrides | `tsc --showConfig` provides canonical effective options | Manual JSON parse of tsconfig (misses extends chains) | Unit 02.01 |
| D-03 | Fixture suite organization | Paired good/bad directories under `evals/fixtures/typescript/` | Standardized test matrix across 4 violation classes | Inline code strings in test files only | Unit 01.02 |

### Unknowns and blockers

- None. Discovery complete; released brief verified.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | D-01, S-02 | ADR 0035 and contract specifications define host execution receipt schema and explicit `fixtureMode` runner capability flag | Unit 01.01 | `test -f docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md` | planned |
| AC-02 | D-03, S-05, S-06 | Paired positive (good) and negative (bad) fixture catalog covering 4 violation classes across shared TypeScript, React, Next.js, and SolidJS | Unit 01.02 | `ls evals/fixtures/typescript/good/ && ls evals/fixtures/typescript/bad/` | planned |
| AC-03 | D-01, D-02, S-01, S-03 | Real host mode execution captures compiler `--showConfig` options (`strict`, `noImplicitAny`, `noUncheckedIndexedAccess`) and ESLint reports in tamper-evident receipts; missing tools in host mode return `TOOL_UNAVAILABLE` (BLOCKED) | Unit 02.01 | `node --test evals/tests/conformance/typescript-adapter.test.mjs` | planned |
| AC-04 | D-01, S-04 | Offline fixture mode dispatches to deterministic static AST syntax checkers for standalone test suites without requiring global host tooling | Unit 02.02 | `node --test evals/tests/conformance/typescript-adapter.test.mjs` | planned |
| AC-05 | S-05, S-06 | Automated fixture test suite verifies that every bad fixture fails closed with expected diagnostic and every good fixture passes without false positives | Unit 03.01 | `node --test evals/tests/conformance/typescript-fixtures.test.mjs` | planned |
| AC-06 | S-01, S-02 | Conformance adapter unit tests assert host mode `TOOL_UNAVAILABLE` gating and receipt emission | Unit 03.02 | `node --test evals/tests/conformance/conformance-cli.test.mjs` | planned |
| AC-07 | All | Context manifest, lockfile, and doctor diagnostics remain synchronized and pass 100% | Unit 04.01 | `npm run lint && node scripts/context.mjs doctor` | planned |

## Scope

- Architecture Decision Record 0035.
- Conformance adapter receipt generation and host/fixture mode separation in `orchestrator/conformance/adapters/typescript.mjs`.
- Paired positive and negative test fixture catalog in `evals/fixtures/typescript/`.
- Automated fixture test suite in `evals/tests/conformance/typescript-fixtures.test.mjs`.
- Unit and CLI test updates asserting host `TOOL_UNAVAILABLE` and receipt structures.
- Manifest and lock synchronization.

## Non-goals

- No runtime npm dependencies inside Context Factory core.
- No automatic code rewrite or AST mutation.
- No removal or softening of human evidence gates.
- No external compiler dependencies for offline fixture test suites.

## Constraints and decisions

- Conformance receipts must include `command`, `exitCode`, and `effectiveConfigDigest`.
- Missing host tools in host mode MUST return `TOOL_UNAVAILABLE` (`isBlocked: true`).
- Pure Node.js ESM compatibility.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
|---|---|---|
| Host environments lacking `tsc` in devDependencies get BLOCKED | High / expected | Conformance CLI informs developer to install dependencies or supply governed human waiver |
| ESLint v9 flat config compatibility | Medium / low | Use resilient config discovery and safe argument passing |

## Task branch

| Field | Recorded decision |
|---|---|
| Target branch | `master` |
| Task branch | `feat/PLN-0005-ts-conformance-receipts-fixtures` |
| Base commit | `1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422` |

## Phases

- [ ] `phase-01-discovery-and-scenarios/phase.md` — Phase 1 — Discovery, Scenarios, and Boundary Analysis
- [ ] `phase-02-architecture-and-contracts/phase.md` — Phase 2 — Architecture, Contracts, and Data Modeling
- [ ] `phase-03-implementation-and-tests/phase.md` — Phase 3 — Incremental Implementation and Tests
- [ ] `phase-04-verification-and-release/phase.md` — Phase 4 — Verification, Quality Gates, and Release

## Verification

Commands to verify the entire task:
- `node --test evals/tests/conformance/*.test.mjs`
- `node evals/run-evals.mjs`
- `npm run lint`
- `node scripts/context.mjs doctor`

## Plan done-check

- [x] Acceptance criteria map to units and verification.
- [x] Blockers are resolved or absent.
- [x] Risks and dependencies are recorded.
- [x] Task branch and target base are verified.

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Conformance Report | Verification Command |
|---|---|---|---|---|
| Phase 01 Verification | `feat/PLN-0005-ts-conformance-receipts-fixtures` | pending | pending | `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-09/feat-PLN-0005-ts-conformance-receipts-fixtures` |
| Phase 02 Verification | `feat/PLN-0005-ts-conformance-receipts-fixtures` | pending | pending | `node --test evals/tests/conformance/typescript-adapter.test.mjs` |
| Phase 03 Verification | `feat/PLN-0005-ts-conformance-receipts-fixtures` | pending | pending | `node --test evals/tests/conformance/typescript-fixtures.test.mjs` |
| Phase 04 Verification | `feat/PLN-0005-ts-conformance-receipts-fixtures` | pending | pending | `node scripts/context.mjs doctor` |
| Task Finalization | `feat/PLN-0005-ts-conformance-receipts-fixtures` to `master` | pending | pending | `node scripts/context.mjs doctor` |
