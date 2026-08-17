---
name: runtime-validation
description: Mandate runtime validation at all I/O boundaries, infer TypeScript types directly from schemas, and handle parsing errors safely.
scope: Request inputs, route handlers, API client responses, environment variables, webhooks, and local storage.
alwaysApply: true
---

# Runtime Validation and Boundaries

## Zero-trust at system boundaries

- Treat all external and boundary data as untrusted: HTTP request bodies, route parameters, query strings, headers, environment variables, database raw outputs, 3rd-party webhook payloads, and browser storage.
- Parse boundary data using a schema validation library (e.g. Zod, Valibot, or ArkType) before passing the payload into domain services or business logic.

## Single source of truth

- Derive TypeScript types directly from runtime schemas (e.g. `export type CreateUserDto = z.infer<typeof CreateUserSchema>`) rather than manually maintaining parallel interfaces.
- Avoid duplicate manual interfaces that can silently drift from runtime validation rules.

## Safe parsing and structured issues

- Default to safe parsing (`schema.safeParse(data)`) to prevent unhandled runtime exceptions during input validation.
- Convert schema parsing errors into structured, user-actionable problem responses (e.g. RFC 7807 problem details or standard validation error payloads) indicating the invalid field path and rule violation.
- Do not expose sensitive internal error stacks or internal database schema details in client-facing validation errors.

## Transformations and sanitization

- Use schema transformations (`.transform()`, `.trim()`, `.toLowerCase()`, coercion) at the boundary layer so that domain models receive normalized, pristine data.
- Coerce string inputs from query parameters or headers (e.g. `z.coerce.number()`, `z.coerce.boolean()`) explicitly with boundaries checked.
