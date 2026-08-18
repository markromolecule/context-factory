---
name: testing-data-access-layer
description: Verify database and API adapters at the boundary with isolated, deterministic tests.
scope: Repository tests, API-client tests, fixtures, database harnesses, and transport mocks.
alwaysApply: true
---

# Testing Data Access

## Database adapters

- Use an isolated database/schema or transaction rollback per test.
- Apply the same migrations used in production.
- Seed only data required by the case and generate unique deterministic values.
- Test constraints, null/empty results, ordering, pagination, soft deletion, and rollback.
- Assert externally observable rows/results rather than query-builder internals.

## API adapters

- Mock the network boundary, not the function under test.
- Match method, URL, headers, query, and body.
- Cover valid decoding, invalid payloads, authentication failures, rate limits, timeouts, cancellation, and retry limits.
- Prevent unhandled outbound network access in the test environment.

Keep fixtures typed and close to the adapter. Run the narrow test first, then the relevant suite. Never weaken assertions to accommodate nondeterminism; remove the nondeterminism.
