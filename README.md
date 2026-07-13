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
6. Record durable decisions in [[docs/decisions/README|Architecture Decisions]] and work in [[docs/tasks/README|Tasks]].

## Sync contract

`context-manifest.json` is the canonical inventory. Run:

```sh
node scripts/validate-context.mjs
```

Update the manifest and all affected index notes in the same change whenever a rule, skill, workflow, or canonical document is added, renamed, or removed.
