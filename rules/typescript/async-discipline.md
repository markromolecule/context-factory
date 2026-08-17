---
name: async-discipline
description: Prevent floating promises, enforce AbortSignal propagation, and ensure deterministic concurrency control.
scope: Asynchronous functions, event listeners, promises, background tasks, and stream processing.
alwaysApply: true
---

# Async and Concurrency Discipline

## Floating promise prevention

- Prohibit floating promises. Every promise must be explicitly `await`ed, returned, or passed to an error-handled consumer.
- If intentionally firing a non-blocking asynchronous task in the background, mark it explicitly with `void` (e.g. `void trackAnalyticsEvent(event)`) and ensure internal errors in that task are caught and logged.

## Abort signals and cancellation

- Accept and propagate `AbortSignal` across all asynchronous I/O functions, network requests, long polling, and database queries.
- Check `signal.aborted` or listen to `signal.addEventListener("abort", ...)` before beginning expensive async work or between sequential batch iterations.
- Respect timeout signals (`AbortSignal.timeout(ms)`) for external HTTP calls and downstream RPC operations.

## Concurrency control and parallel execution

- Use `Promise.allSettled()` when handling independent tasks where a single rejection should not abort or invalidate the results of sibling tasks.
- Restrict `Promise.all()` to strictly interdependent operations where failure of one operation invalidates the entire batch.
- When executing concurrent operations against rate-limited APIs or databases, use concurrency pool limiters (e.g. `p-limit`) rather than firing unbounded parallel promises.
