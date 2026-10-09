---
title: "Pragmatic Laravel Rule Taxonomy, Anti-Overengineering Architecture, and Dynamic Multi-Language Alignment"
type: decision
status: superseded
superseded_by: "docs/decisions/0036-decommission-laravel-php-stack-focus-typescript.md"
created: "2026-09-18"
tags: [adr, rules, laravel, php, architecture, anti-overengineering, dynamic-workflows]
---

# 0022 — Pragmatic Laravel Rule Taxonomy, Anti-Overengineering Architecture, and Dynamic Multi-Language Alignment

## Context

Context Factory's language-specific rules, skills, and workflows are currently centered on a TypeScript environment. While a placeholder folder exists at `rules/laravel/`, it contains 24 zero-byte placeholder files scattered across 14 fragmented subdirectories (`actions`, `auth`, `backend`, `blade`, `caching`, `common`, `console`, `database`, `events`, `events-listener`, `http-client`, `middleware`, `request`, `security`).

Furthermore:
1. **Fragmented Taxonomy:** Folders containing only a single rule file create navigation friction and cognitive overload.
2. **Over-Engineering in Laravel:** Developers frequently import rigid patterns from other ecosystems (e.g., Java or complex NestJS/TypeScript architectures) into Laravel—such as generic Repository interfaces wrapping Eloquent models, DTO boilerplate, premature Service/Action interfaces with only one implementation, or action classes for trivial single-model CRUD operations. This directly conflicts with Laravel's pragmatic convention-over-configuration philosophy.
3. **Hardcoded Language Assumptions in Skills and Workflows:** Skills (`refactor`, `execute`, `docs`) and workflows (`code-review-and-optimization`, `new-project-delivery`, `database-migration`) explicitly reference `rules/typescript/...` and hardcode verification commands like `tsc --noEmit`.

A clean, maintainable rule taxonomy and anti-overengineering standard are required to make Laravel development smooth, idiomatic, and maintainable, while enabling skills and workflows to dynamically adapt to the project's declared stack (`typescript` vs `laravel`).

## Options Considered

### Option 1: 5-Group Symmetric Taxonomy (Mirroring TypeScript Structure)
Mirror the 5 TypeScript categories (`common`, `backend`, `database`, `ui`, `hooks`) into `foundation`, `http`, `database`, `application`, and `security` (with UI/Blade optional).
- **Pros:** Perfect symmetry between TypeScript and Laravel trees.
- **Cons:** Conflates asynchronous workloads (queues, events, scheduled tasks, external HTTP clients) into application logic, and fullstack presentation (Blade/Livewire) lacks a dedicated home.

### Option 2: 6-Group Operational Lifecycle Taxonomy (Selected)
Consolidate the 14 fragmented directories into 6 cohesive categories aligned with the developer mental model and HTTP/data lifecycle:
1. `foundation/` (Strict types, modern PHP 8.2+ syntax, dependency injection, exception handling, configuration hygiene)
2. `http/` (Routes, skinny resource controllers, Form Requests & validation, middleware, API resources)
3. `database/` (Eloquent models & relations, query scopes, query optimization & eager loading, migrations & seeders)
4. `application/` (Pragmatic business logic & Actions complexity thresholds, DB transactions, async queues/events/cache/HTTP)
5. `security/` (Policies & Gates authorization, rate limiting, file upload defense, sanitization & escaping)
6. `presentation/` (Blade components, layouts, asset pipeline)
- **Pros:** Eliminates 1-file orphan folders, maps directly to Laravel's request lifecycle, establishes explicit complexity thresholds to prevent over-engineering, and maintains high cohesion.
- **Cons:** Requires reorganizing the 24 placeholders into ~13-15 focused, high-density rules.

### Option 3: 8-Group Fine-Grained Split
Preserve fine-grained folders (`foundation`, `http`, `application`, `data`, `authorization`, `async`, `presentation`, `security`).
- **Pros:** Keeps authorization isolated from security defenses, and async isolated from synchronous application logic.
- **Cons:** Re-introduces folder sprawl where categories like `authorization` only contain 1 file, creating unnecessary maintenance overhead.

## Decision

Adopt **Option 2: 6-Group Operational Lifecycle Taxonomy**, combined with the **Anti-Overengineering Architectural Standard** and **Dynamic Multi-Language Alignment**:

### 1. Rule Grouping Taxonomy
Consolidate `@rules/laravel` into 6 directories:
- `rules/laravel/foundation/`
  - `conventions.md`: Modern PHP 8.2+ (`declare(strict_types=1)`, enums, readonly properties), Pint formatting, config vs env.
  - `container-and-injection.md`: Constructor dependency injection, Service Providers, avoiding Facade overuse.
  - `error-handling.md`: Exception hierarchies, domain exceptions, fail-fast boundary validation.
