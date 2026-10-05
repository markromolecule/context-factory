---
title: "Phase 3 — Downstream Execution & Review Skills (execute, review)"
type: phase
parent: "0002"
phase: "03"
phase_branch: "task/0002/phase-03"
status: planned
created: "2026-10-05"
tags: [task, phase, skills, execution, review]
---

# Phase 3 — Downstream Execution & Review Skills (execute, review)

## Objective

Equip `skills/engineering/execute/SKILL.md` and `skills/engineering/review/SKILL.md` with explicit point-of-generation rule anchors, strict conflict precedence enforcement, and an independent diff review gate verifying that the executed code adheres to the unit's declared language rules prior to developer checkpoints.

## Dependencies & Prerequisites

- Phase 2 integration merged into `task/0002-language-rule-lifecycle-binding`.
- Upstream planning skills updated.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Execute Skill Generation Anchor & Precedence | `unit-01-execute-skill-generation-anchor.md` | `task/0002/phase-03/execute-skill-anchor` | `.worktrees/0002/phase-03/execute-skill-anchor` | `none` | `Unit 03.02` | `planned` |
| **Unit 03.02** | Review Skill Conformance Gate | `unit-02-review-skill-conformance-gate.md` | `task/0002/phase-03/review-skill-conformance-gate` | `.worktrees/0002/phase-03/review-skill-conformance-gate` | `none` | `Unit 03.01` | `planned` |

## Impacted Files & Components

- `skills/engineering/execute/SKILL.md`: Enforce re-anchoring on `<language_rules>` directly before generation and apply strict conflict precedence.
- `skills/engineering/review/SKILL.md`: Introduce Gate 4: Language Rules Conformance Audit.

## Implementation Tasks

- [ ] Unit 03.01 — Update `skills/engineering/execute/SKILL.md` with generation anchoring and rule precedence directives.
- [ ] Unit 03.02 — Update `skills/engineering/review/SKILL.md` with Gate 4 Language Rules Conformance Audit.

## Verification & Testing

- Validate markdown syntax and frontmatter.
- Run `npm run lint`.

## Risks, Worktree Teardown & Rollback

- Reversible skill markdown updates.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force` and prune metadata.
