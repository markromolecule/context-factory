---
ruleId: cf-rule-ts-backend-testing
name: backend-testing
description: Assign focused tests to backend operation boundaries while retaining database and network adapter testing ownership.
scope: Backend operation service, controller, route, data, serializer, public-contract, and architecture tests.
stack: typescript
appliesTo: ["src/modules/**/*.test.ts", "src/modules/**/*.spec.ts", "src/features/**/*.test.ts", "src/features/**/*.spec.ts", "tests/**/*.test.ts", "tests/**/*.spec.ts"]
layers: ["controllers", "services", "data"]
alwaysApply: true
---

# Backend Testing

## Operation test discovery

- [directive:ts.backend-testing.operation-test-discovery][mode:evidence-blocking][verifier:human-evidence] Co-locate operation tests with the operation and use `.test.ts` by default. Recognize `.spec.ts` when the host has established that suffix; do not silently remove either discovered convention.

## Boundary cases

- [directive:ts.backend-testing.service-policy-cases][mode:evidence-blocking][verifier:human-evidence] Unit-test commands and policy-bearing reads with fake dependencies, including authorization, tenant-sensitive denial, transaction rollback, and side-effect ordering. Do not require a service test for a simple read that has no service or policy boundary.
- [directive:ts.backend-testing.controller-mapping-cases][mode:evidence-blocking][verifier:human-evidence] Test controllers for malformed input, typed error-to-HTTP mapping, and public response mapping without exercising persistence mechanics.
- [directive:ts.backend-testing.data-boundary-cases][mode:evidence-blocking][verifier:human-evidence] Test data functions at their real database or remote boundary for empty results and known constraints. Use `ts.test-data.isolated-db-instance` and `ts.test-data.mock-network-boundary` for isolation and network mechanics.
- [directive:ts.backend-testing.route-composition-cases][mode:evidence-blocking][verifier:human-evidence] Test route middleware, authentication and authorization composition, and controller registration at the integration boundary.
- [directive:ts.backend-testing.public-contract-cases][mode:evidence-blocking][verifier:human-evidence] Test the feature public index against deep-import bypasses and test serialized output for excluded internal fields. Do not require a test for an absent layer.

Keep test mechanics such as migrations, fixtures, network interception, and retry limits in `testing-data-access-layer.md`.
