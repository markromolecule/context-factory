---
title: LLM Wiki
type: moc
tags: [knowledge, llm, wiki]
---

# LLM Wiki

The LLM Wiki stores durable, attributable project knowledge as Markdown. It complements rules, skills, and workflows:

- rules constrain behavior;
- skills define specialized procedures;
- workflows coordinate lifecycles;
- knowledge explains facts, concepts, contracts, runbooks, and provenance.

## Authority

Use this order within an item's declared scope:

1. `canonical` — approved source of truth.
2. `reviewed` — verified supporting knowledge.
3. `reference` — useful but not authoritative.
4. `example` — illustrative only.

Lifecycle state is separate from authority: `draft`, `active`, `deprecated`, or `superseded`. Only active canonical or reviewed knowledge may ground consequential claims without additional verification.

## Required metadata

Canonical knowledge follows `schemas/knowledge.schema.json` and starts from [[docs/templates/Knowledge|Knowledge Template]]. Every item has a stable ID, type, lifecycle status, scope, owner, authority, verification date, review date, and sources.

## Retrieval

Use the [[skills/productivity/grounding/SKILL|grounding]] skill. Filter by metadata and task terms, prefer the highest applicable authority, follow relevant links one hop, and retain hashes plus selection reasons in the context bundle.

## Maintenance

- Update or supersede knowledge in the same change as its authoritative behavior.
- Never rewrite a durable decision to hide its history; supersede it with a new ADR or note.
- Treat stale dates, missing sources, and conflicting canonical claims as validation findings.
- Run `node scripts/context.mjs doctor` after knowledge changes.

## Index

- [[knowledge/README|Knowledge index]]
- [[knowledge/principles/solid-dip|Dependency Inversion Principle (`factory.principles.solid.dip`)]]
- [[knowledge/principles/solid-isp|Interface Segregation Principle (`factory.principles.solid.isp`)]]
- [[knowledge/principles/solid-lsp|Liskov Substitution Principle (`factory.principles.solid.lsp`)]]
- [[knowledge/principles/solid-ocp|Open/Closed Principle (`factory.principles.solid.ocp`)]]
- [[knowledge/principles/solid-srp|Single Responsibility Principle (`factory.principles.solid.srp`)]]
