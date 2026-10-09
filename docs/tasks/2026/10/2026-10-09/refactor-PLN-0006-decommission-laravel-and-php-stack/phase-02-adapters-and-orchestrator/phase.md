---
title: "Phase 2 — Adapter and Conformance Engine Decommissioning"
type: phase
parent: "refactor-PLN-0006-decommission-laravel-and-php-stack"
phase: "02"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 2 — Adapter and Conformance Engine Decommissioning

## Objective

Delete `orchestrator/conformance/adapters/laravel.mjs`, unregister Laravel from the CLI conformance registry, update `doctor.mjs` for single-stack TypeScript health, and configure CLI commands to emit an informative `BLOCKED` (exit code 2) diagnostic citing ADR 0036 when `--stack laravel` is requested.

## Dependencies & Prerequisites

- Phase 1 completed (Unit 01.01 done).
- Task branch `refactor/PLN-0006-decommission-laravel-and-php-stack` active.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Remove Laravel Adapter and Implement Decommissioned Stack Diagnostics | `unit-01-adapter-removal-and-cli-diagnostics.md` | `refactor/PLN-0006-decommission-laravel-and-php-stack` | `01.01` | `planned` |

## Impacted Files & Components

- `orchestrator/conformance/adapters/laravel.mjs`: Deleted.
- `app/cli/commands/conform.mjs`: Unregister `registerLaravelAdapter()`; detect explicit `--stack laravel` and fail closed with exit code 2 citing ADR 0036.
- `app/cli/commands/doctor.mjs`: Update conformance adapter readiness diagnostic to report `Adapters: typescript (ready) | Stacks: none unsupported`.
- `scripts/context-core.mjs`: Remove Laravel keyword mappings (`laravel`, `artisan`, `blade`, `eloquent`) from stack inference.

## Implementation Tasks

- [ ] Unit 02.01 — Remove adapter, unregister from CLI, add decommissioned stack diagnostic, and clean stack inference.

## Verification & Testing

- `node scripts/context.mjs conform --stack laravel` (must exit code 2 with informative diagnostic)
- `node scripts/context.mjs doctor`

## Risks & Rollback

- Revert unit changes via git on the task branch.
