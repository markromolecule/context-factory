---
title: "Phase 3: Orchestrators, Guides, Maps & ADR"
type: phase
parent: "[[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/README|Task: Lifecycle Specialist Agents & Declarative Architecture]]"
phase: "03"
status: completed
created: "2026-08-25"
tags: [task, phase, orchestrator, adr, documentation, guides]
---

# Phase 3: Orchestrators, Guides, Maps & ADR

## Objective

Synchronize all orchestration entrypoints and model adapters with the new specialist agent dispatch commands and roles, update the agent registry, maps of content, and user guides, and author Architectural Decision Record 0016 (`docs/decisions/0016-declarative-lifecycle-specialist-agents.md`).

## Dependencies & Prerequisites

- Phase 2 completed: All 7 agent contracts and prompt files are in place and validated.

## Impacted Files & Components

- `orchestrator/SHARED.md` — [MODIFY] Update `## Roles & Subagents` section to document the full 7-agent lifecycle.
- `AGENTS.md` & `GEMINI.md` — [MODIFY] Update Trigger & Skill Dispatch Matrix and Session Slash Commands with `/architect`, `/data`, `/ux`, `/threat`.
- `CLAUDE.md`, `CODEX.md` — [MODIFY] Update session triggers and subagents.
- `.cursorrules`, `.github/copilot-instructions.md`, `.windsurfrules` — [MODIFY] Synchronize agent commands and roles.
- `orchestrator/AGENTS.md`, `orchestrator/CLAUDE.md`, `orchestrator/CODEX.md`, `orchestrator/GEMINI.md` — [MODIFY] Synchronize entrypoint adapters.
- `agents/README.md` — [MODIFY] Update lifecycle mermaid diagram, subagents registry table, and trigger matrix.
- `docs/Agents.md` — [MODIFY] Add wiki links to all 4 new specialist agent contracts.
- `docs/guide/subagents-lifecycle.md` — [MODIFY] Expand guide with detailed sections, workflows, and prompts for the 4 specialist roles.
- `docs/decisions/0016-declarative-lifecycle-specialist-agents.md` — [NEW] Record the declarative lifecycle specialist agents architecture.
- `docs/decisions/README.md` — [MODIFY] Add ADR 0016 to decision ledger.

## Implementation Tasks

- [x] Task 3.1: Update `orchestrator/SHARED.md` under `## Roles & Subagents` detailing all 7 agents: BA Agent, Architect / ADR, Data Modeler, PM Agent, UX / Design System, Developer / QA, Threat / Security, DevOps Agent.
- [x] Task 3.2: Update root entrypoints `AGENTS.md` and `GEMINI.md` (and corresponding orchestrator files) adding `/architect`, `/data`, `/ux`, `/threat` to Session Slash Commands & Prefix Triggers.
- [x] Task 3.3: Update IDE adapters (`.cursorrules`, `.github/copilot-instructions.md`, `.windsurfrules`, `CLAUDE.md`, `CODEX.md`, `orchestrator/*.md`).
- [x] Task 3.4: Update `agents/README.md` with:
  - Extended Mermaid lifecycle architecture showing discovery, architecture, data modeling, planning, UX/UI, implementation, threat modeling, and deployment.
  - Complete 7-agent table with paths, capabilities, and primary skills.
  - Subagent dispatch & trigger matrix including `/architect`, `/data`, `/ux`, `/threat`.
- [x] Task 3.5: Update `docs/Agents.md` linking `agents/architect-agent/AGENT.md`, `agents/data-agent/AGENT.md`, `agents/ux-agent/AGENT.md`, `agents/threat-agent/AGENT.md`.
- [x] Task 3.6: Update `docs/guide/subagents-lifecycle.md` with deep-dive sections for each specialist role, IDE-specific usage examples, and end-to-end multi-agent orchestration flows.
- [x] Task 3.7: Author `docs/decisions/0016-declarative-lifecycle-specialist-agents.md` capturing context, options considered, decisions (D-01 through D-06), consequences, and validation dates.
- [x] Task 3.8: Register ADR 0016 in `docs/decisions/README.md`.

## Verification & Testing

- Verified all wiki links across markdown files.
- Verified consistency between `orchestrator/SHARED.md`, `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.windsurfrules`, `agents/README.md`, `docs/Agents.md`, and `docs/guide/subagents-lifecycle.md`.
- `node scripts/context.mjs eval` (13/13 evaluations passed in 68ms).

## Risks & Rollback

- **Risk:** Markdown link breakage in Obsidian vault.
- **Mitigation:** Run `validate-context.mjs` link scanner to verify all wiki references.
- **Rollback:** Revert documentation changes.
