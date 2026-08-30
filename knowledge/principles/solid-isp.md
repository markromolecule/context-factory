---
id: factory.principles.solid.isp
title: Interface Segregation Principle
type: concept
status: active
scope: [software-architecture, context-factory, clean-code]
owner: context-factory
authority: canonical
created: 2026-08-23
lastVerified: 2026-08-23
reviewAfter: 2027-02-23
appliesTo: [rules/solid/interface-segregation.md, skills/refactor/**, skills/plan/**]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json]
tags: [solid, isp, interface-segregation, architecture, principles]
---

# Interface Segregation Principle (ISP)

The **Interface Segregation Principle** states that **clients should not be forced to depend upon interfaces, methods, or properties that they do not use**.

## Core Mental Model & Definition

> *"Many client-specific interfaces are better than one general-purpose interface."* — Robert C. Martin

When an interface becomes a "fat interface" or "header dump" containing dozens of unrelated methods, any change to one method forces all consumers and implementors of that interface to recompile, retest, or implement dummy/no-op methods.

## Segregation in TypeScript & Modern Web Systems

In TypeScript's structural type system and React component architectures, ISP applies to both backend service boundaries and frontend component contracts:

### 1. Role-Specific Backend Interfaces

Instead of one massive `UserService` interface with 20 methods:

- Split into focused role interfaces: `UserReader`, `UserWriter`, `UserAuthenticator`, `UserNotifier`.
- Services implement only what is required, or compose multiple small interfaces when needed (`interface UserService extends UserReader, UserWriter`).

### 2. Lean React Component Props

Instead of passing an entire 30-field `UserRecord` object into an avatar component:

- Define a minimal, segregated prop contract: `interface AvatarProps { src?: string; name: string; size?: "sm" | "md" | "lg"; }`.
- Prevents unnecessary re-renders, tightly coupled mocking in tests, and unintended exposure of sensitive fields.

## Invariants & Rules

1. **No Dummy Implementations:** If a class implementing an interface has empty methods or throws errors for unused methods, the interface MUST be segregated.
2. **Client-Driven Interface Design:** Design interfaces from the perspective of the *consumer*, not the provider.
3. **TypeScript Utility Types:** Utilize `Pick<T, K>` or segregated sub-types to narrow contracts rather than passing full domain models across presentation boundaries.

## Cross-References

- Rule Enforcement: [[rules/solid/interface-segregation|Interface Segregation Rule]]
- UI Organization: [[rules/typescript/ui/code-organization|UI Code Organization]]
- Refactoring Skill: [[skills/engineering/refactor/SKILL|Refactor Skill]]
