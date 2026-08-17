---
name: mutation-hooks
description: Implement TanStack Query mutations with typed variables, safe cache updates, and explicit error/retry behavior.
scope: useMutation wrappers, optimistic updates, invalidation, and mutation tests.
alwaysApply: false
---

# Mutation Hooks

- Keep transport calls in typed data adapters; hooks coordinate client cache and UI lifecycle.
- Type mutation variables, result, and known errors explicitly.
- Invalidate the narrowest affected query keys after success.
- Prefer server responses for cache replacement when they are authoritative.
- Use optimistic updates only when latency benefit justifies rollback complexity.
- For optimistic updates: cancel relevant queries, snapshot prior data, apply an immutable patch, restore on error, and refetch on settlement.
- Do not retry non-idempotent mutations unless the backend provides an idempotency contract.
- Keep toast/navigation behavior in the caller unless it is universal policy for that mutation.

Test success, known error mapping, invalidation, concurrent mutations, and complete optimistic rollback. Ensure failures never leave cache state that the server rejected.
