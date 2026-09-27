---
title: "Laravel Modular Domain Architecture, Route Co-location, and Unified Naming Conventions"
type: decision
status: accepted
created: "2026-09-27"
tags: [adr, rules, laravel, php, modular-architecture, naming-conventions]
---

# 0023 — Laravel Modular Domain Architecture, Route Co-location, and Unified Naming Conventions

## Context

Context Factory's Laravel rule set established anti-overengineering and operational lifecycle taxonomy in ADR 0022. However, developers and AI agents generating Laravel backends experienced inconsistent, messy outputs due to three structural issues:

1. **Rule Desynchronization:** While `rules/laravel/common/project-structure.md` proposed a modular domain layout (`app/Modules/<Module>/`), other core rules—specifically `rules/laravel/common/naming-conventions.md`, `rules/laravel/application/business-logic-and-actions.md`, and `rules/laravel/http/routing-and-controllers.md`—still referenced standard flat Laravel MVC paths (`app/Models/`, `app/Http/Controllers/`, `app/Actions/<Domain>/`).
2. **Inconsistent Naming and Routing Conventions:** Rules diverged on route names (e.g., standard `orders.show` vs `modules.orders.show`), invokable controller naming (`DownloadInvoiceController` vs `OrderStoreController`), and view path references (`view('orders.show')` vs `view('modules.orders.show')`).
3. **Stack Resolution Defaulting:** Without an explicit `--stack laravel` CLI flag or a `.context-bridge.json` file in the target project, `scripts/context-core.mjs` defaulted to `["typescript"]`, discarding all Laravel rules and resolving TypeScript rules even when the prompt explicitly requested a Laravel backend.

A durable architectural decision is needed to standardize on a cohesive modular domain layout, define how routes and migrations are managed in modern Laravel 11/12, resolve naming convention conflicts, and ensure deterministic context resolution.

## Options Considered

### Option 1: Decoupled Domain-Driven Design (DDD) Split (`app/Domains/` + `app/Http/`)
Split domain logic (`app/Domains/Orders/Models/`, `app/Domains/Orders/Actions/`) from HTTP delivery transport (`app/Http/Controllers/Orders/`, `app/Http/Requests/Orders/`).
- **Advantages:** Strict theoretical separation between pure domain business logic and HTTP transport mechanisms.
- **Disadvantages:** Scatters related feature code across disparate directories, forcing developers to navigate between `app/Domains/` and `app/Http/` for a single feature. Violates developer desire for vertical feature cohesion.

### Option 2: Native PSR-4 Hybrid Modular Domain Architecture (`app/Modules/<Feature>/`) — Selected
Organize features vertically under `app/Modules/<Feature>/` containing models, controllers, actions, requests, resources, policies, and co-located routes (`routes.php` or `routes/api.php`), with cross-cutting infrastructure in `app/Shared/`. Maintain database migrations centrally in `database/migrations/` to guarantee deterministic foreign-key timestamp ordering, and auto-load module routes via a lightweight `ModuleServiceProvider`.
- **Advantages:**
  - High cohesion: all domain primitives and transport endpoints for a feature are co-located in a single directory.
  - Zero external dependencies: works out of the box using standard Composer PSR-4 autoloading (`App\Modules\*`).
  - Deterministic migrations: central `database/migrations/` avoids cross-module migration race conditions and foreign-key constraint ordering failures.
  - Modern Laravel 11/12 compatibility: avoids legacy Kernel bloat, using lean bootstrapping in `bootstrap/app.php` and `AppServiceProvider` / `ModuleServiceProvider`.
- **Disadvantages:** Requires a small bootstrapping mechanism (`ModuleServiceProvider`) to discover and register module routes.

### Option 3: Package-Driven Modular Architecture (`modules/<Feature>/` via `nwidart/laravel-modules`)
Adopt the popular third-party package `nwidart/laravel-modules` to manage modules outside `app/` in a dedicated `modules/` root directory.
- **Advantages:** Provides ready-made Artisan commands (`php artisan module:make ...`) and module-level service providers.
- **Disadvantages:** Introduces a heavy third-party dependency, custom configuration files (`modules.php`), divergent non-standard root directory (`modules/`), and extra maintenance friction.

## Decision

Adopt **Option 2: Native PSR-4 Hybrid Modular Domain Architecture (`app/Modules/<Feature>/`)**, along with **Clean Canonical Laravel Naming Conventions** and **Smart Resolver Keyword Inference**:

### 1. Directory Structure Blueprint
All domain features encapsulate their responsibilities inside `app/Modules/<Feature>/`:

