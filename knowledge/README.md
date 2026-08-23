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

- [[knowledge/principles/solid-srp|Single Responsibility Principle (`factory.principles.solid.srp`)]]
- [[knowledge/principles/solid-ocp|Open/Closed Principle (`factory.principles.solid.ocp`)]]
- [[knowledge/principles/solid-lsp|Liskov Substitution Principle (`factory.principles.solid.lsp`)]]
- [[knowledge/principles/solid-isp|Interface Segregation Principle (`factory.principles.solid.isp`)]]
- [[knowledge/principles/solid-dip|Dependency Inversion Principle (`factory.principles.solid.dip`)]]

## Rules

- Keep one primary subject per note and use stable dotted IDs.
- Link evidence and related knowledge rather than copying their contents.
- Use `supersedes` for replacement and retain historical notes.
- Add new canonical notes to `context-manifest.json`.
- Use [[skills/grounding/SKILL|grounding]] for retrieval.

