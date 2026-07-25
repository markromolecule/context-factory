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

## Rules

- Keep one primary subject per note and use stable dotted IDs.
- Link evidence and related knowledge rather than copying their contents.
- Use `supersedes` for replacement and retain historical notes.
- Add new canonical notes to `context-manifest.json`.
- Use [[skills/knowledge-grounding/SKILL|knowledge-grounding]] for retrieval.
