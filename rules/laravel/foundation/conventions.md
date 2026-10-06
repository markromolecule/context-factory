---
ruleId: cf-rule-laravel-foundation-conventions
name: conventions
description: Enforce modern PHP 8.2+ strict typing, Pint formatting, backed enums, and configuration hygiene across Laravel applications.
scope: All PHP classes, models, controllers, actions, commands, and configuration in Laravel applications.
stack: laravel
appliesTo: ["app/**/*.php", "config/**/*.php"]
layers: ["foundation"]
alwaysApply: false
---

# Laravel & Modern PHP Conventions

## Boundaries

- [directive:laravel.foundation.conventions][mode:automated-blocking][verifier:linter] Verify configured Laravel formatting and PHP convention tooling when it is available; otherwise report tool unavailability.

- Require `declare(strict_types=1);` as the first statement in every PHP file without exception.
- Enforce full type declarations on all class properties, method parameters, and method return types.
- Never use untyped arrays where a typed value object, `readonly class`, or Form Request defines data structure.
- Never invoke `env()` directly outside files in the `config/` directory; always read configuration via `config('services.name.key')`.
- Format all code with Laravel Pint adhering to the PSR-12 and Laravel preset standards.

## Behavior

- **Modern PHP 8.2+ Syntax:**
  - Use constructor property promotion to declare and initialize dependencies.
  - Use backed enums (`enum OrderStatus: string`) instead of string literals, integers, or class constants.
  - Use `match` expressions instead of verbose `switch` statements or nested conditionals.
  - Mark immutable value objects and DTOs as `readonly class`.
  - Use nullsafe operator (`?->`) and null coalescing assignment (`??=`) for clean, defensive expressions.
- **Naming Conventions:**
  - Classes, Enums, Interfaces, and Traits: `PascalCase` (e.g. `ProcessPaymentAction`, `UserRole`).
  - Methods and Variables: `camelCase` (e.g. `calculateTotal()`, `$billingAddress`).
  - Database Tables, Columns, and Route Parameters: `snake_case` (e.g. `order_items`, `created_at`, `{user_id}`).
  - Configuration Keys and Translation Keys: `kebab-case` or `snake_case` matching existing project conventions.
  - Follow the canonical [[rules/laravel/common/naming-conventions|Laravel Naming Conventions]] matrix for models, pivots, relationships, requests, resources, policies, events, jobs, routes, and artisan commands.
- **Configuration & Environment Hygiene:**
  - Keep all runtime secrets and environment variables declared in `.env.example` with empty or safe placeholder values.
  - Access configuration via `config(...)` so that `php artisan config:cache` runs successfully in production.
- **Strict Anti-Overengineering Rule:**
  - Prefer Laravel's native helpers and collections over complex custom iterators or external utility libraries.
  - Do not create custom wrapper classes for standard PHP functions or native Laravel collection methods.
  - Strictly eliminate common anti-patterns (untyped arrays, `env()` calls outside `config/`, N+1 queries, mass assignment holes, and monolithic controllers) as detailed in [[rules/laravel/common/anti-patterns|Laravel Anti-Patterns Guide]].

## Verification

- Run `vendor/bin/pint --test` to confirm strict formatting conformance.
- Run `vendor/bin/phpstan analyse --level=8` (or configured level) to verify strict type safety and zero missing parameter/return types.
- Audit codebase to ensure zero instances of `env()` exist outside `config/`.
