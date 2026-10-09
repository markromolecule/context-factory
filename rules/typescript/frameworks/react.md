---
ruleId: cf-rule-ts-react
name: react
description: Keep React components pure, effects purposeful, state minimal, and interaction identity stable.
scope: React components and custom hooks; also applies to React used by Next.js.
stack: typescript
frameworks: ["react"]
appliesTo: ["**/*.tsx", "**/hooks/**/*.ts", "**/use*.ts"]
layers: ["components", "hooks"]
alwaysApply: false
---

# React

Use with the shared TypeScript rules. Follow the installed React version and existing router, state library, and compiler configuration.

- [directive:ts.react.hooks-and-effects][mode:evidence-blocking][verifier:human-evidence] Follow the installed React Rules of Hooks and dependency lint rules. Use effects to synchronize external systems; derive values during rendering and handle user actions in event handlers.
- [directive:ts.react.pure-render][mode:evidence-blocking][verifier:human-evidence] Keep rendering pure. Do not mutate props, state, or cached data; use state updates that preserve other queued changes. Keep side effects outside render.
- [directive:ts.react.minimal-state][mode:evidence-blocking][verifier:human-evidence] Store only authoritative state. Derive other values; keep temporary form drafts distinct from server data. Extract custom hooks when behavior is complex or reused, not for every local state variable.
- [directive:ts.react.effect-cleanup][mode:evidence-blocking][verifier:human-evidence] Clean up subscriptions and timers. Cancel supported requests or ignore stale responses when inputs change or components unmount; verify that old results cannot overwrite newer state.
- [directive:ts.react.stable-identity][mode:evidence-blocking][verifier:human-evidence] Use stable domain keys for changing lists and framework-generated IDs for accessibility relationships. Avoid random render-time keys and index keys when items reorder, insert, or disappear.
- [directive:ts.react.justified-memoization][mode:advisory][verifier:none] Add memoization only for measured cost or a required identity contract; account for the project's React Compiler configuration. Do not use memoization to repair incorrect effects.

## Verification

Run the configured React lint rules and behavior tests for changed interactions. Exercise prop changes, reordered lists, cleanup, and stale responses when relevant. These directives require review evidence until dedicated conformance verifiers exist; a generic adapter PASS does not prove them.

## References

[Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
