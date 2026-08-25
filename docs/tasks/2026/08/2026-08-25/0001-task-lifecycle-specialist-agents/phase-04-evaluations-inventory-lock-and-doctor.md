---
title: "Phase 4: Evaluations, Inventory, Lock & Doctor Verification"
type: phase
parent: "[[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/README|Task: Lifecycle Specialist Agents & Declarative Architecture]]"
phase: "04"
status: completed
created: "2026-08-25"
tags: [task, phase, evaluations, manifest, lock, doctor]
---

# Phase 4: Evaluations, Inventory, Lock & Doctor Verification

## Objective

Add dedicated evaluation cases for specialist agent slash commands, update `context-manifest.json` with all new agent files and ADR 0016, bump `contextVersion` if appropriate (or synchronize manifest inventory), regenerate `context-lock.json`, and run the comprehensive evaluation and doctor test suite (`node scripts/context.mjs doctor`) to verify 100% health with zero failures or drift.

## Dependencies & Prerequisites

- Phases 1, 2, and 3 completed.

## Impacted Files & Components

- `evals/cases/agent-architect.json` — [NEW] Evaluation case for `/architect` resolution.
- `evals/cases/agent-data.json` — [NEW] Evaluation case for `/data` resolution.
- `evals/cases/agent-ux.json` — [NEW] Evaluation case for `/ux` resolution.
- `evals/cases/agent-threat.json` — [NEW] Evaluation case for `/threat` resolution.
- `context-manifest.json` — [MODIFY] Register all new agent files, ADR 0016, evaluation cases, and version 3.9.0.
- `context-lock.json` — [MODIFY] Regenerate cryptographic SHA-256 lockfile.

## Implementation Tasks

- [x] Task 4.1: Author dedicated evaluation cases in `evals/cases/`:
  - `evals/cases/agent-architect.json` (`/architect` -> `architect-agent`, `workflows/architecture-change.md`, SOLID rules, ADR skill).
  - `evals/cases/agent-data.json` (`/data` -> `data-agent`, `workflows/database-migration.md`, database rules).
  - `evals/cases/agent-ux.json` (`/ux` -> `ux-agent`, `workflows/feature-delivery.md`, UI & custom hooks rules).
  - `evals/cases/agent-threat.json` (`/threat` -> `threat-agent`, `workflows/security-sensitive-change.md`, security rules & skill).
- [x] Task 4.2: Update `context-manifest.json`:
  - Registered all 12 new agent files (total 23 agent resources).
  - Registered `docs/decisions/0016-declarative-lifecycle-specialist-agents.md`.
  - Registered new evaluation case files.
  - Bumped version to `3.9.0`.
- [x] Task 4.3: Run `node scripts/context.mjs lint` to verify manifest inventory and frontmatter rules.
- [x] Task 4.4: Run `node scripts/context.mjs lock` to generate fresh `context-lock.json`.
- [x] Task 4.5: Run `node scripts/context.mjs eval` to execute all unit and dataset evaluations.
- [x] Task 4.6: Run `node scripts/context.mjs doctor` and ensure 100% passing state.

## Verification & Testing

- `node scripts/context.mjs lint` -> 0 errors: `Context Factory 3.9.0 is valid: 35 rules, 10 skills, 10 workflows, 23 agent resources, 6 knowledge items, 14 evaluations, 209 Markdown files.`
- `node scripts/context.mjs eval` -> `Summary: 17/17 evaluations passed in 63ms.`
- `node scripts/context.mjs lock --check` -> `Context lock is current (sha256:4fa4966b1514be123bcae66dde0668ab6c33a916d704f10b3b48ebd5ebe4ab92).`
- `node scripts/context.mjs doctor` -> `Context Factory is healthy.`

## Risks & Rollback

- **Risk:** Stale lock digest or failed evaluation assertion.
- **Mitigation:** Run `node scripts/context.mjs lock` and `node scripts/context.mjs doctor` after all edits.
- **Rollback:** Revert manifest and lockfile changes.
