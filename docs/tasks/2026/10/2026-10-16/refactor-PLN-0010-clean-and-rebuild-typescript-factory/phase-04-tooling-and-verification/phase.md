---
title: "Phase 4 — Tooling Alignment, Bridge Generator, Validator, and Final Verification"
type: phase
parent: "refactor-PLN-0010-clean-and-rebuild-typescript-factory"
phase: "04"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: completed
created: "2026-10-16"
tags: [task, phase]
---

# Phase 4 — Tooling Alignment, Bridge Generator, Validator, and Final Verification

## Objective

Update `scripts/validate-context.mjs`, `app/cli/core/bridge-generator.mjs`, and `app/cli/core/indexer.mjs` to validate and symlink `skills/workflows/` directly into `.agents/skills/`, remove assertions requiring deleted root files, author ADR 0039, update Maps of Content (`docs/Skills.md`, `docs/Workflows.md`), synchronize `context-manifest.json` and `context-lock.json`, and verify 100% HEALTHY doctor diagnostics.

## Dependencies & Prerequisites

- Phases 1, 2, and 3 completed on branch `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Tooling Alignment, Bridge Symlinks, ADR 0039, and Lockfile Synchronization | `unit-01-tooling-and-verification.md` | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | `03.01` | `completed` |

## Impacted Files & Components

- **Modified:**
  - `scripts/validate-context.mjs`
  - `app/cli/core/bridge-generator.mjs`
  - `app/cli/core/indexer.mjs`
  - `context-manifest.json`
  - `context-lock.json`
  - `docs/Skills.md`
  - `docs/Workflows.md`
  - `docs/decisions/README.md`
- **Created:**
  - `docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md`

## Implementation Tasks

- [x] Unit 04.01 — Update validator and bridge generator, author ADR 0039, regenerate MOCs, manifest, and lockfile, and verify `node scripts/context.mjs doctor`.

## Verification & Testing

- `node scripts/validate-context.mjs` passes with 0 errors.
- `node scripts/context.mjs doctor` passes 100% HEALTHY.
- `npm test` passes all evaluations.

## Risks & Rollback

- Revert changes via git restore.
