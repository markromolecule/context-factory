---
title: "Phase 3 — Cross-Skill Integration, Sync, & Release"
type: phase
parent: "0003"
phase: "03"
phase_branch: "task/0003/phase-03-integration"
status: planned
created: "2026-10-05"
tags: [task, phase, integration, review, refactor, sync, doctor, release]
---

# Phase 3 — Cross-Skill Integration, Sync, & Release

## Objective

Wire the new `perf` and `types` skills into `/review` (Gate 3 SOLID Audit and Gate 4 Language Rules Conformance) and `/refactor` as active remediation targets for LLM code slop, update the skills group catalog in `skills/engineering/README.md` and `skills/README.md`, run full repository synchronization via `npm run sync`, and verify Context Factory diagnostic health with `npm run doctor`.

## Dependencies & Prerequisites

- Phase 2 integration merged into `task/0003-cli-ux-and-code-health-skills`.
- `perf` and `types` skills authored and validated.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Review & Refactor Remediation Wiring | `unit-01-review-and-refactor-remediation-wiring.md` | `task/0003/phase-03/remediation-wiring` | `.worktrees/0003/phase-03/remediation-wiring` | `none` | `none` | `planned` |
| **Unit 03.02** | Skills Catalog Sync & Doctor Verification | `unit-02-skills-catalog-sync-and-doctor-verification.md` | `task/0003/phase-03/sync-and-doctor` | `.worktrees/0003/phase-03/sync-and-doctor` | `Unit 03.01` | `none` | `planned` |

## Impacted Files & Components

- `skills/engineering/review/SKILL.md`: Update Gates 3 & 4 to explicitly route type slop to `/types` and runtime/query bottlenecks to `/perf`.
- `skills/engineering/refactor/SKILL.md`: Cross-reference `/perf` and `/types` as specialized refactoring procedures.
- `skills/engineering/README.md`: Index `perf` and `types` per ADR 0020 invariants.
- `skills/README.md`: Update skills catalog.
- `context-manifest.json`, `context-lock.json`, Obsidian MOCs: Synchronized via `npm run sync`.

## Implementation Tasks

- [ ] Unit 03.01 — Update `skills/engineering/review/SKILL.md` and `skills/engineering/refactor/SKILL.md` with explicit remediation routing.
- [ ] Unit 03.02 — Update skill READMEs, run `npm run sync`, execute `npm run doctor`, and verify clean diagnostic health.

## Verification & Testing

- `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0003-task-cli-ux-and-code-health-skills`
- `npm run sync`
- `npm run doctor`

## Risks, Worktree Teardown & Rollback

- Risk: Drift between skills inventory and `context-manifest.json`.
  - Mitigation: `npm run sync` regenerates lockfile, manifest, and Obsidian MOCs, verified by `doctor`.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
