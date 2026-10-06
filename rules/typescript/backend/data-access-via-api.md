---
ruleId: cf-rule-ts-data-access-via-api
name: data-access-via-api
description: Implement typed, observable, and testable access to external or internal HTTP APIs.
scope: API clients, remote repositories, transport adapters, and response mapping.
stack: typescript
appliesTo: ["**/*.data.ts", "src/**/api/**/*.ts", "src/**/services/**/*.ts"]
layers: ["data", "services"]
alwaysApply: true
---

# Data Access via API

- [directive:ts.api-access.centralize-client][mode:evidence-blocking][verifier:human-evidence] Centralize base URL, authentication, timeouts, serialization, and response decoding in a client adapter.
- [directive:ts.api-access.injectable-dependencies][mode:advisory][verifier:none] Accept dependencies such as `fetch`, clock, or client instances when isolation improves testing.
- [directive:ts.api-access.validate-responses][mode:automated-blocking][verifier:test] Validate untrusted responses before mapping them to domain types.
- [directive:ts.api-access.typed-failure-classes][mode:evidence-blocking][verifier:human-evidence] Distinguish network, timeout, authentication, rate-limit, validation, and remote-domain failures.
- [directive:ts.api-access.idempotent-retry][mode:evidence-blocking][verifier:human-evidence] Retry only idempotent operations and only for transient failures; use bounded backoff and honor `Retry-After`.
- [directive:ts.api-access.propagate-signals][mode:advisory][verifier:none] Forward cancellation signals and correlation/request IDs where supported.
- [directive:ts.api-access.no-credential-logging][mode:automated-blocking][verifier:linter] Never log credentials, tokens, or sensitive response bodies.
- [directive:ts.api-access.caching-above-client][mode:advisory][verifier:none] Keep caching policy above the raw client unless the API contract requires transport caching.

Name operations for domain intent (`getUser`, `searchUsers`) and keep endpoint details inside the adapter. Test request construction, mapping, cancellation, and each meaningful failure class with mocked transport boundaries.
