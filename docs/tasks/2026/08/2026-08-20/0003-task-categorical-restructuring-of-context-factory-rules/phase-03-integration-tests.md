---
title: "Phase 3 — Verification, Lock Generation, and Quality Gate"
type: phase
parent: "0003-task-categorical-restructuring-of-context-factory-rules"
phase: "03"
status: completed
created: "2026-08-20"
tags: [task, phase, verification, lock, doctor]
---

# Phase 3 — Verification, Lock Generation, and Quality Gate

## Objective

Synchronize entrypoint contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`), update evaluation cases, regenerate `context-lock.json`, and verify with `scripts/harness-cli.mjs doctor`.

## Dependencies & Prerequisites

- Phase 2 completed with manifest and rule files aligned.

## Impacted Files & Components

- Entrypoint contracts: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`.
- `evals/cases/frontend-styling.json` & evaluation test fixtures [MODIFY]: Update referenced rule paths.
- `context-lock.json` [MODIFY]: Regenerate lock digest.
- `docs/tasks/2026/08/2026-08-20/0003-task-categorical-restructuring-of-context-factory-rules/README.md` [MODIFY]: Mark all phases completed, record verification evidence, and finalize task.

## Implementation Tasks

- [x] Task 3.1 — Update entrypoint contracts to reflect the 6 category paths (`rules/global/`, `rules/database/`, `rules/backend/`, `rules/typescript/`, `rules/hooks/`, `rules/ui/`).
- [x] Task 3.2 — Update any evaluation test cases referencing old rule paths (e.g. `evals/cases/frontend-styling.json` for `rules/ui/frontend.md`).
- [x] Task 3.3 — Regenerate `context-lock.json` via `node scripts/harness-cli.mjs lock`.
- [x] Task 3.4 — Run `node scripts/harness-cli.mjs lint` to ensure valid schemas and links.
- [x] Task 3.5 — Run `node scripts/harness-cli.mjs eval` to execute all evaluations.
- [x] Task 3.6 — Run `node scripts/harness-cli.mjs doctor` to verify complete health.
- [x] Task 3.7 — Mark all task phases completed and record verification evidence in parent README.

## Verification & Testing

- `node scripts/harness-cli.mjs lint` -> Exit 0: `Context Factory 3.5.0 is valid: 30 rules, 12 skills, 8 workflows, 11 agent resources, 1 knowledge items, 9 evaluations, 134 Markdown files.`
- `node scripts/harness-cli.mjs lock --check` -> Exit 0: `Context lock is current (sha256:3456edc534afa30eb255525dc64d1f572ba25c13cf1b06d4f687b0950a84c8da).`
- `node scripts/harness-cli.mjs eval` -> Exit 0: `12/12 evaluations passed in 47ms.`
- `node scripts/harness-cli.mjs doctor` -> Exit 0: `Context Factory is healthy.`

## Risks & Rollback

- Risk: Outdated paths in evaluation fixtures or contracts.
- Rollback: Revert via git.
