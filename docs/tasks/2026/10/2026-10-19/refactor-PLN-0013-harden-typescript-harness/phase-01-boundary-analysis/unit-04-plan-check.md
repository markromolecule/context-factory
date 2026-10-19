---
title: "Validate the scaffolded master plan"
type: unit
parent: "phase-01-boundary-analysis"
unit: "01.04"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: []
parallelizable_with: []
---

# Unit 01.04: Validate the scaffolded master plan

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: none.

## Objective

Make `plan:check` validate the master plan and brief in the layout produced by `task:new`, so a green result actually covers the full plan contract.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; D-01 requires truthful CLI behavior and D-04 requires real binding coverage.
- Observed on this plan: `task:new` wrote its master Markdown beside the task folder. `plan:check <task-folder>` found ten units and reported PASS, but returned `doneCheck.applicable:false` and `handoff.applicable:false`. Direct calls with the day directory found both checks applicable and valid. The checker must join these results automatically.
- Acceptance AC-11: a generated plan with missing or stale brief, unresolved blocker, or missing done-check must fail `plan:check`, while a valid generated plan passes with both checks applicable.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
</language_rules>

> Applicable rules supersede conflicting steps; refresh hashes before execution if sources change.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` equals `refactor/PLN-0013-harden-typescript-harness`; stop on detached HEAD, wrong branch, or unrelated dirty state.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`.
- The plan has passed independent plan review; this unit changes only checker behavior and tests.

## Scope

**In scope:**
- `scripts/plan-check.mjs`
- `tests/cli/plan-check-layout.test.mjs` (new)

**Out of scope:** Task artifacts, production host code, historic plans, and other CLI commands.

## Steps

1. Pin a fixture produced by `task:new` with sibling master and task folder; reproduce the false applicable flags through the public `plan:check` command.
2. Resolve the corresponding master by the scaffold naming contract and require the v3 done-check and released handoff checks. Fail closed on ambiguous or absent master, while preserving explicit legacy-plan handling.
3. Add fixture variants for missing brief, stale brief source hash, unresolved blocker, incomplete done-check, and valid plan. Assert JSON and exit code, not just internal helper behavior.

## Verification

- **Contract/integration test:** `node --test tests/cli/plan-check-layout.test.mjs`. It covers the CLI path and file layout that helper-only tests miss. Each invalid variant must return nonzero; valid generated plan must report both checks applicable and valid.
- **Evidence gate:** Record commands, exit codes, files, Git revision, and current directive hashes. Missing tool or fixture setup blocks completion.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 identifies the exact scaffold boundary and step 2 confines the change to master discovery.
- `cf.evidence.verification`: step 3 records CLI JSON and exit codes for valid and invalid fixtures.
- `cf.quality.tests-for-behavior-changes`: the negative fixture fails with current behavior before acceptance.

## Rollback

Revert the checker and fixture commit together; keep the false-PASS reproduction in the issue or review record.

## Definition of done

- [ ] AC-11 has positive and negative results on the current revision.
- [ ] Only declared scope changed, and the task branch is correct.
- [ ] CLI test passes and reports done-check and handoff as applicable.
- [ ] Change is reviewed and committed; no required check is unresolved.