```
app/
├── Modules/
│   ├── Orders/
│   │   ├── Actions/                 # ProcessOrderCheckout.php, CancelOrder.php
│   │   ├── Controllers/             # OrderController.php, DownloadInvoiceController.php
│   │   ├── Enums/                   # OrderStatus.php
│   │   ├── Events/                  # OrderShipped.php
│   │   ├── Models/                  # Order.php, OrderItem.php
│   │   ├── Policies/                # OrderPolicy.php
│   │   ├── Requests/                # StoreOrderRequest.php, UpdateOrderRequest.php
│   │   ├── Resources/               # OrderResource.php, OrderItemResource.php
│   │   └── routes.php               # Co-located module routes (or routes/api.php + routes/web.php)
│   └── Users/
│       ├── Actions/                 # RegisterUser.php, ResetPassword.php
│       ├── Controllers/             # UserController.php, ProfileController.php
│       ├── Models/                  # User.php
│       ├── Requests/                # UpdateProfileRequest.php
│       └── routes.php
├── Shared/                          # Cross-cutting foundational infrastructure
│   ├── Enums/                       # Global enums (Environment.php, Currency.php)
│   ├── Exceptions/                  # DomainException.php
│   ├── Middleware/                  # EnforceSecurityHeaders.php
│   ├── Providers/                   # ModuleServiceProvider.php
│   └── Traits/                      # HasUlids.php, Auditable.php
database/
└── migrations/                      # Centralized migrations preserving foreign-key timestamp order
```

### 2. Routing and Migrations Strategy
- **Co-located Routes:** Each module defines its endpoints in `app/Modules/<Feature>/routes.php` (or `routes/api.php` and `routes/web.php`).
- **Auto-Discovery:** A lean `ModuleServiceProvider` (or `AppServiceProvider`) iterates over `app/Modules/*/routes.php` and registers them with appropriate middleware (`web` or `api`) and standard URL prefixes (`/api/v1/...`).
- **Centralized Migrations:** All database migrations remain in `database/migrations/` using standard Laravel timestamp ordering (`YYYY_MM_DD_HHMMSS_create_..._table.php`). This strictly eliminates foreign key ordering failures during `migrate:fresh`.

### 3. Canonical Naming Conventions Matrix
- **Route Names:** Standard dot notation `<plural-entity>.<action>` (`orders.index`, `orders.show`, `orders.store`). NEVER prefix with internal directory artifacts (no `modules.orders.show`).
- **Resource Controllers:** Singular entity + `Controller` (`OrderController`, `UserProfileController`).
- **Invokable Single-Action Controllers:** Verb + Noun + `Controller` (`StoreOrderController`, `DownloadInvoiceController`, `ProcessCheckoutController`).
- **Models:** Singular `PascalCase` (`Order`, `OrderItem`) in namespace `App\Modules\<Feature>\Models`.
- **Form Requests:** `<Action><Model>Request` (`StoreOrderRequest`, `UpdateProfileRequest`) in `App\Modules\<Feature>\Requests`.
- **API Resources:** `<Model>Resource` (`OrderResource`) in `App\Modules\<Feature>\Resources`.
- **Actions:** Imperative phrase (`ProcessOrderCheckout`, `CancelOrder`) in `App\Modules\<Feature>\Actions`.

### 4. Smart Resolver Keyword Inference
In `scripts/context-core.mjs`, when no explicit `--stack` flag or `.context-bridge.json` configuration is present:
- Check if prompt terms contain unambiguous stack keywords (`laravel`, `artisan`, `eloquent`, `blade`, `pint`, `pest`).
- If matched, infer `stacks: ["laravel"]` for context resolution.
- Only fall back to `["typescript"]` when no known stack keywords are present.

## Consequences

- **Cohesion and Velocity:** Developers navigate a single module folder to work on a feature end-to-end. Context Factory generation for Laravel backends produces modular, production-ready code.
- **Rule Harmonization:** `rules/laravel/common/naming-conventions.md`, `rules/laravel/common/project-structure.md`, `rules/laravel/application/business-logic-and-actions.md`, and `rules/laravel/http/routing-and-controllers.md` are unified around the same paths and namespaces.
- **Reliable Resolution:** Unconfigured prompts containing "laravel" will no longer default silently to TypeScript rules.
- **Zero Package Bloat:** Native PSR-4 architecture requires no third-party packages or complex build configuration.

## Validation and Review Date

- Verify that `node scripts/context.mjs resolve "laravel backend project structure"` resolves Laravel rules rather than TypeScript rules.
- Verify that `node scripts/context.mjs doctor` passes with zero schema or integrity errors.
- Review when Laravel 13 is released or when a second PHP framework scope is proposed, whichever occurs first.
