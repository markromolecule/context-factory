---
title: "Phase 2: Update Canonical Manifest and Obsidian Rules Map"
type: phase
parent: "docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/README.md"
phase: "2"
status: completed
created: "2026-08-22"
tags: [task, phase, manifest, documentation]
---

# Phase 2: Update Canonical Manifest and Obsidian Rules Map

## Objective

Synchronize `context-manifest.json` and `docs/Rules.md` with the new file paths under `rules/typescript/` to satisfy the Context Factory inventory requirements.

## Dependencies & Prerequisites

- Phase 1 completed (all rule files moved to their new locations).

## Impacted Files & Components

- `context-manifest.json` (canonical inventory of rules)
- `docs/Rules.md` (Obsidian Map of Content with wikilinks)

## Implementation Tasks

- [x] Update `context-manifest.json` `rules` array with the new 30 paths:
  - `rules/global/*.md` (7 items)
  - `rules/typescript/backend/*.md` (4 items)
  - `rules/typescript/common/*.md` (5 items)
  - `rules/typescript/database/*.md` (4 items)
  - `rules/typescript/hooks/*.md` (4 items)
  - `rules/typescript/ui/*.md` (6 items)
- [x] Update `docs/Rules.md` to reflect the updated folder taxonomy:
  - `## Global` (`rules/global/`)
  - `## TypeScript`
    - `### Common` (`rules/typescript/common/`)
    - `### Backend` (`rules/typescript/backend/`)
    - `### Database` (`rules/typescript/database/`)
    - `### Hooks` (`rules/typescript/hooks/`)
    - `### UI` (`rules/typescript/ui/`)

## Verification & Testing

- Ran `node scripts/validate-context.mjs`: confirmed 0 inventory mismatch errors between disk files, `context-manifest.json`, and `docs/Rules.md`.

## Risks & Rollback

- **Risk:** Typo in wikilink format or missing rule path in manifest triggers inventory difference errors in `validate-context.mjs`.
- **Rollback:** Revert `context-manifest.json` and `docs/Rules.md` via `git checkout`.

