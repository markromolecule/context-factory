---
title: "Phase 2 — Purge Model-Specific Root Entrypoints & Model Adapters"
type: phase
parent: "refactor-PLN-0010-clean-and-rebuild-typescript-factory"
phase: "02"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: planned
created: "2026-10-16"
tags: [task, phase]
---

# Phase 2 — Purge Model-Specific Root Entrypoints & Model Adapters

## Objective

Remove redundant model-specific adapter files from the root and orchestrator directories (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*` adapters), designating `orchestrator/SHARED.md` and `README.md` as the sole model-neutral contracts.

## Dependencies & Prerequisites

- Phase 1 completed on branch `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Remove Root Model Adapters and Centralize Contract | `unit-01-root-adapter-removal.md` | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | `01.01` | `planned` |

## Impacted Files & Components

- **Deleted:**
  - `AGENTS.md`
  - `CLAUDE.md`
  - `CODEX.md`
  - `GEMINI.md`
  - `.cursorrules`
  - `.windsurfrules`
  - `.github/copilot-instructions.md`
  - `orchestrator/AGENTS.md`
  - `orchestrator/CLAUDE.md`
  - `orchestrator/CODEX.md`
  - `orchestrator/GEMINI.md`
- **Preserved:**
  - `README.md`
  - `orchestrator/SHARED.md`

## Implementation Tasks

- [ ] Unit 02.01 — Remove the 7 root/github adapter files and 4 orchestrator model adapter files, ensuring `orchestrator/SHARED.md` is clean and model-neutral.

## Verification & Testing

- `git status --short` confirms all targeted adapter files are deleted.
- Inspect `orchestrator/SHARED.md` to ensure it carries no dangling references to deleted adapter files.

## Risks & Rollback

- Revert file deletions via `git checkout -- <deleted-files>`.
