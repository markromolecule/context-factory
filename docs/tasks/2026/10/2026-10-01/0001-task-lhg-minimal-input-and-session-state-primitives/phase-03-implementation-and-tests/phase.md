---
title: "Phase 3: Skills, Contracts and Density Audit"
type: phase
parent: "0001-task-lhg-minimal-input-and-session-state-primitives"
phase: "03"
phase_branch: "task/0001/phase-03/integration"
status: completed
merge_commit: "0b4d6c4"
created: "2026-10-01"
tags: [task, phase, skills, rules, density, contract]
---

# Phase 3: Skills, Contracts and Density Audit

## Objective

Author `skills/productivity/session/SKILL.md` to establish ergonomic slash command shortcuts (`/session save`, `/session resume`, `/session status`, `/session clear`), update `orchestrator/SHARED.md` with session reset triggers at ~60% context saturation, and optimize core global rules for high instruction density.

## Dependencies & Prerequisites

- Phase 2 complete: CLI commands and budget fencing in place.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Session Productivity Skill & Shared Contract | `unit-01-session-skill-and-contract.md` | `task/0001/phase-03/unit-01-session-skill-and-contract` | `.worktrees/0001/phase-03/unit-01-session-skill-and-contract` | `02.01` | `03.02` | `merged` |
| **Unit 03.02** | LHG Minimal Input Rule Density Optimization | `unit-02-lhg-rule-density-optimization.md` | `task/0001/phase-03/unit-02-lhg-rule-density-optimization` | `.worktrees/0001/phase-03/unit-02-lhg-rule-density-optimization` | `02.02` | `03.01` | `merged` |

## Impacted Files & Components

- `skills/productivity/session/SKILL.md`: New productivity skill definition for session management.
- `orchestrator/SHARED.md`: Shared model-neutral contract updated with session lifecycle rules.
- `rules/global/evidence-and-claims.md`: Refactored for high-density directives without conversational filler.
- `rules/global/architecture-conformance.md`: Refactored for high-density constraint tables.

## Implementation Tasks

- [x] **Unit 03.01:** Author `skills/productivity/session/SKILL.md` and add session lifecycle guidance to `orchestrator/SHARED.md`.
- [x] **Unit 03.02:** Audit and refactor core rules to maximize information density and reduce token consumption by 30–50%.

## Verification & Testing

- Markdown lint: Verify frontmatter syntax, aliases, and trigger mappings.
- Contract review: Ensure `orchestrator/SHARED.md` preserves model-neutral execution constraints.

## Risks, Worktree Teardown & Rollback

- **Risk:** Unintended breakage of existing evaluation assertions relying on rule text phrasing.
- **Mitigation:** Run `evals/run-evals.mjs` against unit cases to ensure zero test regression.
- **Teardown:** Prune `.worktrees/0001/phase-03/*` and delete unit branches after integration merge.
