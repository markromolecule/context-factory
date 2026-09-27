---
title: "Phase 2 — Resolver Stack Keyword Inference"
type: phase
parent: "0001-task-laravel-modular-architecture-and-conventions"
phase: "02"
status: completed
created: "2026-09-27"
tags: [task, phase, laravel, resolver, inference]
---

# Phase 2 — Resolver Stack Keyword Inference

## Objective

Enhance `scripts/context-core.mjs` so that when a project has no `.context-bridge.json` or `--stack` CLI argument, the resolver checks for unambiguous stack keywords in the request before blindly defaulting to `typescript`. This ensures Laravel requests deterministically load Laravel rules.

## Dependencies & Prerequisites

- Phase 1 completed (Decision D-04 accepted in ADR 0023).
- Clean working tree with passing `node scripts/context.mjs doctor`.

## Impacted Files & Components

- `scripts/context-core.mjs` — `resolveContext()` stack determination logic.
- `evals/run-evals.mjs` — verify existing resolver evaluations pass.

## Implementation Tasks

- [x] Task 2.1 — Define stack keyword lookup map in `scripts/context-core.mjs` (mapping `laravel`, `artisan`, `eloquent`, `blade`, `pint`, `pest` to `laravel`).
- [x] Task 2.2 — In `resolveContext()`, update stack determination fallback: if `declaredStacks` is null or empty, test `request` against stack keywords; if a match is found, assign `declaredStacks = [inferredStack]`; otherwise fallback to `["typescript"]`.
- [x] Task 2.3 — Test resolution with unconfigured prompts:
  - `node scripts/context.mjs resolve "laravel backend project structure and naming conventions"` (verified: resolves 5 Laravel/global rules, zero TypeScript rules).
  - `node scripts/context.mjs resolve "typescript react components"` (verified: resolves TypeScript rules).
- [x] Task 2.4 — Run `node evals/run-evals.mjs` to ensure zero regressions across existing evaluation suites (22/22 passed).

## Verification & Testing

- **Command:** `node scripts/context.mjs resolve "laravel backend project structure and naming conventions"`
  - **Output:** Resolves `rules/global/evidence-and-claims.md`, `rules/global/naming-conventions.md`, `rules/laravel/common/naming-conventions.md`, `rules/laravel/common/project-structure.md`, `rules/laravel/foundation/conventions.md`.
  - **Zero TypeScript rules loaded.**
- **Command:** `node evals/run-evals.mjs`
  - **Result:** `PASS: 22/22 evaluations passed in 75ms`.
- **Command:** `node scripts/context.mjs doctor`
  - **Result:** `HEALTHY (59 rules, 12 skills, 12 workflows, lockfile current, symlinks verified)`.

## Risks & Rollback

- Risk: A query mentioning both "Laravel" and "TypeScript" (e.g. "Laravel backend with TypeScript frontend") could select only one stack.
- Mitigation: Explicit bridge `.context-bridge.json` with `stacks: ["laravel", "typescript"]` or `--stacks laravel,typescript` remains the authoritative override. Rollback is a simple git revert of `scripts/context-core.mjs`.
