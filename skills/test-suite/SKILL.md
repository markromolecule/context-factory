---
name: test-suite
description: Design and implement comprehensive 4-layer backend test suites (data, service, controller, route) and frontend query/mutation smoke tests (/test-suite, /test, [TEST]).
---

# Test Suite Engineering & 4-Layer Testing

Use this skill when constructing automated test suites, establishing test fixtures and mock boundaries, creating 4-layer backend tests, or validating frontend client hook transport.

## Workflow

1. **4-Layer Backend Testing Architecture:**
   - **Layer 1 - Data Layer (`*.data.test.ts`):** Verify raw queries, transaction rollbacks, constraint violations, and index behavior against an isolated test database.
   - **Layer 2 - Service Layer (`*.service.test.ts`):** Verify domain business policies, invariants, calculations, authorization logic, and error throws using mock data interfaces.
   - **Layer 3 - Controller Layer (`*.controller.test.ts`):** Verify status code mapping (`200`, `201`, `400`, `404`, `500`), header formatting, and DTO extraction.
   - **Layer 4 - Route Integration (`*.routes.test.ts`):** Verify end-to-end HTTP request dispatch, middleware chains (auth, rate-limiting, CORS), and public schema validation.
2. **Frontend Contract Smoke Testing:**
   - Test custom React query/mutation hooks against mock service workers (MSW) or live development servers.
   - Assert cache invalidation, loading states, retry policies, and error toasts.
3. **Fixture & Mock Discipline:**
   - Hoist reusable factory fixtures (`createTestUser()`, `createTestOrganization()`).
   - Clean up state after every test run (`beforeEach` / `afterEach` transaction rollback).
   - Test edge cases: empty results, boundary values, malformed inputs, unauthenticated requests, and concurrency races.

## Output

Report:
- Runnable test code with descriptive test blocks (`describe`, `it`, `expect`).
- Coverage of positive happy paths, edge cases, and security boundaries.
- Test execution commands and passing assertion evidence.
