---
name: async-discipline
description: Prevent floating promises, eliminate async waterfalls, enforce AbortSignal propagation, protect connection pools, and ensure deterministic concurrency control.
scope: Asynchronous functions, event listeners, promises, background tasks, concurrency pools, and stream processing.
alwaysApply: true
---

# Async and Concurrency Discipline

## Floating promise prevention and background tasks

- Prohibit floating promises. Every promise must be explicitly `await`ed, returned, or passed to an error-handled consumer.
- If intentionally firing a non-blocking asynchronous task in the background, mark it explicitly with `void` (e.g. `void trackAnalyticsEvent(event)`) and ensure internal errors in that task are caught and logged locally. Never let an unhandled background rejection escape.

## Waterfall elimination and parallel execution

- Prohibit sequential `await` inside loops (`for ... of { await ... }`) when loop iterations are independent.
- Use `Promise.all()` for strictly interdependent parallel operations where failure of one operation invalidates the entire batch.
- Use `Promise.allSettled()` for independent operations where individual task failures must not abort sibling operations (e.g., multi-channel notifications, audit trails).

## Concurrency pooling and database protection

- When executing concurrent operations against rate-limited APIs, file systems, or databases, strictly prohibit unbounded `Promise.all` across large collections.
- Use concurrency pool limiters (e.g., `p-limit` with a default concurrency of 10–25) or chunked iteration to prevent exhausting database connection pools and hitting network socket limits.

## Abort signals and cancellation

- Accept and propagate `AbortSignal` across all asynchronous I/O functions, network requests, long polling, and database queries.
- Pass incoming HTTP request `AbortSignal` down to database clients to immediately abort running SQL queries if the client disconnects before completion.
- Check `signal.aborted` or listen to `signal.addEventListener("abort", ...)` before beginning expensive async work or between sequential batch iterations.
- Respect timeout signals (`AbortSignal.timeout(ms)`) for external HTTP calls and downstream RPC operations.

## Transaction concurrency and lock discipline

- Strictly prohibit external network calls, heavy CPU hashing/crypto, or sleep operations inside open database transactions.
- Keep database transactions as short as possible to prevent lock contention, deadlocks, and connection starvation.
- Enforce deterministic lock acquisition order across transactions that touch multiple tables.

## Verification

Test promise rejection handling, AbortSignal cancellation behavior on client disconnect, concurrency pool limits under load, and transaction rollback on error.
