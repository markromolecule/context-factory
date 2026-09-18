---
title: "Laravel Common Conventions and Artisan Command Standards"
type: context
status: ready
created: "2026-09-18"
tags: [context, rules, laravel, naming-conventions, artisan, common]
feature: "laravel-common-and-artisan-standards"
---

# Laravel Common Conventions and Artisan Command Standards Context Specification

## 1. Overview & Objective

- **Problem Statement:** While Context Factory establishes core Laravel rules across foundation, HTTP, database, application, security, and presentation, critical day-to-day developer guidance is currently fragmented or missing:
  1. `rules/laravel/foundation/conventions.md` has only a 4-bullet summary of naming conventions, omitting comprehensive conventions for Laravel components (Models, Tables, Pivots, Foreign Keys, Controllers, Form Requests, Resources, Policies, Events, Listeners, Jobs, Mailables, Notifications, Enums, Routes, Blade, and Config).
  2. There is no dedicated rule or standard for **Artisan Console Commands** (signatures, argument/option conventions, safe production execution with `--force` confirmation, memory safety via `chunkById` or `LazyCollection`, progress bars, single-responsibility delegation to Actions/Jobs, and standard exit codes).
  3. The directory taxonomy (`common` vs `foundation`) differs from `rules/typescript/common/`, leaving ambiguity on where cross-cutting conventions and CLI tooling belong.
- **Business / User Value:** Provides Laravel developers and AI coding agents with unambiguous, idiomatic standards that eliminate guessing, prevent production CLI disasters (like unchunked memory exhaustion or unconfirmed destructive commands), and guarantee uniform naming across the entire codebase.
- **Success Criteria:**
  - Complete naming conventions table/specification covering all Laravel architectural layers.
  - Dedicated Artisan command standard enforcing memory management, confirmation gates, and Action/Job delegation.
  - Clean taxonomy alignment that integrates smoothly with `context-manifest.json`, `app/cli/core/indexer.mjs`, and `node scripts/context.mjs doctor`.

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a Laravel developer, I want a single authoritative naming conventions rule, so that every class, file, method, table, foreign key, route, and event follows idiomatic Laravel conventions without debate.*
- *As a backend engineer, I want an explicit Artisan command standard, so that commands processing large datasets stream records safely with progress indicators and require confirmation before running mutations in production.*
- *As an AI agent pair programmer, I want predictable rule placement (e.g. `common/` or `foundation/`), so that context resolution deterministically loads naming and command standards.*

### Functional Requirements

- [ ] Define exhaustive naming conventions across all Laravel primitives:
  - Models (singular `PascalCase`), Tables (plural `snake_case`), Pivot tables (singular alphabetical `snake_case`, e.g. `role_user`).
  - Primary keys (`id`, `uuid`, `ulid`), Foreign keys (`<model>_id`), Polymorphic keys (`<name>_id`, `<name>_type`), Timestamps and Boolean flags (`is_*`, `has_*`).
  - Relationships (singular for `belongsTo`/`hasOne`, plural for `hasMany`/`belongsToMany`).
  - Controllers (Resource singular `OrderController`, Invokeable `<Verb><Subject>Controller`), RESTful methods.
  - Form Requests (`<Action><Model>Request`), API Resources (`<Model>Resource`).
  - Policies (`<Model>Policy`), Gates, and authorization methods.
  - Events (past tense `OrderShipped`), Listeners (imperative `SendShipmentNotification`).
  - Queued Jobs (imperative `ProcessPodcast`, `GenerateMonthlyInvoices`).
  - Mailables (`<Noun>Mail`), Notifications (`<Event>Notification`).
  - Backed Enums (singular `PascalCase`, `PascalCase` cases with string values).
  - Routes (URLs `kebab-case`, route names `plural.action`, route parameters `snake_case` or `camelCase`).
  - Artisan commands (signature `<domain>:<verb-noun>`, class `<Action><Domain>Command`).
  - Migrations (`YYYY_MM_DD_HHMMSS_create_<table_name>_table.php`).
  - Blade components (`<x-ui.button>`, views `resources/views/<domain>/<action>.blade.php`).
- [ ] Define comprehensive Artisan Console Command standards:
  - Command signatures: kebab-case domain namespaces (`orders:prune-expired`, `users:send-digest`).
  - Input definition: explicit arguments vs options (e.g., `--dry-run`, `--force`, `--limit=`, `--chunk=`).
  - Production safety: require `$this->confirmToProceed()` or `--force` for mutating commands in production.
  - Memory management: forbid unbounded `Model::all()` / `->get()`; enforce `chunkById()` or `LazyCollection` (`->cursor()`), `$this->withProgressBar()`, and `DB::disableQueryLog()`.
  - Anti-bloat / delegation: commands remain thin CLI presenters, delegating domain logic to Invokable Actions or dispatching Jobs.
  - Standard exit codes: return `Command::SUCCESS`, `Command::FAILURE`, or `Command::INVALID`.
