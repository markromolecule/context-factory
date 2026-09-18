---
name: query-optimization
description: Enforce eager loading, N+1 query prevention, cursor pagination, and ESR compound index alignment.
scope: Database queries, Eloquent queries, pagination, and migration indexes.
alwaysApply: true
---

# Database Query Optimization and Performance

## Boundaries

- Strictly prohibit N+1 queries. Interleaving data iteration with relational network queries violates [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by forcing presentation loops to manage data fetching. Enable `Model::preventLazyLoading(!app()->isProduction())` in `AppServiceProvider::boot()` so lazy loading throws an immediate exception during development and automated tests. See [[rules/laravel/common/anti-patterns|Laravel Anti-Patterns Guide]].
- Never execute unbounded `->all()` or `->get()` queries on unbounded tables; always apply explicit filtering, `limit()`, or pagination.
- Never use `chunk()` when mutating records within the loop; always use `chunkById()` to avoid skipped rows due to primary key offsets shifting.
- Design database indexes following the **ESR rule** (Equality columns first, Sort columns second, Range columns last).

## Behavior

- **Eager Loading Discipline:**
  - Always eager-load known relationships at the query root:

    ```php
    $orders = Order::query()
        ->with(['user:id,name,email', 'items.product'])
        ->where('status', OrderStatus::Pending)
        ->latest()
        ->paginate(20);
    ```

  - Use `loadMissing()` when eager loading needs to be applied conditionally without re-querying already loaded relations.
  - Use `withCount(['comments', 'likes'])` instead of loading collections merely to count them.
- **Pagination Strategy:**
  - Use `paginate($perPage)` for standard administrative interfaces requiring page numbers and total counts.
  - Use `cursorPaginate($perPage)` or `simplePaginate($perPage)` for high-volume APIs, mobile feeds, and infinite-scroll views to avoid expensive `COUNT(*)` queries on multi-million row tables.
- **Selective Column Projections:**
  - Avoid selecting large `TEXT` or `JSON` columns unless they are actively needed in the response: `User::select(['id', 'name', 'email'])->get()`.
- **Database Query Debugging:**
  - Utilize Laravel Telescope, Laravel Pulse, or `DB::listen()` in local development to inspect query counts, duplicate queries, and execution timings.

## Verification

- Run test suites with strict lazy loading enabled; confirm zero `LazyLoadingViolationException` errors occur.
- Profile critical API endpoints to confirm query counts stay constant (O(1)) regardless of the number of items returned in the collection.
- Inspect `EXPLAIN` query plans on high-traffic queries to ensure full index hits and zero unintended sequential table scans.
