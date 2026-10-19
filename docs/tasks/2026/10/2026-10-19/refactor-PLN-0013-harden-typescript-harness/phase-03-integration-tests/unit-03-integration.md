---
title: "Synchronize and verify the integrated harness"
type: unit
parent: "phase-03-integration-tests"
unit: "03.03"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["01.03", "01.04", "02.02", "02.03", "03.01", "03.02"]
parallelizable_with: []
---

# Unit 03.03: Synchronize and verify the integrated harness

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 01.03, 01.04, 02.02, 02.03, 03.01, 03.02.

## Objective

Synchronize and verify the integrated harness so AC-10 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: Baseline full evaluations passed 203/207; four failures include bridge inventory/root contracts. Current manifest, host inventory, lock, generated entries, and active docs need one final comparison.
- Acceptance AC-10: Final catalog and full suite have no known regression. This unit stands alone; its steps and test cases supply the receipt.
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
- Dependencies 01.03, 01.04, 02.02, 02.03, 03.01, 03.02 have committed verification receipts; stop if any required check failed.

## Scope

**In scope:**
- `context-manifest.json`
- `context-lock.json`
- `README.md`
- `app/cli/README.md`
- `evals/tests/bridge`
- `evals/tests/cli`
- `evals/tests/bridge/bridge-conformance.test.mjs`

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Rebuild manifest, host inventory, and lock only from canonical sources; inspect entire diff and active command inventory for missing `conform`, stale npm guidance, broken paths, and duplicated contract text.
2. Run doctor, validator, core tests, full evaluation tests, host CI fixture execution, public CLI import, plan check, and diff check on final integrated checkout.
3. Record exact command, exit code, revision, scope, and remaining failures in the final receipt; do not mark completion while any required check is failing or human evidence is absent.

## Verification

- **Test choice and cases:** Whole-diff integration: `node scripts/context.mjs doctor`, `node scripts/validate-context.mjs`, `node --test tests/**/*.test.mjs`, `node --test evals/tests/**/*.test.mjs`, `git diff --check`. All must pass; retain separate result counts.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert integration-only generated artifacts and docs, then rerun source-owned checks; do not silently revert earlier verified units.

## Definition of done

- [ ] AC-10 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
