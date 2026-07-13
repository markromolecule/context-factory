---
name: zustand-store
description: Use Zustand for minimal shared client state with selector-based subscriptions and deterministic reset behavior.
scope: Zustand stores, middleware, selectors, persistence, and store tests.
alwaysApply: false
---

# Zustand Stores

Use a store only for client state shared across distant components or routes. Prefer component state for local UI and TanStack Query for server state.

- Keep stores domain-focused and state shallow.
- Define state and actions with explicit types and expose a default-state constant.
- Use selectors; never subscribe a component to the entire store without a measured reason.
- Compute derived values through selectors rather than storing duplicates.
- Add Immer only when nested update complexity justifies the dependency.
- Add persistence only for intentional durable state, version its schema, and exclude secrets.
- Keep side effects in services/actions around the store; keep state transitions deterministic.
- Provide an explicit reset action when session/project boundaries require cleanup.

Test initial state, every action, reset, selector results, and persistence migration when used. Reset store state between tests to prevent order dependence.
