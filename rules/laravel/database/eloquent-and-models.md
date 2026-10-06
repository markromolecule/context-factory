---
ruleId: cf-rule-laravel-database-eloquent-and-models
name: eloquent-and-models
description: Govern Eloquent Active Record conventions, explicit relationship typing, attribute casting, and local query scopes.
scope: Eloquent models, relationships, scopes, casts, and model lifecycle observers.
stack: laravel
appliesTo: ["app/**/Models/**/*.php", "app/**/Models/*.php"]
layers: ["data", "models"]
alwaysApply: false
---

# Eloquent ORM and Models

- [directive:laravel.database.eloquent-models][mode:evidence-blocking][verifier:human-evidence] Review model relationships, casts, and lifecycle behavior at the Eloquent boundary.

## Boundaries

- **Single Responsibility Principle (SRP):** Eloquent models represent data entity schema, casts, relationships, and persistence contracts. Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by preventing "fat models": business orchestration, multi-model transactions, external API interactions, and payment flows belong in dedicated Invokable Actions or Domain Services, not Eloquent model methods.
- Embrace Eloquent models as Active Records with built-in query building capabilities; strictly prohibit creating fake repository classes (`UserRepositoryInterface` -> `UserRepository`) that merely wrap Eloquent methods (`all()`, `find()`, `where()`).
- Always define explicit return types on all relationship methods (e.g. `public function orders(): HasMany`).
- Define mass-assignment protection explicitly using `$fillable` on all models to prevent unintended attribute writes; never leave models unguarded.
- Never trigger synchronous external HTTP requests, heavy email dispatching, or blocking network I/O inside Eloquent lifecycle hooks (`booted()`, observers, or mutators); use asynchronous Queued Events instead.

## Behavior

- **Modern Attribute Casting:**
  - Define attribute casting in the modern `casts(): array` method (Laravel 11+) or `$casts` property, using native PHP types, backed enums, and encrypted casts:

    ```php
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'is_active' => 'boolean',
            'metadata' => 'array',
            'api_secret' => 'encrypted',
            'placed_at' => 'immutable_datetime',
        ];
    }
    ```

- **Relationships:**
  - Use expressive relationship declarations (`hasOne`, `hasMany`, `belongsTo`, `belongsToMany`, `morphMany`, etc.).
  - Always define the inverse relationship to maintain bidirectional referential integrity.
- **Query Scopes & Custom Builders (Open/Closed Principle):**
  - Adhere to the [[rules/solid/open-closed|Open/Closed Principle (OCP)]] by encapsulating reusable query constraints in local query scopes and custom Eloquent Builder classes. This keeps the core model and query call sites closed to modification while remaining cleanly open for domain-specific query extension:

    ```php
    public function scopeActive(Builder $query): void
    {
        $query->where('status', OrderStatus::Active);
    }
    ```

  - For complex models with dozens of scopes, extract a custom Eloquent Builder class (`OrderBuilder extends Builder`) overriding `newEloquentBuilder($query)` to keep the model class readable.
- **Anti-Overengineering Rule:**
  - Avoid creating separate DTO or entity mapper layers for internal database operations; Eloquent models and API Resources provide sufficient data modeling and response separation.

## Verification

- Run static analysis with Larastan/PHPStan to verify model property types and relationship return signatures.
- Write unit tests verifying that local scopes produce the expected SQL where constraints.
- Test that mass-assignment prevents unfillable attributes from being persisted.
