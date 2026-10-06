---
ruleId: cf-rule-laravel-common-anti-patterns
name: anti-patterns
description: Overview and index of common Laravel anti-patterns and bad habits with links to dedicated deep-dive rules.
scope: All PHP classes, controllers, models, actions, queries, and configuration in Laravel applications.
stack: laravel
appliesTo: ["app/**/*.php", "routes/**/*.php"]
layers: ["common"]
alwaysApply: false
---

# Laravel Anti-Patterns & Bad Habits Guide

- [directive:laravel.common.anti-patterns][mode:advisory][verifier:none] Apply the linked Laravel anti-pattern rules at their specific code boundaries rather than treating this index as an automated check.

This guide indexes the five most common high-impact anti-patterns in Laravel development. Each bad habit has a dedicated, actionable rule detailing failure mechanisms, concrete code remediations, and [[rules/solid/single-responsibility|SOLID principles]] alignment.

## Core Anti-Pattern Rules

### 1. [[rules/laravel/anti-patterns/untyped-arrays|Untyped Arrays]]

- **Problem:** Passing opaque `array $data` payloads across layers eliminates static analysis, breaks autocomplete, and causes runtime `Undefined array key` crashes.
- **Antidote:** Use PHP 8.2+ `final readonly class` DTOs, Value Objects, or typed Form Request accessors.
- **SOLID Alignment:** [[rules/solid/liskov-substitution|Liskov Substitution (LSP)]] & [[rules/solid/interface-segregation|Interface Segregation (ISP)]].

### 2. [[rules/laravel/anti-patterns/n-plus-one-queries|N+1 Database Queries]]

- **Problem:** Accessing un-eager-loaded relationships inside collection loops or Blade templates fires $N+1$ SQL queries, starving connection pools under traffic.
- **Antidote:** Preload relations with `Post::with('author')->get()` at the query root and enable `Model::preventLazyLoading(!app()->isProduction())`.
- **SOLID Alignment:** [[rules/solid/single-responsibility|Single Responsibility (SRP)]].

### 3. [[rules/laravel/anti-patterns/mass-assignment|Mass-Assignment Vulnerability]]

- **Problem:** Passing unvalidated `$request->all()` into `Model::create()` or `update()` allows malicious users to overwrite protected attributes (`is_admin`, `role`, `balance`).
- **Antidote:** Enforce dedicated Form Requests and persist strictly via `$request->validated()`.
- **SOLID Alignment:** [[rules/solid/single-responsibility|Single Responsibility (SRP)]] & Encapsulation.

### 4. [[rules/laravel/anti-patterns/config-caching|Direct env() Calls Outside Config]]

- **Problem:** Calling `env('KEY')` directly in controllers, models, or services returns `null` once `php artisan config:cache` is executed in production.
- **Antidote:** Map all environment variables into `config/*.php` and access them exclusively via `config('services.key')`.
- **SOLID Alignment:** [[rules/solid/dependency-inversion|Dependency Inversion (DIP)]].

### 5. [[rules/laravel/anti-patterns/monolithic-controllers|Monolithic Controllers]]

- **Problem:** Fat controllers containing validation, multi-table transactions, third-party API SDK calls, and email dispatches are untestable and unmaintainable.
- **Antidote:** Keep controllers under 25 lines; delegate domain mutations to Invokable Actions (`app/Modules/<Domain>/Actions/`) and Queued Jobs.
- **SOLID Alignment:** [[rules/solid/single-responsibility|Single Responsibility (SRP)]] & [[rules/solid/dependency-inversion|Dependency Inversion (DIP)]].

---

## Quick Reference Summary

| Anti-Pattern | Primary Risk | Modern Remedy | Dedicated Rule |
| :--- | :--- | :--- | :--- |
| **Untyped Arrays** | Runtime crash, zero static typing | Strongly typed `readonly class` DTOs | [[rules/laravel/anti-patterns/untyped-arrays|untyped-arrays.md]] |
| **N+1 Queries** | Exponential database latency | Eager loading `with(...)` & strict model mode | [[rules/laravel/anti-patterns/n-plus-one-queries|n-plus-one-queries.md]] |
| **Mass Assignment** | Privilege escalation vulnerability | Strict `$request->validated()` Form Requests | [[rules/laravel/anti-patterns/mass-assignment|mass-assignment.md]] |
| **Direct `env()` Calls** | Production outage under `config:cache` | Centralized `config('services.key')` mapping | [[rules/laravel/anti-patterns/config-caching|config-caching.md]] |
| **Monolithic Controllers** | Untestable god classes | Invokable Actions & Queued Jobs | [[rules/laravel/anti-patterns/monolithic-controllers|monolithic-controllers.md]] |

---

## Verification & Auditing Checklist

- [ ] **Strict Model Mode:** Verify `Model::preventLazyLoading(! $this->app->isProduction())` in `AppServiceProvider.php`.
- [ ] **Config Cache Audit:** Run `grep -rn "env(" app/ routes/ resources/` to ensure zero `env()` calls outside `config/`.
- [ ] **Mass Assignment Audit:** Confirm zero instances of `::create($request->all())` or `->update($request->all())` exist.
- [ ] **Static Type Analysis:** Run `vendor/bin/phpstan analyse --level=8` to confirm no untyped array parameters or return types exist in actions and services.
- [ ] **Skinny Controller Inspection:** Verify no controller action exceeds 25 lines or contains inline `DB::transaction()` or external SDK network calls.
