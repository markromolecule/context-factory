---
title: "Phase 4 — Lifecycle Contracts, Bridges, and Adversarial Evaluations"
type: phase
parent: "0001-task-executable-rule-conformance-harness"
phase: "04"
phase_branch: "task/0001/phase-04-integration"
status: completed
created: "2026-10-06"
tags: [task, phase, lifecycle, bridges, evaluations]
---

# Phase 4 — Lifecycle Contracts, Bridges, and Adversarial Evaluations

## Objective

Wire executable evidence through context/plan/execute/review/verify, make every editor bridge point to the authoritative gates, and prove failures with adversarial lifecycle cases.

## Dependencies & prerequisites

- Phase 3 CLI commands and TypeScript adapter merged.

## Unit index

| Unit | Artifact | Branch | Worktree | Depends on | Parallelizable |
|---|---|---|---|---|---|
| 04.01 Lifecycle Contracts | `unit-01-lifecycle-contracts.md` | `task/0001/phase-04/lifecycle-contracts` | `.worktrees/0001/phase-04/lifecycle-contracts` | 03.03 | 04.02 |
| 04.02 Bridge and Doctor Parity | `unit-02-bridge-doctor-parity.md` | `task/0001/phase-04/bridge-doctor-parity` | `.worktrees/0001/phase-04/bridge-doctor-parity` | 03.03 | 04.01 |
| 04.03 Adversarial Lifecycle Evaluations | `unit-03-adversarial-evaluations.md` | `task/0001/phase-04/adversarial-evaluations` | `.worktrees/0001/phase-04/adversarial-evaluations` | 04.01, 04.02 | none |

## Phase verification

- `node --test evals/lifecycle-conformance.test.mjs evals/bridge-conformance.test.mjs`
- `npm test`
- Generated bridge snapshots for every supported editor must contain the same required CLI gate semantics.

## Risks and rollback

- Keep adapters thin; shared policy stays in SHARED/core contracts.
- Revert generated-instruction changes together with bridge snapshots.
- Teardown unit worktrees after phase integration.
