---
title: "Phase 1: Relocate Rule Files & Organize TypeScript Subfolders"
type: phase
parent: "docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/README.md"
phase: "1"
status: completed
created: "2026-08-22"
tags: [task, phase, rules, refactor]
---

# Phase 1: Relocate Rule Files & Organize TypeScript Subfolders

## Objective

Move all domain-specific rule directories (`backend/`, `database/`, `hooks/`, `ui/`) and core TypeScript rules into their respective subdirectories under `rules/typescript/`, ensuring that only `global/` and `typescript/` remain at the root of `rules/`.

## Dependencies & Prerequisites

- Context specification [[docs/context/refactors/language-scoped-rules-restructure|language-scoped-rules-restructure.md]] approved and ready.

## Impacted Files & Directories

- `rules/global/` (retained at root as universal rules)
- `rules/typescript/common/` (new directory):
  - `async-discipline.md` (moved from `rules/typescript/`)
  - `error-handling.md` (moved from `rules/typescript/`)
  - `module-and-imports.md` (moved from `rules/typescript/`)
  - `runtime-validation.md` (moved from `rules/typescript/`)
  - `type-safety.md` (moved from `rules/typescript/`)
- `rules/typescript/backend/` (moved from `rules/backend/`):
  - `controllers-and-routes.md`
  - `data-access-via-api.md`
  - `module-architecture.md`
  - `service-layer.md`
- `rules/typescript/database/` (moved from `rules/database/`):
  - `data-access-via-db.md`
  - `query-optimization-and-pagination.md`
  - `schema-db.md`
  - `testing-data-access-layer.md`
- `rules/typescript/hooks/` (moved from `rules/hooks/`):
  - `custom-hooks.md`
  - `mutation-hooks.md`
  - `query-hooks.md`
  - `zustand-store.md`
- `rules/typescript/ui/` (moved from `rules/ui/`):
  - `code-organization.md`
  - `dialogs-and-overlays.md`
  - `forms-and-validation.md`
  - `frontend.md`
  - `interaction-feedback.md`
  - `next-react-project-structure.md`

## Implementation Tasks

- [x] Create `rules/typescript/common/` directory.
- [x] Move `rules/typescript/*.md` files into `rules/typescript/common/`.
- [x] Move `rules/backend/` into `rules/typescript/backend/`.
- [x] Move `rules/database/` into `rules/typescript/database/`.
- [x] Move `rules/hooks/` into `rules/typescript/hooks/`.
- [x] Move `rules/ui/` into `rules/typescript/ui/`.
- [x] Remove old empty root directories (`rules/backend/`, `rules/database/`, `rules/hooks/`, `rules/ui/`).
- [x] Confirm `rules/` root only contains `global` and `typescript`.

## Verification & Testing

- Directory check `ls -la rules rules/typescript` confirmed only `global` and `typescript` at `rules/` root.
- Inspection of all subdirectories confirmed all 30 rule files present (7 global, 5 common, 4 backend, 4 database, 4 hooks, 6 ui).

## Risks & Rollback

- **Risk:** Files accidentally deleted during move.
- **Rollback:** `git checkout -- rules/` can revert any unintended filesystem operations.

