---
title: "Unit 02.01: Purge Conformance Subsystem, Adapters, CLI Command, and Test Suites"
type: unit
parent: "phase-02-conformance-elimination"
unit: "02.01"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, unit, refactor, conformance]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Purge Conformance Subsystem, Adapters, CLI Command, and Test Suites

> Phase: phase-02-conformance-elimination · Depends on: 01.01 · Parallelizable with: none
> Task branch: refactor/PLN-0011-clean-ephemeral-dirs-and-conformance · Base commit: c7524e96a0e97bacdb848bdee05abd9203ef5e96

## Objective

Delete `orchestrator/conformance/`, `app/cli/commands/conform.mjs`, conformance schemas, and conformance eval suites, updating `evals/run-evals.mjs` and `context-cli.mjs` so the test suite passes cleanly without conformance machinery.

## Context packet

- `orchestrator/conformance/` contains 8 files implementing adapter contract, TypeScript adapter, waiver policy, evidence gate, report verifier, and orchestrator (~1,500 lines).
- `evals/tests/conformance/` contains 8 test files: `conformance-cli-verify.test.mjs`, `conformance-cli.test.mjs`, `conformance-gate.test.mjs`, `decommissioned-stack.test.mjs`, `lifecycle-conformance.test.mjs`, `receipt-identity.test.mjs`, `typescript-adapter.test.mjs`, `typescript-fixtures.test.mjs`.
- `evals/datasets/conformance/` contains 8 dataset files: `01-missing-binding.json` through `08-bridge-omission.json`.
- `app/cli/commands/conform.mjs` implements `context-cli conform`.
- Serves Acceptance Criterion **AC-02**.

<language_rules>
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 01.01 completed.
- Git working branch is `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`.

## Scope

**In scope:**
- Delete `orchestrator/conformance/` (entire directory).
- Delete `app/cli/commands/conform.mjs`.
- Delete `schemas/conformance-report.schema.json` and `schemas/conformance-result.schema.json`.
- Delete `evals/tests/conformance/` (8 test files).
- Delete `evals/datasets/conformance/` (8 dataset files).
- Update `evals/run-evals.mjs` to remove conformance evaluation runs and adapter registrations.
- Update `app/cli/bin/context-cli.mjs` to remove `conform` command and help card.

**Out of scope:**
- Modifying remaining eval suites under `evals/cases/` and feature/defect/architecture datasets under `evals/datasets/`.

## Steps

1. Delete directory `orchestrator/conformance/`: `git rm -r orchestrator/conformance/`.
2. Delete `app/cli/commands/conform.mjs`: `git rm app/cli/commands/conform.mjs`.
3. Delete schemas: `git rm schemas/conformance-report.schema.json schemas/conformance-result.schema.json`.
4. Delete tests: `git rm -r evals/tests/conformance/`.
5. Delete datasets: `git rm -r evals/datasets/conformance/`.
6. Edit `evals/run-evals.mjs`:
   - Remove imports of `evaluateConformance`, `registerTypeScriptAdapter`, `validateWaiver`.
   - Remove the `ds-conf` evaluation block.
7. Edit `app/cli/bin/context-cli.mjs`:
   - Remove `handleConformCommand` import.
   - Remove `conform` command dispatch and command card entries.
8. Run `npm test` and verify that all 27 remaining evaluations pass.

## Verification

- **Automated Tests:**
  - Test type: Unit / Integration suite — verifies evaluation runner functions correctly with conformance datasets cleanly excised.
  - Case: `npm test` runs 27/27 passing evaluations.
  - Command: `npm test`

## Rollback

- Revert file changes and git deletions: `git checkout HEAD -- orchestrator/conformance app/cli/commands/conform.mjs schemas/ evals/`

## Definition of done

- [ ] Maps to acceptance criteria: AC-02
- [ ] Executed on recorded task branch `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`
- [ ] Changes committed cleanly to task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All remaining 27 evaluations pass (PASS)
