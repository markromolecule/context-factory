---
ruleId: cf-rule-ts-solidjs
name: solidjs
description: Preserve SolidJS fine-grained reactivity, ownership cleanup, and request-safe rendering without importing React assumptions.
scope: SolidJS components, signals, stores, effects, and reactive data loading.
stack: typescript
frameworks: ["solidjs"]
appliesTo: ["**/*.tsx", "**/hooks/**/*.ts", "**/primitives/**/*.ts", "**/stores/**/*.ts"]
layers: ["components", "state"]
alwaysApply: false
---

# SolidJS

Use with shared TypeScript rules. `rules/solid/` means SOLID architecture principles, not SolidJS. Use the installed Solid router and data APIs; do not import React hooks or assume components rerun on every update.

- [directive:ts.solidjs.preserve-reactivity][mode:evidence-blocking][verifier:human-evidence] Read reactive props inside tracked expressions or accessors. Do not snapshot them through top-level destructuring; use the installed framework's reactive prop utilities when splitting or merging props.
- [directive:ts.solidjs.derive-state][mode:evidence-blocking][verifier:human-evidence] Derive values with accessors or memos. Use effects for external side effects; avoid effects that repeatedly copy derived values into signals or create update loops.
- [directive:ts.solidjs.owned-cleanup][mode:evidence-blocking][verifier:human-evidence] Create reactive computations under the appropriate owner and register cleanup for subscriptions, listeners, and timers with onCleanup. Dispose manually created roots when their work ends.
- [directive:ts.solidjs.resource-races][mode:evidence-blocking][verifier:human-evidence] Use the project's reactive resource or router data primitives. Model pending and failure states and prevent stale requests from overwriting current data; forward cancellation only through APIs that support it.
- [directive:ts.solidjs.list-identity][mode:evidence-blocking][verifier:human-evidence] Choose Solid list and conditional primitives according to identity and update behavior. Verify reorder, insertion, removal, and branch changes; do not copy React key or render assumptions.
- [directive:ts.solidjs.request-isolation][mode:evidence-blocking][verifier:human-evidence] When server rendering, keep user-specific mutable state scoped to each request. Access browser globals only in supported client lifecycle code and preserve matching server/client output during hydration.

## Verification

Test reactive prop updates, derived values, list changes, cleanup, stale requests, and hydration where applicable. Use Solid-compatible tooling. These directives require review evidence until dedicated conformance verifiers exist.

## References

[Reactive props](https://docs.solidjs.com/concepts/components/props)
[Effects and cleanup](https://docs.solidjs.com/concepts/effects)
