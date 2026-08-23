---
id: factory.principles.solid.lsp
title: Liskov Substitution Principle
type: concept
status: active
scope: [software-architecture, context-factory, clean-code]
owner: context-factory
authority: canonical
created: 2026-08-23
lastVerified: 2026-08-23
reviewAfter: 2027-02-23
appliesTo: [rules/solid/liskov-substitution.md, skills/refactor/**, skills/plan/**]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json]
tags: [solid, lsp, liskov-substitution, architecture, principles]
---

# Liskov Substitution Principle (LSP)

The **Liskov Substitution Principle** asserts that objects of a superclass or implementors of an interface should be **replaceable with instances of their subclasses or alternative implementations without altering the correctness or behavioral invariants of the program**.

## Core Mental Model & Definition

Formulated by Barbara Liskov in 1987:
> *"If $S$ is a subtype of $T$, then objects of type $T$ may be replaced with objects of type $S$ without altering any of the desirable properties of the program (correctness, task performed, etc.)."*

LSP extends beyond simple static type checking: it governs **behavioral subtyping** and semantic contracts.

## Behavioral Subtyping Contract Rules

When implementing an interface or extending a base class:

| Contract Dimension | LSP Requirement | Anti-Pattern Violation |
| :--- | :--- | :--- |
| **Preconditions** | Cannot be strengthened in the subtype | Subclass requires additional setup or tighter validation arguments than the base interface declares |
| **Postconditions** | Cannot be weakened in the subtype | Subclass returns `null`, empty data, or omits side-effects guaranteed by base contract |
| **Invariants** | All invariants of supertype must be preserved | Subclass mutates state in an unconstrained manner violating base lifecycle |
| **Exception / Error Safety** | Subtype must not throw unexpected unchecked errors | Subclass throws `NotSupportedError` or `UnimplementedError` for interface methods |
| **Return Type Covariance** | Subtype return types must be narrower or equal | Subtype returns a wider, unhandled type union |
| **Parameter Contravariance** | Subtype parameter types must be wider or equal | Subtype narrows acceptable parameter types |

## Invariants & Rules in TypeScript

1. **No Throwing `NotSupportedError`:** If a subtype throws an error indicating that an interface method is not supported (e.g. `ReadOnlyFile` implementing `File.write()`), the interface is poorly segregated and violates LSP.
2. **Predictable Side Effects & Result Semantics:** An in-memory mock repository used in tests must exhibit identical business validation semantics, filtering behavior, and error results as the real database-backed repository.
3. **Avoid Subtype Type-Checking (`instanceof` branching):** If calling code must check `if (service instanceof SpecializedService)` to handle specific behaviors, polymorphism is broken and LSP is violated.

## Cross-References

- Rule Enforcement: [[rules/solid/liskov-substitution|Liskov Substitution Rule]]
- Type Safety: [[rules/typescript/common/type-safety|Strict Type Safety]]
- Error Handling: [[rules/typescript/common/error-handling|Error Handling and Result Types]]
