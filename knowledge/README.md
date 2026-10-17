---
id: factory.knowledge.index
title: Knowledge Index
type: concept
status: active
scope: [context-factory]
owner: context-factory
authority: canonical
created: 2026-07-25
lastVerified: 2026-07-25
reviewAfter: 2027-01-25
appliesTo: [knowledge/**]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json]
tags: [knowledge, index]
---

# Knowledge Index

Canonical LLM knowledge lives under `knowledge/`. Each note is independently retrievable, attributable, reviewable, and validated against `schemas/knowledge.schema.json`.

## Knowledge types

- `fact` — a verifiable current-state statement.
- `concept` — shared domain terminology or mental model.
- `contract` — an API, schema, event, or behavioral invariant.
- `procedure` — a repeatable operational method.
- `runbook` — diagnosis, mitigation, and recovery.
- `example` — an approved illustration that is not independently authoritative.

## Canonical Knowledge Items

### Architectural Principles (SOLID)

- [[knowledge/principles/single-responsibility|Single Responsibility Principle (`factory.principles.single-responsibility`)]]
- [[knowledge/principles/open-closed|Open/Closed Principle (`factory.principles.open-closed`)]]
- [[knowledge/principles/liskov-substitution|Liskov Substitution Principle (`factory.principles.liskov-substitution`)]]
- [[knowledge/principles/interface-segregation|Interface Segregation Principle (`factory.principles.interface-segregation`)]]
- [[knowledge/principles/dependency-inversion|Dependency Inversion Principle (`factory.principles.dependency-inversion`)]]

### Pragmatic Design Principles

- [[knowledge/principles/yagni|You Aren't Gonna Need It (`factory.principles.yagni`)]]
- [[knowledge/principles/kiss|Keep It Simple, Stupid (`factory.principles.kiss`)]]
- [[knowledge/principles/composition-over-inheritance|Composition over Inheritance (`factory.principles.composition-over-inheritance`)]]
- [[knowledge/principles/law-of-demeter-tell-dont-ask|Law of Demeter and Tell, Don't Ask (`factory.principles.demeter-tell-dont-ask`)]]

## Rules

- Keep one primary subject per note and use stable dotted IDs.
- Link evidence and related knowledge rather than copying their contents.
- Use `supersedes` for replacement and retain historical notes.
- Add new canonical notes to `context-manifest.json`.
- Use [[skills/productivity/grounding/SKILL|grounding]] for retrieval.
