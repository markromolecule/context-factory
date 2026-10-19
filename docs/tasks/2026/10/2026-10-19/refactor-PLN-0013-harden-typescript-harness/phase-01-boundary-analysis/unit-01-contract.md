---
title: "Record the superseding conformance contract"
type: unit
parent: "phase-01-boundary-analysis"
unit: "01.01"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Record the superseding conformance contract

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: none.

## Objective

Record the superseding conformance contract so AC-01 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: ADR 0029 and 0035 define a conformance harness, ADR 0039 still refers to `conform`, while current CLI has no such command. User decision D-01 removes runtime conformance; D-02 retains factory host entries.
- Acceptance AC-01: Accepted decision and active contract/guidance state executable host checks and evidence accurately. This unit stands alone; its steps and test cases supply the receipt.
- Scope is JavaScript implementation and Markdown catalog/configuration; no TypeScript-only directive is claimed for an `.mjs` source.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes if canonical rule content changes before execution.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` must equal `refactor/PLN-0013-harden-typescript-harness`; stop on detached HEAD, wrong branch, dirty unrelated state, or changed target base.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`.
- This is the first execution unit; the plan must have passed independent plan review.

## Scope

**In scope:**
- `docs/decisions/0041-runtime-conformance-removal-and-host-checks.md` (new)
- `docs/templates/Task.md`
- `docs/templates/Unit.md`
- `docs/decisions/0029-executable-rule-conformance-harness.md`
- `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md`
- `docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md`
- `orchestrator/SHARED.md`
- `skills/productivity/plan/SKILL.md`
- `skills/productivity/plan-review/SKILL.md`
- `skills/engineering/execute/SKILL.md`

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Inventory active `conform` references and classify executable commands, policy text, templates, and historical records; record precise consumers before edits.
2. Write a new superseding ADR or add explicit supersession links according to decision-record convention. State that host lint, typecheck, test, and build produce individual evidence, while human checkpoints remain blocking.
3. Align SHARED and active lifecycle instructions to the accepted contract. Preserve history; do not rewrite old task receipts or imply a binding proves code correctness.

## Verification

- **Test choice and cases:** Architecture/contract review: add a focused active-command inventory assertion in `evals/tests/cli/github-gate.test.mjs` or a dedicated contract test; use `node scripts/validate-context.mjs`. A fixture with an active dead `conform` invocation must fail. Inspect ADR links and absence of copied policy.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.

## Rollback

Revert the decision and guidance commit together; retain the inventory receipt.

## Definition of done

- [ ] AC-01 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
