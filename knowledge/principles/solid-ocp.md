---
id: factory.principles.solid.ocp
title: Open/Closed Principle
type: concept
status: active
scope: [software-architecture, context-factory, clean-code]
owner: context-factory
authority: canonical
created: 2026-08-23
lastVerified: 2026-08-23
reviewAfter: 2027-02-23
appliesTo: [rules/solid/open-closed.md, skills/refactor/**, skills/plan/**]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json]
tags: [solid, ocp, open-closed, architecture, principles]
---

# Open/Closed Principle (OCP)

The **Open/Closed Principle** dictates that software entities (classes, modules, functions, components) should be **open for extension, but closed for modification**.

## Core Mental Model & Definition

- **Open for Extension:** The behavior of the module can be extended to satisfy new business requirements or handle new variants.
- **Closed for Modification:** The existing, tested source code of the module remains untouched when adding new behavior, eliminating regression risk.

> *"You should be able to extend the behavior of a system without modifying that system."* — Bertrand Meyer / Robert C. Martin

## Modern Extension Mechanisms in TypeScript & React

Rather than heavy classical OOP inheritance hierarchies, modern TypeScript and React achieve OCP through polymorphic composition:

1. **Strategy Pattern / Registry Mapping:**
   Instead of modifying a giant `switch (paymentType)` block whenever a new payment provider is added, define a `PaymentStrategy` interface and register concrete handlers in a lookup map or plugin registry.
2. **Higher-Order Functions & Middleware:**
   Extend core pipeline behavior by wrapping functions (e.g. logging, rate-limiting, error handling) without altering core handler code.
3. **React Component Composition (`children` & Slot Props):**
   Extend UI containers (e.g., `Dialog`, `Card`, `DataTable`) by passing sub-components via slots or children rather than adding dozens of boolean variant flags (`isEditable`, `hasHeader`, `isCompact`) to a monolithic component.
4. **Discriminated Unions with Exhaustiveness Handlers:**
   When types are closed, use discriminated unions with helper visitor functions so new variants trigger compile-time exhaustiveness checks.

## Invariants & Rules

1. **Avoid Cascading Switch Blocks:** If adding a new feature requires modifying conditional logic across 5 different files, replace the switch block with a strategy interface or registry.
2. **Stability of Core Abstractions:** Core workflows should depend on polymorphic contracts (`interface`, `type`, function signatures) that allow new implementors to plug in seamlessly.
3. **Pragmatic Boundary:** Do not apply premature OCP to trivial, non-variable code. Apply OCP where requirements are known or expected to vary over time.

## Cross-References

- Rule Enforcement: [[rules/solid/open-closed|Open/Closed Rule]]
- Strategy & Planning: [[skills/plan/SKILL|Plan Skill]]
- Architectural Conformance: [[rules/global/architecture-conformance|Architecture Conformance]]
