---
title: "Make skills and workflows distinct and tier aware"
type: unit
parent: "phase-02-vertical-slice-refactoring"
unit: "02.04"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.04: Make skills and workflows distinct and tier aware

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 01.01.

## Objective

Make skills and workflows distinct and tier aware so AC-07 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: Catalog contains 12 procedural skills and six workflow skills. Some active instructions still imply runtime conformance or repeat shared policy; workflow routing tests expose host-entry drift.
- Acceptance AC-07: Skills stand alone; workflows coordinate tiers and checkpoints without copied policy. This unit stands alone; its steps and test cases supply the receipt.
- Scope is JavaScript implementation and Markdown catalog/configuration; no TypeScript-only directive is claimed for an `.mjs` source.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:4c42d15b81106b8bb6c117edd3d88808740db4f09f175f0112588990d887fa25
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes if canonical rule content changes before execution.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` must equal `refactor/PLN-0013-harden-typescript-harness`; stop on detached HEAD, wrong branch, dirty unrelated state, or changed target base.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`.
- Dependencies 01.01 have committed verification receipts; stop if any required check failed.

## Scope

**In scope:**
- `skills/productivity`
- `skills/engineering`
- `skills/workflows`
- `evals/tests/bridge/workflow-routing.test.mjs`
- `evals/tests/bridge/workflow-entry-contract.test.mjs`

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. For each selected procedural skill, require an actionable procedure, output artifact, and completion check independent of a workflow. Remove duplicated shared policy in favor of canonical references.
2. For each workflow, define composition, tier T0/T1/T2/T3 trigger, ordering, stop condition, human evidence, and phase handoff; preserve plan-review and execute boundaries.
3. Add routing fixtures for direct information requests, small changes, material changes, missing human receipt, and invalid phase advancement; keep host adapters thin.

## Verification

- **Test choice and cases:** Workflow contract tests: `node --test evals/tests/bridge/workflow-routing.test.mjs evals/tests/bridge/workflow-entry-contract.test.mjs`; inspect skill output/completion sections. A workflow that merely mirrors a skill must fail review.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert skill/workflow commit; preserve route fixture output.

## Definition of done

- [ ] AC-07 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
