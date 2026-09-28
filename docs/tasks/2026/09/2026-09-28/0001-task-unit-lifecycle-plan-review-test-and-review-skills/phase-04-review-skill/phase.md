---
title: "Phase 4 — Unit Diff Review Skill"
type: phase
parent: "0001-task-unit-lifecycle-plan-review-test-and-review-skills"
phase: "04"
status: verified
created: "2026-09-28"
tags: [task, phase, skill, review, diff, scope-fence]
---

# Phase 4 — Unit Diff Review Skill

## Objective

Author and catalog the `review` skill (`skills/engineering/review/SKILL.md`) and its OpenAI agent interface (`agents/openai.yaml`). The skill performs independent white-box diff review within a unit's active git worktree, verifying that no out-of-scope files were edited, all declared tests were written and pass, SOLID principles are preserved on new code, and Definition of Done criteria are fulfilled before developer review checkpoints.

## Context & Prerequisites

- Can run in parallel with Phases 1, 2, and 3.
- Decision: [[docs/decisions/0024-unit-execution-review-and-testing-skills|ADR 0024]] (Dedicated `review` skill).
- Skill Group: Engineering (`skills/engineering/`).

## Unit Index & Dependency Graph

```mermaid
graph LR
    U01[Unit 04.01: Author review Skill]
```

| Unit ID | Title | File | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 04.01** | Author `review` Skill | `unit-01-review-skill.md` | `none` | `Phase 1, Phase 2, Phase 3` | `verified` |

## Impacted Files & Components

- `skills/engineering/review/SKILL.md` (New skill instructions)
- `skills/engineering/review/agents/openai.yaml` (Agent interface)
- `skills/engineering/README.md` (Group index update)

## Rollback Strategy

Remove `skills/engineering/review/` and revert index.
