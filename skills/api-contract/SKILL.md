---
name: api-contract
description: Design, document, and synchronize type-safe API endpoints, request/response DTO schemas, OpenAPI/Scalar specifications, and client SDK contracts (/api-contract, /api, [API]).
---

# API Contract Design & Synchronization

Use this skill when designing REST, RPC, or HTTP API contracts, authoring OpenAPI/Scalar documentation, binding Zod DTOs to route parameters, or generating typed client query/mutation contracts.

## Workflow

1. **Model DTOs & Validation Schemas:**
   - Define strict input schemas (query params, URL params, request body) using Zod.
   - Define exact response schemas for `200 OK`, `201 Created`, `400 Bad Request`, `401/403 Unauthorized`, and `404 Not Found`.
2. **Define Route Definitions & Handlers:**
   - Mount routes using explicit HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
   - Validate incoming payloads at route entry points before invoking controller/service logic.
3. **Generate OpenAPI / Scalar Documentation:**
   - Attach route metadata (operationId, tags, summary, response descriptions) to endpoints.
   - Verify interactive API docs render cleanly with runnable curl/fetch examples.
4. **Export Type-Safe Client Contracts:**
   - Export typed request/response payload interfaces from canonical Zod schemas.
   - Provide client fetcher / hook integration examples for consuming frontends (`useQuery`, `useMutation`).

## Output

Report:
- Complete route definitions and schemas.
- Scalar/OpenAPI contract specification snippets.
- TypeScript consumer client types and usage patterns.
