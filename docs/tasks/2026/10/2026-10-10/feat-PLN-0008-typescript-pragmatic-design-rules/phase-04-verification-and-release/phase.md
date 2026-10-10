---
title: "Phase 04 — Binding, conformance, and catalog release"
type: phase
parent: "feat-PLN-0008-typescript-pragmatic-design-rules"
phase: "04"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, phase, verification]
---

# Phase 04 — Binding, Conformance, and Catalog Release

## Objective

Prove the new guidance reaches only relevant TypeScript files, appears in the rendered provider payload, retains honest enforcement, and leaves the factory catalog healthy.

## Dependencies & Prerequisites

Units 01.01, 02.01, 03.01, and 03.02 must have reviewed commits and current unit receipts. Verify the exact task branch, plan packet, and catalog before changing integration tests. This phase does not merge automatically.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| --- | --- | --- | --- | --- | --- |
| 04.01 | Selection, enforcement, and whole-task release | `unit-01-verification-and-release.md` | `feat/PLN-0008-typescript-pragmatic-design-rules` | 03.01, 03.02 | planned |

## Impacted Files & Components

Rule-binding and rendered-payload tests, representative evaluation dataset, catalog coverage, manifests/maps/version/lock, and execution receipts. No host application, runtime dependency, schema, or deployment changes.

## Implementation Tasks

- [ ] Add TypeScript/TSX positive and JavaScript/unrelated-stack negative binding cases, including nearest-package framework selection.
- [ ] Measure rendered payload, inspect representative output quality separately, and prove evidence-blocking directives do not pass without named evidence.
- [ ] Synchronize catalog and version, run all declared checks and final whole-diff conformance, then submit a reviewable checkpoint.

## Verification & Testing

Unit 04.01 runs focused integration/contract tests, lint, all evaluations, doctor, plan:check, and final whole-diff preflight/conform with independently verified receipt. Record the exact scope, hashes, report ID, skipped checks, and any human-evidence or waiver source. `FAIL`, `BLOCKED`, `TOOL_UNAVAILABLE`, and `UNSUPPORTED` never count as PASS.

## Risks & Rollback

Selection may overbind the common rule or duplicate framework text, increasing payload. Report actual bytes and quality separately and narrow metadata only with a failing test. Revert evaluation/catalog integration as one unit if invalid; reopen the owning earlier unit for a rule defect. Merge to `master` only after review and developer authorization.
