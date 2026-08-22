---
name: type-safety
description: Enforce strict type safety, exhaustiveness checking, branded identifiers, and disciplined narrowing while banning any and unsafe assertions.
scope: TypeScript files, type definitions, generic utilities, and type guards.
alwaysApply: true
---

# Type Safety

## Strict typing standards

- Ban `any`. Use `unknown` when incoming data types are indeterminate, and require narrowing via type guards, assertion functions, or schema parsing before consumption.
- Avoid loose `Object`, `object`, or `{}` types. Use `Record<string, unknown>` or explicit typed schemas.
- Enable and adhere to strict compiler settings (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`).
- Use `satisfies` to validate that an expression matches a type contract without widening literal types or losing exact property inference.

## Discriminated unions and exhaustiveness

- Model complex domain states, action types, and lifecycle statuses as discriminated unions with a common literal discriminator (e.g. `type: "idle" | "loading" | "success" | "error"`).
- Ensure all `switch` or conditional branches handling discriminated unions are exhaustive. Use an unreachable `assertNever(value: never): never` utility in default branches to fail at compile time when new union variants are added.

## Type assertions and casting discipline

- Forbid type assertions (`as Type`) for bypassing type checking. Type assertions hide bugs and break compile-time safety guarantees.
- Restrict `as const` to immutable value definitions, literal arrays, and configuration maps.
- Avoid non-null assertions (`!`). Use explicit null-checking conditionals, fallback defaults (`??`), or invariant assertion functions that provide runtime failure diagnostics.
- When narrowing types, write custom type predicates (`function isUser(val: unknown): val is User`) with runtime validation checks rather than arbitrary casts.

## Branded and nominal identifiers

- Use branded/nominal types (e.g. `type UserId = string & { readonly __brand: unique symbol }`) for primary keys and distinct entity identifiers to prevent accidentally passing an `OrderId` to a function expecting a `UserId`.
- Provide typed constructor/parsing helpers for branded types at application boundaries.

## Generics discipline

- Use generics only when a function or component operates uniformly over multiple types while preserving relationship between inputs and outputs.
- Avoid overly speculative or deeply recursive type acrobatics that degrade `tsc` compiler performance and obscure IDE error messages.
- Always provide sensible default type parameters where applicable (`<T = unknown>`).
