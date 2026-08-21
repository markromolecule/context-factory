---
title: "Phase 3: Synchronize Orchestrators, Subagents, Workflows & ADR-0013"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0002-task-streamline-procedural-skills-inventory/README.md"
phase: "03"
status: completed
created: "2026-08-21"
tags: [task, phase, orchestrators, subagents, workflows, adr, vault]
---

# Phase 3: Synchronize Orchestrators, Subagents, Workflows & ADR-0013

## Objective

Synchronize entry point contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `orchestrator/*`), subagent system prompts, workflow definitions, Obsidian vault docs, and create ADR-0013.

## Dependencies & Prerequisites

- Phase 1 and Phase 2 completed.

## Impacted Files & Components

- Root orchestrators: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `orchestrator/*`
- Subagents: `agents/ba-agent/*`, `agents/pm-agent/*`, `agents/devops-agent/*`
- Workflows: `workflows/*.md`
- Vault docs: `docs/Skills.md`, `docs/Workflows.md`, `docs/ARCHITECTURE.md`, `docs/guide/*`, `docs/decisions/README.md`
- New ADR: `docs/decisions/0013-streamline-procedural-skills-inventory.md`

## Implementation Tasks

- [x] Update `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, and `orchestrator/*`:
  - Update **Trigger & Skill Dispatch Matrix** to list only the 8 procedural skills.
  - Update **Session Slash Commands & Prefix Triggers** table.
- [x] Update Subagent prompts:
  - `agents/ba-agent/AGENT.md`, `system-prompt.md`, `subagent-invocation.md`: skills `[grill, grounding]`.
  - `agents/pm-agent/AGENT.md`, `system-prompt.md`, `subagent-invocation.md`: skills `[plan, execution, adr, verify]`.
  - `agents/devops-agent/AGENT.md`, `system-prompt.md`, `subagent-invocation.md`: skills `[security, verify]`.
- [x] Update Workflows:
  - `workflows/feature-delivery.md`: remove backticks for deleted skills (`backend-module`, `playground`); keep `grill`, `explore`, `plan`, `execution`.
  - `workflows/architecture-change.md`: keep `grill`, `explore`, `adr`, `plan`, `execution`.
  - `workflows/new-project-delivery.md`: keep `grill`, `plan`, `execution`.
- [x] Update Vault Docs:
  - `docs/Skills.md`: Update to list exactly the 8 procedural skills with their descriptions and slash commands.
  - `docs/Workflows.md`: Update slash trigger table and skill links.
  - `docs/ARCHITECTURE.md`: Register ADR-0013.
  - `docs/guide/skills.md`: Document the 8 procedural skills and explain the clear separation between rules and skills.
  - `docs/decisions/README.md`: Add ADR-0013.
- [x] Create ADR-0013:
  - `docs/decisions/0013-streamline-procedural-skills-inventory.md` (1-3-1 architectural decision standard).

## Verification & Testing

- Check all markdown links to ensure 0 broken links.
- Confirm consistent 8-skill inventory across all documentation.

## Risks & Rollback

- Zero broken links or missing anchors.
