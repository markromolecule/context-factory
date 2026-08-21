---
title: "Phase 1: Skill Renaming & Frontmatter Optimization"
type: phase
parent: "docs/tasks/2026/08/2026-08-21/0001-task-skill-taxonomy-and-ergonomics-optimization/README.md"
phase: "01"
status: planned
created: "2026-08-21"
tags: [task, phase, skills, renaming]
---

# Phase 1: Skill Renaming & Frontmatter Optimization

## Objective

Rename long/compound skill directories and update their `SKILL.md` frontmatter identifiers to crisp, single-word or short action names for optimal IDE slash-command autocompletion.

## Dependencies & Prerequisites

- Context specification approved in `docs/context/patch-skills/create-optimize-new-skills.md`.

## Impacted Files & Components

- `skills/execution-plan/` $\rightarrow$ `skills/execution/`
- `skills/implementation-plan/` $\rightarrow$ `skills/plan/`
- `skills/grill-with-docs/` $\rightarrow$ `skills/grill/`
- `skills/architecture-decision/` $\rightarrow$ `skills/adr/`
- `skills/verification-review/` $\rightarrow$ `skills/verify/`
- `skills/security-review/` $\rightarrow$ `skills/security/`
- `skills/typescript-diagnostics/` $\rightarrow$ `skills/typescript/`
- `skills/zod-schema-modeling/` $\rightarrow$ `skills/zod/`
- `skills/repository-discovery/` $\rightarrow$ `skills/explore/`

## Implementation Tasks

- [x] Rename `skills/execution-plan` to `skills/execution` and update frontmatter `name: execution`.
- [x] Rename `skills/implementation-plan` to `skills/plan` and update frontmatter `name: plan`.
- [x] Rename `skills/grill-with-docs` to `skills/grill` and update frontmatter `name: grill`.
- [x] Rename `skills/architecture-decision` to `skills/adr` and update frontmatter `name: adr`.
- [x] Rename `skills/verification-review` to `skills/verify` and update frontmatter `name: verify`.
- [x] Rename `skills/security-review` to `skills/security` and update frontmatter `name: security`.
- [x] Rename `skills/typescript-diagnostics` to `skills/typescript` and update frontmatter `name: typescript`.
- [x] Rename `skills/zod-schema-modeling` to `skills/zod` and update frontmatter `name: zod`.
- [x] Rename `skills/repository-discovery` to `skills/explore` and update frontmatter `name: explore`.
- [x] Update internal references, agent sidecars (`agents/openai.yaml`), and reference files within each renamed skill directory.

## Verification & Testing

- Inspect directory layout under `skills/` to confirm all target folders exist.
- Verify each `SKILL.md` frontmatter has exact `name` matching the folder.

## Risks & Rollback

- Moving directories changes paths in `context-manifest.json`. Handled in Phase 3 prior to lock regeneration.
