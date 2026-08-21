---
title: "Phase 1: Prune 8 Rule-Duplicate Skills & Rename Grounding Skill"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0002-task-streamline-procedural-skills-inventory/README.md"
phase: "01"
status: completed
created: "2026-08-21"
tags: [task, phase, skills, prune, refactor]
---

# Phase 1: Prune 8 Rule-Duplicate Skills & Rename Grounding Skill

## Objective

Remove the 8 skills that duplicate declarative rules in `rules/`, and rename `skills/knowledge-grounding` to `skills/grounding` with frontmatter `name: grounding`.

## Dependencies & Prerequisites

- Master task plan approved.

## Impacted Files & Components

- Skills deleted:
  - `skills/playground/`
  - `skills/typescript/`
  - `skills/zod/`
  - `skills/database-query/`
  - `skills/component-craft/`
  - `skills/backend-module/`
  - `skills/api-contract/`
  - `skills/test-suite/`
- Skill renamed:
  - `skills/knowledge-grounding/` $\rightarrow$ `skills/grounding/`
- `skills/grounding/SKILL.md` (frontmatter `name: grounding`)

## Implementation Tasks

- [x] Delete `skills/playground/` directory and its contents.
- [x] Delete `skills/typescript/` directory and its contents.
- [x] Delete `skills/zod/` directory and its contents.
- [x] Delete `skills/database-query/` directory and its contents.
- [x] Delete `skills/component-craft/` directory and its contents.
- [x] Delete `skills/backend-module/` directory and its contents.
- [x] Delete `skills/api-contract/` directory and its contents.
- [x] Delete `skills/test-suite/` directory and its contents.
- [x] Rename `skills/knowledge-grounding/` to `skills/grounding/`.
- [x] Update `skills/grounding/SKILL.md` frontmatter to `name: grounding` and description (`/grounding`, `/wiki`, `[WIKI]`).

## Verification & Testing

- Run `ls skills/` and verify exactly 8 directories exist: `adr`, `execution`, `explore`, `grill`, `grounding`, `plan`, `security`, `verify`.

## Risks & Rollback

- All 8 procedural skills are in place with zero dangling files.
