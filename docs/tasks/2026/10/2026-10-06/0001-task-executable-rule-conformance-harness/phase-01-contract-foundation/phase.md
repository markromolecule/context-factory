---
title: "Phase 1 — Rule Contract Foundation"
type: phase
parent: "0001-task-executable-rule-conformance-harness"
phase: "01"
phase_branch: "task/0001/phase-01-integration"
status: completed
merge_commit: "118202922ea04977af742df386589a915ba5b47a"
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

| Unit | Artifact | Branch | Worktree | Depends on | Status |
|---|---|---|---|---|---|
| 01.01 Schema and Validation Contracts | `unit-01-schema-validation-contracts.md` | `task/0001/phase-01/schema-validation-contracts` | `.worktrees/0001/phase-01/schema-validation-contracts` | none | merged |
| 01.02 Descriptor Parser and Pilot Rules | `unit-02-descriptor-parser-pilot.md` | `task/0001/phase-01/descriptor-parser-pilot` | `.worktrees/0001/phase-01/descriptor-parser-pilot` | 01.01 | merged |

## Phase verification

- `node --test evals/rule-contract-schema.test.mjs evals/rule-descriptor-parser.test.mjs` (PASS: 32/32 tests passed in 111ms)
- `npm run lint` (PASS)
- `node scripts/context.mjs doctor` (PASS: healthy)
- `node --test` (PASS: 82/82 workspace tests passed)
- Merge Commit: `118202922ea04977af742df386589a915ba5b47a`

## Risks and rollback

- Keep schemas versioned and additive; revert pilot markers and parser together if the syntax proves ambiguous.
- Do not advertise catalog enforcement in this phase.
- After merge, remove unit worktrees, prune Git metadata, and remove empty `.worktrees/0001/phase-01/` directories.
