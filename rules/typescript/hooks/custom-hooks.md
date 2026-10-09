---
ruleId: cf-rule-ts-custom-hooks
name: custom-hooks
description: Build focused, composable custom React hooks with stable referential identities, clear lifecycle discipline, and strict separation of UI and state logic.
scope: Custom React hooks, state composition, callback memoization, lifecycle effects, and hook tests.
stack: typescript
frameworks: ["react"]
appliesTo: ["src/**/hooks/**/*.ts", "src/**/hooks/**/*.tsx", "**/use*.ts", "**/use*.tsx"]
layers: ["hooks", "state"]
alwaysApply: false
---

# Custom Hooks

## Single responsibility and separation of concerns

- [directive:ts.hooks.isolate-state-logic][mode:evidence-blocking][verifier:human-evidence] Isolate complex component state, interaction state machines, calculations, and subscriptions inside custom hooks.
- [directive:ts.hooks.declarative-jsx-presentation][mode:evidence-blocking][verifier:human-evidence] Keep JSX rendering components declarative and focused purely on layout, accessibility, and presentation.
- [directive:ts.hooks.name-with-use-prefix][mode:automated-blocking][verifier:linter] Name hook files and symbols starting with `use` (e.g. `useTableFilter`, `useDebouncedValue`, `useActiveWorkspace`).
- [directive:ts.hooks.single-domain-concern][mode:advisory][verifier:none] Keep custom hooks focused on a single domain concern; compose multiple smaller hooks rather than creating monolithic god-hooks.

## Server state vs. client state discipline

- [directive:ts.hooks.no-mirror-server-state][mode:evidence-blocking][verifier:human-evidence] Never copy or mirror TanStack Query / server state into local `useState` or `useEffect` synchronization loops.
- [directive:ts.hooks.select-or-derive-client-values][mode:evidence-blocking][verifier:human-evidence] Use `select` in query hooks or compute derived client values directly in render flow (`useMemo` only when computation cost justifies it).
- [directive:ts.hooks.authoritative-server-cache][mode:evidence-blocking][verifier:human-evidence] Maintain UI-only state (e.g., drawer open/close, active tab, draft input) in local state or Zustand, keeping server state authoritative in the query cache.

## Referential stability and memoization

- [directive:ts.hooks.callback-memoization][mode:evidence-blocking][verifier:human-evidence] Wrap callback functions returned from custom hooks in `useCallback` when they are passed as props to memoized children or included in dependency arrays.
- [directive:ts.hooks.compound-object-memoization][mode:evidence-blocking][verifier:human-evidence] Memoize returned compound objects or arrays with `useMemo` when object identity changes would trigger unnecessary downstream re-renders or effect re-executions.
- [directive:ts.hooks.avoid-raw-inline-object-deps][mode:automated-blocking][verifier:linter] Avoid passing raw inline object literals as hook dependencies.

## Lifecycle and cleanup

- [directive:ts.hooks.deterministic-cleanup-return][mode:automated-blocking][verifier:test] Ensure every event listener, timer, WebSocket connection, or `AbortController` created within `useEffect` registers a deterministic cleanup return function.
- [directive:ts.hooks.prevent-cascading-updates][mode:evidence-blocking][verifier:human-evidence] Avoid cascading state updates where one hook's `setState` triggers another effect's `setState` across multiple render cycles.

## Verification

Test custom hook behavior using `@testing-library/react` (`renderHook`), verifying initial state, state transitions, stable callback references across re-renders, and proper cleanup on unmount.
