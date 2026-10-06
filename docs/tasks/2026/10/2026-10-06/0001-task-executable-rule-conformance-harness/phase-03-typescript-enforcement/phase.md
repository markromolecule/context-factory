---
title: "Phase 3 — TypeScript Conformance and CLI Enforcement"
type: phase
parent: "0001-task-executable-rule-conformance-harness"
phase: "03"
phase_branch: "task/0001/phase-03-integration"
status: completed
created: "2026-10-06"
tags: [task, phase, conformance, typescript, cli]
---

# Phase 3 — TypeScript Conformance and CLI Enforcement

## Objective

Implement the model-neutral conformance/evidence gate, prove the adapter seam with TypeScript, and expose authoritative fail-closed repository commands.

## Dependencies & prerequisites

- Phase 2 merged and verified.

## Unit index

| Unit | Artifact | Branch | Worktree | Depends on | Parallelizable |
|---|---|---|---|---|---|
| 03.01 Conformance and Evidence Gate | `unit-01-conformance-evidence-gate.md` | `task/0001/phase-03/conformance-evidence-gate` | `.worktrees/0001/phase-03/conformance-evidence-gate` | 02.02, 02.03 | none |
| 03.02 TypeScript Adapter | `unit-02-typescript-adapter.md` | `task/0001/phase-03/typescript-adapter` | `.worktrees/0001/phase-03/typescript-adapter` | 03.01 | none |
| 03.03 CLI Enforcement | `unit-03-cli-enforcement.md` | `task/0001/phase-03/cli-enforcement` | `.worktrees/0001/phase-03/cli-enforcement` | 03.02 | none |

## Phase verification

- `node --test evals/conformance-gate.test.mjs evals/typescript-adapter.test.mjs evals/conformance-cli.test.mjs`
- Confirm failing blocking fixtures return non-zero and no checkpoint-success state.

## Risks and rollback

- Adapter registration is additive and removable without changing descriptor/report schemas.
- Preserve distinct failure states; never downgrade tool failures to advisory.
- Teardown worktrees after phase integration.
