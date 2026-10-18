---
id: factory.principles.composition-over-inheritance
title: Composition over Inheritance
type: concept
status: active
scope: [software-architecture, context-factory, clean-code, typescript]
owner: context-factory
authority: canonical
created: 2026-10-10
lastVerified: 2026-10-10
reviewAfter: 2027-04-10
appliesTo: [rules/typescript/common/pragmatic-design.md]
supersedes: []
sources: [docs/WIKI.md, schemas/knowledge.schema.json, docs/discovery/pragmatic-design-principles-and-rule-alignment/brief.md]
tags: [composition, inheritance, principles, architecture, typescript, clean-code]
---

# Composition over Inheritance

**Composition over Inheritance** establishes that polymorphic behavior and code reuse should be achieved by assembling discrete, focused collaborator functions or objects rather than constructing class inheritance hierarchies.

## Core Mental Model & Definition

- **Composition:** An entity accomplishes a task by delegating to or combining independent components (*"has-a"* or *"uses-a"* relationship).
- **Inheritance:** A subclass derives from a base class to acquire state and methods (*"is-a"* relationship). Deep inheritance hierarchies tightly couple subclasses to the internal implementation details of ancestors, causing fragile base class problems and rigid taxonomies.
- **Pragmatic Threshold:** When a component has only **one concrete implementation**, implement it directly. Do not introduce a premature strategy pattern, abstract interface, or dependency-injection container until an actual second variant exists. When real variation emerges, compose focused functions or collaborators rather than subclassing.

## TypeScript Examples

### Non-Conforming (Deep Inheritance Hierarchy)

```typescript
// Fragile base class hierarchy forcing tight coupling and shared mutable state
abstract class BaseEntity {
  id: string = crypto.randomUUID();
  createdAt: Date = new Date();
}

abstract class AuditableEntity extends BaseEntity {
  updatedAt: Date = new Date();
  abstract logAudit(action: string): void;
}

abstract class NotifiableEntity extends AuditableEntity {
  abstract sendNotification(message: string): Promise<void>;
}

// Rigid subclass forced to inherit unrelated methods and state
export class UserAccount extends NotifiableEntity {
  constructor(public email: string) {
    super();
  }
  logAudit(action: string): void {
    console.log(`Audit: ${this.id} - ${action}`);
  }
  async sendNotification(message: string): Promise<void> {
    // forced implementation even if notifiable behavior changes independently
  }
}
```

### Conforming (Focused Functional & Object Composition)

```typescript
// Cohesive data structure with discrete, composable collaborator functions
export interface UserAccount {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
}

export interface AuditLogger {
  log(entityId: string, action: string): void;
}

export interface Notifier {
  notify(recipient: string, message: string): Promise<void>;
}

// Composed service or function receiving only the collaborators it actually needs
export async function updateUserEmail(
  user: UserAccount,
  newEmail: string,
  deps: { logger: AuditLogger; notifier?: Notifier }
): Promise<UserAccount> {
  const updated: UserAccount = { ...user, email: newEmail };
  deps.logger.log(user.id, `email_updated_to_${newEmail}`);
  if (deps.notifier) {
    await deps.notifier.notify(newEmail, "Your email address has been updated.");
  }
  return updated;
}
```

## Invariants & Rules

1. **Favor Small Collaborators:** Combine small, focused functions, modules, or objects rather than subclassing.
2. **Accept Direct 1-Implementation Designs:** If there is only one concrete implementation needed today, write it directly. Do not invent an abstract base class or interface merely for ceremony.
3. **Inject Behavior on Real Variation:** When multiple distinct runtime behaviors are genuinely required, inject a strategy function or collaborator interface into the consumer.

## Documented Exceptions

- **Language & Framework Primitives:** Extending standard built-in classes where inheritance is required by JavaScript/TypeScript semantics, such as custom error types (`class DomainError extends Error`).
- **Framework Component Models:** Legacy framework lifecycle contracts that require subclassing (e.g., standard Node.js `EventEmitter` or legacy React `Component`).
- **High-Throughput Prototype Chains:** Extreme micro-optimizations where JavaScript engine hidden classes and prototype inheritance provide measurably superior execution characteristics in vetted hotspots.

## Cross-References

- Rules Index: [[docs/RULES|Rules Index]]
- Open/Closed Principle: [[knowledge/principles/open-closed|Open/Closed Principle]]
- Companion Concept: [[knowledge/principles/law-of-demeter-tell-dont-ask|Law of Demeter & Tell, Don't Ask]]
