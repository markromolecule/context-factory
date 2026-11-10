---
title: "Direct runner integration"
type: phase
parent: "feat-PLN-0015-grounded-run-context-and-retrieval-evalu"
phase: "02"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, phase, harness]
---

# Phase 2: Direct runner integration

## Objective

Wire Phase 1's bounded source assembly into `executeRun` and both public run command paths, preserving a single provider payload contract and exposing a compact budget receipt.

## Dependencies & Prerequisites

- Unit 01.01 must be verified and committed on the task branch. If its assembly contract differs from the plan, reconcile this unit before execution.
- Verify the released brief and current branch before editing.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact file | Task branch | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| 02.01 | Send bounded sources to every direct provider | `unit-01-direct-run-payload.md` | `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` | 01.01 | planned |

## Impacted Files & Components

- `orchestrator/runner.mjs`: provider dispatch.
- `app/cli/commands/run.mjs`, `app/cli/bin/context-cli.mjs`, `scripts/harness-cli.mjs`: run command entries and help.
- `schemas/run-result.schema.json`: result receipt contract.
- `evals/tests/rules/prompt-compiler.test.mjs` and new `evals/tests/cli/run-budget.test.mjs`: integration and CLI contract tests.
- `evals/run-evals.mjs`: give routing datasets an explicit offline cap so the existing suite remains runnable after direct runs enforce the recommended default.
- `context-manifest.json` and `context-lock.json`: register the new evaluation test and pin the updated inventory.

## Implementation Tasks

- [ ] Unit 02.01 assembles selected sources after resolution, enforces the final cap after prompt hooks, dispatches only a passing payload, and reports an input-budget receipt without source bodies.

## Verification & Testing

- `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs` checks direct/custom provider capture, no-dispatch overflow, hook behavior, schema receipt, and both command paths. `node scripts/context.mjs doctor` confirms the new test is registered in the manifest and lock.
- `pnpm run test` must pass all 27 existing evaluations with the explicit offline cap; this is test setup, not a change to the direct-run default.
- Run configured `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor`; typecheck is unconfigured.

## Risks & Rollback

- A hook can add text after initial assembly. Recount the final prepared payload before dispatch and fail if it exceeds cap.
- Revert this unit's scoped files on the task branch; no data migration or remote state is involved.
