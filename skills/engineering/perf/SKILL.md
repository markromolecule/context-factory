---
name: perf
description: Profile and fix runtime bottlenecks: N+1 queries, missing indexes, async waterfalls, memory, bundle size. Triggers: /perf, [PERF], "optimize queries", "reduce latency", or review performance findings.
---

# Perf

Measure first, optimize second, verify third. No optimization without a before/after number.

## Workflow
1. **Baseline:** record latency, query count, memory, or bundle size.
2. **Find the cause:** match against the rules below.
3. **Fix:** the smallest surface that resolves it.
4. **Verify:** run the checklist at the bottom.

## Rules

**Database**
- No queries inside loops. Batch with `WHERE x IN (...)` or a join, then group in memory.
- Composite indexes follow ESR order: equality (=) → sort (ORDER BY) → range (<, >, BETWEEN, multi-value IN).
- Paginate with keyset on `(created_at, id)` and `LIMIT n+1`. No `OFFSET`.
- No `SELECT *` / `selectAll()`. Name the columns.

**Async**
- Independent awaits run via `Promise.all` / `allSettled`.
- Batch jobs use `p-limit` (10–25). Never unbounded `Promise.all(items.map(...))`.
- Pass the request `AbortSignal` to DB and fetch calls.
- No external API calls (Stripe, S3, etc.) inside open transactions.

**Memory**
- High-volume reads use the query builder (Kysely), not ORM hydration.
- Large result sets use cursors or streams, never full arrays.
- Close timers, listeners, sockets, and file handles.

**Bundle / Render**
- Prefer modular imports (`lodash-es`, `date-fns`). Lazy-load admin dialogs, editors, and charts.
- `useMemo` for heavy computation, `useCallback` for handlers passed to memoized children.
- Keep fast-changing state (scroll, mouse) in leaf components, not root context.

## Example (non-obvious fix)
```ts
const users = await db.selectFrom('users').select(['id', 'name']).execute();
const posts = await db.selectFrom('posts').select(['id', 'user_id', 'title'])
  .where('user_id', 'in', users.map(u => u.id)).execute();
// Group in memory (Map.groupBy in Node 21+, or Object.groupBy / reduce in older runtimes)
const byUser = Map.groupBy(posts, (p) => p.user_id);
return users.map(u => ({ ...u, posts: byUser.get(u.id) ?? [] }));
```

## Handoffs
- Needs structural change (splitting services, adding a cache layer) → `/refactor`
- Every fix gets a query-count or perf test → `/test`

## Done when
- [ ] Baseline and after-measurement both reported
- [ ] `EXPLAIN ANALYZE` shows an index seek on changed queries
- [ ] Query count is O(1) relative to result size
- [ ] Batch I/O is concurrency-limited
- [ ] Existing tests pass
