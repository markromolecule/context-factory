---
title: "Phase 1: Core Schemas and Session Engine"
type: phase
parent: "0001-task-lhg-minimal-input-and-session-state-primitives"
phase: "01"
phase_branch: "task/0001/phase-01/integration"
status: completed
merge_commit: "386bc4d"
created: "2026-10-01"
tags: [task, phase, schema, session-engine]
---

# Phase 1: Core Schemas and Session Engine

## Objective

Establish the canonical session state contract (`schemas/session-state.schema.json`) and build the pure ESM session serialization and loader core engine (`scripts/session-core.mjs`) to enable dual-layer checkpoint persistence (`.context/sessions/<id>.json` + `.tmp/SESSION_RESUME.md`).

## Dependencies & Prerequisites

- Context Specification: [[docs/context/harness/lhg-session-state-and-minimal-input|Context Spec]] (`status: ready`)
- Architecture Decision: [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025]] (`status: accepted`)

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Session State Schema Definition | `unit-01-session-schema.md` | `task/0001/phase-01/unit-01-session-schema` | `.worktrees/0001/phase-01/unit-01-session-schema` | `none` | `none` | `merged` |
| **Unit 01.02** | Pure ESM Session Serialization Engine | `unit-02-session-core-engine.md` | `task/0001/phase-01/unit-02-session-core-engine` | `.worktrees/0001/phase-01/unit-02-session-core-engine` | `01.01` | `none` | `merged` |

## Impacted Files & Components

- `schemas/session-state.schema.json`: Canonical JSON schema defining session checkpoint data structures.
- `scripts/session-core.mjs`: Pure ESM implementation for session state serialization, git extraction, working memory formatting, and resume prompt generation.

## Implementation Tasks

- [x] **Unit 01.01:** Define JSON schema draft-2020-12 for session state with strict field validations.
- [x] **Unit 01.02:** Implement `scripts/session-core.mjs` with `saveSession`, `loadSession`, `listSessions`, `clearSession`, and `generateResumePrompt`.

## Verification & Testing

- Contract test: Verify sample session state payloads against `schemas/session-state.schema.json` using `orchestrator/validator.mjs`.
- Unit test: Execute node tests verifying `scripts/session-core.mjs` filesystem operations, git metadata extraction, and resume file formatting.

## Risks, Worktree Teardown & Rollback

- **Risk:** Incompatible session JSON payloads or corrupt `.tmp` files.
- **Mitigation:** Strict schema validation during load; fallback to git status inspection if corrupt.
- **Teardown:** Remove `.worktrees/0001/phase-01/*` worktrees and delete unit branches upon merging into `task/0001/phase-01/integration`.
