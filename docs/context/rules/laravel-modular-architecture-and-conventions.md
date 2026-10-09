---
title: "Laravel Modular Domain Architecture & Unified Naming Conventions"
type: context
status: ready
created: "2026-09-27"
tags: [context, rules, laravel, php, modular-architecture, naming-conventions]
feature: "laravel-modular-architecture-and-conventions"
---

# Laravel Modular Domain Architecture & Unified Naming Conventions Context Specification

## 1. Overview & Objective

- **Problem Statement:** 
  When using Context Factory to generate a Laravel backend, the generated output was messy and failed to adhere to a clean per-module organization. Investigation reveals three core root causes:
  1. **Conflicting & Desynchronized Laravel Rules:** `rules/laravel/common/project-structure.md` mandates a Modular Domain Architecture (`app/Modules/<Module>/`), but `rules/laravel/common/naming-conventions.md`, `rules/laravel/application/business-logic-and-actions.md`, and `rules/laravel/http/routing-and-controllers.md` still prescribe default flat Laravel MVC paths (`app/Models/`, `app/Http/Controllers/`, `app/Actions/<Domain>/`).
  2. **Inconsistent Naming & Routing Conventions:** Route names, view paths, controller naming (`OrderController` vs `OrderStoreController` vs `DownloadInvoiceController`), and route registration mechanisms are inconsistent across rules and examples.
  3. **Resolver Stack Defaulting:** Without an explicit `--stack laravel` flag or `.context-bridge.json` in the host repository, `scripts/context-core.mjs` defaults to `["typescript"]`, causing TypeScript rules to be selected for Laravel requests, while zero Laravel rules are injected.
- **Business / User Value:** 
  Provide developers and AI agents with an unambiguous, cohesive, and battle-tested Modular Architecture standard for Laravel 11/12 that cleanly groups features (controllers, models, actions, requests, resources, routes, and migrations) while establishing razor-sharp naming conventions.
- **Success Criteria:**
  - All Laravel rules in `rules/laravel/` harmonize around a single, agreed-upon modular organization standard.
  - Complete elimination of contradictory file paths, namespaces, and naming patterns between `project-structure.md`, `naming-conventions.md`, and `business-logic-and-actions.md`.
  - Durable ADR recorded in `docs/decisions/` capturing the modular architectural boundary, route registration strategy, and migration management.
  - Verification that resolution and doctor checks pass cleanly.

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a backend engineer generating or maintaining a Laravel service, I want every feature's controllers, models, actions, requests, and routes encapsulated in a cohesive module directory (`app/Modules/<Module>/`), so that the codebase scales without sprawling across flat MVC folders.*
- *As an AI coding agent, I want canonical rules and naming tables to use identical paths and namespace examples, so that I generate consistent, production-ready code on the first attempt.*
- *As a team lead, I want clear standards on how module routes, migrations, and service providers bootstrap in Laravel 11/12 without legacy Kernel bloat.*

### Functional Requirements

- [ ] Harmonize Laravel project structure across all rules to adhere to agreed modular boundaries.
- [ ] Align naming conventions across models, controllers, requests, resources, routes, and views.
- [ ] Define how per-module routing (web & api) and migrations are registered in modern Laravel 11/12 lean bootstrapping.
- [ ] Update resolver and agent instructions to prevent stack defaulting leaks.

### Edge Cases & Failure Modes

- Cross-module tight coupling: modules directly querying or mutating internal state of another module rather than through public actions or domain events.
- Route collision between module routes when route names or URL prefixes lack standardized namespace scoping.
- Migration execution order failures if module migrations depend on tables from other modules.
- Autoloading / namespace PSR-4 mismatches when creating new modules.

## 3. Technical & Architectural Context

- **Affected Layers:**
  - `rules/laravel/common/project-structure.md`
  - `rules/laravel/common/naming-conventions.md`
  - `rules/laravel/application/business-logic-and-actions.md`
  - `rules/laravel/http/routing-and-controllers.md`
  - `rules/laravel/anti-patterns/monolithic-controllers.md`
  - `rules/laravel/foundation/conventions.md`
  - `scripts/context-core.mjs` (stack resolution fallback & term inference)
  - `docs/decisions/0023-laravel-modular-domain-architecture-and-unified-conventions.md` (ADR 0023)
