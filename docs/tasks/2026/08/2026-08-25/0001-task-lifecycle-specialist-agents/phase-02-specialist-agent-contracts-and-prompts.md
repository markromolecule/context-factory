---
title: "Phase 2: Specialist Agent Contracts & Prompts"
type: phase
parent: "[[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/README|Task: Lifecycle Specialist Agents & Declarative Architecture]]"
phase: "02"
status: completed
created: "2026-08-25"
tags: [task, phase, agents, architect, data, ux, threat, prompts]
---

# Phase 2: Specialist Agent Contracts & Prompts

## Objective

Author four complete, modular **Lifecycle Specialist Agent** directories (`agents/architect-agent/`, `agents/data-agent/`, `agents/ux-agent/`, and `agents/threat-agent/`), each containing a canonical `AGENT.md` contract, standardized `prompts/subagent-invocation.md`, and an IDE-portable `prompts/system-prompt.md`.

## Dependencies & Prerequisites

- Phase 1 completed: Declarative agent schema, harness resolver, and validation logic active.

## Impacted Files & Components

- `agents/architect-agent/AGENT.md` — [NEW] Architect & ADR Specialist specification.
- `agents/architect-agent/prompts/subagent-invocation.md` — [NEW] Invocation prompts for Antigravity IDE, Cursor, Claude Code.
- `agents/architect-agent/prompts/system-prompt.md` — [NEW] Portable system prompt.
- `agents/data-agent/AGENT.md` — [NEW] Data Modeler & Database Architect specification.
- `agents/data-agent/prompts/subagent-invocation.md` — [NEW] Invocation prompts.
- `agents/data-agent/prompts/system-prompt.md` — [NEW] Portable system prompt.
- `agents/ux-agent/AGENT.md` — [NEW] UX & Design System Engineer specification.
- `agents/ux-agent/prompts/subagent-invocation.md` — [NEW] Invocation prompts.
- `agents/ux-agent/prompts/system-prompt.md` — [NEW] Portable system prompt.
- `agents/threat-agent/AGENT.md` — [NEW] Security & Threat Modeling Specialist specification.
- `agents/threat-agent/prompts/subagent-invocation.md` — [NEW] Invocation prompts.
- `agents/threat-agent/prompts/system-prompt.md` — [NEW] Portable system prompt.

## Implementation Tasks

- [x] Task 2.1: Author `agents/architect-agent/AGENT.md` with:
  - Role: Software Architect & Technical Lead.
  - Aliases: `["/architect", "[ARCHITECT]"]`.
  - Default workflow: `architecture-change`.
  - Workflows: `[architecture-change, feature-delivery, context-maintenance]`.
  - Skills: `[adr, plan, verify, grounding]`.
  - Rules: global architecture, code-quality, evidence, naming, security guardrails, SOLID rules, module-architecture.
  - Handoffs: upstream `[ba-agent]`, downstream `[pm-agent, devops-agent]`.
  - Operating procedure, safety boundaries, and anti-patterns.
- [x] Task 2.2: Author `agents/architect-agent/prompts/subagent-invocation.md` and `prompts/system-prompt.md`.
- [x] Task 2.3: Author `agents/data-agent/AGENT.md` with:
  - Role: Data Modeler & Database Architect.
  - Aliases: `["/data", "[DATA]"]`.
  - Default workflow: `database-migration`.
  - Workflows: `[database-migration, feature-delivery, security-sensitive-change]`.
  - Skills: `[verify, grounding, plan]`.
  - Rules: global rules, database rules (schema-db, data-access-via-db, query-optimization, testing-data-access), service-layer, data-access-via-api.
  - Handoffs: upstream `[ba-agent, architect-agent]`, downstream `[pm-agent, devops-agent]`.
  - Operating procedure, safety boundaries (migration/rollback rules), and anti-patterns.
- [x] Task 2.4: Author `agents/data-agent/prompts/subagent-invocation.md` and `prompts/system-prompt.md`.
- [x] Task 2.5: Author `agents/ux-agent/AGENT.md` with:
  - Role: UX & Design System Engineer.
  - Aliases: `["/ux", "[UX]"]`.
  - Default workflow: `feature-delivery`.
  - Workflows: `[feature-delivery, code-review-and-optimization]`.
  - Skills: `[grounding, verify, refactor]`.
  - Rules: global rules, UI rules (frontend, code-organization, forms-and-validation, dialogs-and-overlays, interaction-feedback), hook rules (custom-hooks, zustand-store, query-hooks, mutation-hooks).
  - Handoffs: upstream `[ba-agent]`, downstream `[pm-agent, devops-agent]`.
  - Operating procedure, accessibility gates, micro-animation discipline, and anti-patterns.
- [x] Task 2.6: Author `agents/ux-agent/prompts/subagent-invocation.md` and `prompts/system-prompt.md`.
- [x] Task 2.7: Author `agents/threat-agent/AGENT.md` with:
  - Role: Security & Threat Modeling Specialist.
  - Aliases: `["/threat", "[THREAT]"]`.
  - Default workflow: `security-sensitive-change`.
  - Workflows: `[security-sensitive-change, feature-delivery, database-migration, release-readiness]`.
  - Skills: `[security, verify]`.
  - Rules: `rules/global/security-guardrails.md`, `rules/global/evidence-and-claims.md`, `rules/global/architecture-conformance.md`.
  - Handoffs: upstream `[ba-agent, architect-agent]`, downstream `[pm-agent, devops-agent]`.
  - Operating procedure, threat modeling lifecycle, secrets hygiene, and anti-patterns.
- [x] Task 2.8: Author `agents/threat-agent/prompts/subagent-invocation.md` and `prompts/system-prompt.md`.

## Verification & Testing

- Inspected all 12 generated files for formatting and valid YAML frontmatter.
- Tested context resolution on all 4 new agent aliases and bracket prefixes:
  - `/architect` -> `architect-agent`, `workflows/architecture-change.md`, 23 rules, 5 skills.
  - `/data` -> `data-agent`, `workflows/database-migration.md`, 24 rules, 3 skills.
  - `/ux` -> `ux-agent`, `workflows/feature-delivery.md`, 32 rules, 5 skills.
  - `/threat` -> `threat-agent`, `workflows/security-sensitive-change.md`, 23 rules, 2 skills.
- `node scripts/context.mjs eval` -> 13/13 evaluations passed in 53ms.

## Risks & Rollback

- **Risk:** Rule or skill misconfiguration in agent frontmatters.
- **Mitigation:** Frontmatter and reference resolution verified across all 4 agents.
- **Rollback:** Remove new agent directories.
