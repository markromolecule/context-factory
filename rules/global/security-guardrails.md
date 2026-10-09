---
ruleId: cf-rule-global-security-guardrails
name: security-guardrails
description: Apply secure defaults for input, identity, secrets, data access, outbound requests, logging, and dependencies.
scope: Application code, APIs, jobs, integrations, configuration, infrastructure, tests, and generated templates.
stack: global
appliesTo: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs"]
layers: ["controllers", "services", "data", "infrastructure"]
alwaysApply: false
---

# Security Guardrails

## Trust boundaries

- [directive:cf.sec.untrusted-input-boundaries][mode:evidence-blocking][verifier:human-evidence] Treat request bodies, params, query strings, headers, files, webhooks, environment values, database content, and remote responses as untrusted.
- [directive:cf.sec.allowlisted-boundary-validation][mode:automated-blocking][verifier:test] Validate with an allowlisted schema at the boundary; reject unknown fields where compatibility permits and enforce size, range, and format limits.
- [directive:cf.sec.server-side-auth-default-deny][mode:automated-blocking][verifier:test] Authenticate identity before protected work and authorize the specific action and resource server-side. Default to deny.
- [directive:cf.sec.server-side-tenant-isolation][mode:automated-blocking][verifier:test] Keep tenant or ownership constraints in trusted server-side queries; never rely on a client-provided owner identifier.

## Data and execution

- [directive:cf.sec.parameterized-queries-no-concat][mode:automated-blocking][verifier:linter] Use parameterized database APIs and context-aware output encoding. Never concatenate input into SQL, shell commands, HTML, paths, or dynamic code.
- [directive:cf.sec.restrict-outbound-urls-ssrf][mode:automated-blocking][verifier:test] Restrict outbound URLs, redirects, and file paths to approved schemes and destinations; defend against SSRF and path traversal.
- [directive:cf.sec.maintained-crypto-libraries][mode:automated-blocking][verifier:linter] Use maintained cryptographic libraries and platform randomness. Never design custom cryptography.
- [directive:cf.sec.rate-limiting-and-bounds][mode:automated-blocking][verifier:test] Limit request bodies, pagination, concurrency, retries, and expensive operations. Apply rate limits at abuse-prone public boundaries.
- [directive:cf.sec.idempotency-replay-protection][mode:automated-blocking][verifier:test] Require idempotency or replay protection for retryable mutations, payments, and trusted webhooks.

## Secrets, errors, and operations

- [directive:cf.sec.no-credentials-in-source-or-logs][mode:automated-blocking][verifier:linter] Keep credentials out of source, generated output, client bundles, URLs, logs, and error responses. Fail startup when required secrets are absent.
- [directive:cf.sec.sanitized-public-errors][mode:automated-blocking][verifier:test] Return stable public errors without stack traces or internal details; preserve diagnostic context only in access-controlled structured logs.
- [directive:cf.sec.redact-telemetry-pii][mode:automated-blocking][verifier:linter] Redact tokens, credentials, personal data, and sensitive payloads from telemetry.
- [directive:cf.sec.lock-dependencies-and-audit][mode:automated-blocking][verifier:test] Pin or lock resolved dependencies, review updates, and run dependency and secret scanning in CI where supported.
- [directive:cf.sec.explicit-cors-and-headers][mode:evidence-blocking][verifier:human-evidence] Configure CORS, cookies, headers, and proxy trust explicitly for the deployment model; do not use permissive production defaults.

## Verification

Test malformed and oversized input, missing and insufficient authorization, cross-tenant access, injection payloads, unsafe redirects or URLs, error redaction, and abuse limits that apply to the changed boundary.
