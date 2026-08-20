---
name: custom-hooks
description: Build focused, composable custom React hooks with stable referential identities, clear lifecycle discipline, and strict separation of UI and state logic.
scope: Custom React hooks, state composition, callback memoization, lifecycle effects, and hook tests.
alwaysApply: false
---

# Custom Hooks

## Single responsibility and separation of concerns

- Isolate complex component state, interaction state machines, calculations, and subscriptions inside custom hooks.
- Keep JSX rendering components declarative and focused purely on layout, accessibility, and presentation.
- Name hook files and symbols starting with `use` (e.g. `useTableFilter`, `useDebouncedValue`, `useActiveWorkspace`).
- Keep custom hooks focused on a single domain concern; compose multiple smaller hooks rather than creating monolithic god-hooks.

## Server state vs. client state discipline

- Never copy or mirror TanStack Query / server state into local `useState` or `useEffect` synchronization loops.
- Use `select` in query hooks or compute derived client values directly in render flow (`useMemo` only when computation cost justifies it).
- Maintain UI-only state (e.g., drawer open/close, active tab, draft input) in local state or Zustand, keeping server state authoritative in the query cache.

## Referential stability and memoization

- Wrap callback functions returned from custom hooks in `useCallback` when they are passed as props to memoized children or included in dependency arrays.
- Memoize returned compound objects or arrays with `useMemo` when object identity changes would trigger unnecessary downstream re-renders or effect re-executions.
- Avoid passing raw inline object literals as hook dependencies.

## Lifecycle and cleanup

- Ensure every event listener, timer, WebSocket connection, or `AbortController` created within `useEffect` registers a deterministic cleanup return function.
- Avoid cascading state updates where one hook's `setState` triggers another effect's `setState` across multiple render cycles.

## Verification

Test custom hook behavior using `@testing-library/react` (`renderHook`), verifying initial state, state transitions, stable callback references across re-renders, and proper cleanup on unmount.
