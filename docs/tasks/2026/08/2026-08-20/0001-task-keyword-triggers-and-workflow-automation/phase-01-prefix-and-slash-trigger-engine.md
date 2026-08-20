---
title: "Phase 1 — Prefix and Slash Trigger Pattern Matching in Context Core"
type: phase
parent: "0001-task-keyword-triggers-and-workflow-automation"
phase: "01"
status: completed
created: "2026-08-20"
tags: [task, phase, triggers, context-core]
---

# Phase 1 — Prefix and Slash Trigger Pattern Matching in Context Core

## Objective

Enhance `scripts/context-core.mjs` so that explicit prefix triggers (e.g. `/plan`, `/fix`, `/migrate`, `/sec`, `/grill`, `/adr`, `/verify`, `[HOTFIX]`, `[DISCOVERY]`, etc.) take absolute precedence in `resolveContext()`, ensuring 100% deterministic workflow and skill activation without relying solely on fuzzy term scoring.

## Dependencies & Prerequisites

- Existing `scripts/context-core.mjs` routing hints and scoring engine.

## Impacted Files & Components

- `scripts/context-core.mjs` — Update `ROUTING_HINTS`, `ACTION_TERMS`, and `resolveContext` logic to prioritize prefix triggers and slash commands.
- `evals/cases/` — Add new resolution test cases for slash commands and tag prefixes.

## Implementation Tasks

- [x] Task 1 — Add high-priority slash and bracket tag regex patterns to `ROUTING_HINTS` in `scripts/context-core.mjs`.
- [x] Task 2 — Ensure prefix matching handles leading slash commands (`/plan`, `/fix`, `/migrate`, `/sec`, `/arch`, `/grill`, `/verify`, `/upgrade`, `/release`, `/context`) cleanly.
- [x] Task 3 — Add file-path and directory awareness so requests specifying target files (e.g. touching `src/api/*` or `rules/backend/*`) automatically include matching domain rules.
- [x] Task 4 — Add unit test cases in `evals/cases/` covering prefix resolution.

## Verification & Testing

- `node scripts/harness-cli.mjs resolve "/fix regression in token parser"` $\rightarrow$ verifies `workflows/defect-resolution.md`.
- `node scripts/harness-cli.mjs resolve "[HOTFIX] token parser failure"` $\rightarrow$ verifies `workflows/defect-resolution.md`.
- `node scripts/harness-cli.mjs resolve "/migrate add billing table"` $\rightarrow$ verifies `workflows/database-migration.md`.
- `node scripts/harness-cli.mjs resolve "/plan new feature"` $\rightarrow$ verifies `workflows/feature-delivery.md`.

## Risks & Rollback

- **Risk:** Existing natural language queries might experience regressions if regexes are overly broad.
- **Rollback:** Revert `ROUTING_HINTS` to original regex patterns and run `node scripts/harness-cli.mjs eval --unit`.
