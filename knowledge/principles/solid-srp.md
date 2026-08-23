---
id: factory.principles.solid.srp
title: Single Responsibility Principle
type: concept
status: active
scope: [software-architecture, context-factory, clean-code]
owner: context-factory
authority: canonical
created: 2026-08-23
lastVerified: 2026-08-23
reviewAfter: 2027-02-23
appliesTo: [rules/solid/single-responsibility.md, skills/refactor/**, skills/plan/**]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json]
tags: [solid, srp, single-responsibility, architecture, principles]
---

# Single Responsibility Principle (SRP)

The **Single Responsibility Principle** asserts that a module, class, function, or component should have **one, and only one, reason to change**.

## Core Mental Model & Definition

In modern software engineering (as formulated by Robert C. Martin), a "reason to change" corresponds to an **actor** or **business stakeholder**:
> *"A module should be responsible to one, and only one, actor."*

When a single unit conflates multiple reasons to change—such as combining database query execution, business calculation, and HTTP response formatting—changes requested by one stakeholder (e.g. database schema change) risk inadvertently breaking features governed by another (e.g. billing calculations).

## Architectural Boundaries & Responsibility Separation

In full-stack TypeScript systems, responsibility boundaries must be partitioned across explicit layers:

| Layer | Responsibility | Sole Reason to Change | Example Symbol |
| :--- | :--- | :--- | :--- |
| **Transport / Controller** | HTTP parsing, parameter extraction, status codes | API routing / transport changes | `UserController.register` |
| **Domain / Service** | Business policy validation, domain calculations | Business rule modifications | `RegistrationService.execute` |
| **Data Access / Repository** | Query generation, database persistence | Schema / DB storage alterations | `UserRepository.insert` |
| **UI Presentation** | DOM rendering, layout, styling tokens | UX / Visual design changes | `UserProfileCard.tsx` |
| **UI State / Logic Hook** | Async fetching, caching, mutation state | Client data flow changes | `useUserProfile.ts` |

## Invariants & Rules

1. **One Actor per Module:** A file must not serve distinct business actors (e.g., accounting reporting logic and user authentication logic in the same class).
2. **Layer Isolation:** UI components must never perform direct database operations or heavy domain algorithms. Custom hooks or services must isolate state and effects.
3. **Cohesion over Size:** SRP is not merely about line count; high cohesion means all internal methods and fields collaborate toward a single unified purpose.
4. **Refactoring Trigger:** If modifying feature X requires editing a file that is also touched when modifying unrelated feature Y, that file violates SRP and must be decomposed using `skills/refactor`.

## Cross-References

- Rule Enforcement: [[rules/solid/single-responsibility|Single Responsibility Rule]]
- Refactoring Skill: [[skills/refactor/SKILL|Refactor Skill]]
- Architectural Conformance: [[rules/global/architecture-conformance|Architecture Conformance]]
