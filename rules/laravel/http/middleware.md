---
name: middleware
description: Standardize HTTP middleware pipeline usage, authentication gatekeepers, context initialization, and performance safety.
scope: HTTP middleware classes, pipeline configuration, and route middleware aliases.
alwaysApply: true
---

# HTTP Middleware

## Boundaries

- **Cross-Cutting Single Responsibility:** Keep middleware strictly focused on a single cross-cutting transport concern per class (authentication, authorization guards, CORS negotiation, security headers, rate limiting, or request context initialization). Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by preventing composite middleware that handles multiple distinct concerns.
- Never place heavy business logic, database transactions, or external third-party API calls inside middleware.
- Avoid performing unindexed or slow database queries in middleware executing on every request (e.g. global middleware); cache tenant or user context when necessary.
- Register middleware aliases and global pipeline order in `bootstrap/app.php` (Laravel 11+) or `app/Http/Kernel.php` (Laravel 10 and below).

## Behavior

- **Open/Closed Pipeline Architecture:**
  - The HTTP middleware pipeline adheres to [[rules/solid/open-closed|Open/Closed (OCP)]]: extend application request/response behavior by appending or prepending focused middleware in `bootstrap/app.php` without modifying core controller or routing infrastructure.
- **Pipeline Discipline:**
  - Execute request filtering before calling `$next($request)` (e.g. inspecting headers, validating API tokens, setting locale).
  - Execute response decoration after receiving the response from `$next($request)` (e.g. attaching security headers, Content-Security-Policy).
  - Return early with an explicit `JsonResponse` or `RedirectResponse` when a precondition fails (e.g. maintenance mode, missing API key).
- **Context Initialization (Tenancy & Tracing):**
  - Use middleware to extract and bind request-scoped context (such as current tenant or distributed tracing ID) into Laravel's `Context` repository or container for the duration of the request lifecycle.
- **Terminable Middleware:**
  - When recording request telemetry, access logs, or firing non-blocking analytics, implement `\Illuminate\Contracts\Routing\TerminableMiddleware` and perform the work in the `terminate(Request $request, Response $response)` method after the response has been sent to the client.

## Verification

- Test middleware in isolation using unit tests with mock `$request` and closure `$next`.
- Test integrated route execution to confirm middleware order, header attachment, and expected 401/403/429 early exit responses.
- Verify zero measurable memory leak or performance regression when global middleware executes under load.
