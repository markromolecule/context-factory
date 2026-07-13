---
name: service-layer
description: Place multi-step business workflows and invariants in testable services with explicit dependencies.
scope: Application services, use cases, business orchestration, and domain error handling.
alwaysApply: false
---

# Service Layer

Create a service when an operation coordinates multiple boundaries, owns a business invariant, requires a transaction, or has reusable policy. Skip pass-through services that only rename one repository call unless the project's adopted module architecture requires a stable use-case boundary; in that case, keep the service thin and do not invent business logic merely to justify the layer.

- Accept dependencies explicitly and keep framework request/response objects outside services.
- Model inputs and results around the use case, not database rows or UI state.
- Enforce authorization-sensitive business rules at the correct trusted boundary.
- Make transaction ownership clear and keep all atomic writes on the same transaction.
- Return or throw typed domain errors that controllers can map without string matching.
- Keep side effects ordered and define compensation/idempotency for retryable workflows.
- Emit structured observability events without sensitive data.

Unit-test policy and orchestration with dependency fakes. Add integration tests when transaction, queue, clock, or external-system behavior is central to correctness.
