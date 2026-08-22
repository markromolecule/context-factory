---
title: "Phase 3: Synchronize Agent Entrypoints, Orchestrators, and Evaluation Cases"
type: phase
parent: "docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/README.md"
phase: "3"
status: completed
created: "2026-08-22"
tags: [task, phase, contracts, orchestrator, evaluations]
---

# Phase 3: Synchronize Agent Entrypoints, Orchestrators, and Evaluation Cases

## Objective

Update rule references and dispatch directives across all agent entrypoint contracts (root and `orchestrator/` mirrors) as well as evaluation dataset test fixtures so that AI agents and evaluation suites correctly map to the new rule paths.

## Dependencies & Prerequisites

- Phase 2 completed (`context-manifest.json` and `docs/Rules.md` synchronized).

## Impacted Files & Components

- Root agent contracts:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `CODEX.md`
  - `GEMINI.md`
  - `.cursorrules`
  - `.windsurfrules`
- Orchestrator contract mirrors:
  - `orchestrator/AGENTS.md`
  - `orchestrator/CLAUDE.md`
  - `orchestrator/CODEX.md`
  - `orchestrator/GEMINI.md`
- Workflows & Skills:
  - `workflows/new-project-delivery.md`
  - `workflows/code-review-and-optimization.md`
  - `skills/refactor/SKILL.md`
- Evaluations:
  - `evals/cases/frontend-styling.json` (updated `rules/ui/frontend.md` $\rightarrow$ `rules/typescript/ui/frontend.md`)

## Implementation Tasks

- [x] Update Mandatory Directives rule listing in `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`:
  - Global rules: `rules/global/` (`1-3-1-rule.md`, `code-quality.md`, `evidence-and-claims.md`, `security-guardrails.md`, `naming-conventions.md`, `architecture-conformance.md`, `git-commit.md`).
  - TypeScript rules: `rules/typescript/common/` (`type-safety.md`, `runtime-validation.md`, `error-handling.md`, `async-discipline.md`, `module-and-imports.md`).
  - Database rules: `rules/typescript/database/` (`schema-db.md`, `data-access-via-db.md`, `query-optimization-and-pagination.md`, `testing-data-access-layer.md`).
  - Backend rules: `rules/typescript/backend/` (`module-architecture.md`, `controllers-and-routes.md`, `service-layer.md`, `data-access-via-api.md`).
  - Hooks rules: `rules/typescript/hooks/` (`custom-hooks.md`, `query-hooks.md`, `mutation-hooks.md`, `zustand-store.md`).
  - UI rules: `rules/typescript/ui/` (`frontend.md`, `next-react-project-structure.md`, `code-organization.md`, `forms-and-validation.md`, `dialogs-and-overlays.md`, `interaction-feedback.md`).
  - Module architecture boundary directive: `rules/typescript/backend/module-architecture.md`.
- [x] Mirror all contract changes into `orchestrator/` files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`).
- [x] Update workflows and skills referencing rule paths (`new-project-delivery.md`, `code-review-and-optimization.md`, `refactor/SKILL.md`).
- [x] Update rule paths in `evals/cases/frontend-styling.json`.

## Verification & Testing

- Executed `node evals/run-evals.mjs`: **12/12 evaluations passed**.

## Risks & Rollback

- **Risk:** Inconsistency between root contracts and `orchestrator/` contracts.
- **Rollback:** Restore contract files via `git checkout`.

