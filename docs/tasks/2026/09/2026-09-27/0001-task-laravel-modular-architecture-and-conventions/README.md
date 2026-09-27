---
title: "Laravel Modular Domain Architecture & Unified Naming Conventions"
type: task
status: completed
created: "2026-09-27"
tags: [task, laravel, architecture, rules, grill]
---

# Laravel Modular Domain Architecture & Unified Naming Conventions

## Outcome

Harmonize Context Factory's Laravel rule taxonomy, modular domain architecture standard (`app/Modules/<Module>/`), route/migration bootstrapping, and canonical naming conventions across all Laravel rules, eliminating conflicts with TypeScript and internal rule desynchronization.

## Pre-planning record

### Actors and goals

- **Backend Engineers:** Generate clean, highly maintainable, feature-encapsulated Laravel backends where each feature's models, controllers, actions, requests, resources, and routes live together in a dedicated module.
- **AI Agents:** Deterministically select and apply unified, non-contradictory Laravel rules without falling back to flat MVC or leaking TypeScript standards.
- **Factory Maintainers:** Keep `rules/laravel/`, context manifest, generated maps, and ADRs synchronized and verified via `scripts/context.mjs doctor`.

### Domain language

- **Module / Domain:** A self-contained directory under `app/Modules/<ModuleName>/` encapsulating domain entities, actions, controllers, requests, resources, policies, and co-located routes.
- **Shared Infrastructure:** Cross-cutting code (`app/Shared/`) containing base traits, shared enums, global middleware, service providers, and common exceptions.
- **Skinny Transport Controller:** A controller method restricted to HTTP parameter reception, Form Request validation, single action/Eloquent delegation, and API resource transformation.
- **Invokable Action:** A single-responsibility class implementing `__invoke()` encapsulating multi-table database mutations or external integration boundaries.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Agent generates a new domain entity (e.g. `Order`) | Stack declared as `laravel` | Code placed in `app/Modules/Orders/Models/Order.php`, `app/Modules/Orders/Controllers/`, etc. | If placed in `app/Models/`, fails code review / lint gate | Discovered |
| SC-02 | Agent registers routes for a module | Module created in `app/Modules/Orders/` | Routes registered per agreed module routing standard (co-located `routes.php` auto-loaded via `ModuleServiceProvider`) | Missing route registration causes 404; route list verification catches | Discovered |
| SC-03 | User runs `scripts/context.mjs resolve` on Laravel task without `--stack` | Task prompt mentions "laravel" | Resolver recognizes Laravel context via smart keyword inference rather than defaulting silently to TypeScript | Resolves TypeScript rules if unconfigured; mitigated by stack inference | Discovered |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | What module directory pattern should be the authoritative standard? | Native PSR-4 Modular Pattern (`app/Modules/<Feature>/`) | Zero third-party dependencies, groups Controllers, Models, Actions, Requests, Resources, and Routes together cleanly; cross-cutting code in `app/Shared/`. | Rejected DDD split (`app/Domains/` + separate `app/Http/`) because it scatters feature transport from domain; rejected `nwidart/laravel-modules` due to third-party dependency overhead. | [laravel-modular-architecture-and-conventions.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/context/rules/laravel-modular-architecture-and-conventions.md) |
| D-02 | How should module routes and database migrations be organized and loaded? | Hybrid Modular: centralized migrations in `database/migrations/`, per-module routes in `app/Modules/<Feature>/routes.php` (or `routes/api.php`) | Centralized migrations preserve deterministic timestamp ordering across foreign keys; per-module routes keep transport co-located with domain features, loaded via lean `ModuleServiceProvider`. | Rejected distributed migrations in `app/Modules/*/Database/Migrations/` due to foreign key race conditions and directory ordering failures; rejected centralized routing because it separates endpoint definitions from the feature module. | [laravel-modular-architecture-and-conventions.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/context/rules/laravel-modular-architecture-and-conventions.md) |
| D-03 | What naming convention applies to module-level route names, controllers, and views? | Clean Canonical Laravel | Route names use standard `<entity_plural>.<action>` (`orders.show`, `orders.store`), single-action controllers use `<Verb><Noun>Controller` (`StoreOrderController`, `ProcessCheckoutController`), and route URLs remain standard RESTful (`/api/v1/orders`). | Rejected `modules.` route name prefixes (e.g. `modules.orders.show`) which leak internal file hierarchy into routing and cause route helper friction. | [laravel-modular-architecture-and-conventions.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/context/rules/laravel-modular-architecture-and-conventions.md) |
| D-04 | How should Context Factory resolve stacks when no explicit `.context-bridge.json` exists? | Smart Keyword Inference | If no bridge or `--stack` is specified, infer the stack from unambiguous request terms (`laravel`, `artisan`, `eloquent` -> `laravel`), only falling back to `typescript` when no stack keyword is detected. | Rejected strict fallback to TypeScript which caused unconfigured Laravel prompts to receive TypeScript rules and produce messy code. | [0023-laravel-modular-domain-architecture-and-unified-conventions.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0023-laravel-modular-domain-architecture-and-unified-conventions.md) |

