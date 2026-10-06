---
ruleId: cf-rule-ts-controllers-and-routes
name: controllers-and-routes
description: Keep HTTP transport code thin, validated, framework-idiomatic, and separate from business/data logic.
scope: API route declarations, controllers, handlers, middleware, and HTTP response mapping.
stack: typescript
appliesTo: ["**/*.routes.ts", "**/*.controller.ts", "src/app/api/**/*.ts", "pages/api/**/*.ts"]
layers: ["controllers"]
alwaysApply: true
---

# Controllers and Routes

## Boundaries

- [directive:ts.controllers.transport-only][mode:evidence-blocking][verifier:human-evidence] Define routing, authentication/authorization gates, request parsing, and HTTP response mapping at the transport layer.
- [directive:ts.controllers.single-schema-validation][mode:automated-blocking][verifier:test] Validate params, query, headers, and body at the boundary with one schema source.
- [directive:ts.controllers.delegate-to-services][mode:evidence-blocking][verifier:human-evidence] Delegate business decisions to services and persistence to data-access functions.
- [directive:ts.controllers.no-leak-internals][mode:automated-blocking][verifier:test] Do not leak ORM rows, internal errors, stack traces, or secrets in responses.

## Behavior

- [directive:ts.controllers.typed-handlers][mode:advisory][verifier:none] Use framework-native typed handlers for Hono, Express, or the selected framework.
- [directive:ts.controllers.consistent-envelopes][mode:advisory][verifier:none] Return consistent success and error envelopes established by the project.
- [directive:ts.controllers.domain-error-mapping][mode:evidence-blocking][verifier:human-evidence] Map domain errors to explicit status codes; let unexpected errors reach centralized error handling.
- [directive:ts.controllers.explicit-pagination][mode:advisory][verifier:none] Make pagination, filtering, sorting, and idempotency behavior explicit.
- [directive:ts.controllers.discoverable-routes][mode:advisory][verifier:none] Keep route registration discoverable in a resource-level `routes.ts` or framework-equivalent entry point.

## Verification

Test request validation, authorization, success mapping, expected domain errors, and unexpected-error delegation. Prefer handler tests for mapping and integration tests for middleware/routing composition.
