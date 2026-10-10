---
id: factory.principles.demeter-tell-dont-ask
title: Law of Demeter and Tell, Don't Ask
type: concept
status: active
scope: [software-architecture, context-factory, clean-code, typescript]
owner: context-factory
authority: canonical
created: 2026-10-10
lastVerified: 2026-10-10
reviewAfter: 2027-04-10
appliesTo: [rules/typescript/common/pragmatic-design.md, rules/solid/single-responsibility.md]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json, docs/discovery/pragmatic-design-principles-and-rule-alignment/brief.md]
tags: [law-of-demeter, tell-dont-ask, principles, architecture, typescript, clean-code]
---

# Law of Demeter and Tell, Don't Ask

The **Law of Demeter (Principle of Least Knowledge)** and **Tell, Don't Ask** form a unified design principle: an entity should only communicate with its immediate collaborators and should tell those collaborators what operation to execute rather than interrogating their internal state to make decisions on their behalf.

## Core Mental Model & Combined Definition

- **Law of Demeter:** A function or method should only invoke methods on:
  1. Itself / its own class parameters;
  2. Objects passed as explicit arguments;
  3. Objects it directly instantiated;
  4. Its direct, immediate collaborators or held fields.
  It must not "reach through" an object graph (e.g., `a.getB().getC().doSomething()`) to interact with a collaborator's internal dependencies.
- **Tell, Don't Ask:** Rather than asking an object for its data, examining that data, and performing operations on that data externally, the caller should tell the object that owns the data to execute the business action.
- **Combined Intent:** Keep decision-making co-located with the state owner. This prevents ripple effects across data models when internal representations change.

## DTOs & Passive Data Structures vs. Domain Objects

A critical distinction governs the application of this combined principle:

- **Domain Entities & Aggregates:** Encapsulate state, business rules, and behavior. Callers must **tell** them what to do. Reaching into domain internals to perform domain decisions is a direct violation.
- **Data Transfer Objects (DTOs), Records, & Payloads:** Passive data carriers with public properties designed explicitly for transport, inspection, and transformation. Reading nested fields in a DTO, validating input with a schema, or projecting fields into an API response is **not** a violation of the Law of Demeter.

## TypeScript Examples

### Non-Conforming (Reach-Through & External Decision Making)

```typescript
// Caller reaches through multiple internal objects and makes a domain decision externally
class OrderProcessor {
  processDiscount(order: Order, discountRate: number): void {
    // Reaching through order -> customer -> loyaltyAccount to decide and mutate balance
    if (order.getCustomer().getLoyaltyAccount().getTier() === "VIP") {
      const currentPoints = order.getCustomer().getLoyaltyAccount().getPoints();
      order.getCustomer().getLoyaltyAccount().setPoints(currentPoints + 100);
      order.getPaymentDetails().setDiscount(discountRate);
    }
  }
}
```

### Conforming (Domain: Tell the Owner to Act)

```typescript
// Caller tells the immediate domain aggregate to execute the business action
class OrderProcessor {
  processDiscount(order: Order, discountRate: number): void {
    // The Order aggregate encapsulates its customer and payment relationships
    order.applyLoyaltyPromotion(discountRate);
  }
}
```

### Conforming (DTO, Validation, & Serialization Exception)

```typescript
// Legitimate inspection of passive DTO properties during mapping and serialization
export interface CreateUserDto {
  profile: {
    contact: {
      email: string;
      phoneNumber?: string;
    };
  };
}

// Pure data transformation and serialization reading nested DTO fields is fully valid
export function mapUserDtoToResponse(dto: CreateUserDto): { email: string } {
  return {
    email: dto.profile.contact.email.toLowerCase(),
  };
}
```

## Invariants & Rules

1. **Tell, Don't Ask for Domain State:** Do not inspect an object's internal fields to decide what that object should do; command the object to perform the action.
2. **One Dot per Navigation for Domain Collaborators:** Do not chain method calls through foreign domain objects (`a.b().c().d()`).
3. **Fluent Builders & Stream Pipelines are Permitted:** Chained calls on fluent builders (`query.select().where().orderBy()`), promises, LINQ/RxJS streams, or array transformations (`arr.map().filter().reduce()`) return new representations of the same pipeline and do not violate Demeter.

## Documented Exceptions

- **Data Transfer Objects (DTOs) & API Responses:** Reading nested properties of passive DTOs or API responses is standard and required.
- **Input Validation & Schema Parsing:** Schema validators (e.g. Zod, TypeBox, Valibot) that traverse nested input objects to validate constraints.
- **Serialization & Data Mappers:** Functions specifically designated to translate between database entities, domain models, and external wire representations.
- **Pure Functional Pipelines:** Chaining array methods or pure functional pipes on transparent data structures.

## Cross-References

- Rules Index: [[docs/Rules|Rules Index]]
- Single Responsibility: [[knowledge/principles/solid-srp|Single Responsibility Principle]]
- Companion Concept: [[knowledge/principles/composition-over-inheritance|Composition over Inheritance]]
