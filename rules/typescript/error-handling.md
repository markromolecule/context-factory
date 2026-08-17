---
name: error-handling
description: Standardize typed error representations, Result patterns for predictable domain failures, and safe catch-block handling.
scope: Error types, exception boundaries, service responses, and catch blocks.
alwaysApply: true
---

# Error Handling and Result Types

## Result patterns for expected domain failures

- Prefer explicit Result types (`Result<T, E>` or `{ success: true, data: T } | { success: false, error: E }`) over throwing exceptions for expected business failures (e.g. `UserNotFound`, `InsufficientFunds`, `InvalidCredentials`).
- Reserve exceptions (`throw new Error(...)`) for truly exceptional, unrecoverable system faults (e.g. network partition, disk failure, unexpected database disconnect).
- Define custom domain error classes extending standard `Error` with `name` and structured metadata properties when throwing exceptions is required.

## Safe catch blocks and error narrowing

- Always type catch clause variables as `unknown` (`catch (err: unknown)`).
- Narrow caught errors using type guards (e.g. `err instanceof Error`, `isAppError(err)`) before reading `.message`, `.stack`, or custom properties.
- Do not swallow errors silently. If catching an error to rethrow or transform, always attach the original error via `new Error("...", { cause: err })` to preserve the complete causal stack trace.

## Async error propagation

- Ensure unhandled promise rejections are impossible by awaiting or returning promises within `try/catch` or piping through result monads.
- When wrapping third-party SDK calls that reject promises, encapsulate them in an adapter function that maps SDK exceptions to predictable domain Results.
