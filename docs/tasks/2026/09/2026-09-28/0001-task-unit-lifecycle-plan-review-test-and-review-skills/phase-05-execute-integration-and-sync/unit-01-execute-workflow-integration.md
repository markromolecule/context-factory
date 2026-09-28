---
title: "Execute Workflow Integration"
type: unit
parent: "phase-05-execute-integration-and-sync"
unit: "05.01"
status: verified
created: "2026-09-28"
tags: [task, unit, execute, integration, test, review]
depends_on: ["03.01", "04.01"]
parallelizable_with: []
---

# Unit 05.01: Execute Workflow Integration

> Phase: phase-05-execute-integration-and-sync · Depends on: 03.01, 04.01 · Parallelizable with: none

## Objective

Update `skills/engineering/execute/SKILL.md` to formally delegate test authoring to `skills/engineering/test/SKILL.md` (test-first Red-Green discipline) and diff pre-screening to `skills/engineering/review/SKILL.md` before developer checkpoints.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - `skills/engineering/execute/SKILL.md` currently says:
    `3. Run exactly the verification the unit's own Verification section specifies...`
    `5. Once verification passes, commit on the unit's branch...`
  - It does not instruct the agent to write tests first or run an independent review gate before checkpointing.
- Acceptance Criteria Served:
  - `AC-05`: `execute` skill delegates test creation to `test` and diff pre-screening to `review` before batch checkpoints.
- Decisions Constraining Unit:
  - `D-03`: `execute` must call `test` instead of improvising.
  - `D-01`: `execute` must call `review` before the developer checkpoint so diffs are pre-screened.

## Preconditions

Units 03.01 (`test` skill) and 04.01 (`review` skill) completed.

## Scope

**In scope:** `skills/engineering/execute/SKILL.md`.
**Out of scope:** Modifying worktree branching logic or merging discipline.

## Steps

1. Update section `## Execute Each Unit` in `skills/engineering/execute/SKILL.md`:
   - Step 2: "Invoke `skills/engineering/test/SKILL.md` (`/test`) to author failing tests first for the unit's declared verification types (unit, integration, architecture, contract, migration) before writing functional code."
   - Step 3: "Implement the minimal code within unit scope to make the tests pass (Green)."
   - Step 4: "Invoke `skills/engineering/review/SKILL.md` (`/review`) to conduct an independent diff review: audit scope fences (`In scope`), test completeness, SOLID compliance, and Definition of Done."
2. Update section `### Checkpoint Output Format` in `skills/engineering/execute/SKILL.md`:
   - Include the `/review` pre-screening status (e.g. `Pre-Screening Review: PASS (0 scope leaks, 0 SOLID violations)`).

## Verification

- Test type(s):
  - Architecture / Contract tests: Verifies workflow text instructs agents to call `/test` and `/review` and maintains strict batch checkpoint stop conditions.
- Cases:
  - Text audit of `execute/SKILL.md` confirms explicit `/test` invocation.
  - Text audit confirms `/review` pre-screening gate.
- Commands: `node scripts/context.mjs lint`
- Evidence: `node scripts/context.mjs lint` passed with 0 errors. `node scripts/context.mjs doctor` passed with 100% HEALTHY.

## Rollback

Revert edits to `skills/engineering/execute/SKILL.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-05
- [x] `execute` skill formally references `test` and `review`
- [x] Checkpoint format incorporates pre-screening summary
- [x] All listed verification passes
