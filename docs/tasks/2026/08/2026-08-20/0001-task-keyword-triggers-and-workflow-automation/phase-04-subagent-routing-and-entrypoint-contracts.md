---
title: "Phase 4 — Entrypoint Contracts and Subagent Dispatch Synchronization"
type: phase
parent: "0001-task-keyword-triggers-and-workflow-automation"
phase: "04"
status: completed
created: "2026-08-20"
tags: [task, phase, entrypoints, contracts, subagents]
---

# Phase 4 — Entrypoint Contracts and Subagent Dispatch Synchronization

## Objective

Synchronize all model adapter entrypoints (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*.md`) to document and enforce the unified prefix/slash command trigger taxonomy and map them explicitly to lifecycle subagent roles (`ba-agent`, `pm-agent`, `devops-agent`, and developer/reviewer skills).

## Dependencies & Prerequisites

- Phase 1, 2, and 3 completed.

## Impacted Files & Components

- `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`
- `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`
- `orchestrator/SHARED.md`, `orchestrator/{AGENTS,CLAUDE,CODEX,GEMINI}.md`
- `docs/guide/README.md`, `docs/guide/subagents-lifecycle.md`, `docs/guide/rules-and-workflows.md`

## Implementation Tasks

- [x] Task 1 — Add the Prefix & Slash Command Dispatch Table to `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`.
- [x] Task 2 — Update `.cursorrules`, `.windsurfrules`, and `.github/copilot-instructions.md` with identical trigger directives.
- [x] Task 3 — Update `orchestrator/SHARED.md` and adapters to align role transitions with prompt triggers.
- [x] Task 4 — Update user guide documentation under `docs/guide/` explaining session keyword workflow triggers.

## Verification & Testing

- `node scripts/validate-context.mjs` $\rightarrow$ verifies all orchestrators and adapters are synchronized with zero format violations.

## Risks & Rollback

- **Risk:** Inconsistency across different model adapter files.
- **Rollback:** Revert adapter files using git checkout.
