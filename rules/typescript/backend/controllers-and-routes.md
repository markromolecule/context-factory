---
name: controllers-and-routes
description: Keep HTTP transport code thin, validated, framework-idiomatic, and separate from business/data logic.
scope: API route declarations, controllers, handlers, middleware, and HTTP response mapping.
alwaysApply: true
---

# Controllers and Routes

## Boundaries

- Define routing, authentication/authorization gates, request parsing, and HTTP response mapping at the transport layer.
- Validate params, query, headers, and body at the boundary with one schema source.
- Delegate business decisions to services and persistence to data-access functions.
- Do not leak ORM rows, internal errors, stack traces, or secrets in responses.

## Behavior

- Use framework-native typed handlers for Hono, Express, or the selected framework.
- Return consistent success and error envelopes established by the project.
- Map domain errors to explicit status codes; let unexpected errors reach centralized error handling.
- Make pagination, filtering, sorting, and idempotency behavior explicit.
- Keep route registration discoverable in a resource-level `routes.ts` or framework-equivalent entry point.

## Verification

Test request validation, authorization, success mapping, expected domain errors, and unexpected-error delegation. Prefer handler tests for mapping and integration tests for middleware/routing composition.
