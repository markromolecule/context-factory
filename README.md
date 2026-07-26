---
title: Context Factory
type: index
tags: [context-factory, index]
---

# Context Factory

This repository is the source of truth for agent behavior, engineering rules, reusable skills, development workflows, and project knowledge.

## Start here

1. Read [[docs/Home|Home]].
2. Follow [[orchestrator/SHARED|Shared Orchestration Contract]].
3. Select relevant rules through [[docs/Rules|Rules Map]].
4. Select lifecycle orchestration through [[docs/Workflows|Workflows Map]].
5. Invoke specialized procedures through [[docs/Skills|Skills Map]].
6. Apply task-relevant product and interface judgment through [[docs/Taste|Taste Map]].
7. Ground durable knowledge through [[docs/Wiki|LLM Wiki]].
8. Record durable decisions in [[docs/decisions/README|Architecture Decisions]] and work in [[docs/tasks/README|Tasks]].

## Sync contract

Resolve a request, compile an immutable bundle, or check the factory:

```sh
node scripts/context.mjs resolve "implement an authenticated orders endpoint"
node scripts/context.mjs bundle "implement an authenticated orders endpoint"
node scripts/context.mjs doctor
```

`context-manifest.json` is the canonical inventory and `context-lock.json` pins its exact content. Update the manifest and affected maps, regenerate the lock, and pass validation plus behavioral evaluations whenever canonical context changes.
