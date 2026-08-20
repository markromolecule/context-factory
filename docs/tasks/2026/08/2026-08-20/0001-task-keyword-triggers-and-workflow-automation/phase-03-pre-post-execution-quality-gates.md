---
title: "Phase 3 — Pre/Post Execution Verification Hooks & ADR-0009"
type: phase
parent: "0001-task-keyword-triggers-and-workflow-automation"
phase: "03"
status: completed
created: "2026-08-20"
tags: [task, phase, hooks, adr, quality-gates]
---

# Phase 3 — Pre/Post Execution Verification Hooks & ADR-0009

## Objective

Formalize the architectural decision in `docs/decisions/0009-session-keyword-triggers-and-workflow-automation.md` and implement automated pre/post-execution quality hooks in the orchestrator and CLI runner to automatically capture pre-flight defect reproductions, run post-execution test gates, and validate claims against `schemas/claim-evidence.schema.json`.

## Dependencies & Prerequisites

- Phase 1 & 2 completed.
- Existing `orchestrator/runner.mjs` and `orchestrator/validator.mjs`.

## Impacted Files & Components

- `docs/decisions/0009-session-keyword-triggers-and-workflow-automation.md` (NEW) — Architectural decision record.
- `orchestrator/runner.mjs` — Add pre/post execution lifecycle hooks for test runs and evidence gathering.
- `scripts/harness-cli.mjs` — Expose hook execution and claim validation helper commands.

## Implementation Tasks

- [x] Task 1 — Draft `docs/decisions/0009-session-keyword-triggers-and-workflow-automation.md` following `docs/templates/Decision.md`.
- [x] Task 2 — Implement automated pre-flight hook (e.g. executing test command before defect fix execution).
- [x] Task 3 — Implement automated post-flight hook (executing `npm test`, `tsc --noEmit`, and `validateSchema` against `claim-evidence.schema.json`).
- [x] Task 4 — Add git pre-commit hook example / instruction in docs for automatic `lock` and `doctor` validation.

## Verification & Testing

- `node scripts/harness-cli.mjs validate evals/cases/defect-resolution.json --schema run-result` $\rightarrow$ verifies output passes schema.
- Verify that ADR-0009 complies with Decision template and Obsidian links.

## Risks & Rollback

- **Risk:** Quality hooks failing on environments missing specific test runners.
- **Rollback:** Make pre/post execution hooks soft-warn when test runners are not configured.
