---
title: "Conformance Scope and Gate Repair"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.00"
branch: "task/0001/phase-05/conformance-scope-repair"
worktree: ".worktrees/0001/phase-05/conformance-scope-repair"
status: verified
created: "2026-10-06"
tags: [task, unit, conformance, cli, repair]
depends_on: ["04.03"]
parallelizable_with: []
---

# Unit 05.00: Conformance Scope and Gate Repair

## Objective

Make CLI scope input unambiguous and preserve a fail-closed, usable conformance receipt for multi-path material changes before catalog units are verified.

## Context packet

- Review evidence found that `--scope rules/a,rules/b` reaches the binding compiler as one literal path; repeated scope flags are also overwritten by the option parser.
- A SOLID-only catalog scope selected 66 unrelated directives, so Unit 05.03 must add regression coverage after this unit restores exact multi-path input.
- Units 05.01–05.03 intentionally exclude manifest and lock artifacts; their previous isolated `npm run lint` requirement conflicted with the release-gate ownership in Unit 05.04.
- AC-02 requires deterministic, exact scope binding; AC-08 forbids reporting success for blocked reports.

<language_rules>
- [directive:cf.arch.contracts][mode:evidence-blocking] `rules/global/architecture-conformance.md`: preserve explicit CLI and binding contracts.
- [directive:cf.arch.direction][mode:automated-blocking] `rules/global/architecture-conformance.md`: retain directional dependencies between CLI parsing and binding compilation.
- [directive:cf.arch.layers][mode:evidence-blocking] `rules/global/architecture-conformance.md`: command receipts must reflect the exact evaluated scope.
- [directive:cf.arch.adrs][mode:automated-blocking] `rules/global/architecture-conformance.md`: cover changed CLI behavior with focused contract tests.
</language_rules>

## Scope

**In scope:** `app/cli/core/options.mjs`; `app/cli/commands/preflight.mjs`; `app/cli/commands/conform.mjs`; `evals/conformance-cli.test.mjs`; new focused CLI scope fixture/test under `evals/`; `context-lock.json` as the generated lock artifact required by the repository pre-commit guard; Phase 5 task artifacts that record this approved repair.

**Out of scope:** binding compiler selection semantics, global/SOLID descriptor metadata, adapters, lock regeneration, and Laravel support.

## Steps

1. Define a backward-compatible `--scope` representation that accepts repeated flags and comma-delimited values as a normalized, ordered path array.
2. Ensure preflight and conformance pass that array unchanged to `resolveContext` and record every individual path in receipts.
3. Add Red/Green contract tests for multi-path preflight/conformance and for rejecting an empty normalized scope.
4. Preserve exit semantics: a `BLOCKED` evidence report remains non-zero and is never formatted as PASS.
5. Regenerate the lock required to commit this CLI change. Unit 05.04 remains responsible for the final aggregate sync after catalog migration.

## Verification

- **Contract tests:** CLI parsing and JSON receipt scope are public CLI behavior; cover comma-delimited, repeated, and empty input.
- **Integration tests:** invoke preflight and conform through the CLI with a deterministic fixture and assert exact binding scope and exit status.
- Commands: focused scope test; `node --test evals/conformance-cli.test.mjs`; `npm test` only if focused suites remain green.
- **Execution evidence (2026-10-06):** Red observed before implementation: repeated `--scope` flags overwrote earlier values and a comma-delimited value was emitted as one literal path. Green: `node --test evals/conformance-cli.test.mjs` (PASS: 10/10 in 205ms).
- **Pre-screening:** scope fence PASS (four in-scope production/test files; no whitespace errors); SOLID review PASS (normalization remains in the CLI option boundary and handlers only consume normalized values).
- **Conformance receipt:** `report-binding-adhoc-00-00-04386f3fa391-1791276108754` (Verdict: PASS; Binding Hash: `sha256:04386f3fa3915ae35d9cb87e16d91679bfc878ed51c0a092470399857e4bc5bb`; Diff Hash: `sha256:80ba2f17b642cb87daa6e2f49a87d8171f0805687c478ca467c4fb7da5a05dce`). Named human evidence: Mark Joseph approved the CLI-to-binding boundary, layer separation, and policy behavior.
- **Generated artifact:** `context-lock.json` is refreshed here to satisfy the repository pre-commit guard; Unit 05.04 will refresh it again as part of the final aggregate sync.

## Rollback

Revert the CLI normalization and focused tests together; catalog units remain blocked rather than receiving ambiguous bindings.

## Definition of done

- [x] AC-02 exact multi-path scope is represented deterministically in receipts.
- [x] AC-08 blocking verdicts remain non-success exits.
- [x] Focused Red and Green evidence is recorded.
- [x] Unit passes `/review` and a PASS conformance report with valid human evidence where required.
