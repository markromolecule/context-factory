---
title: "Session Productivity Skill & Shared Contract"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.01"
branch: "task/0001/phase-03/unit-01-session-skill-and-contract"
worktree: ".worktrees/0001/phase-03/unit-01-session-skill-and-contract"
status: verified
commit: "4aa9150"
created: "2026-10-01"
tags: [task, unit, skill, contract, session]
depends_on: ["02.01"]
parallelizable_with: ["03.02"]
---

# Unit 03.01: Session Productivity Skill & Shared Contract

> Phase: phase-03-implementation-and-tests · Depends on: 02.01 · Parallelizable with: 03.02  
> Worktree: .worktrees/0001/phase-03/unit-01-session-skill-and-contract · Branch: task/0001/phase-03/unit-01-session-skill-and-contract

## Objective

Author `skills/productivity/session/SKILL.md` to define the user-facing slash commands (`/session save`, `/session resume`, `/session status`, `/session clear`, `[SESSION]`) and update `orchestrator/SHARED.md` to embed standard session reset procedures whenever LLM context load approaches ~60%.

## Context packet

- **Pre-planning Reference:** [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025 Decision]]
- **Existing Skills:** `skills/productivity/context/SKILL.md`, `skills/productivity/plan/SKILL.md`
- **Orchestration Contract:** `orchestrator/SHARED.md`
- **Acceptance Criteria:** AC-05

## Preconditions

- Unit 02.01 completed (`app/cli/commands/session.mjs` available).
- Worktree provisioned at declared path.

## Scope

**In scope:**
- `skills/productivity/session/SKILL.md`
- `orchestrator/SHARED.md`

**Out of scope:**
- CLI implementations or global rule content changes.

## Steps

1. Create `skills/productivity/session/SKILL.md` with YAML frontmatter declaring name `session`, description, and aliases (`/session`, `/session-save`, `/session-resume`, `[SESSION]`).
2. Provide step-by-step procedures for saving sessions before context exhaustion and resuming in clean sessions.
3. Update `orchestrator/SHARED.md` under `## Working contract` and `## Execution & Harness Contract` to mandate session checkpoints whenever context reaches ~60% load to preserve high-fidelity reasoning.

## Verification

- **Test Type:** Architecture test — verifies skill frontmatter, slash trigger mapping, and model-neutral contract wording.
- **Command:** `node --test evals/session-contract.test.mjs`
- **Output:**
  ```text
  ▶ Unit 03.01: Session Productivity Skill & Shared Contract
    ✔ Skill file exists with valid frontmatter and aliases (2.808ms)
    ✔ Skill documentation covers procedures and commands (0.521833ms)
    ✔ orchestrator/SHARED.md mandates session checkpoints at ~60% saturation (0.461459ms)
  ✔ Unit 03.01: Session Productivity Skill & Shared Contract (4.906041ms)
  ℹ tests 3
  ℹ suites 1
  ℹ pass 3
  ℹ fail 0
  ```

## Rollback

- Revert `orchestrator/SHARED.md` and delete `skills/productivity/session/SKILL.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-05
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch (`4aa9150`)
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
