---
title: "Phase 2 — Code Health Engineering Skills (perf, types)"
type: phase
parent: "0003"
phase: "02"
phase_branch: "task/0003/phase-02-integration"
status: planned
created: "2026-10-05"
tags: [task, phase, skills, perf, types, typescript, performance]
---

# Phase 2 — Code Health Engineering Skills (`perf`, `types`)

## Objective

Author two dedicated first-class engineering skills under `skills/engineering/`: **`perf`** (runtime profiling, ORM N+1 query elimination, ESR composite indexing, async waterfalls, and memory/bundle audits) and **`types`** (static type hardening, eliminating `any` and loose casts, discriminated unions, `assertNever` exhaustiveness, and branded types).

## Dependencies & Prerequisites

- Phase 1 integration merged into `task/0003-cli-ux-and-code-health-skills`.
- ADR 0020 and ADR 0028 accepted.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | `perf` Performance Optimization Skill | `unit-01-perf-engineering-skill.md` | `task/0003/phase-02/perf-skill` | `.worktrees/0003/phase-02/perf-skill` | `none` | `Unit 02.02` | `planned` |
| **Unit 02.02** | `types` Static Type Hardening Skill | `unit-02-types-engineering-skill.md` | `task/0003/phase-02/types-skill` | `.worktrees/0003/phase-02/types-skill` | `none` | `Unit 02.01` | `planned` |

## Impacted Files & Components

- `skills/engineering/perf/SKILL.md`: New procedural skill for runtime performance profiling and query optimization.
- `skills/engineering/types/SKILL.md`: New procedural skill for static typing hardening and slop elimination.

## Implementation Tasks

- [ ] Unit 02.01 — Author `skills/engineering/perf/SKILL.md` with complete procedures, rules anchors, and test justifications.
- [ ] Unit 02.02 — Author `skills/engineering/types/SKILL.md` with complete procedures, type guard patterns, and test justifications.

## Verification & Testing

- Validate markdown syntax and frontmatter schemas on both new skills.
- Verify both skills adhere to Context Factory skill schema (`name`, `description`).
- Verify parallelizable units touch strictly disjoint file paths.

## Risks, Worktree Teardown & Rollback

- Risk: Overlapping concepts between `refactor` and `types`/`perf`.
  - Mitigation: Explicit scope delineation: `types` focuses strictly on type contracts and compiler guarantees; `perf` focuses strictly on runtime bottlenecks and I/O efficiency; `refactor` focuses on architecture and SOLID decomposition.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
