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
6. Inspect tool integrations through [[docs/Connectors|Connectors Map]] and [.mcp.json](.mcp.json).
7. Ground durable knowledge through [[docs/Wiki|LLM Wiki]].
8. Record durable decisions in [[docs/decisions/README|Architecture Decisions]] and work in [[docs/tasks/README|Tasks]] (triaged via [[docs/tasks/INBOX|Triage Inbox]]).
9. Integrate into host repositories using [[docs/guide/cross-workspace-integration|Cross-Workspace Integration Guide]] or `context-cli init`.

## Multi-Editor Bridging & Submodule Onboarding

Context Factory provides first-class, non-destructive bridging for modern AI coding editors:
- **VS Code:** Scaffolds `.github/copilot-instructions.md`, `.vscode/extensions.json`, and merges `.vscode/settings.json` non-destructively.
- **Antigravity:** Live `.agents/` symlinks (`skills/`, `rules/`, `workflows/`, `agents/`), `.agents/skills.json`, and `GEMINI.md`.
- **Cursor:** Provisions modern `.cursor/rules/context-factory.mdc` (`alwaysApply: true`) and root `.cursorrules`.
- **Trae:** Scaffolds `.trae/rules/project_rules.md` referencing orchestrator contracts and rules.

### Quick Start in Any Host Project:
```sh
# 1. Add as submodule
git submodule add <context-factory-url> .context-factory

# 2. Launch interactive setup wizard (scans existing IDEs & guides selection)
node .context-factory/app/cli/bin/context-cli.mjs init
```

## Sync contract

Resolve a request, compile an immutable bundle, or check the factory:

```sh
node scripts/context.mjs resolve "implement an authenticated orders endpoint"
node scripts/context.mjs bundle "implement an authenticated orders endpoint"
node scripts/context.mjs doctor
```

`context-manifest.json` is the canonical inventory and `context-lock.json` pins its exact content. Update the manifest and affected maps, regenerate the lock, and pass validation plus behavioral evaluations whenever canonical context changes.
