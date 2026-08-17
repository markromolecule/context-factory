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
| Orchestration | `orchestrator/SHARED.md` | Model-neutral load order, execution contract, and working rules |
| Execution Runner | `orchestrator/runner.mjs` | Pluggable provider execution (`openai`, `anthropic`, `gemini`), 3-stage hooks, and mock replay |
| Output Validator | `orchestrator/validator.mjs` | Pure ESM JSON Schema validator enforcing output contracts |
| Adapters | `orchestrator/{AGENTS,CLAUDE,GEMINI}.md` | Thin model-specific presentation guidance |
| Rules | `rules/{global,backend,frontend,typescript}/` | Scoped engineering constraints |
| Skills | `skills/*/SKILL.md`, references, agents | Triggered procedures with progressively disclosed resources and synchronized interface metadata |
| Workflows | `workflows/*.md` | Multi-stage lifecycle orchestration, quality gates, and stop conditions |
| Knowledge | `knowledge/*.md`, `docs/` | Attributable LLM knowledge, Obsidian maps, tasks, and decisions |
| Schemas | `schemas/*.json` | Output contracts (`run-result`, `evaluation-report`, `claim-evidence`) and knowledge schemas |
| Templates and decisions | `docs/templates/`, `docs/decisions/` | Valid artifact shapes and durable architectural history |
| Harness CLI | `scripts/harness-cli.mjs`, `scripts/context.mjs` | Unified CLI interface, context resolution, bundling, execution, locking, and diagnostics |
| Automation | `.github/workflows/context-factory.yml` | Cross-platform health enforcement on pushes and pull requests |
| Evaluation Suites | `evals/run-evals.mjs`, `evals/{cases,datasets}/` | Multi-tier unit resolution cases and golden workflow regression suites |

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
  D --> K["LLM Wiki knowledge"]
  K --> B["Immutable context bundle"]
  B --> RN["Execution Runner (3-stage hooks)"]
  RN --> V["Validator & Evals"]
```

## Invariants

- The root directory is the Obsidian vault.
- The manifest contains every orchestrator, rule, skill, skill resource, and index note.
- Model adapters defer to one shared contract.
- Skill frontmatter contains only `name` and `description`.
- Workflow frontmatter contains `name`, `description`, and `scope`; workflow inventory and map match disk.
- Rule descriptions state scope; bodies state enforceable behavior and verification.
- Durable decisions and active task state live in the vault, not only in chat.
- Consequential claims use the evidence classes defined by the shared contract.
- Architecture follows project profiles and accepted decisions rather than model preference.
- Canonical knowledge has stable identity, authority, provenance, ownership, lifecycle, and review metadata.
- `context-lock.json` hashes the manifest and complete canonical inventory, excluding only the generated lock itself.

## Decisions

- [[docs/decisions/0001-vertical-backend-modules|Vertical backend modules]]
- [[docs/decisions/0002-task-appropriate-form-surfaces|Task-appropriate form surfaces]]
- [[docs/decisions/0003-first-class-development-workflows|First-class development workflows]]
- [[docs/decisions/0004-deterministic-context-harness|Deterministic context harness]]
- [[docs/decisions/0005-preplanning-grill-gate|Pre-planning grill gate]]
- [[docs/decisions/0006-design-taste-layer|Design taste layer]]
- [[docs/decisions/0007-simplify-styling-and-taste|Simplify frontend styling and remove taste layer]]
- [[docs/decisions/0008-pluggable-ai-execution-harness|Pluggable AI execution harness, hooks, and schema validation]]
