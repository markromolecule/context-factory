---
name: security-sensitive-change
description: Deliver changes across trust boundaries with explicit threat modeling, security gates, adversarial verification, and safe release controls.
scope: Authentication, authorization, secrets, payments, personal data, webhooks, files, redirects, outbound URLs, privileged operations, and security findings.
---

# Security-Sensitive Change

## Triggers

Use whenever compromise could expose data, cross an authorization boundary, execute attacker-controlled behavior, create financial impact, or weaken an existing control.

## Required inputs

- Assets, actors, identities, privileges, sensitive data, and trust boundaries.
- Entry points, external systems, deployment assumptions, and abuse cases.
- Required authentication, action/resource authorization, tenant isolation, and audit behavior.

## Applicable rules and skills

Always load security guardrails plus boundary-specific rules and use the `security` skill. Compose with feature delivery, database migration, dependency upgrade, or release readiness as needed.

## Phases

1. Map data flow and trust boundaries from input through storage, effects, output, logs, and external calls.
2. Define credible misuse cases and required controls before implementation.
3. Review design for default-deny authorization, validation, injection, secrets, replay, abuse limits, safe errors, and redacted telemetry.
4. Implement controls at trusted boundaries with explicit dependencies and auditable behavior.
5. Add positive and adversarial tests, including missing/insufficient access and cross-tenant attempts.
6. Run security review and dependency/secret scanning available to the project.
7. Define rollout monitoring, incident signals, rollback/disable controls, and operational ownership.

## Quality gates

- Authentication is not treated as authorization; action and resource access are tested separately.
- Sensitive values cannot reach client bundles, URLs, logs, public errors, or generated artifacts.
- Inputs, resource use, retries, and replay behavior are bounded.
- High-severity findings are resolved before release.

## Stop and escalation conditions

Stop when authorization policy is undefined, production secrets or privileged access are required, a known critical control would be bypassed, required cryptographic design lacks qualified review, or risk acceptance is needed.

## Artifacts and completion

Store threat assumptions and durable controls in the task/ADR without recording secrets or exploit-enabling sensitive detail. Report reviewed boundaries, tests, findings, mitigations, release controls, and residual risk.
