---
ruleId: cf-rule-ts-async-discipline
name: async-discipline
description: Prevent floating promises, eliminate async waterfalls, enforce AbortSignal propagation, protect connection pools, and ensure deterministic concurrency control.
scope: Asynchronous functions, event listeners, promises, background tasks, concurrency pools, and stream processing.
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["common", "services", "controllers", "data"]
alwaysApply: true
---

# Async and Concurrency Discipline

## Floating promise prevention and background tasks

- [directive:ts.async.no-floating-promises][mode:automated-blocking][verifier:linter] Prohibit floating promises. Every promise must be explicitly `await`ed, returned, or passed to an error-handled consumer.
- [directive:ts.async.explicit-void-background][mode:advisory][verifier:none] If intentionally firing a non-blocking asynchronous task in the background, mark it explicitly with `void` (e.g. `void trackAnalyticsEvent(event)`) and ensure internal errors in that task are caught and logged locally. Never let an unhandled background rejection escape.

## Waterfall elimination and parallel execution

- [directive:ts.async.no-sequential-await-loop][mode:automated-blocking][verifier:linter] Prohibit sequential `await` inside loops (`for ... of { await ... }`) when loop iterations are independent.
- [directive:ts.async.use-promise-all][mode:advisory][verifier:none] Use `Promise.all()` for independent operations whose results are all required. Await dependent operations in order. Promise.all rejects on a failure but does not cancel sibling work.
- [directive:ts.async.use-promise-allsettled][mode:advisory][verifier:none] Use `Promise.allSettled()` for independent operations where individual task failures must not abort sibling operations (e.g., multi-channel notifications, audit trails).

## Concurrency pooling and database protection

- [directive:ts.async.no-unbounded-promise-all][mode:evidence-blocking][verifier:human-evidence] When executing concurrent operations against rate-limited APIs, file systems, or databases, strictly prohibit unbounded `Promise.all` across large collections.
- [directive:ts.async.use-concurrency-limiter][mode:advisory][verifier:none] Use concurrency pool limiters (e.g., `p-limit` with a default concurrency of 10–25) or chunked iteration to prevent exhausting database connection pools and hitting network socket limits.

## Abort signals and cancellation

- [directive:ts.async.accept-abort-signal][mode:evidence-blocking][verifier:human-evidence] Accept and propagate `AbortSignal` across all asynchronous I/O functions, network requests, long polling, and database queries.
- [directive:ts.async.propagate-request-signal][mode:evidence-blocking][verifier:human-evidence] Propagate request cancellation through documented driver APIs where supported. Do not invent AbortSignal parameters or claim a database query stopped merely because the HTTP request ended; use supported timeouts and suppress stale results when cancellation is unavailable.
- [directive:ts.async.check-signal-aborted][mode:advisory][verifier:none] Check `signal.aborted` or listen to `signal.addEventListener("abort", ...)` before beginning expensive async work or between sequential batch iterations.
- [directive:ts.async.timeout-signal][mode:advisory][verifier:none] Respect timeout signals (`AbortSignal.timeout(ms)`) for external HTTP calls and downstream RPC operations.

## Transaction concurrency and lock discipline

- [directive:ts.async.no-io-in-transaction][mode:evidence-blocking][verifier:human-evidence] Strictly prohibit external network calls, heavy CPU hashing/crypto, or sleep operations inside open database transactions.
- [directive:ts.async.short-transactions][mode:advisory][verifier:none] Keep database transactions as short as possible to prevent lock contention, deadlocks, and connection starvation.
- [directive:ts.async.deterministic-lock-order][mode:evidence-blocking][verifier:human-evidence] Enforce deterministic lock acquisition order across transactions that touch multiple tables.

## Verification

Test promise rejection handling, AbortSignal cancellation behavior on client disconnect, concurrency pool limits under load, and transaction rollback on error.
