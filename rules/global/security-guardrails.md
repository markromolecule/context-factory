---
name: security-guardrails
description: Apply secure defaults for input, identity, secrets, data access, outbound requests, logging, and dependencies.
scope: Application code, APIs, jobs, integrations, configuration, infrastructure, tests, and generated templates.
alwaysApply: true
---

# Security Guardrails

## Trust boundaries

- Treat request bodies, params, query strings, headers, files, webhooks, environment values, database content, and remote responses as untrusted.
- Validate with an allowlisted schema at the boundary; reject unknown fields where compatibility permits and enforce size, range, and format limits.
- Authenticate identity before protected work and authorize the specific action and resource server-side. Default to deny.
- Keep tenant or ownership constraints in trusted server-side queries; never rely on a client-provided owner identifier.

## Data and execution

- Use parameterized database APIs and context-aware output encoding. Never concatenate input into SQL, shell commands, HTML, paths, or dynamic code.
- Restrict outbound URLs, redirects, and file paths to approved schemes and destinations; defend against SSRF and path traversal.
- Use maintained cryptographic libraries and platform randomness. Never design custom cryptography.
- Limit request bodies, pagination, concurrency, retries, and expensive operations. Apply rate limits at abuse-prone public boundaries.
- Require idempotency or replay protection for retryable mutations, payments, and trusted webhooks.

## Secrets, errors, and operations

- Keep credentials out of source, generated output, client bundles, URLs, logs, and error responses. Fail startup when required secrets are absent.
- Return stable public errors without stack traces or internal details; preserve diagnostic context only in access-controlled structured logs.
- Redact tokens, credentials, personal data, and sensitive payloads from telemetry.
- Pin or lock resolved dependencies, review updates, and run dependency and secret scanning in CI where supported.
- Configure CORS, cookies, headers, and proxy trust explicitly for the deployment model; do not use permissive production defaults.

## Verification

Test malformed and oversized input, missing and insufficient authorization, cross-tenant access, injection payloads, unsafe redirects or URLs, error redaction, and abuse limits that apply to the changed boundary.
