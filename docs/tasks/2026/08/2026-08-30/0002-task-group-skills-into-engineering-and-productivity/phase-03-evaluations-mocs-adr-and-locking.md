---
title: "Phase 3: Evaluations, MOCs, ADR and Locking"
type: phase
parent: "0002-task-group-skills-into-engineering-and-productivity"
phase: "3"
status: completed
created: "2026-08-30"
tags: [task, phase, adr, evals, manifest, lock, doctor]
---

# Phase 3: Evaluations, MOCs, ADR and Locking

## Objective

Author ADR 0020, update documentation maps, update all evaluation test cases and datasets, sync manifest inventory, regenerate lockfile, and run the complete doctor diagnostic.

## Dependencies & Prerequisites

- Phase 1 and Phase 2 completed.

## Impacted Files & Components

- `docs/decisions/0020-categorical-skill-grouping-and-group-indexes.md` (NEW): Architecture Decision Record.
- `docs/decisions/README.md` (MODIFY): Link ADR 0020.
- `docs/Skills.md` & `docs/guide/skills.md` (MODIFY): Update grouped skills and guide notes.
- `evals/cases/*.json` & `evals/datasets/**/*.json` (MODIFY): Update expected skill paths.
- `context-manifest.json` & `context-lock.json` (MODIFY): Synchronize canonical inventory and regenerate lockfile.

## Implementation Tasks

- [x] Author `docs/decisions/0020-categorical-skill-grouping-and-group-indexes.md`.
- [x] Update `docs/decisions/README.md`.
- [x] Update `docs/Skills.md` and `docs/guide/skills.md`.
- [x] Update all 14 evaluation test cases and datasets in `evals/`.
- [x] Update `context-manifest.json` canonical inventory.
- [x] Run `node scripts/context.mjs lock` to update `context-lock.json`.
- [x] Run `node scripts/context.mjs doctor` to verify complete health.

## Verification & Testing

- `node scripts/validate-context.mjs` — PASS
- `node evals/run-evals.mjs` — 21/21 PASS
- `node scripts/context.mjs doctor` — 100% HEALTHY

## Risks & Rollback

- Revert manifest and lockfile if doctor detects inventory mismatch or broken wiki links.
