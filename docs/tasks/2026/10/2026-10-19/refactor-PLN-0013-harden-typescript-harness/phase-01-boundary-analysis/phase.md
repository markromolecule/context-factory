---
title: "Phase 1 — Contract truth and CLI gates"
type: phase
parent: "refactor-PLN-0013-harden-typescript-harness"
phase: "01"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, phase]
---

# Phase 1 — Contract truth and CLI gates

## Objective

Replace broken conformance claims with a reviewed host-check contract, executable CLI/CI checks, and fail-closed preflight.

## Dependencies and prerequisites

Released discovery brief; clean task branch; D-01 and D-04. Verify `git symbolic-ref --quiet --short HEAD` equals `refactor/PLN-0013-harden-typescript-harness` before any execution.

## Unit index

| Unit | Outcome | Artifact | Depends on | Status |
|---|---|---|---|---|
| 01.01 | Record the superseding conformance contract | `unit-01-contract.md` | none | planned |
| 01.02 | Make CLI exports and generated CI executable | `unit-02-cli-ci.md` | 01.01 | planned |
| 01.03 | Fail closed on unsupported preflight scope | `unit-03-preflight.md` | 01.02 | planned |
| 01.04 | Validate the scaffolded master plan | `unit-04-plan-check.md` | none | planned |

## Impacted components

- `docs/decisions/0041-runtime-conformance-removal-and-host-checks.md`
- `docs/templates/Task.md`
- `docs/templates/Unit.md`
- `scripts/plan-check.mjs`
- `tests/cli/plan-check-layout.test.mjs`
- `docs/decisions/0029-executable-rule-conformance-harness.md`
- `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md`
- `docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md`
- `orchestrator/SHARED.md`
- `skills/productivity/plan/SKILL.md`
- `skills/productivity/plan-review/SKILL.md`
- `skills/engineering/execute/SKILL.md`
- `app/cli/index.mjs`
- `app/cli/core/github-gate-generator.mjs`
- `scripts/harness-cli.mjs`
- `evals/tests/cli/github-gate.test.mjs`
- `app/cli/README.md`
- `app/cli/commands/preflight.mjs`
- `tests/cli/preflight.test.mjs`

## Verification and handoff

Execute units in dependency order. Each unit has concrete tests and a negative case. Close this phase only when every unit result and required human checkpoint is recorded, and then hand its verified revision to the next phase.

## Risks and rollback

Removing the dead command may expose active consumers. Inventory before edits; revert phase commits if emitted checks regress.
