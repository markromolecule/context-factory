---
title: "Phase 4 — Verification, Quality Gates, and Release"
type: phase
parent: "0002-task-data-layer-optimization-and-system-performance-arc"
phase: "04"
status: completed
created: "2026-08-20"
tags: [task, phase, verification, lock, doctor]
---

# Phase 4 — Verification, Quality Gates, and Release

## Objective

Lock the updated context inventory, execute the full context factory quality harness (`doctor`, `lint`, `eval`), update entry contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, etc.), and mark the task as complete.

## Dependencies & Prerequisites

- Phase 3 completed with manifest registered and evals aligned.

## Impacted Files & Components

- `context-lock.json` [MODIFY]: Regenerated cryptographic digest and inventory lock.
- `AGENTS.md` & `GEMINI.md` [MODIFY]: Add new rules to the mandatory directives and trigger matrices if applicable.
- `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules` [MODIFY]: Synchronize updated rule references.
- `docs/tasks/2026/08/2026-08-20/0002-task-data-layer-optimization-and-system-performance-arc/README.md` [MODIFY]: Mark all phases completed, record verification evidence, and finalize task.

## Implementation Tasks

- [x] Task 4.1 — Update entry point contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`) to include `rules/backend/query-optimization-and-pagination.md` and `rules/frontend/custom-hooks.md`.
- [x] Task 4.2 — Run `node scripts/harness-cli.mjs lock` to regenerate `context-lock.json`.
- [x] Task 4.3 — Run `node scripts/harness-cli.mjs lint` to validate context rules and schemas.
- [x] Task 4.4 — Run `node scripts/harness-cli.mjs eval` to execute all unit and dataset evaluations.
- [x] Task 4.5 — Run `node scripts/harness-cli.mjs doctor` to verify end-to-end repository health.
- [x] Task 4.6 — Record verification command evidence in the task artifact and mark status `completed`.

## Verification & Testing

- `node scripts/harness-cli.mjs lint` -> Exit 0: `Context Factory 3.5.0 is valid: 30 rules, 12 skills, 8 workflows, 11 agent resources, 1 knowledge items, 9 evaluations, 130 Markdown files.`
- `node scripts/harness-cli.mjs lock --check` -> Exit 0: `Context lock is current (sha256:d20ec23f1eb118abacdf7156d9d0969ae45decbf5a7467aa0cbadd951dda33d3).`
- `node scripts/harness-cli.mjs eval` -> Exit 0: `12/12 evaluations passed in 44ms.`
- `node scripts/harness-cli.mjs doctor` -> Exit 0: `Context Factory is healthy.`

## Risks & Rollback

- Risk: Lock mismatch or eval failure.
- Rollback: Regenerate lock and fix failing eval assertions before commit.