- [ ] Align taxonomy and directory structure:
  - Decide whether to introduce `rules/laravel/common/` (mirroring TypeScript's `rules/typescript/common/`) or keep and enhance `rules/laravel/foundation/` with new files.
  - Update `context-manifest.json`, `app/cli/core/indexer.mjs`, and `context-lock.json` if directories or files change.

- [ ] Create `rules/laravel/common/project-structure.md`:
  - Modern Laravel 11/12 lean architecture: configure middleware, exception handling, and routing via `bootstrap/app.php` without legacy `Kernel.php` bloat.
  - Standard application directory conventions: `app/Actions/<Domain>/`, `app/Models/`, `app/Enums/`, `app/Rules/`, `app/Http/Requests/`, `app/Http/Resources/`.
  - Console and scheduled task registration via `routes/console.php`.
  - Environmental and configuration hygiene: read secrets solely via `config(...)`, never call `env()` outside `config/`.

### Edge Cases & Failure Modes

- Large dataset queries in Artisan commands causing out-of-memory crashes on production workers.
- Destructive commands accidentally run on production without `--force` prompt.
- Inconsistent naming between Eloquent relationship methods and foreign key column names causing broken dynamic relations.
- Mismatched route names breaking `route('orders.show', $order)` in Blade templates and redirect responses.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:**
  - New directory: `rules/laravel/common/` with `naming-conventions.md`, `artisan-commands.md`, `project-structure.md`.
  - Indexer & MOC generator: `app/cli/core/indexer.mjs` (add `laravelCommon` group in `generateRulesMoc`).
  - Context manifest: `context-manifest.json` (register new rules).
  - Rules MOC: `docs/Rules.md`.
  - Lockfile: `context-lock.json`.
- **Existing Files to Update or Reference:**
  - `rules/laravel/foundation/conventions.md` (cross-reference or streamline to avoid redundancy with `common/naming-conventions.md`).
  - `rules/laravel/application/business-logic-and-actions.md`.
  - `docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards.md`.
- **Data Model & Schema:** None (rule and metadata configuration).
- **Security & Authorization:** CLI commands executing with system privilege must validate parameters, confirm destructive operations in production, and never log sensitive customer PII or tokens in console output.

## 4. Scope & Boundaries

- **In Scope:**
  - `rules/laravel/common/naming-conventions.md`
  - `rules/laravel/common/artisan-commands.md`
  - `rules/laravel/common/project-structure.md`
  - `app/cli/core/indexer.mjs` updates to include `laravelCommon`.
  - Synchronization of `context-manifest.json`, `docs/Rules.md`, and `context-lock.json`.
  - Verification via `node scripts/context.mjs doctor`.
- **Out of Scope / Non-Goals:**
  - Changing existing TypeScript rules.
  - Removing existing `rules/laravel/foundation/` rules (they continue to govern modern PHP syntax, DI container, and exception hierarchies).

## 5. Discovery Ledger

| ID | Topic | Status | Evidence / Decision |
|---|---|---|---|
| Q1 | Taxonomy & Directory Location (`common` vs `foundation`) | Resolved | Create a dedicated `rules/laravel/common/` directory (mirroring TypeScript's `rules/typescript/common/`). |
| Q2 | Scope of `naming-conventions.md` | Resolved | Exhaustive coverage of all Laravel primitives (models, tables, pivots, keys, relations, controllers, requests, resources, policies, events, listeners, jobs, mailables, notifications, enums, routes, blade components, config). |
| Q3 | Scope of `artisan-commands.md` | Resolved | Signature conventions, argument/option conventions (`--force`, `--dry-run`), production safety confirmations, memory-safe streaming (`chunkById`, `LazyCollection`, `disableQueryLog`), progress bars, action/job delegation, standard exit codes. |
| Q4 | Additional rules under "and whatever" | Resolved | Include `project-structure.md` covering modern Laravel 11/12 lean `bootstrap/app.php`, folder layout, and console route registration. |

## 6. References & External Context

- [[docs/Rules|Rules Map]]
- [[docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards|ADR 0022]]
- [[rules/laravel/foundation/conventions|Laravel Conventions Rule]]
- [[rules/laravel/application/business-logic-and-actions|Laravel Business Logic and Actions]]

## 7. Readiness Audit & Completion Gate

- **Actors and permission boundaries:** Identified Laravel developers and AI agents executing coding workflows. Safe execution requirements for CLI commands (`--force` confirmation for destructive production mutations) explicitly defined.
- **Primary journeys and edge cases:** Complete matrix of naming conventions; Artisan memory exhaustion protection (`chunkById()`, `DB::disableQueryLog()`); Lean `bootstrap/app.php` vs legacy `Kernel.php` clarity.
- **In-scope vs out-of-scope boundaries:** Strictly 3 new rules under `rules/laravel/common/`, indexer update, and manifest/lock synchronization.
- **Verification criteria:** `node scripts/context.mjs doctor` passes cleanly; `docs/Rules.md` reflects `laravelCommon` category.
- **Status:** Ready for implementation planning (`/plan`).
