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

- [directive:ts.service.create-for-coordination][mode:advisory][verifier:none] Create a service when an operation coordinates multiple boundaries, owns a business invariant, requires a transaction, or has reusable policy. A simple read without policy, authorization-sensitive decisions, or orchestration may use controller-to-data directly; do not add a pass-through service.
- [directive:ts.service.explicit-dependencies][mode:evidence-blocking][verifier:human-evidence] Accept dependencies explicitly and keep framework request/response objects outside services.
- [directive:ts.service.policy-bearing-operations][mode:evidence-blocking][verifier:human-evidence] Put commands and policy-bearing reads behind a service or policy boundary; tenant and authorization decisions must not be bypassed by a controller-to-data shortcut.
- [directive:ts.service.use-case-models][mode:advisory][verifier:none] Model inputs and results around the use case, not database rows or UI state.
- [directive:ts.service.enforce-auth-boundary][mode:evidence-blocking][verifier:human-evidence] Enforce authorization-sensitive business rules at the correct trusted boundary.
- [directive:ts.service.transaction-ownership][mode:evidence-blocking][verifier:human-evidence] Accept transaction context explicitly, make its owner clear, and keep all atomic writes on the same transaction.
- [directive:ts.service.typed-domain-errors][mode:evidence-blocking][verifier:human-evidence] Return or throw typed domain errors that controllers can map without string matching.
- [directive:ts.service.ordered-side-effects][mode:evidence-blocking][verifier:human-evidence] Run external side effects after a successful transaction and define compensation or idempotency for retryable workflows.
- [directive:ts.service.structured-observability][mode:advisory][verifier:none] Emit structured observability events without sensitive data.

Unit-test policy and orchestration with dependency fakes. Add integration tests when transaction, queue, clock, or external-system behavior is central to correctness.
