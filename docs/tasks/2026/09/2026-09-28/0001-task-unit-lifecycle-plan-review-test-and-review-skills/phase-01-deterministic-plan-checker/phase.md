---
title: "Phase 1 — Deterministic Plan Checker"
type: phase
parent: "0001-task-unit-lifecycle-plan-review-test-and-review-skills"
phase: "01"
status: verified
created: "2026-09-28"
tags: [task, phase, plan-check, dag, cycle, scope]
---

# Phase 1 — Deterministic Plan Checker

## Objective

Build a deterministic Node.js plan checker script (`scripts/plan-check.mjs`) and CLI command (`node scripts/context.mjs plan:check <task-dir>`) that parses unit artifacts, builds the dependency DAG, verifies that the graph is strictly acyclic, and validates that parallel units have completely disjoint declared file scopes.

## Context & Prerequisites

- Context Specification: [[docs/context/skills/unit-execution-review-and-testing-skills|Unit Lifecycle Context Spec]]
- ADR 0024: [[docs/decisions/0024-unit-execution-review-and-testing-skills|ADR 0024]]
- Unit Template Contract: [[docs/templates/Unit|Unit Template]]

## Unit Index & Dependency Graph

```mermaid
graph LR
    U01[Unit 01: DAG Cycle Detector]
    U02[Unit 02: Scope Overlap Checker]
    U03[Unit 03: CLI Harness & Eval Tests]
    U01 --> U02
    U02 --> U03
```

| Unit ID | Title | File | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | DAG Cycle Detector | `unit-01-dag-cycle-detector.md` | `none` | `none` | `verified` |
| **Unit 01.02** | Scope Overlap Checker | `unit-02-scope-overlap-checker.md` | `Unit 01.01` | `none` | `verified` |
| **Unit 01.03** | CLI Harness & Eval Tests | `unit-03-cli-and-eval-tests.md` | `Unit 01.02` | `none` | `verified` |

## Impacted Files & Components

- `scripts/plan-check.mjs` (New deterministic checker module)
- `scripts/harness-cli.mjs` (Expose `plan:check` command)
- `evals/cases/` (Unit test cases for plan checking)

## Rollback Strategy

Delete `scripts/plan-check.mjs` and revert changes to `scripts/harness-cli.mjs`.
