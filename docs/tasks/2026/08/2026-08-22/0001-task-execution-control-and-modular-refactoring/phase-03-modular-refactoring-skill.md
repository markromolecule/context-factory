---
title: "Phase 3 — Modular Refactoring Skill"
type: phase
parent: "0001-task-execution-control-and-modular-refactoring"
phase: "03"
status: completed
created: "2026-08-22"
tags: [task, phase, skill, refactor, modularity]
---

# Phase 3 — Modular Refactoring Skill

## Objective

Create `skills/refactor/SKILL.md` and its agent interface resource `skills/refactor/agents/openai.yaml` to safely and cleanly decompose lengthy, monolithic files into modular, cohesive units that stay in sync.

## Dependencies & Prerequisites

- Phase 2 completed.

## Impacted Files & Components

- `skills/refactor/SKILL.md` (new skill file).
- `skills/refactor/agents/openai.yaml` (new interface file).

## Implementation Tasks

- [x] Task 3.1 — Create `skills/refactor/SKILL.md` with frontmatter `name: refactor` and description.
- [x] Task 3.2 — Define the step-by-step modularization procedure:
  1. *Target Identification:* Analyze file length, complexity, and mixed responsibilities.
  2. *Contract & Dependency Mapping:* Identify exported symbols, types, and consumers.
  3. *Surgical Decomposition:* Extract cohesive sub-components, custom hooks, helper utilities, or domain services into dedicated files.
  4. *Import & Export Synchronization:* Update barrel exports (`index.ts`) and consumer imports.
  5. *Behavioral Equivalence Verification:* Run unit and integration tests to verify zero regressions.
- [x] Task 3.3 — Specify execution triggers: `/refactor`, `[REFACTOR]`, "modularize code", "break down file", and proactive autonomous invocation when the LLM detects high file complexity during code review.
- [x] Task 3.4 — Create `skills/refactor/agents/openai.yaml` matching OpenAI interface standards.

## Verification & Testing

- Validated YAML frontmatter and resource format via `node scripts/context.mjs lint`.
- Verified inclusion in `docs/Skills.md` and `context-manifest.json`.

## Risks & Rollback

- Ensure refactoring preserves exact public API contracts so external consumers are never broken.
