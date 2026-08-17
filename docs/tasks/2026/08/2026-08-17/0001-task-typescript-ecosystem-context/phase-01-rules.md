---
title: "Phase 1: Define TypeScript Rules"
type: phase
parent: TypeScript Ecosystem Rules and Skills Integration
phase: "1"
status: completed
created: 2026-08-17
tags: [task, phase, typescript, rules]
---

# Phase 1: Define TypeScript Rules

## Objective

Author 5 dedicated TypeScript ecosystem rules under `rules/typescript/` covering type safety, runtime boundary validation, error handling, async discipline, and module resolution.

## Dependencies & Prerequisites

- Existing global, backend, and frontend rules under `rules/`.

## Impacted Files & Components

- `rules/typescript/type-safety.md` — strict type safety, narrowing, branded types, and ban `any`.
- `rules/typescript/runtime-validation.md` — zero-trust boundary schema parsing and single source of truth.
- `rules/typescript/error-handling.md` — Result / Either patterns, typed catch blocks, and causal chaining.
- `rules/typescript/async-discipline.md` — floating promise prevention, AbortSignal propagation, concurrency pools.
- `rules/typescript/module-and-imports.md` — verbatim type imports, path aliases, circular dependency avoidance.

## Implementation Tasks

- [x] Create `rules/typescript/type-safety.md`
- [x] Create `rules/typescript/runtime-validation.md`
- [x] Create `rules/typescript/error-handling.md`
- [x] Create `rules/typescript/async-discipline.md`
- [x] Create `rules/typescript/module-and-imports.md`

## Verification & Testing

- Inspect YAML frontmatter of each rule for `name`, `description`, `scope`, and `alwaysApply: false`.

## Risks & Rollback

- Ensure rules do not contradict backend/frontend specific patterns. If rollback needed, remove the `rules/typescript/` directory.
