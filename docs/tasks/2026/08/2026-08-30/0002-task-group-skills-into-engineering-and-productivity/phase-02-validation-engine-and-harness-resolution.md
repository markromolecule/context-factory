---
title: "Phase 2: Validation Engine and Harness Resolution"
type: phase
parent: "0002-task-group-skills-into-engineering-and-productivity"
phase: "2"
status: completed
created: "2026-08-30"
tags: [task, phase, validation, harness, resolution]
---

# Phase 2: Validation Engine and Harness Resolution

## Objective

Enhance `scripts/validate-context.mjs`, `scripts/context-core.mjs`, and `app/cli/core/indexer.mjs` to support nested skill paths and enforce automated group `README.md` presence and link synchronization.

## Dependencies & Prerequisites

- Phase 1 completed (skills moved and group READMEs created).

## Impacted Files & Components

- `scripts/validate-context.mjs` (MODIFY): Add group README check, update skill resource parent detection, and support nested paths.
- `scripts/context-core.mjs` (MODIFY): Support nested skill matching for agents and workflows.
- `app/cli/core/indexer.mjs` (MODIFY): Group skills by category in generated MOCs.

## Implementation Tasks

- [x] Update `scripts/validate-context.mjs` with group README validation invariant.
- [x] Update `scripts/context-core.mjs` agent declared skills lookup.
- [x] Update `app/cli/core/indexer.mjs` skill grouping logic.

## Verification & Testing

- Run `node scripts/validate-context.mjs` to test group README enforcement.

## Risks & Rollback

- Revert validator changes if false positive errors occur.
