---
name: query-hooks
description: Build stable TanStack Query hooks with centralized keys, typed inputs, deliberate caching, and UI-independent data access.
scope: Query keys, `useQuery` wrappers, prefetching, server hydration, and query tests.
alwaysApply: false
---

# Query Hooks

- Keep raw API/database access outside hooks and inject or import a typed data adapter.
- Define hierarchical query-key factories; include every input that changes the result.
- Use `enabled` for unavailable prerequisites instead of issuing invalid requests.
- Choose `staleTime`, garbage collection, retry, and refetch behavior from data volatility and UX requirements.
- Transform transport data in the adapter or `select`; do not mutate cached values.
- Preserve cancellation signals when the query library supplies them.
- Keep hooks focused on one resource/use case and return the standard query result unless a narrower contract adds value.
- Avoid copying server state into Zustand/local component state.

Test key stability, disabled behavior, success, mapped errors, cancellation where relevant, and cache behavior. For Next.js hydration, ensure server and client use identical keys and serializers.
