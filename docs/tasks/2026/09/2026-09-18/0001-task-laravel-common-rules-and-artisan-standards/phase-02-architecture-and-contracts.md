---
title: "Phase 2 — Authoring Common Rules (Naming, Artisan, Structure)"
type: phase
parent: "0001-task-laravel-common-rules-and-artisan-standards"
phase: "02"
status: completed
created: "2026-09-18"
tags: [task, phase, laravel, rules]
---

# Phase 2 — Authoring Common Rules (Naming, Artisan, Structure)

## Objective

Author the three new canonical Laravel rules in `rules/laravel/common/`: `naming-conventions.md`, `artisan-commands.md`, and `project-structure.md`, and update `rules/laravel/foundation/conventions.md` to reference the new naming standards.

## Dependencies & Prerequisites

- Phase 1 complete.

## Impacted Files & Components

- `rules/laravel/common/naming-conventions.md` [NEW] — Comprehensive naming conventions for all Laravel classes, schemas, routes, and views.
- `rules/laravel/common/artisan-commands.md` [NEW] — CLI standards for signatures, confirmation, streaming, and Action/Job delegation.
- `rules/laravel/common/project-structure.md` [NEW] — Modern Laravel 11/12 lean `bootstrap/app.php`, folder layout, and configuration hygiene.
- `rules/laravel/foundation/conventions.md` [MODIFY] — Streamline naming section and link to `rules/laravel/common/naming-conventions.md`.

## Implementation Tasks

- [x] Task 2.1 — Author `rules/laravel/common/naming-conventions.md` with full matrix of Laravel primitives:
  - Models, Tables, Pivots, Foreign/Polymorphic keys, Timestamps, Booleans.
  - Relations (`belongsTo`, `hasOne`, `hasMany`, `belongsToMany`).
  - Controllers (Resource vs Invokable), Requests, API Resources, Policies, Events, Listeners, Jobs, Mailables, Notifications, Enums, Routes, Artisan commands, Migrations, Blade components, and Config keys.
- [x] Task 2.2 — Author `rules/laravel/common/artisan-commands.md` with:
  - Command signatures (`domain:verb-noun`), descriptions, argument vs option conventions (`--force`, `--dry-run`, `--limit=`).
  - Safe production execution: require `$this->confirmToProceed()` or `--force` in production environments.
  - Memory safety: mandate `chunkById()` or `LazyCollection` (`->cursor()`), progress bars (`$this->withProgressBar()`), and `DB::disableQueryLog()`.
  - Single-responsibility delegation to Invokable Actions or Queued Jobs.
  - Exit codes: `Command::SUCCESS`, `Command::FAILURE`, `Command::INVALID`.
- [x] Task 2.3 — Author `rules/laravel/common/project-structure.md` with:
  - Lean `bootstrap/app.php` configuration (middleware, exceptions, routing) without legacy `Kernel.php` files.
  - Standard directory layout: `app/Actions/<Domain>/`, `app/Models/`, `app/Enums/`, `app/Rules/`, `app/Http/Requests/`, `app/Http/Resources/`.
  - Console route and schedule registration in `routes/console.php`.
  - Strict `config()` vs `env()` hygiene.
- [x] Task 2.4 — Update `rules/laravel/foundation/conventions.md` to reference `common/naming-conventions.md`.
- [x] Task 2.5 — Author `rules/laravel/common/anti-patterns.md` with comprehensive anti-patterns and bad habits matrix (untyped arrays, N+1 queries, mass assignment, env caching, monolithic controllers) and synchronize cross-references across `foundation/conventions.md`, `database/query-optimization.md`, `http/requests-and-validation.md`, and `application/business-logic-and-actions.md`.

## Verification & Testing

- Verified all 5 rule frontmatters meet strict schema constraints (`name`, `description`, `scope`, `alwaysApply: boolean`) via Node script runner.
- Confirmed PHP 8.2+ code examples adhere to strict typing, readonly types, backed enums, and modern Laravel 11+ methods.
- Confirmed cross-references to `rules/laravel/common/anti-patterns.md` and `rules/laravel/common/naming-conventions.md` across the entire Laravel ruleset.

## Risks & Rollback

- Risk: Inconsistent terminology or contradictory rules.
- Mitigation: Cross-checked against ADR 0022 and existing rules in `rules/laravel/http/` and `rules/laravel/database/`.
- Rollback: Delete `rules/laravel/common/` and revert `conventions.md`.
