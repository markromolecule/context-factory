---
title: "Session State Schema Definition"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.01"
branch: "task/0001/phase-01/unit-01-session-schema"
worktree: ".worktrees/0001/phase-01/unit-01-session-schema"
status: planned
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
- **Command:** `node -e "import('./orchestrator/validator.mjs').then(v => v.loadSchema('session-state').then(s => console.log('Schema valid:', !!s)))"`

## Rollback

- Delete `schemas/session-state.schema.json` and reset unit branch.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
