---
ruleId: cf-rule-ts-zustand-store
name: zustand-store
description: Use Zustand for minimal shared client state with selector-based subscriptions and deterministic reset behavior.
scope: Zustand stores, middleware, selectors, persistence, and store tests.
stack: typescript
frameworks: ["react"]
appliesTo: ["src/**/stores/**/*.ts", "src/**/store/**/*.ts", "**/*Store.ts", "**/*store.ts"]
layers: ["hooks", "state"]
alwaysApply: false
---

# Zustand Stores

Use a store only for client state shared across distant components or routes. Prefer component state for local UI and TanStack Query for server state.

- [directive:ts.zustand.domain-focused-shallow-state][mode:advisory][verifier:none] Keep stores domain-focused and state shallow.
- [directive:ts.zustand.explicit-types-and-defaults][mode:automated-blocking][verifier:typechecker] Define state and actions with explicit types and expose a default-state constant.
- [directive:ts.zustand.selector-based-subscriptions][mode:evidence-blocking][verifier:human-evidence] Use selectors; never subscribe a component to the entire store without a measured reason.
- [directive:ts.zustand.derived-values-in-selectors][mode:advisory][verifier:none] Compute derived values through selectors rather than storing duplicates.
- [directive:ts.zustand.immer-when-justified][mode:advisory][verifier:none] Add Immer only when nested update complexity justifies the dependency.
- [directive:ts.zustand.versioned-persistence-schema][mode:automated-blocking][verifier:test] Add persistence only for intentional durable state, version its schema, and exclude secrets.
- [directive:ts.zustand.deterministic-transitions][mode:evidence-blocking][verifier:human-evidence] Keep side effects in services/actions around the store; keep state transitions deterministic.
- [directive:ts.zustand.explicit-reset-action][mode:automated-blocking][verifier:test] Provide an explicit reset action when session/project boundaries require cleanup.

Test initial state, every action, reset, selector results, and persistence migration when used. Reset store state between tests to prevent order dependence.
