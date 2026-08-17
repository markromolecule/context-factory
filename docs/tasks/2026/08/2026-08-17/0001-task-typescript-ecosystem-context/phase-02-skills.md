---
title: "Phase 2: Define TypeScript Skills and Agent Interfaces"
type: phase
parent: TypeScript Ecosystem Rules and Skills Integration
phase: "2"
status: completed
created: 2026-08-17
tags: [task, phase, typescript, skills]
---

# Phase 2: Define TypeScript Skills and Agent Interfaces

## Objective

Create 2 specialized skills (`typescript-diagnostics` and `zod-schema-modeling`) with clean frontmatter and OpenAI agent interfaces under `skills/`.

## Dependencies & Prerequisites

- Phase 1 completed.

## Impacted Files & Components

- `skills/typescript-diagnostics/SKILL.md` — compiler diagnostics, circular type resolution, tsconfig audits.
- `skills/typescript-diagnostics/agents/openai.yaml` — agent prompt interface.
- `skills/zod-schema-modeling/SKILL.md` — schema composition, transformations, refinements, type inference.
- `skills/zod-schema-modeling/agents/openai.yaml` — agent prompt interface.

## Implementation Tasks

- [x] Create `skills/typescript-diagnostics/SKILL.md`
- [x] Create `skills/typescript-diagnostics/agents/openai.yaml`
- [x] Create `skills/zod-schema-modeling/SKILL.md`
- [x] Create `skills/zod-schema-modeling/agents/openai.yaml`
- [x] Sanitize legacy frontmatter in `knowledge-grounding`, `repository-discovery`, and `verification-review`

## Verification & Testing

- Verify frontmatter of all skills contains only `name` and `description`.
- Verify `short_description` length (25-64 chars) and `default_prompt` ($skill_name reference) in agent YAMLs.

## Risks & Rollback

- Revert skill additions if agent definitions fail schema validation.
