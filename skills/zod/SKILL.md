---
name: zod
description: Design, compose, and validate runtime schemas, DTOs, and contract transformations using Zod and TypeScript (/zod, [ZOD]).
---

# Zod Schema Modeling

Use this skill when designing runtime boundary validation schemas, composing reusable DTOs, implementing custom schema transforms/refinements, or extracting TypeScript types from schemas.

## Modeling Procedure

1. **Define Domain Primitives**:
   - Establish base schemas for common formats (e.g. UUID, email, slug, timestamps, sanitized strings).
   - Use `.trim()`, `.min()`, `.max()`, `.regex()` constraints directly on primitive definitions.
2. **Compose Complex Entities & DTOs**:
   - Construct object schemas with `z.object({...})`.
   - Use `.extend()`, `.merge()`, `.pick()`, `.omit()`, or `.partial()` to derive request/response variations from canonical entity schemas without duplicating field definitions.
3. **Handle Discriminated Unions & Polymorphism**:
   - For polymorphic payloads, use `z.discriminatedUnion("type", [VariantA, VariantB])` for optimal performance and clear type inference.
4. **Transformations & Refinements**:
   - Use `.transform()` for data parsing (e.g. parsing date strings into `Date` objects or normalizing case).
   - Use `.refine()` or `.superRefine()` for cross-field validations (e.g. `passwordConfirmation === password`, `startDate < endDate`) with clear custom issue paths.
5. **Infer Static Types**:
   - Export inferred static types alongside schemas:
     ```ts
     export const UserSchema = z.object({ id: z.string().uuid(), name: z.string().min(1) });
     export type User = z.infer<typeof UserSchema>;
     ```
6. **Integrate at Boundaries**:
   - Bind schemas to HTTP endpoints, server actions, RPC routers, or form handlers using safe parsing (`.safeParse()`).

## Output

Report:
- Complete TypeScript schema definitions with exported inferred types.
- Edge case handling and refinement assertions.
- Safe parsing integration examples for route/service boundaries.
