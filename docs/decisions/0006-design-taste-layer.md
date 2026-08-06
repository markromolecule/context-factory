---
title: Design Taste Layer
type: decision
status: superseded
created: 2026-07-26
tags: [adr, design, taste, components]
---

# 0006 — Design Taste Layer

> [!WARNING]
> This decision has been **superseded** by [[docs/decisions/0007-simplify-styling-and-taste|0007 — Simplify Frontend Styling and Remove Taste Layer]].

## Context

The `design-pattern` skill defines visual systems well, but system-wide journeys, component contracts, composition rules, and a consistent design quality bar need reusable guidance. Placing all of that inside one skill would make it large and force unrelated design context into every task.

## Options considered

1. Expand `design-pattern/SKILL.md` with all design guidance. This keeps one entry point but weakens progressive disclosure.
2. Add a canonical `taste/` layer of selectively loaded design judgment, applied primarily by `design-pattern`.
3. Create many narrowly scoped design skills. This improves isolation but fragments one end-to-end design responsibility and increases routing ambiguity.

## Decision

Adopt option 2. Keep skills as executable procedures and add `taste/` as canonical, progressively disclosed product-experience, component-contract, and critique guidance. Expand `design-pattern` to route these references and require representative page or flow composition for reusable component work.

## Consequences

- Design work can proceed from end-to-end intent through component implementation and review.
- The manifest, resolver, validator, lock, maps, and evaluations must understand the new context type.
- Taste remains subordinate to user direction, evidence, accessibility, and accepted project decisions.
- New taste references require an explicit scope and a consumer skill.

## Validation and review date

Review after ten design-system or component-pattern tasks or by 2027-01-26. Measure context-selection precision, component reuse, design-review findings, accessibility defects, and exceptions to established patterns.
