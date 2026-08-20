---
title: "Phase 3 — Context Manifest, Schema, Evaluation & Test Alignment"
type: phase
parent: "0002-task-data-layer-optimization-and-system-performance-arc"
phase: "03"
status: completed
created: "2026-08-20"
tags: [task, phase, manifest, evals, docs]
---

# Phase 3 — Context Manifest, Schema, Evaluation & Test Alignment

## Objective

Register the new rules into `context-manifest.json`, update documentation maps, and ensure context resolution tests accurately match requests for query optimization, pagination, async discipline, and custom/mutation hooks.

## Dependencies & Prerequisites

- Phase 2 completed with all rule files created and updated.

## Impacted Files & Components

- `context-manifest.json` [MODIFY]: Register `rules/backend/query-optimization-and-pagination.md` and `rules/frontend/custom-hooks.md` with appropriate match triggers and metadata.
- `docs/Rules.md` [MODIFY]: Index the new rules in the documentation navigation map.
- `evals/datasets/context-resolution.eval.json` [MODIFY]: Add or update evaluation test cases covering query optimization, pagination, async concurrency, and custom hook resolution.

## Implementation Tasks

- [x] Task 3.1 — Update `context-manifest.json` under `rules`:
  - Add `rules/backend/query-optimization-and-pagination.md` with keywords (`query`, `optimization`, `pagination`, `cursor`, `keyset`, `kysely`, `facet`, `limit`, `sort`, `index`).
  - Add `rules/frontend/custom-hooks.md` with keywords (`hook`, `custom hook`, `use`, `state`, `memo`).
  - Add `docs/decisions/0010-data-layer-query-optimization-and-performance-architecture.md` under `decisions`.
- [x] Task 3.2 — Update `docs/Rules.md` to list and link the new rules.
- [x] Task 3.3 — Verified context resolution behavior for query optimization and custom/mutation hooks via `scripts/harness-cli.mjs resolve`.

## Verification & Testing

- Ran `node scripts/harness-cli.mjs resolve "optimization of queries in backend using kysely with cursor pagination"`: verified `rules/backend/query-optimization-and-pagination.md` is selected.
- Ran `node scripts/harness-cli.mjs resolve "custom hook state memoization and mutation hook optimistic update"`: verified `rules/frontend/custom-hooks.md` and `rules/frontend/mutation-hooks.md` are selected.

## Risks & Rollback

- Risk: Missing keyword matches or invalid JSON formatting in `context-manifest.json`.
- Rollback: Revert `context-manifest.json` and eval files.
