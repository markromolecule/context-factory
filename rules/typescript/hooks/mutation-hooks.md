---
ruleId: cf-rule-ts-mutation-hooks
name: mutation-hooks
description: Implement TanStack Query mutations with typed variables, safe optimistic cache updates, deterministic error rollback, and narrow invalidation.
scope: useMutation wrappers, optimistic updates, cache rollbacks, query invalidation, and mutation tests.
stack: typescript
frameworks: ["react"]
appliesTo: ["src/**/hooks/**/*.ts", "src/**/hooks/**/*.tsx", "**/use*Mutation*.ts", "**/use*Mutation*.tsx"]
layers: ["hooks", "state"]
alwaysApply: false
---

# Mutation Hooks

## Transport isolation and typing

- [directive:ts.mutation.transport-in-adapters][mode:evidence-blocking][verifier:human-evidence] Keep all raw network/transport calls in typed data adapters (`@/api`, `@/services`); mutation hooks coordinate only the React Query client cache, optimistic UI updates, and lifecycle callbacks.
- [directive:ts.mutation.explicit-types][mode:automated-blocking][verifier:typechecker] Define explicit TypeScript types for mutation variables (`TVariables`), mutation responses (`TData`), known error envelopes (`TError`), and optimistic snapshot context (`TContext`).

## Deterministic optimistic update lifecycle

When implementing optimistic mutations, follow the strict 3-stage lifecycle protocol:

1. **`onMutate(variables)` — Snapshot and apply optimistic patch:**
   - [directive:ts.mutation.cancel-outgoing-queries][mode:automated-blocking][verifier:test] Cancel any outgoing refetches on the affected query keys to prevent overwriting optimistic state: `await queryClient.cancelQueries({ queryKey })`.
   - [directive:ts.mutation.snapshot-previous-cache][mode:automated-blocking][verifier:test] Snapshot previous query cache data: `const previousData = queryClient.getQueryData(queryKey)`.
   - [directive:ts.mutation.immutable-optimistic-patch][mode:automated-blocking][verifier:test] Apply an immutable optimistic update to the cache: `queryClient.setQueryData(queryKey, (old) => patch(old, variables))`.
   - Return the snapshot context: `return { previousData }`.

2. **`onError(err, variables, context)` — Deterministic rollback:**
   - [directive:ts.mutation.deterministic-rollback][mode:automated-blocking][verifier:test] Immediately revert the cache to the previous snapshot: `if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData)`.
   - Trigger localized error notification or user feedback.

3. **`onSettled(data, error, variables, context)` — Narrow invalidation:**
   - [directive:ts.mutation.narrow-invalidation][mode:automated-blocking][verifier:test] Invalidate *only the narrowest* affected query keys to synchronize with the authoritative server state: `queryClient.invalidateQueries({ queryKey })`.

## Direct cache updates vs. invalidation

- [directive:ts.mutation.prefer-direct-cache-replace][mode:advisory][verifier:none] Prefer direct cache replacement (`queryClient.setQueryData`) when the server mutation response is authoritative and complete, avoiding an unnecessary follow-up network refetch.
- [directive:ts.mutation.invalidate-broad-only-when-needed][mode:advisory][verifier:none] Invalidate broad or list query keys only when derived counts, sorting, or multi-user aggregations require re-evaluation on the server.

## Idempotency and retry discipline

- [directive:ts.mutation.no-auto-retry-non-idempotent][mode:automated-blocking][verifier:test] Strictly prohibit automatic retry on non-idempotent mutations (`POST`, `DELETE`, non-idempotent `PATCH`) unless the backend endpoint supports and requires an explicit idempotency key header (`Idempotency-Key`).
- [directive:ts.mutation.caller-navigation-side-effects][mode:evidence-blocking][verifier:human-evidence] Keep UI navigation and route changes in the caller component rather than embedding navigation side effects directly inside the mutation hook.

## Verification

Test mutation success, expected error handling, snapshot rollback on server failure, narrow invalidation targeting, and concurrent mutation handling using mocked network adapters.
