---
title: "Phase 3 — Harmonize Laravel Rules & Naming Conventions"
type: phase
parent: "0001-task-laravel-modular-architecture-and-conventions"
phase: "03"
status: completed
created: "2026-09-27"
tags: [task, phase, laravel, rules, modular-architecture, naming-conventions]
---

# Phase 3 — Harmonize Laravel Rules & Naming Conventions

## Objective

Synchronize and harmonize all Laravel rule files under `rules/laravel/` to universally enforce the Native PSR-4 Modular Pattern (`app/Modules/<Feature>/`), co-located routing, centralized migrations, and clean canonical naming conventions, completely eliminating contradictory flat MVC paths and inconsistent casing.

## Dependencies & Prerequisites

- Phase 1 (ADR 0023) and Phase 2 (Resolver Keyword Inference) completed.

## Impacted Files & Components

- `rules/laravel/common/project-structure.md` — modular domain layout, co-located routes, lean `ModuleServiceProvider`.
- `rules/laravel/common/naming-conventions.md` — modular paths, namespaces, `<Verb><Noun>Controller`, and clean route names in naming matrix.
- `rules/laravel/application/business-logic-and-actions.md` — action paths in `app/Modules/<Domain>/Actions/` and modular namespaces in examples.
- `rules/laravel/http/routing-and-controllers.md` — co-located routing in modules and standard RESTful practices.
- `rules/laravel/anti-patterns/monolithic-controllers.md` — fix route name (`orders.show` vs `modules.orders.show`) and controller naming (`StoreOrderController` vs `OrderStoreController`).

## Implementation Tasks

- [x] Task 3.1 — Update `rules/laravel/common/project-structure.md`:
  - Detailed Native PSR-4 directory structure: `app/Modules/<Feature>/` co-locating Controllers, Models, Actions, Requests, Resources, Policies, and `routes.php`.
  - Detailed `app/Shared/` for cross-cutting infrastructure (`Providers/ModuleServiceProvider.php`, `Enums/`, `Middleware/`, `Traits/`).
  - Documented centralized migrations in `database/migrations/` preserving deterministic timestamp ordering.
  - Documented lean `ModuleServiceProvider` route discovery pattern for modern Laravel 11/12 `bootstrap/app.php`.
- [x] Task 3.2 — Update `rules/laravel/common/naming-conventions.md`:
  - Updated canonical naming matrix to reflect `app/Modules/<Feature>/...` paths and `App\Modules\<Feature>\...` namespaces for Models, Controllers, Requests, Resources, Policies, and Actions.
  - Standardized invokable controllers as `<Verb><Noun>Controller` (`StoreOrderController`, `DownloadInvoiceController`).
  - Standardized route names as `<entity_plural>.<action>` (`orders.index`, `orders.show`), explicitly forbidding `modules.` prefixes.
  - Updated code examples to use `namespace App\Modules\Orders\Models;`.
- [x] Task 3.3 — Update `rules/laravel/application/business-logic-and-actions.md`:
  - Updated action storage rule: `app/Modules/<Domain>/Actions/` (e.g. `app/Modules/Orders/Actions/ProcessOrderCheckout.php`).
  - Updated namespace in code examples to `namespace App\Modules\Orders\Actions;` and `use App\Modules\Orders\Models\Order;`.
- [x] Task 3.4 — Update `rules/laravel/http/routing-and-controllers.md`:
  - Stated that routes reside in module co-located route files (`app/Modules/<Domain>/routes.php`), registered via `ModuleServiceProvider` with consistent URL prefixes (`/api/v1/...`).
- [x] Task 3.5 — Update `rules/laravel/anti-patterns/monolithic-controllers.md`:
  - Renamed remediation controller from `OrderStoreController` to `StoreOrderController`.
  - Changed `route('modules.orders.show', $order)` to standard `route('orders.show', $order)`.

## Verification & Testing

- Grep audit across `rules/laravel/`:
  - `grep -rn "app/Http/Controllers" rules/laravel/`: 0 occurrences.
  - `grep -rn "app/Models" rules/laravel/`: 0 occurrences.
  - `grep -rn "modules." rules/laravel/`: 0 occurrences in route names; only present in view path documentation and explicit prohibition clauses.
- `node scripts/context.mjs doctor`: PASS (59 rules, 12 skills, 12 workflows, lockfile current).
- `node evals/run-evals.mjs`: PASS (22/22 evaluations passed in 81ms).

## Risks & Rollback

- Risk: Broken wiki links or references in Obsidian map of content.
- Mitigation: All file names and rule names remain identical; only internal content and examples are updated. Rollback is a git checkout of `rules/laravel/`.
