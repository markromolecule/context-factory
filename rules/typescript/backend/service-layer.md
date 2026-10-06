---
ruleId: cf-rule-ts-service-layer
name: service-layer
description: Place multi-step business workflows and invariants in testable services with explicit dependencies.
scope: Application services, use cases, business orchestration, and domain error handling.
stack: typescript
appliesTo: ["**/*.service.ts"]
layers: ["services"]
alwaysApply: true
---

# Service Layer

- [directive:ts.service.create-for-coordination][mode:advisory][verifier:none] Create a service when an operation coordinates multiple boundaries, owns a business invariant, requires a transaction, or has reusable policy. Skip pass-through services that only rename one repository call unless the project's adopted module architecture requires a stable use-case boundary.
- [directive:ts.service.explicit-dependencies][mode:evidence-blocking][verifier:human-evidence] Accept dependencies explicitly and keep framework request/response objects outside services.
- [directive:ts.service.use-case-models][mode:advisory][verifier:none] Model inputs and results around the use case, not database rows or UI state.
- [directive:ts.service.enforce-auth-boundary][mode:evidence-blocking][verifier:human-evidence] Enforce authorization-sensitive business rules at the correct trusted boundary.
- [directive:ts.service.transaction-ownership][mode:evidence-blocking][verifier:human-evidence] Make transaction ownership clear and keep all atomic writes on the same transaction.
- [directive:ts.service.typed-domain-errors][mode:automated-blocking][verifier:typechecker] Return or throw typed domain errors that controllers can map without string matching.
- [directive:ts.service.ordered-side-effects][mode:advisory][verifier:none] Keep side effects ordered and define compensation/idempotency for retryable workflows.
- [directive:ts.service.structured-observability][mode:advisory][verifier:none] Emit structured observability events without sensitive data.

Unit-test policy and orchestration with dependency fakes. Add integration tests when transaction, queue, clock, or external-system behavior is central to correctness.
