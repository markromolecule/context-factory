---
title: "Unit Lifecycle Primitives: Plan Review, Test-Driven Execution, and Diff Review"
type: decision
status: accepted
created: "2026-09-28"
tags: [adr, skills, unit, execute, plan-review, test, review]
---

# Unit Lifecycle Primitives: Plan Review, Test-Driven Execution, and Diff Review

## Context

With the introduction of atomic unit planning (`skills/productivity/plan/SKILL.md`, `docs/templates/Unit.md`) and unit-by-unit worktree execution (`skills/engineering/execute/SKILL.md`), the engineering workflow requires automated and disciplined guardrails at three critical boundaries:

1. **Pre-Execution Plan Audit:** Plans must be vetted in a fresh session before execution begins. Currently, `/plan` grades its own homework. Graph cycles and file overlap between parallel units only surface late as merge collisions.
2. **Test-First Implementation Discipline:** During execution, agents often improvise or skip complex tests (architecture boundary enforcement, contract tests, and forward/backward migration verification). Test creation must precede functional implementation via a dedicated test-first skill.
3. **Pre-Checkpoint Diff Review:** Before developer review checkpoints in `execute`, unit diffs must be screened against their unit artifact's scope fences (`In scope` vs `Out of scope`), test completeness, SOLID architecture compliance, and Definition of Done.

## Options considered

### For Diff Review (`review` vs `verify`):

- **Option 1 (Recommended): Dedicated `review` skill (`skills/engineering/review/SKILL.md`).**
  - Keeps a clean separation of concerns:
    - `review` is an **internal white-box diff and code auditor** within an active worktree. It verifies that modified files match the unit's declared scope, that all test types from the unit are present, that SOLID principles are preserved on new classes, and that the Definition of Done is fulfilled.
    - `verify` is an **external black-box behavioral auditor** for whole-task milestones and releases. It verifies that reproducible command output proves acceptance criteria and checks for regressions without focusing on intra-worktree file fences.
  - Ergonomics: `/review` is invoked inside worktrees prior to developer batch checkpoints; `/verify` is invoked at phase boundaries and release verification.
- **Option 2: Extend `verify` with dual operational modes.**
  - Overloads `skills/engineering/verify/SKILL.md` to handle both unit diff pre-screening and system-level acceptance verification.
  - Adds modal complexity to a single skill prompt, muddying the mental model between code-level review and product acceptance.
- **Option 3: Pure manual inspection at checkpoints without skill automation.**
  - Leaves diff auditing to developer eyeball review at batch checkpoints, re-introducing developer cognitive fatigue and missed scope leaks.

### For Plan Validation (`plan-review`):

- **Option A (Recommended): Hybrid Deterministic Script + LLM Cold-Start Semantic Review.**
  - Overlap and DAG cycle checks are delegated to a deterministic Node.js script (`scripts/plan-check.mjs` / `context.mjs plan:check`) using topological sort and set intersections.
  - LLM checks semantic properties: cold-start executability of context packets and alignment between master plan acceptance criteria and unit tests.
- **Option B: Pure LLM prompt-based plan auditing.**
  - Prone to hallucinating disjointness or missing non-trivial graph cycles.
- **Option C: Script-only without skill.**
  - Catches graph issues but misses semantic gaps, vague acceptance criteria, or incomplete context packets.

## Decision

1. **Create a Dedicated `review` Skill:** Author `skills/engineering/review/SKILL.md` to conduct independent white-box diff review on the active worktree against the unit artifact before the batch checkpoint.
2. **Implement Deterministic Plan Checking Script & `plan-review` Skill:** Implement `scripts/plan-check.mjs` (accessible via `node scripts/context.mjs plan:check <task-dir>`) for mathematical cycle and overlap detection, wrapped by `skills/productivity/plan-review/SKILL.md` for cold-start semantic audits.
3. **Author Dedicated `test` Skill:** Author `skills/engineering/test/SKILL.md` to operationalize test-first authoring (Red-Green-Refactor) for unit, integration, architecture, contract, and migration test types, and update `skills/engineering/execute/SKILL.md` to call `test` instead of improvising.

## Consequences

- **Positive:**
  - Prevents worktree merge collisions before execution starts.
  - Eliminates scope leakage across unit boundaries.
  - Enforces true test-first engineering and guarantees that architecture, contract, and migration tests are genuinely implemented.
  - Delivers clean, pre-screened diffs to developers at checkpoints.
- **Trade-offs / Mitigations:**
  - Adds three new skills (`plan-review`, `test`, `review`) and one script (`scripts/plan-check.mjs`) to Context Factory catalog.
  - Requires updating `context-manifest.json`, `context-lock.json`, and `skills/engineering/execute/SKILL.md`.

## Validation and review date

- Validated via `scripts/plan-check.mjs` unit tests and end-to-end evaluation in `evals/`.
- Review Date: 2026-10-28.
