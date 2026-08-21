---
title: "Phase 3: Update Context Core Router, Manifest & Evals"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0001-task-skill-taxonomy-and-ergonomics-optimization/README.md"
phase: "03"
status: planned
created: "2026-08-21"
tags: [task, phase, manifest, harness, routing, evals]
---

# Phase 3: Update Context Core Router, Manifest & Evals

## Objective

Synchronize the harness routing engine, canonical manifest (`context-manifest.json`), evaluation test cases, and gold datasets to support the renamed skills, new developer skills, and clean slash commands.

## Dependencies & Prerequisites

- Phase 1 (Skill renames) and Phase 2 (New skills scaffolding) completed.

## Impacted Files & Components

- `context-manifest.json`
- `scripts/context-core.mjs`
- `evals/cases/`
- `evals/datasets/`

## Implementation Tasks

- [x] Update `context-manifest.json`:
  - Update `skills` array to list new paths (`skills/execution/SKILL.md`, `skills/plan/SKILL.md`, `skills/grill/SKILL.md`, `skills/adr/SKILL.md`, `skills/verify/SKILL.md`, `skills/security/SKILL.md`, `skills/typescript/SKILL.md`, `skills/zod/SKILL.md`, `skills/explore/SKILL.md`, `skills/api-contract/SKILL.md`, `skills/database-query/SKILL.md`, `skills/component-craft/SKILL.md`, `skills/test-suite/SKILL.md`).
  - Update `skillResources` paths to match renamed skill folders.
- [x] Update `scripts/context-core.mjs`:
  - Update `EXECUTION_PLAN_TEST` / `EXECUTION_TEST` regex to support `/execution`, `/exec`, `[EXEC]`, and legacy fallback.
  - Update `PREPLANNING_TEST` / `GRILL_TEST` to match `/grill`, `[GRILL]`, `/discovery`.
  - Update skill selection filters to match streamlined names (`execution`, `security`, `grill`, `plan`).
  - Update `ACTION_TERMS` and `ROUTING_HINTS` to support new slash triggers (`/execution`, `/plan`, `/verify`, `/adr`, `/tsc`, `/zod`, `/explore`, `/api-contract`, `/database-query`, `/component-craft`, `/test-suite`).
- [x] Update evaluation cases under `evals/cases/`:
  - Synchronize expected skill paths in `preplanning-new-system.json`, `slash-commands.json`, `security-change.json`, `defect-resolution.json`, `architecture-change.json`, and `frontend-styling.json`.
- [x] Update dataset files in `evals/datasets/` if affected.

## Verification & Testing

- Run `node scripts/context.mjs resolve "/execution task"` and verify `skills/execution/SKILL.md` resolves.
- Run `node scripts/context.mjs resolve "/plan feature"` and verify `skills/plan/SKILL.md` resolves.
- Run `node scripts/context.mjs resolve "/grill new idea"` and verify `skills/grill/SKILL.md` resolves.
- Run `node evals/run-evals.mjs` to confirm all eval cases pass.

## Risks & Rollback

- Ensure dual regex matching so older prompt patterns do not break.