### Unknowns and blockers

- None. All architectural boundaries, layout decisions, naming conventions, and resolver fallback behavior are resolved.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | Consistency across rules | All references to `app/Models/` and `app/Http/Controllers/` in `rules/laravel/` updated to reflect the agreed modular structure. | Update `rules/laravel/common/naming-conventions.md`, `rules/laravel/common/project-structure.md`, `rules/laravel/application/business-logic-and-actions.md`, `rules/laravel/http/routing-and-controllers.md`, `rules/laravel/anti-patterns/monolithic-controllers.md`. | Verified (grep audit clean, 0 flat path references) | Completed |
| AC-02 | Durable ADR | ADR authored in `docs/decisions/` recording the modular architecture standard and routing strategy. | ADR 0023 accepted in `docs/decisions/` | Verified in decisions index and lockfile | Completed |
| AC-03 | Resolver keyword inference | Unconfigured queries mentioning "laravel" resolve Laravel rules rather than defaulting to TypeScript. | Update `scripts/context-core.mjs` | Verified (`node scripts/context.mjs resolve` loads 32 Laravel/global rules, 0 TS rules) | Completed |
| AC-04 | Doctor health | Context manifest and lockfile remain healthy. | `node scripts/context.mjs doctor` | Doctor exits with 0 (HEALTHY) | Completed |

## Scope

- Harmonizing `rules/laravel/common/project-structure.md`, `rules/laravel/common/naming-conventions.md`, `rules/laravel/application/business-logic-and-actions.md`, `rules/laravel/http/routing-and-controllers.md`, and `rules/laravel/anti-patterns/monolithic-controllers.md`.
- Updating `scripts/context-core.mjs` for smart stack keyword inference.
- Synchronizing manifest, lock, and verifying via `node scripts/context.mjs doctor`.

## Non-goals

- Refactoring any external host application.
- Generic non-Laravel PHP rules.
- Introducing third-party packages like `nwidart/laravel-modules`.

## Constraints and decisions

- Modern Laravel 11/12 (lean `bootstrap/app.php`, no legacy `Kernel.php`).
- Strict PHP 8.2+ with types and Pint formatting.
- Native Composer PSR-4 autoloading (`App\Modules\*`).

## Phases

- [x] [[phase-01-context-and-architecture-decision|Phase 1 — Context Specification & Architecture Decision (ADR 0023)]]
- [x] [[phase-02-resolver-stack-keyword-inference|Phase 2 — Resolver Stack Keyword Inference]]
- [x] [[phase-03-harmonize-laravel-rules|Phase 3 — Harmonize Laravel Rules & Naming Conventions]]
- [x] [[phase-04-synchronization-and-doctor-verification|Phase 4 — Factory Synchronization & Doctor Verification]]

## Verification

- `node scripts/context.mjs doctor`: PASS (59 rules, 12 skills, 12 workflows, lockfile current, symlinks verified).
- `node evals/run-evals.mjs`: PASS (22/22 evaluations passed in 75ms).
- End-to-end resolution test: `node scripts/context.mjs resolve "build modular laravel backend with orders module"` successfully loaded all 32 Laravel and global rules with zero TypeScript rules.

## Result

Task completed successfully. Context Factory now natively enforces Native PSR-4 Modular Domain Architecture (`app/Modules/<Feature>/`) for Laravel 11/12, co-located routing, centralized migrations, clean canonical naming conventions, and deterministic smart resolver stack inference without manual `--stack` flags.
