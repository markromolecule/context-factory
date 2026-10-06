---
ruleId: cf-rule-laravel-database-migrations-and-seeders
name: migrations-and-seeders
description: Govern atomic database migrations, schema indexing, foreign key constraints, model factories, and test seeders.
scope: Database migrations (database/migrations), seeders (database/seeders), and factories (database/factories).
stack: laravel
appliesTo: ["database/migrations/**/*.php", "database/seeders/**/*.php", "database/factories/**/*.php"]
layers: ["data", "migrations"]
alwaysApply: false
---

# Migrations, Seeders, and Model Factories

- [directive:laravel.database.migrations][mode:evidence-blocking][verifier:human-evidence] Require reviewed forward and rollback evidence for schema migrations and deterministic seed behavior.

## Boundaries

- Author migrations as anonymous migration classes (`return new class extends Migration { ... };`) to prevent class naming collisions.
- Every migration must be reversible; define the `down()` method unless the migration is an intentionally destructive one-way migration in an early-stage project.
- Enforce referential integrity using database-level foreign key constraints with explicit deletion rules (`cascadeOnDelete()`, `nullOnDelete()`, or `restrictOnDelete()`); never rely solely on application-level model events for referential integrity.
- Never hardcode production secrets, real user credentials, or live API tokens in seeders.

## Behavior

- **Schema Migration Discipline:**
  - Index foreign keys and searchable columns:

    ```php
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
        $table->string('status', 32)->index();
        $table->decimal('total_amount', 12, 2);
        $table->timestamps();
        $table->index(['user_id', 'status', 'created_at']); // ESR index
    });
    ```

  - For column renames or type modifications on SQLite (testing) and PostgreSQL/MySQL (production), test rollback and upgrade paths.
- **Model Factories:**
  - Define complete, realistic default states for every model using Faker methods (`name()`, `safeEmail()`, `unique()`).
  - Create dedicated factory states (`factory()->unverified()`, `factory()->admin()`, `factory()->completed()`) instead of passing manual overrides repeatedly across tests.
  - Define factory relationships using `for()` or `has()` to generate valid dependency trees automatically.
- **Seeder Separation:**
  - Maintain a strict separation between **Reference / Lookup Seeders** (essential system roles, lookup statuses, currencies required for the app to function) and **Demo / Testing Seeders** (sample users, fake transactions).
  - Only execute reference seeders during production deployments; run demo seeders exclusively in local development.

## Verification

- Run `php artisan migrate:fresh --seed` on a local database to verify that the complete schema builds cleanly without foreign key ordering failures.
- Run `php artisan migrate:rollback` followed by `php artisan migrate` to verify complete rollback reversibility.
- Test that model factories generate valid instances that pass database constraints without manual field overrides.
