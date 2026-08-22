---
title: "Phase 4 — Orchestrators, Subagents, Documentation Maps, and Manifest"
type: phase
parent: "0001-task-execution-control-and-modular-refactoring"
phase: "04"
status: completed
created: "2026-08-22"
tags: [task, phase, orchestrator, subagents, manifest, adr]
---

# Phase 4 — Orchestrators, Subagents, Documentation Maps, and Manifest

## Objective

Synchronize all orchestrator entry points, model adapters, subagent declarations, harness routing scripts, documentation maps, decision records, and `context-manifest.json` with the updated `execute` skill, `refactor` skill, and `code-review-and-optimization` workflow.

## Dependencies & Prerequisites

- Phases 1, 2, and 3 completed.

## Impacted Files & Components

- `orchestrator/SHARED.md`
- `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`
- `orchestrator/AGENTS.md`, `orchestrator/GEMINI.md`, `orchestrator/CLAUDE.md`, `orchestrator/CODEX.md`
- `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`
- `agents/pm-agent/AGENT.md`, `agents/ba-agent/AGENT.md`
- `scripts/context-core.mjs`
- `docs/Skills.md`, `docs/guide/skills.md`, `docs/Workflows.md`
- `docs/decisions/0015-execute-skill-strict-phase-stops-and-modular-refactoring.md`, `docs/decisions/README.md`
- `context-manifest.json`

## Implementation Tasks

- [x] Task 4.1 — Update `orchestrator/SHARED.md` to reference `skills/execute` and `skills/refactor`.
- [x] Task 4.2 — Update Trigger & Dispatch Matrices and Session Slash Commands across all orchestrator files (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*`).
- [x] Task 4.3 — Update `agents/pm-agent/AGENT.md` and `agents/ba-agent/AGENT.md` skill links.
- [x] Task 4.4 — Update harness routing in `scripts/context-core.mjs` to route `/execute`, `/optimize`, and `/refactor`.
- [x] Task 4.5 — Update `docs/Skills.md`, `docs/guide/skills.md`, and `docs/Workflows.md` reflecting the 10-skill procedural taxonomy.
- [x] Task 4.6 — Create ADR `docs/decisions/0015-execute-skill-strict-phase-stops-and-modular-refactoring.md` and link in `docs/decisions/README.md`.
- [x] Task 4.7 — Update `context-manifest.json` inventory with new files and updated skill paths.

## Verification & Testing

- Run `node scripts/context.mjs lint` to verify manifest and documentation links.

## Risks & Rollback

- Ensure all legacy aliases (`/execution`, `/exec`) continue to route correctly to `skills/execute/SKILL.md`.
