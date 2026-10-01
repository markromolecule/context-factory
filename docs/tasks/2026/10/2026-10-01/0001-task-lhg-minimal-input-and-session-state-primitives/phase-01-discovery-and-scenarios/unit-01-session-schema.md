---
title: "Session State Schema Definition"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.01"
branch: "task/0001/phase-01/unit-01-session-schema"
worktree: ".worktrees/0001/phase-01/unit-01-session-schema"
status: verified
created: "2026-10-01"
tags: [task, unit, schema, session]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Session State Schema Definition

> Phase: phase-01-discovery-and-scenarios · Depends on: none · Parallelizable with: none  
> Worktree: .worktrees/0001/phase-01/unit-01-session-schema · Branch: task/0001/phase-01/unit-01-session-schema

## Objective

Author the canonical JSON schema `schemas/session-state.schema.json` to define the formal contract for session checkpoints across IDEs and CLI commands.

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Existing Schemas:** `schemas/run-result.schema.json`, `schemas/evaluation-report.schema.json`
- **Acceptance Criteria:** AC-01

## Preconditions

- Worktree provisioned at declared path.

## Scope

**In scope:**
- `schemas/session-state.schema.json`

**Out of scope:**
- CLI commands, core serialization logic, or rule modifications.

## Steps

1. Create `schemas/session-state.schema.json` conforming to draft-2020-12.
2. Define required properties: `schemaVersion`, `sessionId`, `timestamp`, `taskPointer`, `gitState`, `workingMemory`, `verificationState`, and `coldStartPrompt`.
3. Validate schema syntax against validator test cases.

## Verification

- **Test Type:** Contract test — verifies that sample valid session state objects validate cleanly and invalid payloads fail with explicit path-level errors.
- **Commands & Evidence:**
  - Red verification: `Expected Red Failure: ENOENT: no such file or directory, open '.../schemas/session-state.schema.json'` (exit code 1).
  - Green verification: `node -e "import('./orchestrator/validator.mjs').then(v => v.loadSchema('session-state').then(s => console.log('Schema valid:', !!s)))"` -> `Schema valid: true` (exit code 0).
  - Sample contract test: Validated complete session payload against schema -> `Sample session validation: PASS`.
  - Negative contract test: Validated rejected invalid schema types -> `Negative contract test: PASS (caught 8 errors)`.
  - Diff Review Pre-Screening: Gate 1 (0 scope leaks), Gate 2 (contract tests passing), Gate 3 (SOLID SRP confirmed), Gate 4 (DoD verified).
- **Files Modified:** `schemas/session-state.schema.json`, `context-manifest.json`, `context-lock.json`.
- **Commit:** `da0dd57` on `task/0001/phase-01/unit-01-session-schema`.

## Rollback

- Delete `schemas/session-state.schema.json` and reset unit branch.

## Definition of done

- [x] Maps to acceptance criteria: AC-01
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`da0dd57`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
