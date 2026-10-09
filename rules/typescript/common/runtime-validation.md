---
ruleId: cf-rule-ts-runtime-validation
name: runtime-validation
description: Mandate runtime validation at all I/O boundaries, infer TypeScript types directly from schemas, and handle parsing errors safely.
scope: Request inputs, route handlers, API client responses, environment variables, webhooks, and local storage.
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["controllers", "services", "io", "adapters"]
alwaysApply: true
---

# Runtime Validation and Boundaries

## Zero-trust at system boundaries

- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking][verifier:linter] Treat all external and boundary data as untrusted: HTTP request bodies, route parameters, query strings, headers, environment variables, database raw outputs, 3rd-party webhook payloads, and browser storage.
- [directive:ts.runtime-validation.parse-boundary-data][mode:automated-blocking][verifier:test] Parse boundary data using a schema validation library (e.g. Zod, Valibot, or ArkType) before passing the payload into domain services or business logic.

## Single source of truth

- [directive:ts.runtime-validation.infer-types-from-schemas][mode:automated-blocking][verifier:typechecker] Derive TypeScript types directly from runtime schemas (e.g. `export type CreateUserDto = z.infer<typeof CreateUserSchema>`) rather than manually maintaining parallel interfaces.
- [directive:ts.runtime-validation.no-duplicate-manual-interfaces][mode:advisory][verifier:none] Avoid duplicate manual interfaces that can silently drift from runtime validation rules.

## Safe parsing and structured issues

- [directive:ts.runtime-validation.safe-parse-default][mode:automated-blocking][verifier:linter] Default to safe parsing (`schema.safeParse(data)`) to prevent unhandled runtime exceptions during input validation.
- [directive:ts.runtime-validation.structured-validation-errors][mode:automated-blocking][verifier:test] Convert schema parsing errors into structured, user-actionable problem responses (e.g. RFC 7807 problem details or standard validation error payloads) indicating the invalid field path and rule violation.
- [directive:ts.runtime-validation.no-leaking-internal-stacks][mode:evidence-blocking][verifier:human-evidence] Do not expose sensitive internal error stacks or internal database schema details in client-facing validation errors.

## Transformations and sanitization

- [directive:ts.runtime-validation.schema-transformations][mode:advisory][verifier:none] Use schema transformations (`.transform()`, `.trim()`, `.toLowerCase()`, coercion) at the boundary layer so that domain models receive normalized, pristine data.
- [directive:ts.runtime-validation.explicit-coercion-boundaries][mode:automated-blocking][verifier:test] Parse query/header values with explicit accepted representations and bounds. Do not use generic Boolean coercion for textual flags: the string "false" is truthy. Test false, zero, empty, missing, repeated, and malformed input where applicable.
