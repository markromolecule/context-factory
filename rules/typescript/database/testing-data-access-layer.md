---
ruleId: cf-rule-ts-testing-data-access-layer
name: testing-data-access-layer
description: Verify database and API adapters at the boundary with isolated, deterministic tests.
scope: Repository tests, API-client tests, fixtures, database harnesses, and transport mocks.
stack: typescript
appliesTo: ["src/**/db/**/*.test.ts", "src/**/repositories/**/*.test.ts", "tests/**/*.test.ts"]
layers: ["database", "data"]
alwaysApply: true
---

# Testing Data Access

## Database adapters

- [directive:ts.test-data.isolated-db-instance][mode:automated-blocking][verifier:test] Use an isolated database/schema or transaction rollback per test.
- [directive:ts.test-data.apply-production-migrations][mode:automated-blocking][verifier:test] Apply the same migrations used in production.
- [directive:ts.test-data.seed-minimal-deterministic][mode:automated-blocking][verifier:test] Seed only data required by the case and generate unique deterministic values.
- [directive:ts.test-data.cover-db-edge-cases][mode:automated-blocking][verifier:test] Test constraints, null/empty results, ordering, pagination, soft deletion, and rollback.
- [directive:ts.test-data.assert-observable-results][mode:automated-blocking][verifier:test] Assert externally observable rows/results rather than query-builder internals.

## API adapters

- [directive:ts.test-data.mock-network-boundary][mode:automated-blocking][verifier:test] Mock the network boundary, not the function under test.
- [directive:ts.test-data.match-http-parameters][mode:automated-blocking][verifier:test] Match method, URL, headers, query, and body.
- [directive:ts.test-data.cover-failure-classes][mode:automated-blocking][verifier:test] Cover valid decoding, invalid payloads, authentication failures, rate limits, timeouts, cancellation, and retry limits.
- [directive:ts.test-data.prevent-unhandled-network][mode:automated-blocking][verifier:test] Prevent unhandled outbound network access in the test environment.

Keep fixtures typed and close to the adapter. Run the narrow test first, then the relevant suite. Never weaken assertions to accommodate nondeterminism; remove the nondeterminism.
