---
title: "Phase 3 — Host bridge and integrated evidence"
type: phase
parent: "refactor-PLN-0013-harden-typescript-harness"
phase: "03"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, phase]
---

# Phase 3 — Host bridge and integrated evidence

## Objective

Reconcile factory host entries and report identity, then validate the whole catalog and generated artifacts.

## Dependencies and prerequisites

Phases 1 and 2 verified; host fixture and report schema documented. Verify `git symbolic-ref --quiet --short HEAD` equals `refactor/PLN-0013-harden-typescript-harness` before any execution.

## Unit index

| Unit | Outcome | Artifact | Depends on | Status |
|---|---|---|---|---|
| 03.01 | Reconcile factory host entries and bridge ownership | `unit-01-host-bridge.md` | 02.04 | planned |
| 03.02 | Make status and doctor claims evidence-bound | `unit-02-status.md` | 01.02 | planned |
| 03.03 | Synchronize and verify the integrated harness | `unit-03-integration.md` | 01.03, 01.04, 02.02, 02.03, 03.01, 03.02 | planned |

## Impacted components

- `.agents/skills.json`
- `.agents/README.md`
- `.claude/CLAUDE.md`
- `.claude/settings.json`
- `app/cli/core/bridge-generator.mjs`
- `scripts/validate-context.mjs`
- `tests/bridge/bridge-generator.test.mjs`
- `tests/bridge/bridge-multi-editor.test.mjs`
- `app/cli/core/host-state.mjs`
- `app/cli/commands/status.mjs`
- `app/cli/commands/doctor.mjs`
- `evals/tests/cli/host-status.test.mjs`
- `tests/cli/doctor-editor-audit.test.mjs`
- `context-manifest.json`
- `context-lock.json`
- `README.md`
- `app/cli/README.md`
- `evals/tests/bridge`
- `evals/tests/cli`

## Verification and handoff

Execute units in dependency order. Each unit has concrete tests and a negative case. Close this phase only when every unit result and required human checkpoint is recorded, and then hand its verified revision to the next phase.

## Risks and rollback

Host file ownership or stale reports can mislead. Preserve collisions, use fixtures, revert individual phase commits.
