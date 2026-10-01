---
title: "Pure ESM Session Serialization Engine"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.02"
branch: "task/0001/phase-01/unit-02-session-core-engine"
worktree: ".worktrees/0001/phase-01/unit-02-session-core-engine"
status: planned
created: "2026-10-01"
tags: [task, unit, engine, session]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: Pure ESM Session Serialization Engine

> Phase: phase-01-discovery-and-scenarios · Depends on: 01.01 · Parallelizable with: none  
> Worktree: .worktrees/0001/phase-01/unit-02-session-core-engine · Branch: task/0001/phase-01/unit-02-session-core-engine

## Objective

Implement `scripts/session-core.mjs` providing zero-dependency pure ESM methods for capturing git state, active task unit context, working memory, and writing dual outputs (`.context/sessions/<id>.json` and `.tmp/SESSION_RESUME.md`).

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Schema Contract:** `schemas/session-state.schema.json` from Unit 01.01
- **Related Utilities:** `scripts/worktree.mjs`, `scripts/context-core.mjs`
- **Acceptance Criteria:** AC-02

## Preconditions

- Unit 01.01 completed and merged (`schemas/session-state.schema.json` available).
- Worktree provisioned at declared path.

## Scope

**In scope:**
- `scripts/session-core.mjs`

**Out of scope:**
- CLI argument parsing (`app/cli/commands/session.mjs`), slash skills, or rule editing.

## Steps

1. Implement `captureGitState()` to extract current branch, active worktree, modified files, and concise diff summary via `node:child_process` git commands.
2. Implement `resolveActiveTask()` to discover current task folder and active unit file from git branch or recent `docs/tasks/` entries.
3. Implement `saveSession(options)` writing machine JSON to `.context/sessions/<id>.json` and generating ultra-compact `<1.5k` token `.tmp/SESSION_RESUME.md`.
4. Implement `loadSession(id)`, `listSessions()`, and `clearSession(id)`.
5. Ensure `.tmp/SESSION_RESUME.md` includes copy-paste ready cold-start prompt instructions with zero narrative fluff.

## Verification

- **Test Type:** Unit test — tests saving, loading, listing, and clearing sessions, validating token length (<1.5k) of the generated markdown resume file.
- **Command:** `node -e "import('./scripts/session-core.mjs').then(s => console.log('Session core loaded'))"`

## Rollback

- Remove `scripts/session-core.mjs` and reset unit branch.

## Definition of done

- [ ] Maps to acceptance criteria: AC-02
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
