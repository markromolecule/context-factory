---
title: "Phase 4: Sync Orchestrators, Agents, Vault Docs & ADR-0012"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0001-task-skill-taxonomy-and-ergonomics-optimization/README.md"
phase: "04"
status: completed
created: "2026-08-21"
tags: [task, phase, orchestrators, documentation, adr, vault]
---

# Phase 4: Sync Orchestrators, Agents, Vault Docs & ADR-0012

## Objective

Synchronize all root orchestrators, subagent system prompts, Obsidian vault documentation, workflows, and create Architecture Decision Record (ADR-0012) documenting the optimized taxonomy and slash palette.

## Dependencies & Prerequisites

- Phase 1, Phase 2, and Phase 3 completed.

## Impacted Files & Components

- `orchestrator/SHARED.md`
- Root orchestrators: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `orchestrator/*`
- Subagent definitions: `agents/ba-agent/*`, `agents/pm-agent/*`, `agents/devops-agent/*`
- Vault documentation: `docs/Skills.md`, `docs/Workflows.md`, `docs/ARCHITECTURE.md`, `docs/guide/*`
- New ADR: `docs/decisions/0012-skill-taxonomy-and-slash-ergonomics-optimization.md`
- Workflows: `workflows/*.md` (updating skill references)

## Implementation Tasks

- [x] Update `orchestrator/SHARED.md`:
  - Synchronize references to `skills/execution`, `skills/plan`, `skills/grill`, `skills/verify`, `skills/security`, `skills/adr`.
- [x] Update root orchestrators (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `orchestrator/` adapters):
  - Update the **Trigger & Skill Dispatch Matrix** with new skill names and clean links.
  - Update the **Session Slash Commands & Prefix Triggers** table with new slash commands (`/execution`, `/plan`, `/grill`, `/verify`, `/adr`, `/tsc`, `/zod`, `/explore`, `/api-contract`, `/database-query`, `/component-craft`, `/test-suite`).
- [x] Update Subagent Prompts:
  - `agents/ba-agent/AGENT.md`, `prompts/system-prompt.md`, `prompts/subagent-invocation.md`
  - `agents/pm-agent/AGENT.md`, `prompts/system-prompt.md`, `prompts/subagent-invocation.md`
  - `agents/devops-agent/AGENT.md`, `prompts/system-prompt.md`, `prompts/subagent-invocation.md`
- [x] Update Workflows (`workflows/*.md`):
  - Replace legacy skill references (e.g. `grill-with-docs` $\rightarrow$ `grill`, `implementation-plan` $\rightarrow$ `plan`, `execution-plan` $\rightarrow$ `execution`, `verification-review` $\rightarrow$ `verify`, `security-review` $\rightarrow$ `security`).
- [x] Update Vault Docs:
  - `docs/Skills.md` (Add full index of all 16 skills with descriptions and slash commands).
  - `docs/Workflows.md` (Update slash trigger table and skill linkages).
  - `docs/ARCHITECTURE.md` and `docs/guide/skills.md`.
- [x] Create ADR-0012:
  - `docs/decisions/0012-skill-taxonomy-and-slash-ergonomics-optimization.md` using `docs/templates/Decision.md` documenting the 1-3-1 architectural rationale for the taxonomy and slash ergonomics optimization.

## Verification & Testing

- Check all internal markdown wiki links across `docs/` and `agents/` to ensure 0 broken links.
- Confirm consistency of all orchestrator files.

## Risks & Rollback

- Carefully preserve markdown link syntax so no broken links are created.
