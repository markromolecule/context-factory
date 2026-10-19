---
title: "Make status and doctor claims evidence-bound"
type: unit
parent: "phase-03-integration-tests"
unit: "03.02"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["01.02"]
parallelizable_with: []
---

# Unit 03.02: Make status and doctor claims evidence-bound

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 01.02.

## Objective

Make status and doctor claims evidence-bound so AC-09 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: `status` currently picks the first found report, often factory-local, without host/scope/binding/revision matching. Doctor passes catalog health while full evaluations contain failures.
- Acceptance AC-09: Status only accepts matching host, scope, binding, and revision evidence; doctor claims remain narrow. This unit stands alone; its steps and test cases supply the receipt.
- Scope is JavaScript implementation and Markdown catalog/configuration; no TypeScript-only directive is claimed for an `.mjs` source.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes if canonical rule content changes before execution.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` must equal `refactor/PLN-0013-harden-typescript-harness`; stop on detached HEAD, wrong branch, dirty unrelated state, or changed target base.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`.
- Dependencies 01.02 have committed verification receipts; stop if any required check failed.

## Scope

**In scope:**
- `app/cli/core/host-state.mjs`
- `app/cli/commands/status.mjs`
- `app/cli/commands/doctor.mjs`
- `evals/tests/cli/host-status.test.mjs`
- `tests/cli/doctor-editor-audit.test.mjs`

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Inventory report producers/consumers and define an exact identity tuple: host root, scoped files, binding hash, revision/diff hash, command, timestamp, and verdict where available.
2. Separate catalog health, host configuration, and check results. Report current PASS only for matching identity; old, missing, foreign, or partial reports display unknown/stale/blocked with a next action.
3. Test factory-first and host-first report ordering, changed revision/scope/binding, missing checks, and a healthy doctor with failing evaluations.

## Verification

- **Test choice and cases:** Host status integration tests: `node --test evals/tests/cli/host-status.test.mjs tests/cli/doctor-editor-audit.test.mjs`; a stale or foreign PASS must never become current.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert status/doctor commit; retain test fixture reports for diagnosis.

## Definition of done

- [ ] AC-09 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