- `rules/laravel/http/`
  - `routing-and-controllers.md`: Route model binding, skinny resource controllers, API Resources.
  - `requests-and-validation.md`: Form Requests, custom rules, `$request->validated()` only.
  - `middleware.md`: HTTP pipeline guards, CORS, transport decoration.
- `rules/laravel/database/`
  - `eloquent-and-models.md`: Eloquent conventions, relationships, attribute casting, query scopes.
  - `query-optimization.md`: Eager loading (`preventLazyLoading`), N+1 prevention, cursor pagination, ESR indexing.
  - `migrations-and-seeders.md`: Atomic migrations, foreign keys, model factories, testing seeders.
- `rules/laravel/application/`
  - `business-logic-and-actions.md`: Anti-overengineering rules, Action complexity thresholds, Eloquent-first discipline.
  - `transactions.md`: `DB::transaction()` boundaries, deadlock handling, keeping external side-effects outside transactions.
  - `async-and-events.md`: Queued jobs (`ShouldQueue`), Events & Listeners, `Cache::remember()`, resilient HTTP client.
- `rules/laravel/security/`
  - `authorization.md`: Policies and Gates (`authorize()`), resource ownership verification.
  - `defense-and-protection.md`: Rate limiting, secure file uploads (MIME, private disk), output escaping, CSRF.
- `rules/laravel/presentation/`
  - `blade-and-components.md`: Component-first Blade (`<x-...>`), layout slots, escaping, Vite asset pipeline.

### 2. Anti-Overengineering Architectural Standards
1. **No Fake Repositories:** Eloquent models are Active Records with an integrated Query Builder. Prohibit creating repository interfaces that merely proxy Eloquent methods (`UserRepositoryInterface` -> `UserRepository`). Encapsulate queries in Eloquent Scopes (`scopeActive()`) or custom Query Builders.
2. **Skinny Controllers with Justified Actions:**
   - Standard CRUD stays in Controller + Form Request + Eloquent. Do NOT create Action classes for basic single-model CRUD.
   - Extract an Invokable Action (`app/Actions/...`) ONLY when:
     - Multi-table mutations require a `DB::transaction()`.
     - The business logic is reused across multiple entry points (Web, API, Artisan CLI, Queue Job).
     - External third-party services (Stripe, Twilio, AWS) are coordinated alongside database writes.
3. **No Premature Interfaces:** Prohibit 1:1 interfaces for services or actions where only a single implementation exists. Only introduce interfaces for external infrastructure adapters with multiple implementations.
4. **Form Requests as the Single Gatekeeper:** Never validate directly in controllers with `$request->validate()`. Always use Form Requests and `$request->validated()`.

### 3. Dynamic Multi-Language Alignment in Skills and Workflows
1. **Dynamic Rule Resolution:** Skills and workflows reference language rules via `.context-bridge.json` declared stacks (`stacks: ["laravel"]` vs `stacks: ["typescript"]`).
2. **Stack-Agnostic Procedures:** Workflows (`code-review-and-optimization`, `new-project-delivery`, `database-migration`) and skills (`refactor`, `execute`, `docs`) reference architectural boundaries (`transport`, `domain`, `data-access`) and load the respective language rules dynamically.
3. **Dynamic Verification Gates:** Replace hardcoded `tsc --noEmit` with stack-specific test commands:
   - TypeScript: `pnpm test`, `pnpm lint`, `tsc --noEmit`, `pnpm build`.
   - Laravel: `php artisan test` (or Pest), `php artisan pint --test`, `vendor/bin/phpstan analyse`.

## Consequences

- **Developer Productivity:** Eliminates cognitive overhead and boilerplate. Developers build fast, idiomatic Laravel applications without artificial layers.
- **Maintainability:** 6 cohesive groups replace 14 fragmented folders, reducing rule count from 24 empty files to 14 high-value, actionable rules.
- **Cross-Language Consistency:** The factory core remains stack-agnostic; both TypeScript and Laravel projects follow identical quality, ADR, planning, and execution lifecycles.
- **Migration & Rollback:** The empty placeholder files in `rules/laravel/` are replaced with the new 6-group taxonomy. If needed, the previous folder structure can be recovered from git history.

## Validation and Review Date

- Validate by registering the new 6-group Laravel rules in `context-manifest.json` and generating the updated rules map.
- Validate dynamic stack resolution via `node scripts/context.mjs resolve "laravel"` on projects declaring `stacks: ["laravel"]`.
- Review by 2027-03-18 or when a third language stack is introduced.
