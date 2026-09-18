---
title: "Phase 3 — Indexer Update and MOC Synchronization"
type: phase
parent: "0001-task-laravel-common-rules-and-artisan-standards"
phase: "03"
status: completed
created: "2026-09-18"
tags: [task, phase, laravel, indexer]
---

# Phase 3 — Indexer Update and MOC Synchronization

## Objective

Update the Context Factory indexer (`app/cli/core/indexer.mjs`) to recognize the `laravelCommon` group, regenerate the Rules Map of Content (`docs/Rules.md`), and update `context-manifest.json`.

## Dependencies & Prerequisites

- Phase 2 complete (rule files present in `rules/laravel/common/`).

## Impacted Files & Components

- `app/cli/core/indexer.mjs` [MODIFY] — Add `laravelCommon` group to `generateRulesMoc`.
- `docs/Rules.md` [MODIFY] — Generated Obsidian Map of Content.
- `context-manifest.json` [MODIFY] — Registered canonical rules inventory.

## Implementation Tasks

- [x] Task 3.1 — Modify `generateRulesMoc` in `app/cli/core/indexer.mjs`:
  - Add `laravelCommon: { title: "## Laravel\n\n### Common", items: [] }`.
  - Update `laravelFoundation` title to `### Foundation`.
  - Add matching condition: `else if (p.startsWith("rules/laravel/common/")) groups.laravelCommon.items.push(row);`.
- [x] Task 3.2 — Run `node app/cli/bin/context-cli.mjs sync` to automatically discover new files and update `context-manifest.json`, `docs/Rules.md`, and `context-lock.json`.

## Verification & Testing

- `docs/Rules.md` verified: lines 67-75 display `## Laravel` -> `### Common` with 4 canonical wikilinks: `anti-patterns`, `artisan-commands`, `naming-conventions`, and `project-structure`.
- `context-manifest.json` verified: all 4 rules registered in `manifest.rules`.
- `context-lock.json` updated with SHA-256 digest `sha256:d8f8ffd715dbc4ab6bf64ad8099ae445bb200c8aa792284a9a15ebffa5539fb6`.

## Risks & Rollback

- Risk: MOC formatting breakage or missing links.
- Mitigation: Indexer runs deterministically; verified output matches standard MOC schema.
