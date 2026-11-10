---
title: "Bounded source assembly"
type: phase
parent: "feat-PLN-0015-grounded-run-context-and-retrieval-evalu"
phase: "01"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, phase, retrieval]
---

# Phase 1: Bounded source assembly

## Objective

Define and test one deterministic context assembly function that preserves source provenance, instruction boundaries, and a pre-dispatch input cap. This phase does not dispatch providers.

## Dependencies & Prerequisites

- Released brief: `docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`; verify it before execution.
- Start on `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` at the recorded base; refresh rule hashes if sources changed.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact file | Task branch | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| 01.01 | Assemble bounded, labeled source context | `unit-01-bounded-source-assembly.md` | `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` | none | planned |

## Impacted Files & Components

- `orchestrator/rules/prompt-compiler.mjs`: existing bundle and prompt compiler.
- `evals/tests/rules/prompt-compiler.test.mjs`: existing isolated compiler tests.
- `context-lock.json`: refresh hashes for the manifest-tracked compiler and test after changes.

## Implementation Tasks

- [ ] Unit 01.01 defines required/optional whole-source policy, produces the labeled source section, measures the complete prepared input, and returns an omission/budget receipt.

## Verification & Testing

- `node --test evals/tests/rules/prompt-compiler.test.mjs`: source path/hash/content, exact cap, optional omission, required overflow, unsafe path, and instruction-like source tests.
- Regenerate the lock, then record focused tests, `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` for the changed revision. Typecheck is unconfigured.

## Risks & Rollback

- Risk: the existing base contract may dominate the budget. Measure it in tests and fail required overflow explicitly rather than trimming mandatory instructions.
- Revert only Unit 01.01's scoped code, tests, and lock refresh on the task branch if the assembly contract fails review.
