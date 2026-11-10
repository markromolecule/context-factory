---
title: "Routing and grounded evaluation"
type: phase
parent: "feat-PLN-0015-grounded-run-context-and-retrieval-evalu"
phase: "03"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, phase, evaluation]
---

# Phase 3: Routing and grounded evaluation

## Objective

Close the observed authenticated-request routing miss and replace fixture-fed dataset success with tests that observe the actual retrieval-to-answer boundary.

## Dependencies & Prerequisites

- Units 01.01 and 02.01 have passing, committed receipts on the same task branch; the provider input now carries bounded, labeled sources.
- Verify the released brief and current branch. Reconcile this phase if the prompt representation changed during Phase 2.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact file | Task branch | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| 03.01 | Route authenticated endpoint requests | `unit-01-authenticated-routing.md` | `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` | 02.01 | planned |
| 03.02 | Evaluate source-dependent answers | `unit-02-grounded-evaluation.md` | `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` | 03.01 | planned |

## Impacted Files & Components

- `scripts/context-core.mjs`, `evals/tests/resolver/intent-routing.test.mjs`: routing positive and negative cases.
- `evals/run-evals.mjs`, `evals/tests/rules/prompt-compiler.test.mjs`: golden-output separation and source-dependent answer test.
- `.github/workflows/context-factory.yml`: run focused source-dependent and CLI tests after doctor in pull-request CI.
- `context-lock.json`: refresh hashes after each unit changes manifest-tracked code and tests.

## Implementation Tasks

- [ ] Unit 03.01 normalizes authenticated intent sufficiently to select feature delivery and security guidance without broad order-domain false positives.
- [ ] Unit 03.02 removes golden-output injection from dataset execution, proves a deterministic offline answer depends on received source content and provenance, and runs that regression in CI.

## Verification & Testing

- `node --test evals/tests/resolver/intent-routing.test.mjs` for workflow/security positive and negative cases.
- `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs evals/tests/resolver/intent-routing.test.mjs` and `node scripts/context.mjs eval` for provider-boundary, CLI, routing, and dataset behavior; CI must invoke the focused Node command.
- `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` after each unit; report exact revision and exit codes. Typecheck remains unconfigured.

## Risks & Rollback

- A broad authentication synonym can overroute unrelated requests; negative fixtures constrain it.
- Offline deterministic answers demonstrate harness wiring but not general live-model reasoning. Report that limit in the result.
- Revert each unit's scoped commit in reverse order on the task branch if its contract fails; no stored data migration is involved.
