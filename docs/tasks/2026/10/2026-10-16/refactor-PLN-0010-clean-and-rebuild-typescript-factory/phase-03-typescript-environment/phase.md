---
title: "Phase 3 — Streamline TypeScript-Only Environment, CLI & Harness Tools"
type: phase
parent: "refactor-PLN-0010-clean-and-rebuild-typescript-factory"
phase: "03"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: planned
created: "2026-10-16"
tags: [task, phase]
---

# Phase 3 — Streamline TypeScript-Only Environment, CLI & Harness Tools

## Objective

Eliminate language and framework selection options (`--stack`, `--stacks` flags and prompts) across CLI commands (`conform.mjs`, `preflight.mjs`, `resolve.mjs`, `init.mjs`), clean up lingering `flutter` unsupported-stack checks in `doctor.mjs` and schemas, and remove framework filtering in the resolver so all rules under `rules/typescript/` apply directly as a unified TypeScript catalog.

## Dependencies & Prerequisites

- Phase 2 completed on branch `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Streamline CLI and Doctor to Dedicated TypeScript Stack | `unit-01-typescript-environment.md` | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | `02.01` | `planned` |

## Impacted Files & Components

- **Modified:**
  - `app/cli/commands/conform.mjs`
  - `app/cli/commands/preflight.mjs`
  - `app/cli/commands/resolve.mjs`
  - `app/cli/commands/init.mjs`
  - `app/cli/commands/doctor.mjs`
  - `schemas/rule-descriptor.schema.json`
  - `scripts/context-core.mjs`
  - `evals/tests/bridge/bridge-conformance.test.mjs`

## Implementation Tasks

- [ ] Unit 03.01 — Remove `--stack` and `--stacks` flags/prompts, eliminate Flutter checks in `doctor.mjs` and schemas, remove framework-filtering branches in resolver, and update tests.

## Verification & Testing

- `npm test` passes 100% of test suites.
- CLI commands run without requiring or prompting for stack selection.

## Risks & Rollback

- Revert file changes via `git checkout -- app/cli/ schemas/ scripts/ evals/`.
