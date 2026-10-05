---
name: types
description: Harden static types: eliminate any, remove loose casts, add discriminated unions and exhaustiveness. Triggers: /types, [TYPES], "harden types", "fix any", or review type-slop failures.
---

# Types

Strict types, zero compromises. No compiler bypasses without runtime proof.

## Workflow
1. **Audit:** locate all `any`, `as [Type]`, and unhandled union branches.
2. **Find the cause:** match against the rules below.
3. **Fix:** replace bypasses with schemas, discriminated unions, or predicates.
4. **Verify:** run the checklist at the bottom.

## Rules

**Zero `any` & No Loose Casts**
- Never use `any` or `Record<string, any>`. Use `unknown` and narrow before access.
- No `as Type` or `as unknown as Type` assertions to silence the compiler.
- Use `satisfies Contract` to validate objects without widening literal types.

**Discriminated Unions & Exhaustiveness**
- Model multi-state entities as discriminated unions with a tag field (`status`, `type`, `kind`). Never bags of optional fields (`{ status: string, data?: T, error?: Error }`).
- All switches on discriminated unions must terminate in `default: return assertNever(val)`.

**Runtime Boundaries & Narrowing**
- Parse external I/O (API responses, request bodies, env vars) with schemas (Zod/Valibot). Infer types via `z.infer`. Never cast raw JSON.
- Narrow objects with pure type predicates (`isUser(val): val is User`).

**Identifiers & Generics**
- Brand entity IDs (`string & { readonly __brand: 'UserId' }`) to prevent ID transposition bugs.
- Constrain all generic type parameters (`<T extends object, K extends keyof T>`). Never unbounded `<T>`.
- Avoid deep recursive type gymnastics that exhaust compiler memory.

## Example (non-obvious fix)
```ts
export function assertNever(value: never): never {
  throw new Error(`Unhandled union member: ${JSON.stringify(value)}`);
}

type Status = 'draft' | 'published' | 'archived';

function handle(status: Status): string {
  switch (status) {
    case 'draft': return 'Draft';
    case 'published': return 'Live';
    case 'archived': return 'Hidden';
    default: return assertNever(status); // Compile error if a new Status is added
  }
}
```

## Handoffs
- Needs structural change (extracting domain models, splitting modules) → `/refactor`
- Every complex type gets a typecheck assertion test → `/test`

## Done when
- [ ] Zero `any` or `Record<string, any>` in modified code
- [ ] Zero unvalidated `as Type` casts
- [ ] All union switches terminate in `assertNever`
- [ ] `tsc --noEmit` exits with code 0
- [ ] Existing tests pass
