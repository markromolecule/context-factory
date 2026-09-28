---
title: "Phase 2 — Plan Review Skill"
type: phase
parent: "0001-task-unit-lifecycle-plan-review-test-and-review-skills"
phase: "02"
status: verified
created: "2026-09-28"
tags: [task, phase, skill, plan-review]
---

# Phase 2 — Plan Review Skill

## Objective

Author and catalog the `plan-review` skill (`skills/productivity/plan-review/SKILL.md`) and its OpenAI agent interface (`agents/openai.yaml`). The skill audits a freshly generated implementation plan in a cold-start session before execution begins, running the deterministic checker, auditing cold-start context packet executability, and ensuring complete AC-to-test mapping.

## Context & Prerequisites

- Requires Phase 1 (Deterministic Plan Checker) completed.
- Skill Group: Productivity (`skills/productivity/`).

## Unit Index & Dependency Graph

```mermaid
graph LR
    U01[Unit 02.01: Author plan-review Skill]
```

| Unit ID | Title | File | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Author `plan-review` Skill | `unit-01-plan-review-skill.md` | `Phase 1 (Unit 01.03)` | `Phase 3, Phase 4` | `verified` |

## Impacted Files & Components

- `skills/productivity/plan-review/SKILL.md` (New skill instructions)
- `skills/productivity/plan-review/agents/openai.yaml` (Agent interface)
- `skills/productivity/README.md` (Group index update)

## Rollback Strategy

Remove `skills/productivity/plan-review/` and revert index.
