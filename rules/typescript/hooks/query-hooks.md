---
ruleId: cf-rule-ts-query-hooks
name: query-hooks
description: Build stable TanStack Query hooks with centralized keys, typed inputs, deliberate caching, and UI-independent data access.
scope: Query keys, `useQuery` wrappers, prefetching, server hydration, and query tests.
stack: typescript
appliesTo: ["src/**/hooks/**/*.ts", "src/**/hooks/**/*.tsx", "**/use*Query*.ts", "**/use*Query*.tsx"]
layers: ["hooks", "state"]
alwaysApply: false
---

# Query Hooks

- [directive:ts.query-hook.external-data-adapter][mode:evidence-blocking][verifier:human-evidence] Keep raw API/database access outside hooks and inject or import a typed data adapter.
- [directive:ts.query-hook.hierarchical-key-factories][mode:automated-blocking][verifier:typechecker] Define hierarchical query-key factories; include every input that changes the result.
- [directive:ts.query-hook.use-enabled-guard][mode:automated-blocking][verifier:test] Use `enabled` for unavailable prerequisites instead of issuing invalid requests.
- [directive:ts.query-hook.deliberate-cache-policy][mode:advisory][verifier:none] Choose `staleTime`, garbage collection, retry, and refetch behavior from data volatility and UX requirements.
- [directive:ts.query-hook.transform-via-adapter-or-select][mode:evidence-blocking][verifier:human-evidence] Transform transport data in the adapter or `select`; do not mutate cached values.
- [directive:ts.query-hook.preserve-cancellation-signals][mode:automated-blocking][verifier:test] Preserve cancellation signals when the query library supplies them.
- [directive:ts.query-hook.focused-resource-contract][mode:advisory][verifier:none] Keep hooks focused on one resource/use case and return the standard query result unless a narrower contract adds value.
- [directive:ts.query-hook.no-server-state-in-client-store][mode:evidence-blocking][verifier:human-evidence] Avoid copying server state into Zustand/local component state.

Test key stability, disabled behavior, success, mapped errors, cancellation where relevant, and cache behavior. For Next.js hydration, ensure server and client use identical keys and serializers.
