---
name: backend-module
description: Create or refactor a Hono or Express capability into a vertical module with DTO, route, controller, service, data, and test boundaries.
---

# Backend Module

## Workflow

1. Read the backend module, controller/route, service, applicable data-access, naming, code-quality, and security rules.
2. Define the capability, actors, authorization policy, invariants, input schema, results, and failure contract before creating files.
3. Create `src/modules/<feature>/` with only the required DTO, data, service, controller, route, and test files.
4. Keep dependencies flowing from route to controller to service to data; inject infrastructure needed for isolated tests.
5. Mount the module route once at the application composition root.
6. Test service policy, boundary validation, error mapping, data behavior, and route middleware composition.
7. Run typecheck, tests, lint, and build for the affected application.

## Naming gate

Before completion, verify every file has its layer suffix. Use a singular feature noun for one-record operations and a plural feature noun for multi-record operations across the service, controller, and data layers.

## Security gate

Confirm allowlisted validation, authentication and resource authorization where required, safe public errors, bounded inputs, parameterized data access, sensitive-log redaction, and abuse controls appropriate to the endpoint.
