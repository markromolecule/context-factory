---
title: "Phase 04 — Rule selection and final integration"
type: phase
parent: "feat-PLN-0007-typescript-backend-rule-expansion"
phase: "04"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, phase]
---

# Phase 04 — Rule Selection and Final Integration

## Objective

Prove relevant backend guidance reaches short requests, measure rendered context, and verify the whole task before handoff.

## Dependencies & Prerequisites

- Units 01.01 through 03.01 are reviewed and complete on the recorded task branch. Their catalog and conformance receipts are current; this phase still requires a fresh whole-diff receipt.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 04.01 | Selection, payload, and whole-task verification | `unit-01-verification-and-release.md` | `feat/PLN-0007-typescript-backend-rule-expansion` | 03.01 | planned |

## Impacted Files & Components

- `evals/tests/rules/rule-binding.test.mjs`, `evals/tests/rules/code-generation-evaluation.test.mjs`, new representative backend evaluation dataset, and `evals/tests/rules/catalog-coverage.test.mjs` if synchronized inventory changes its count.
- `orchestrator/rules/binding-compiler.mjs` or `scripts/context-core.mjs` only when a failing selection test proves that existing metadata/globs cannot select the intended rules. `docs/Rules.md`, `context-manifest.json`, and `context-lock.json` are reconciled.

## Implementation Tasks

- [ ] Test short create/read requests for operation-module selection, established host roots and test suffixes, and exclusion of unrelated UI/framework guidance.
- [ ] Measure rendered provider payload on fixed requests and evaluate representative output against boundary, privacy, transaction, and testing expectations; report both quality and size.
- [ ] Reconcile catalog/decision maps and run final lint, evaluations, doctor, review, and whole-diff conformance.

## Verification & Testing

`node --test evals/tests/rules/rule-binding.test.mjs evals/tests/rules/code-generation-evaluation.test.mjs`, `npm run lint`, `node evals/run-evals.mjs`, and `node scripts/context.mjs doctor`. Obtain a fresh whole-diff preflight/conformance PASS with named human evidence and record the exact Git diff and hashes. Planning does not pre-approve merge.

## Risks & Rollback

Prompt growth and selector overreach can erase the benefit of compact rules. If the binding test fails, fix the narrowest metadata or selector seam and rerun all affected tests. Roll back this unit's selector/evaluation/catalog changes together; do not merge an incomplete task.
