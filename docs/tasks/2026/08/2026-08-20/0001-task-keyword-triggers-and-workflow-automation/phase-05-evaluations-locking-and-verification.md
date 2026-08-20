---
title: "Phase 5 — Evaluation Suites, Manifest Sync, Lock Generation, and Doctor Verification"
type: phase
parent: "0001-task-keyword-triggers-and-workflow-automation"
phase: "05"
status: completed
created: "2026-08-20"
tags: [task, phase, evals, lock, doctor]
---

# Phase 5 — Evaluation Suites, Manifest Sync, Lock Generation, and Doctor Verification

## Objective

Expand the unit evaluation cases and datasets in `evals/` to comprehensively test all prefix triggers, update `context-manifest.json` with new files (ADR-0009, new tasks, evals), generate `context-lock.json`, and verify zero defects with `harness-cli.mjs doctor`.

## Dependencies & Prerequisites

- Phases 1, 2, 3, and 4 completed.

## Impacted Files & Components

- `evals/cases/slash-commands.json` (NEW) — Unit evaluation case suite for prefix commands.
- `context-manifest.json` — Add new decisions, tools, and evaluation cases to canonical inventory.
- `context-lock.json` — Regenerated SHA-256 digest lock.

## Implementation Tasks

- [x] Task 1 — Create `evals/cases/slash-commands.json` containing test assertions for `/plan`, `/fix`, `/migrate`, `/sec`, `/grill`, `/adr`, `/verify`, `[HOTFIX]`, and `[DISCOVERY]`.
- [x] Task 2 — Run `node scripts/harness-cli.mjs eval --unit` and ensure 100% pass rate across all cases.
- [x] Task 3 — Update `context-manifest.json` to include newly added files.
- [x] Task 4 — Run `node scripts/harness-cli.mjs lock` to generate fresh `context-lock.json`.
- [x] Task 5 — Run `node scripts/harness-cli.mjs doctor` and ensure 0 errors.

## Verification & Testing

- `node scripts/harness-cli.mjs eval --unit`
- `node scripts/harness-cli.mjs eval --datasets`
- `node scripts/harness-cli.mjs doctor`

## Risks & Rollback

- **Risk:** Unmatched file hashes or missed manifest entries causing `doctor` to fail.
- **Rollback:** Inspect `doctor` diagnostic output, fix inventory entries, and re-lock.
