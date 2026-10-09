---
ruleId: cf-rule-ts-type-safety
name: type-safety
description: Enforce strict type safety, exhaustiveness checking, branded identifiers, and disciplined narrowing while banning any and unsafe assertions.
scope: TypeScript files, type definitions, generic utilities, and type guards.
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["common", "services", "models", "controllers"]
alwaysApply: true
---

# Type Safety

## Strict typing standards

- [directive:ts.type-safety.ban-any][mode:automated-blocking][verifier:linter] Ban `any` in authored code, including aliases and generic arguments. Use `unknown` and validate before consumption. Enforce explicit any and unsafe assignments, calls, member access, and returns with configured TypeScript-aware lint rules; strict tsc alone does not ban explicit any.
- [directive:ts.type-safety.no-loose-objects][mode:automated-blocking][verifier:typechecker] Avoid loose `Object`, `object`, or `{}` types. Use `Record<string, unknown>` or explicit typed schemas.
- [directive:ts.type-safety.strict-compiler-settings][mode:automated-blocking][verifier:typechecker] Enable and adhere to strict compiler settings (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`).
- [directive:ts.type-safety.use-satisfies][mode:advisory][verifier:none] Use `satisfies` to validate that an expression matches a type contract without widening literal types or losing exact property inference.
- [directive:ts.type-safety.optional-property-semantics][mode:advisory][verifier:none] Distinguish absent properties from explicit undefined when the contract requires it. Adopt exactOptionalPropertyTypes through a scoped migration; do not silently change compiler settings across unrelated packages.
- [directive:ts.type-safety.no-silent-suppressions][mode:evidence-blocking][verifier:human-evidence] Do not silence errors with ts-ignore, ts-nocheck, double casts, or broad lint disables. A narrow ts-expect-error needs a documented reason and regression evidence; negative type tests may use it to assert an expected error.

## Discriminated unions and exhaustiveness

- [directive:ts.type-safety.discriminated-unions][mode:automated-blocking][verifier:typechecker] Model complex domain states, action types, and lifecycle statuses as discriminated unions with a common literal discriminator (e.g. `type: "idle" | "loading" | "success" | "error"`).
- [directive:ts.type-safety.exhaustive-branches][mode:automated-blocking][verifier:typechecker] Ensure all `switch` or conditional branches handling discriminated unions are exhaustive. Use an unreachable `assertNever(value: never): never` utility in default branches to fail at compile time when new union variants are added.

## Type assertions and casting discipline

- [directive:ts.type-safety.forbid-unsafe-type-assertions][mode:automated-blocking][verifier:linter] Forbid type assertions (`as Type`) for bypassing type checking. Type assertions hide bugs and break compile-time safety guarantees.
- [directive:ts.type-safety.restrict-as-const][mode:advisory][verifier:none] Restrict `as const` to immutable value definitions, literal arrays, and configuration maps.
- [directive:ts.type-safety.avoid-non-null-assertions][mode:automated-blocking][verifier:linter] Avoid non-null assertions (`!`). Use explicit null-checking conditionals, fallback defaults (`??`), or invariant assertion functions that provide runtime failure diagnostics.
- [directive:ts.type-safety.custom-type-predicates][mode:automated-blocking][verifier:typechecker] When narrowing types, write custom type predicates (`function isUser(val: unknown): val is User`) with runtime validation checks rather than arbitrary casts.

## Branded and nominal identifiers

- [directive:ts.type-safety.branded-identifiers][mode:evidence-blocking][verifier:human-evidence] Use branded/nominal types (e.g. `type UserId = string & { readonly __brand: unique symbol }`) for primary keys and distinct entity identifiers to prevent accidentally passing an `OrderId` to a function expecting a `UserId`.
- [directive:ts.type-safety.branded-constructors][mode:evidence-blocking][verifier:human-evidence] Provide typed constructor/parsing helpers for branded types at application boundaries.

## Generics discipline

- [directive:ts.type-safety.generics-uniform-types][mode:advisory][verifier:none] Use generics only when a function or component operates uniformly over multiple types while preserving relationship between inputs and outputs.
- [directive:ts.type-safety.avoid-recursive-type-acrobatics][mode:advisory][verifier:none] Avoid overly speculative or deeply recursive type acrobatics that degrade `tsc` compiler performance and obscure IDE error messages.
- [directive:ts.type-safety.default-type-parameters][mode:advisory][verifier:none] Always provide sensible default type parameters where applicable (`<T = unknown>`).
