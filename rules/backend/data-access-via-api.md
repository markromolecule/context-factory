---
name: data-access-via-api
description: Implement typed, observable, and testable access to external or internal HTTP APIs.
scope: API clients, remote repositories, transport adapters, and response mapping.
alwaysApply: true
---

# Data Access via API

- Centralize base URL, authentication, timeouts, serialization, and response decoding in a client adapter.
- Accept dependencies such as `fetch`, clock, or client instances when isolation improves testing.
- Validate untrusted responses before mapping them to domain types.
- Distinguish network, timeout, authentication, rate-limit, validation, and remote-domain failures.
- Retry only idempotent operations and only for transient failures; use bounded backoff and honor `Retry-After`.
- Forward cancellation signals and correlation/request IDs where supported.
- Never log credentials, tokens, or sensitive response bodies.
- Keep caching policy above the raw client unless the API contract requires transport caching.

Name operations for domain intent (`getUser`, `searchUsers`) and keep endpoint details inside the adapter. Test request construction, mapping, cancellation, and each meaningful failure class with mocked transport boundaries.
