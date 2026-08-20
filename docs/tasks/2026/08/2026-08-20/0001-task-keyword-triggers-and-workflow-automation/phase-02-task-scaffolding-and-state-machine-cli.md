---
title: "Phase 2 — Automated Task Scaffolding and Workflow CLI"
type: phase
parent: "0001-task-keyword-triggers-and-workflow-automation"
phase: "02"
status: completed
created: "2026-08-20"
tags: [task, phase, cli, scaffolding]
---

# Phase 2 — Automated Task Scaffolding and Workflow CLI

## Objective

Build automated task scaffolding commands into `scripts/harness-cli.mjs` and create `scripts/task-workflow.mjs` to auto-generate date-partitioned task directories, populate `README.md` from `docs/templates/Task.md`, generate phase breakdown templates from `docs/templates/Phase.md`, and track workflow state transitions.

## Dependencies & Prerequisites

- Phase 1 trigger engine completed.
- Existing `docs/templates/Task.md` and `docs/templates/Phase.md`.

## Impacted Files & Components

- `scripts/task-workflow.mjs` (NEW) — Core scaffolding, numbering, template interpolation, and status transition utilities.
- `scripts/harness-cli.mjs` — Add `task:new`, `task:list`, `task:status` CLI subcommands.

## Implementation Tasks

- [x] Task 1 — Create `scripts/task-workflow.mjs` with `scaffoldTask({ title, type, phases })` calculating current date (`YYYY/MM/YYYY-MM-DD`), next sequential task ID (`000X-task-...`), and writing template files.
- [x] Task 2 — Add support for interpolating variables (`{{title}}`, `{{date}}`, `{{parent_task}}`, `{{phase_number}}`).
- [x] Task 3 — Integrate `task:new`, `task:list`, and `task:status` subcommands into `scripts/harness-cli.mjs`.
- [x] Task 4 — Test CLI scaffolding output against existing tasks directory structure.

## Verification & Testing

- `node scripts/harness-cli.mjs task:new "Example Test Task" --type feature --dry-run` $\rightarrow$ verifies generated directory path and template contents.
- `node scripts/harness-cli.mjs task:list` $\rightarrow$ verifies JSON/table list of current tasks and their status.

## Risks & Rollback

- **Risk:** Collisions with existing manual task numbering or directory formats.
- **Rollback:** Delete generated draft folder and keep manual template copy workflow.
