---
title: Context Factory Architecture
type: architecture
tags: [architecture, context-factory]
---

# Context Factory Architecture

## Purpose

The factory separates stable project knowledge from task-specific context so agents load enough guidance to work consistently without loading everything on every request.

## Layers

| Layer | Source | Responsibility |
|---|---|---|
| Inventory | `context-manifest.json` | Versioned list of canonical context files |
| Entry points | `README.md`, `AGENTS.md` | Discovery and minimum startup instructions |
| Orchestration | `orchestrator/SHARED.md` | Model-neutral load order and working contract |
| Adapters | `orchestrator/{AGENTS,CLAUDE,GEMINI}.md` | Thin model-specific presentation guidance |
| Rules | `rules/{global,backend,frontend}/` | Scoped engineering constraints |
| Skills | `skills/*/SKILL.md` | Triggered specialized task procedures with progressive disclosure |
| Workflows | `workflows/*.md` | Multi-stage lifecycle orchestration, quality gates, and stop conditions |
| Knowledge | `docs/` | Obsidian indexes, tasks, decisions, and durable project context |
| Validation | `scripts/validate-context.mjs` | Inventory, metadata, links, and vault consistency checks |

## Context flow

```mermaid
flowchart LR
  E["Entry point"] --> M["Manifest"]
  M --> O["Shared orchestration"]
  O --> R["Relevant rules"]
  O --> F["Matching workflow"]
  O --> S["Triggered skills"]
  R --> W["Implementation and verification"]
  F --> W
  S --> W
  W --> D["Tasks and decisions"]
  D --> V["Validation"]
```

## Invariants

- The root directory is the Obsidian vault.
- The manifest contains every orchestrator, rule, skill, and index note.
- Model adapters defer to one shared contract.
- Skill frontmatter contains only `name` and `description`.
- Workflow frontmatter contains `name`, `description`, and `scope`; workflow inventory and map match disk.
- Rule descriptions state scope; bodies state enforceable behavior and verification.
- Durable decisions and active task state live in the vault, not only in chat.

## Decisions

- [[docs/decisions/0001-vertical-backend-modules|Vertical backend modules]]
- [[docs/decisions/0002-task-appropriate-form-surfaces|Task-appropriate form surfaces]]
- [[docs/decisions/0003-first-class-development-workflows|First-class development workflows]]
