---
title: "Phase 4 — Manifest & Lock Synchronization, Final Verification & Documentation"
type: phase
parent: "refactor-PLN-0011-clean-ephemeral-dirs-and-conformance"
phase: "04"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, phase, manifest, lock, release]
---

# Phase 4 — Manifest & Lock Synchronization, Final Verification & Documentation

## Objective

Deregister all deleted tools, schemas, and datasets from `context-manifest.json`, regenerate `context-lock.json`, update system documentation (`README.md`, `orchestrator/SHARED.md`), and perform end-to-end verification across `npm test`, `context-cli validate`, and `context-cli doctor`.

## Dependencies & Prerequisites

- Phase 3 completed (tooling and validator aligned).

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Manifest Sync, Lockfile Refresh, Docs Update, and Final Verification | `unit-01-manifest-sync-and-verification.md` | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | `03.01` | `planned` |

## Impacted Files & Components

- `context-manifest.json` (deregister deleted tools, schemas, datasets)
- `context-lock.json` (regenerated via `node scripts/context.mjs lock`)
- `README.md` (remove conform documentation and cards)
- `orchestrator/SHARED.md` (remove conform requirements)

## Implementation Tasks

- [ ] Unit 04.01 — Update manifest, lock, documentation, and execute full verification.

## Verification & Testing

- `node scripts/validate-context.mjs` returns PASS.
- `node app/cli/bin/context-cli.mjs doctor` returns HEALTHY (100% PASS).
- `npm test` passes all evaluations.

## Risks & Rollback

- Stale lockfile hash if files are edited after locking. Mitigation: generate lockfile as the final step after all content edits.
