---
ruleId: cf-rule-ts-error-handling
name: error-handling
description: Standardize typed error representations, Result patterns for predictable domain failures, and safe catch-block handling.
scope: Error types, exception boundaries, service responses, and catch blocks.
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["common", "services", "controllers"]
alwaysApply: true
---

# Error Handling and Result Types

## Result patterns for expected domain failures

- [directive:ts.error.use-result-type][mode:evidence-blocking][verifier:human-evidence] Prefer explicit Result types (`Result<T, E>` or `{ success: true, data: T } | { success: false, error: E }`) over throwing exceptions for expected business failures (e.g. `UserNotFound`, `InsufficientFunds`, `InvalidCredentials`).
- [directive:ts.error.exceptions-for-unrecoverable][mode:advisory][verifier:none] Reserve exceptions (`throw new Error(...)`) for truly exceptional, unrecoverable system faults (e.g. network partition, disk failure, unexpected database disconnect).
- [directive:ts.error.custom-domain-error-classes][mode:advisory][verifier:none] Define custom domain error classes extending standard `Error` with `name` and structured metadata properties when throwing exceptions is required.

## Safe catch blocks and error narrowing

- [directive:ts.error.catch-unknown][mode:automated-blocking][verifier:typechecker] Always type catch clause variables as `unknown` (`catch (err: unknown)`).
- [directive:ts.error.narrow-caught-errors][mode:automated-blocking][verifier:typechecker] Narrow caught errors using type guards (e.g. `err instanceof Error`, `isAppError(err)`) before reading `.message`, `.stack`, or custom properties.
- [directive:ts.error.no-swallow-errors][mode:evidence-blocking][verifier:human-evidence] Do not swallow errors silently. If catching an error to rethrow or transform, always attach the original error via `new Error("...", { cause: err })` to preserve the complete causal stack trace.

## Async error propagation

- [directive:ts.error.no-unhandled-rejections][mode:automated-blocking][verifier:linter] Ensure unhandled promise rejections are impossible by awaiting or returning promises within `try/catch` or piping through result monads.
- [directive:ts.error.adapter-wrapping][mode:advisory][verifier:none] When wrapping third-party SDK calls that reject promises, encapsulate them in an adapter function that maps SDK exceptions to predictable domain Results.
