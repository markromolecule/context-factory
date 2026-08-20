---
title: "Phase 1 — Boundary Analysis & Taxonomy Alignment"
type: phase
parent: "0003-task-categorical-restructuring-of-context-factory-rules"
phase: "01"
status: completed
created: "2026-08-20"
tags: [task, phase, refactor, taxonomy]
---

# Phase 1 — Boundary Analysis & Taxonomy Alignment

## Objective

Map each of the 30 existing rule files into the 6 approved domain categories (`global`, `database`, `backend`, `typescript`, `hooks`, `ui`), confirm migration mappings, and prepare target directories.

## Dependencies & Prerequisites

- Completed grill discovery session recorded in parent `README.md`.
- Working directory clean with zero uncommitted changes.

## Impacted Files & Components

- Rule directories:
  - `rules/global/` (Retained, 7 rules)
  - `rules/database/` (NEW directory, 4 rules)
  - `rules/backend/` (Refined, 4 rules)
  - `rules/typescript/` (Retained, 5 rules)
  - `rules/hooks/` (NEW directory, 4 rules)
  - `rules/ui/` (NEW directory, 6 rules)
  - `rules/frontend/` (To be removed after migration)

## Implementation Tasks

- [x] Task 1.1 — Create target directories `rules/database/`, `rules/hooks/`, `rules/ui/`.
- [x] Task 1.2 — Pin exact file relocation map:
  - `rules/backend/schema-db.md` -> `rules/database/schema-db.md`
  - `rules/backend/data-access-via-db.md` -> `rules/database/data-access-via-db.md`
  - `rules/backend/query-optimization-and-pagination.md` -> `rules/database/query-optimization-and-pagination.md`
  - `rules/backend/testing-data-access-layer.md` -> `rules/database/testing-data-access-layer.md`
  - `rules/frontend/custom-hooks.md` -> `rules/hooks/custom-hooks.md`
  - `rules/frontend/query-hooks.md` -> `rules/hooks/query-hooks.md`
  - `rules/frontend/mutation-hooks.md` -> `rules/hooks/mutation-hooks.md`
  - `rules/frontend/zustand-store.md` -> `rules/hooks/zustand-store.md`
  - `rules/frontend/frontend.md` -> `rules/ui/frontend.md`
  - `rules/frontend/next-react-project-structure.md` -> `rules/ui/next-react-project-structure.md`
  - `rules/frontend/code-organization.md` -> `rules/ui/code-organization.md`
  - `rules/frontend/forms-and-validation.md` -> `rules/ui/forms-and-validation.md`
  - `rules/frontend/dialogs-and-overlays.md` -> `rules/ui/dialogs-and-overlays.md`
  - `rules/frontend/interaction-feedback.md` -> `rules/ui/interaction-feedback.md`

## Verification & Testing

- Created `rules/database/`, `rules/hooks/`, `rules/ui/`.
- Validated all 30 rule source paths and destination paths.

## Risks & Rollback

- Risk: File path collision during move.
- Rollback: Revert via git if needed.
