---
title: "Phase 2 — Rule File Relocation & Manifest Sync"
type: phase
parent: "0003-task-categorical-restructuring-of-context-factory-rules"
phase: "02"
status: completed
created: "2026-08-20"
tags: [task, phase, refactor, manifest]
---

# Phase 2 — Rule File Relocation & Manifest Sync

## Objective

Move all 14 relocated rule files into their target directories, delete the empty `rules/frontend/` folder, update `context-manifest.json`, and update `docs/Rules.md` with new Obsidian wiki links.

## Dependencies & Prerequisites

- Phase 1 completed with verified relocation map.

## Impacted Files & Components

- Rule directories: `rules/database/`, `rules/hooks/`, `rules/ui/`, `rules/backend/`, `rules/frontend/` (deleted).
- `context-manifest.json` [MODIFY]: Updated rule file paths.
- `docs/Rules.md` [MODIFY]: Updated category headings and rule links.

## Implementation Tasks

- [x] Task 2.1 — Relocate database rules from `rules/backend/` to `rules/database/` (`schema-db.md`, `data-access-via-db.md`, `query-optimization-and-pagination.md`, `testing-data-access-layer.md`).
- [x] Task 2.2 — Relocate client hook rules from `rules/frontend/` to `rules/hooks/` (`custom-hooks.md`, `query-hooks.md`, `mutation-hooks.md`, `zustand-store.md`).
- [x] Task 2.3 — Relocate UI rules from `rules/frontend/` to `rules/ui/` (`frontend.md`, `next-react-project-structure.md`, `code-organization.md`, `forms-and-validation.md`, `dialogs-and-overlays.md`, `interaction-feedback.md`) and remove `rules/frontend/`.
- [x] Task 2.4 — Update `context-manifest.json` with the new rule paths organized into the 6 categories.
- [x] Task 2.5 — Update `docs/Rules.md` with the 6 category headings and updated wiki links.

## Verification & Testing

- Inspected `rules/` filesystem: confirmed 30 rules distributed across 6 directories (`global: 7`, `database: 4`, `backend: 4`, `typescript: 5`, `hooks: 4`, `ui: 6`).
- Verified `rules/frontend/` removed.

## Risks & Rollback

- Risk: Broken wiki link references across docs.
- Rollback: Revert via git.
