---
title: "Conformance Scope and Gate Repair"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.00"
branch: "task/0001/phase-05/conformance-scope-repair"
worktree: ".worktrees/0001/phase-05/conformance-scope-repair"
status: planned
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

**In scope:** `app/cli/core/options.mjs`; `app/cli/commands/preflight.mjs`; `app/cli/commands/conform.mjs`; `evals/conformance-cli.test.mjs`; new focused CLI scope fixture/test under `evals/`; Phase 5 task artifacts that record this approved repair.

**Out of scope:** binding compiler selection semantics, global/SOLID descriptor metadata, adapters, lock regeneration, and Laravel support.

## Steps

1. Define a backward-compatible `--scope` representation that accepts repeated flags and comma-delimited values as a normalized, ordered path array.
2. Ensure preflight and conformance pass that array unchanged to `resolveContext` and record every individual path in receipts.
3. Add Red/Green contract tests for multi-path preflight/conformance and for rejecting an empty normalized scope.
4. Preserve exit semantics: a `BLOCKED` evidence report remains non-zero and is never formatted as PASS.
5. Leave lock regeneration to Unit 05.04; record that unit-level catalog checks are focused tests only.

## Verification

- **Contract tests:** CLI parsing and JSON receipt scope are public CLI behavior; cover comma-delimited, repeated, and empty input.
- **Integration tests:** invoke preflight and conform through the CLI with a deterministic fixture and assert exact binding scope and exit status.
- Commands: focused scope test; `node --test evals/conformance-cli.test.mjs`; `npm test` only if focused suites remain green.

## Rollback

Revert the CLI normalization and focused tests together; catalog units remain blocked rather than receiving ambiguous bindings.

## Definition of done

- [ ] AC-02 exact multi-path scope is represented deterministically in receipts.
- [ ] AC-08 blocking verdicts remain non-success exits.
- [ ] Focused Red and Green evidence is recorded.
- [ ] Unit passes `/review` and a PASS conformance report with valid human evidence where required.
