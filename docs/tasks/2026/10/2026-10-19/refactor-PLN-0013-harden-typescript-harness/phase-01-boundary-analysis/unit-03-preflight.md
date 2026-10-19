---
title: "Fail closed on unsupported preflight scope"
type: unit
parent: "phase-01-boundary-analysis"
unit: "01.03"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["01.02"]
parallelizable_with: []
---

# Unit 01.03: Fail closed on unsupported preflight scope

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 01.02.

## Objective

Fail closed on unsupported preflight scope so AC-03 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: Observed preflight PASS with `bindingId:null` and JSX-only PASS with zero directives. D-04 requires scope and coverage; D-01 excludes code-conformance claims.
- Acceptance AC-03: Empty, JS/JSX-only, and zero-directive material scope cannot produce TypeScript PASS. This unit stands alone; its steps and test cases supply the receipt.
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
- `app/cli/commands/preflight.mjs`
- `scripts/harness-cli.mjs`
- `tests/cli/preflight.test.mjs` (new)

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Define distinct material-action, information, empty-scope, JS/JSX, TypeScript, and zero-directive states; retain a selection receipt but never call it code verification.
2. Return BLOCKED or UNSUPPORTED with a reason and next action for missing scope or coverage, while preserving applicable global/security obligations.
3. Add CLI exit-code and JSON tests for null binding, empty scope, JSX-only scope, zero directives, and valid scoped TypeScript; ensure labels match behavior.

## Verification

- **Test choice and cases:** Unit/CLI contract tests in new `tests/cli/preflight.test.mjs`; `node --test tests/cli/preflight.test.mjs`. Negative cases must fail closed and scoped TypeScript must expose binding identity without a code PASS claim.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert preflight commit; retain failing fixture results.

## Definition of done

- [ ] AC-03 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
