---
ruleId: cf-rule-laravel-anti-patterns-n-plus-one-queries
name: n-plus-one-queries
description: Eliminate N+1 database queries through eager loading, query root preloading, and strict model enforcement in dev/test.
scope: Eloquent models, queries, relationship iteration, controllers, and Blade templates.
stack: laravel
appliesTo: ["app/**/*.php", "resources/views/**/*.blade.php"]
layers: ["data", "queries"]
alwaysApply: false
---

# N+1 Database Queries Anti-Pattern

- [directive:laravel.anti-patterns.n-plus-one][mode:automated-blocking][verifier:linter] Require eager-loading and query evidence where relationship iteration can create N+1 behavior.

The N+1 database query problem occurs when an initial query fetches $N$ records (1 query), and iterating through those records executes an additional relational query for every single record ($N$ queries), producing $N + 1$ queries instead of 2. In production, this causes massive database load, connection pool starvation, and severe latency spikes.

## Boundaries

- **MUST NOT:** Iterate through Eloquent collections while accessing relationships that have not been explicitly eager-loaded.
- **MUST NOT:** Access dynamic relationships inside Blade template loops (`@foreach ($posts as $post) {{ $post->author->name }} @endforeach`) without preloading relations in the Controller.
- **MUST:** Eager-load relations at the query root using `with(['relation'])` or `with(['relation:id,name'])`.
- **MUST:** Use `loadMissing(['relation'])` when relations need to be loaded conditionally without duplicating queries.
- **MUST:** Enable strict model enforcement (`Model::preventLazyLoading()`) in `AppServiceProvider::boot()` for local and testing environments.

## Why It Fails

1. **Database Roundtrip Multiplier:** Fetching 100 posts fires 101 separate SQL queries. Under concurrent traffic, database connection pools are quickly exhausted.
2. **Exponential Latency:** Even with 1ms query roundtrip latency, 100 separate queries add 100ms+ of pure network overhead to a single HTTP request.
3. **Silent Local Masking:** With small local seed datasets (e.g. 5 records), N+1 queries appear fast, masking severe production degradation until deployed against large tables.

## Concrete Remediations

### Bad: Lazy Loading in Loops

```php
// BAD: Fires 1 query for posts + 100 queries for authors (101 total queries)
$posts = Post::all();

foreach ($posts as $post) {
    echo $post->author->name; // Fires: SELECT * FROM authors WHERE id = ?
}
```

### Good: Eager Loading at the Query Root

```php
declare(strict_types=1);

namespace App\Modules\Blog\Controllers;

use App\Modules\Blog\Models\Post;
use Illuminate\Contracts\View\View;

final class PostIndexController
{
    public function __invoke(): View
    {
        // GOOD: Eager-loads authors ahead of time; executes exactly 2 queries
        $posts = Post::query()
            ->with(['author:id,name,avatar_url'])
            ->latest('published_at')
            ->paginate(20);

        return view('modules.blog.index', [
            'posts' => $posts,
        ]);
    }
}
```

### Strict Mode Guardrail (`AppServiceProvider.php`)

Activate Laravel's built-in strict mode to throw an immediate `LazyLoadingViolationException` in development and testing environments:

```php
declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Model::preventLazyLoading(! $this->app->isProduction());
        Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());
        Model::preventAccessingMissingAttributes(! $this->app->isProduction());
    }
}
```

## SOLID Principles Alignment

- **[[rules/solid/single-responsibility|Single Responsibility Principle (SRP)]]:** Deferring relational queries into collection loops or Blade views forces the presentation layer to manage database access orchestration. Eager-loading upfront ensures the query layer is solely responsible for data retrieval, while views and loops remain purely responsible for rendering.

## Verification

- Confirm `Model::preventLazyLoading(! $this->app->isProduction())` is configured in `app/Providers/AppServiceProvider.php`.
- Run automated feature tests; verify zero `LazyLoadingViolationException` exceptions are thrown.
- Inspect endpoints with Laravel Pulse or Laravel Telescope to verify query counts remain $O(1)$ regardless of pagination count.
