---
title: "Phase 1 — Rule Contract Foundation"
type: phase
parent: "0001-task-executable-rule-conformance-harness"
phase: "01"
phase_branch: "task/0001/phase-01-integration"
status: planned
created: "2026-10-06"
tags: [task, phase, schemas, parser]
---

# Phase 1 — Rule Contract Foundation

## Objective

Create trustworthy schemas, validation primitives, canonical inline directive syntax, and a minimal migrated TypeScript pilot that later phases can consume without guessing.

## Dependencies & prerequisites

- Accepted ADR 0029 and ready context specification.
- Task base branch `task/0001-executable-rule-conformance-harness`.

## Unit index

| Unit | Artifact | Branch | Worktree | Depends on | Parallelizable |
|---|---|---|---|---|---|
| 01.01 Schema and Validation Contracts | `unit-01-schema-validation-contracts.md` | `task/0001/phase-01/schema-validation-contracts` | `.worktrees/0001/phase-01/schema-validation-contracts` | none | none |
| 01.02 Descriptor Parser and Pilot Rules | `unit-02-descriptor-parser-pilot.md` | `task/0001/phase-01/descriptor-parser-pilot` | `.worktrees/0001/phase-01/descriptor-parser-pilot` | 01.01 | none |

## Phase verification

- `node --test evals/rule-contract-schema.test.mjs evals/rule-descriptor-parser.test.mjs`
- `/review` each unit against its scope and `<language_rules>`.

## Risks and rollback

- Keep schemas versioned and additive; revert pilot markers and parser together if the syntax proves ambiguous.
- Do not advertise catalog enforcement in this phase.
- After merge, remove unit worktrees, prune Git metadata, and remove empty `.worktrees/0001/phase-01/` directories.
