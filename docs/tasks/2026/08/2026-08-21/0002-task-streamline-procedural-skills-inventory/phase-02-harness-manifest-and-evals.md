---
title: "Phase 2: Update Manifest, Context Router & Evals Suite"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0002-task-streamline-procedural-skills-inventory/README.md"
phase: "02"
status: completed
created: "2026-08-21"
tags: [task, phase, manifest, harness, evals]
---

# Phase 2: Update Manifest, Context Router & Evals Suite

## Objective

Synchronize `context-manifest.json`, update `scripts/context-core.mjs` routing hints and regexes, and update the evaluation suite in `evals/cases/` and `evals/datasets/` to reflect the 8 pure procedural skills.

## Dependencies & Prerequisites

- Phase 1 completed.

## Impacted Files & Components

- `context-manifest.json`
- `scripts/context-core.mjs`
- `evals/cases/frontend-styling.json`
- `evals/cases/knowledge-grounding.json`
- `evals/cases/architecture-change.json`
- `evals/datasets/refactors/architecture-change.json`
- `evals/datasets/features/feature-delivery.json`

## Implementation Tasks

- [x] Update `context-manifest.json`:
  - Prune deleted skills from `skills` array.
  - Retain exactly 8 skills: `skills/adr/SKILL.md`, `skills/execution/SKILL.md`, `skills/explore/SKILL.md`, `skills/grill/SKILL.md`, `skills/grounding/SKILL.md`, `skills/plan/SKILL.md`, `skills/security/SKILL.md`, `skills/verify/SKILL.md`.
  - Update `skillResources` array.
  - Register ADR-0013 in `decisions` array.
- [x] Update `scripts/context-core.mjs`:
  - Clean up `ROUTING_HINTS`, `ACTION_TERMS`, and regex routers.
  - Add `/grounding` to routing hints and update aliases (`wiki` $\rightarrow$ `grounding`).
- [x] Update `evals/cases/` and `evals/datasets/`:
  - `evals/cases/frontend-styling.json`: Verify that frontend styling requests resolve `rules/ui/frontend.md` and appropriate global rules.
  - `evals/cases/knowledge-grounding.json`: Update expected skill to `skills/grounding/SKILL.md`.
  - `evals/cases/architecture-change.json` and `evals/datasets/refactors/architecture-change.json`: Remove deleted `backend-module` skill expectation.
- [x] Execute `node evals/run-evals.mjs` to ensure 100% test pass rate.

## Verification & Testing

- `node evals/run-evals.mjs` reports all 12/12 test cases passing.

## Risks & Rollback

- All manifests, routing terms, and evaluation assertions match the 8-skill inventory.
