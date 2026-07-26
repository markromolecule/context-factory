---
title: Home
type: index
tags: [context-factory, moc]
---

# Home

The vault root is `context-factory/`, so Obsidian can index the full factory rather than only `docs/`.

## Maps of content

- [[docs/ARCHITECTURE|Architecture]]
- [[docs/Agents|Agents]]
- [[docs/Rules|Rules]]
- [[docs/Skills|Skills]]
- [[docs/Taste|Taste]]
- [[docs/Wiki|LLM Wiki]]
- [[docs/Workflows|Workflows]]
- [[docs/tasks/README|Tasks]]
- [[docs/decisions/README|Architecture Decisions]]

## Canonical machine context

- [[README|Factory entry point]]
- `context-manifest.json` — canonical inventory and context version
- [[orchestrator/SHARED|Shared orchestration contract]]

## Maintenance

Run `node scripts/context.mjs doctor` after every context change. A context change is complete only when its source, manifest entry, map, lock digest, validation, and behavioral evaluations agree.
