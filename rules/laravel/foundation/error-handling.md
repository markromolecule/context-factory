---
ruleId: cf-rule-laravel-foundation-error-handling
name: error-handling
description: Standardize exception handling, domain error classification, fail-fast boundary validation, and safe error responses.
scope: Exception classes, error reporting, HTTP error response formatting, and global exception handlers.
stack: laravel
appliesTo: ["app/**/*.php"]
layers: ["foundation", "http"]
alwaysApply: false
---

# Error and Exception Handling

## Boundaries

- [directive:laravel.foundation.error-handling][mode:evidence-blocking][verifier:human-evidence] Review exception translation and public-error boundaries without claiming automatic semantic coverage.

- **Single Responsibility Principle (SRP):** Separate error reporting and HTTP presentation from domain logic. Domain models and actions raise expressive exceptions reflecting broken business invariants; HTTP status code translation and JSON error envelope formatting belong in `bootstrap/app.php` exception renderers or renderable exceptions (`render(Request $request)`). Reference: `[[rules/solid/single-responsibility|Single Responsibility (SRP)]]`.
- Centralize HTTP exception reporting and rendering in Laravel's bootstrap exception configuration (`bootstrap/app.php` in Laravel 11+ or `app/Exceptions/Handler.php` in earlier versions).
- Never catch generic `\Throwable` or `\Exception` to swallow errors or return silent nulls; always catch specific exception types and handle them explicitly.
- Never expose internal database errors, SQL queries, stack traces, or environment secrets in production HTTP responses.
- Let unrecoverable infrastructure failures (e.g. database connection loss, Redis outage) bubble up to centralized reporting rather than wrapping every call in defensive try/catch blocks.

## Behavior

- **Domain Exceptions (Liskov Substitution Principle):**
  - Create expressive custom domain exceptions rooted in a shared domain base exception (`App\Shared\Exceptions\DomainException extends \RuntimeException`).
  - Adhere to the [[rules/solid/liskov-substitution|Liskov Substitution Principle (LSP)]] so callers and global exception handlers can catch and handle base domain exceptions without breaking contracts when specific domain subtypes (`InsufficientFundsException`, `OrderAlreadyShippedException`) are raised.
  - Keep domain exceptions self-contained; do not couple domain exceptions directly to HTTP status codes unless they implement `render()` for API responses.
- **Fail-Fast Boundary Validation:**
  - Validate transport input immediately via Form Requests before executing application logic.
  - Assert state invariants early in actions or domain methods using guard clauses (`if (!$order->canBeCancelled()) throw new OrderCannotBeCancelledException();`).
- **Standardized API Error Envelopes:**
  - For JSON API requests, return consistent structured error envelopes:

    ```json
    {
      "message": "The given data was invalid.",
      "errors": {
        "email": ["The email has already been taken."]
      }
    }
    ```

  - Map specific domain exceptions to clear HTTP status codes:
    - 400 Bad Request: Invalid domain state or client precondition failure.
    - 401 Unauthorized: Unauthenticated user or expired token.
    - 403 Forbidden: Authorized user lacks permission (Policy failure).
    - 404 Not Found: Model or resource does not exist (ModelNotFoundException).
    - 422 Unprocessable Content: Form validation failure.
    - 429 Too Many Requests: Rate limit exceeded.
- **Reporting & Observability:**
  - Use `Log::error(...)` with contextual context arrays (e.g. `['user_id' => $user->id, 'order_id' => $order->id]`), never string concatenation.
  - Utilize Laravel's `report()` helper for recoverable errors that still need external telemetry logging.

## Verification

- Test that validation errors return HTTP 422 with the standardized error format.
- Test that unauthorized actions trigger HTTP 403.
- Verify in non-debug mode (`APP_DEBUG=false`) that uncaught exceptions return HTTP 500 with a generic message and zero sensitive trace output.
