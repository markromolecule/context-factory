---
id: factory.principles.dependency-inversion
title: Dependency Inversion Principle
type: concept
status: active
scope: [software-architecture, context-factory, clean-code]
owner: context-factory
authority: canonical
created: 2026-08-23
lastVerified: 2026-10-17
reviewAfter: 2027-04-17
appliesTo: [rules/global/architecture-conformance.md, rules/global/code-quality.md, rules/typescript/backend/module-architecture.md, rules/typescript/backend/service-layer.md, skills/engineering/refactor/**, skills/productivity/plan/**]
supersedes: []
sources: [docs/WIKI.md, schemas/knowledge.schema.json]
tags: [solid, dip, dependency-inversion, architecture, principles]
---

# Dependency Inversion Principle (DIP)

The **Dependency Inversion Principle** establishes the primary structural rule for software dependency direction:

1. **High-level modules should not depend on low-level modules. Both should depend on abstractions.**
2. **Abstractions should not depend on details. Details should depend on abstractions.**

## Core Mental Model & Terminology

DIP is the architectural foundation of Clean Architecture, Hexagonal Architecture (Ports & Adapters), and Onion Architecture.

```mermaid
graph TD
    subgraph Traditional Direct Coupling [Bad: Direct Low-Level Coupling]
        A[High-Level Business Logic] -->|Direct Import| B[Low-Level Postgres Client / AWS SDK]
    end
    
    subgraph Inverted Architecture [Good: Dependency Inversion]
        C[High-Level Business Logic] -->|Depends On| D[Repository Interface / Port]
        E[Postgres Repository Adapter] -->|Implements / Inverted| D
    end
```

### Clarifying Key Distinctions

- **Dependency Inversion Principle (DIP):** The high-level architectural rule governing dependency direction (high-level policy owns the contract).
- **Dependency Injection (DI):** A behavioral technique for supplying an external dependency (via constructor arguments, factory functions, or React context) rather than instantiating it internally (`new SpecificDatabaseClient()`).
- **Inversion of Control (IoC):** A framework architectural pattern where external framework lifecycle controls execution flow.

## Invariants & Rules in TypeScript

1. **High-Level Domain Ownership:** Core business services (`OrderService`, `PaymentService`) must import and depend on domain interfaces or ports, never on concrete ORM clients (e.g., Prisma, Kysely), SDK instances, or third-party APIs directly.
2. **Constructor Parameter Injection:** Concrete implementations must be passed into classes or factory functions via constructor parameters or parameter objects:

   ```typescript
   export class OrderService {
     constructor(private readonly orderRepo: OrderRepository, private readonly notifier: NotificationPort) {}
   }
   ```

3. **Frontend Context as Inversion Mechanism:** In React, avoid hardcoding singleton API clients inside UI components; inject dependencies via React Context providers, custom hooks, or props to facilitate isolated storybook rendering and unit testing.
4. **Pragmatic Persistence Boundaries:** Port and adapter abstractions are required when crossing real architectural boundaries (e.g. payment SDKs, multi-backend persistence, or isolated domain testing). For direct policy-free reads where no domain rules or runtime variations exist, simple direct data access functions are accepted without creating artificial port contracts.

## Cross-References

- Rule Enforcement: [[rules/global/architecture-conformance|Architecture Conformance Rule]]
- Code Quality: [[rules/global/code-quality|Code Quality Rule]]
- Pragmatic Design: [[rules/typescript/common/pragmatic-design|Pragmatic Design Rule]]
- Module Architecture: [[rules/typescript/backend/module-architecture|Backend Module Architecture]]
- Service Layer: [[rules/typescript/backend/service-layer|Service Layer]]
