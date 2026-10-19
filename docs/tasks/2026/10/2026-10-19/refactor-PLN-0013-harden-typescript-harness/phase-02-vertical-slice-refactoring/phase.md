---
title: "Phase 2 — Scoped context and catalog"
type: phase
parent: "refactor-PLN-0013-harden-typescript-harness"
phase: "02"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, phase]
---

# Phase 2 — Scoped context and catalog

## Objective

Route intent, package scope, rules, skills, and workflows with bounded context and preserved obligations.

## Dependencies and prerequisites

Phase 1 verified; accepted contract defines meanings of binding and host checks. Verify `git symbolic-ref --quiet --short HEAD` equals `refactor/PLN-0013-harden-typescript-harness` before any execution.

## Unit index

| Unit | Outcome | Artifact | Depends on | Status |
|---|---|---|---|---|
| 02.01 | Route intent and knowledge on demand | `unit-01-intent.md` | 01.01 | planned |
| 02.02 | Bind TypeScript and frameworks to real package scope | `unit-02-framework.md` | 02.01 | planned |
| 02.03 | Audit rule applicability and evidence modes | `unit-03-rules.md` | 01.01 | planned |
| 02.04 | Make skills and workflows distinct and tier aware | `unit-04-workflows.md` | 01.01 | planned |

## Impacted components

- `scripts/context-core.mjs`
- `evals/tests/resolver/intent-routing.test.mjs`
- `scripts/framework-scope.mjs`
- `evals/tests/resolver/framework-scope.test.mjs`
- `rules/global`
- `rules/typescript`
- `context-manifest.json`
- `context-lock.json`
- `evals/tests/rules/catalog-coverage.test.mjs`
- `skills/productivity`
- `skills/engineering`
- `skills/workflows`
- `evals/tests/bridge/workflow-routing.test.mjs`
- `evals/tests/bridge/workflow-entry-contract.test.mjs`

## Verification and handoff

Execute units in dependency order. Each unit has concrete tests and a negative case. Close this phase only when every unit result and required human checkpoint is recorded, and then hand its verified revision to the next phase.

## Risks and rollback

Context reduction can hide security duties. Preserve negative fixtures and roll back individual routing or catalog commits.