- **Existing Files & Reference Symbols:**
  - `rules/laravel/common/project-structure.md:12-55`
  - `rules/laravel/common/naming-conventions.md:23-58`
  - `rules/laravel/application/business-logic-and-actions.md:23-57`
  - `scripts/context-core.mjs:228-251`

## 4. Scope & Boundaries

- **In Scope:**
  - Standardizing Laravel 11/12 modular directory structure (`app/Modules/<Module>/`).
  - Standardizing naming conventions, route names, controller verbs, and view namespaces.
  - Module bootstrapping mechanism (routes, migrations, providers) in `bootstrap/app.php` / `AppServiceProvider`.
  - Authoring durable ADR in `docs/decisions/`.
- **Out of Scope / Non-Goals:**
  - Prescribing third-party modular packages (e.g. `nwidart/laravel-modules`) as mandatory dependencies; prefer native PSR-4 structure unless authorized.
  - Generic PHP without Laravel.

## 5. Discovery Ledger

| ID | Topic | Status | Evidence / Decision |
|---|---|---|---|
| Q1 | What modular structure pattern should be standardized? | Resolved | Adopt native PSR-4 Modular Pattern (`app/Modules/<Feature>/`) with zero third-party dependencies. Co-locate Controllers, Models, Actions, Requests, Resources, and Routes. Cross-cutting code in `app/Shared/`. |
| Q2 | Where do routes and migrations live? | Resolved | Hybrid Modular Architecture: keep database migrations centralized in `database/migrations/` to guarantee deterministic foreign-key timestamp ordering; keep routes co-located in `app/Modules/<Feature>/routes.php` (or `routes/api.php`) loaded via a lean `ModuleServiceProvider`. |
| Q3 | How should route names and single-action controllers be named? | Resolved | Clean Canonical Laravel: standard dot notation route names (`orders.index`, `orders.show` without `modules.` prefix); single-action controllers use `<Verb><Noun>Controller` (`StoreOrderController`, `DownloadInvoiceController`); standard RESTful endpoints (`/api/v1/orders`). |
| Q4 | How should the resolver handle undeclared stacks mentioning Laravel? | Resolved | Smart Keyword Inference: If no `.context-bridge.json` or `--stack` is specified, infer the stack from unambiguous request terms (`laravel`, `artisan`, `eloquent` -> `laravel`), only falling back to `typescript` when no stack keyword is detected. |

## 6. Readiness Audit

- **Actors and Permission Boundaries:** Backend engineers, AI IDE agents, and factory maintainers are identified.
- **Primary & Exceptional Journeys:** Clean vertical slice generation, co-located routing without route name collision, and foreign-key safe centralized migrations.
- **In-Scope vs Non-Goals:** Clearly bounds native PSR-4 modularity and rules synchronization; excludes heavy third-party packages.
- **Measurable Outcomes:** Unanimous alignment across all rules in `rules/laravel/`, passing doctor checks, and deterministic resolver stack selection for Laravel requests.
- **Confirmation:** Decisions D-01 through D-04 confirmed and recorded in ADR 0023 and Task pre-planning record.
- **Readiness:** Frontmatter updated to `status: ready`. Ready for `/plan` and execution.

## 7. References & External Context

- `rules/laravel/common/project-structure` (decommissioned in ADR 0036)
- `rules/laravel/common/naming-conventions` (decommissioned in ADR 0036)
- [[docs/decisions/0021-explicit-language-stack-selection|ADR 0021: Language Stack Selection]]
- [[docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards|ADR 0022: Laravel Rule Taxonomy]]
- [[docs/decisions/0023-laravel-modular-domain-architecture-and-unified-conventions|ADR 0023: Laravel Modular Domain Architecture]]
