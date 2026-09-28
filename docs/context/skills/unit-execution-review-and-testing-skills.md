---
title: "Unit Lifecycle Skills: Plan Review, Test-Driven Execution, and Diff Review"
type: context
status: ready
created: "2026-09-28"
tags: [context, skills, unit, execute, plan-review, test, review]
feature: "unit-lifecycle-skills"
---

# Unit Lifecycle Skills: Plan Review, Test-Driven Execution, and Diff Review Context Specification

## 1. Overview & Objective

- **Problem Statement:** 
  1. `/plan` currently "grades its own homework": plans can specify parallel units with overlapping file scopes or cyclic dependencies, which only surface as merge conflicts or broken branches late in execution.
  2. During execution, agents frequently skip or superficially write complex test types (architecture boundary tests, contract tests, and database migration forward/rollback tests), leading to unverified claims.
  3. Developers reviewing execution checkpoints must manually inspect raw diffs for scope creep (touching files outside the unit's declared scope), missing test implementations, SOLID violations, and incomplete definitions of done.
- **Business / User Value:** 
  - Catches invalid plans before a single worktree or branch is created.
  - Enforces true test-first engineering (failing test written first, then implementation) for all test types, especially architecture, contract, and migration seams.
  - Delivers pre-screened, quality-checked diffs to developers at execution checkpoints, dramatically reducing manual code review friction.
- **Success Criteria:**
  - `plan-review` audits plans cold-start, utilizing a deterministic script to verify acyclic graphs and disjoint parallel scopes without relying solely on LLM hallucinations.
  - `test` operationalizes the unit's `Verification` section test-first, guiding agents through the Red-Green-Refactor loop with concrete patterns for architecture, contract, and migration tests.
  - An independent `review` step (either a dedicated skill or an extended `verify` skill) inspects the worktree diff against the unit artifact before the developer checkpoint.

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As an engineering coordinator / PM agent*, I want to invoke `/plan-review` on a freshly scaffolded task plan, so that I catch graph cycles, file overlap between parallel units, and unmapped acceptance criteria before launching execution sessions.
- *As a developer agent in an execution worktree*, I want `execute` to delegate test creation to `/test`, so that I write failing tests for architecture, contract, or migration boundaries before writing functional code.
- *As a code reviewer / developer*, I want unit diffs to be pre-screened by `/review` against the unit's declared scope, test requirements, and SOLID rules, so that I only review verified, bounded changes at the batch checkpoint.

### Functional Requirements

- [ ] **FR-01 (Deterministic Plan Checker Script):** Create a deterministic script (e.g. `scripts/plan-check.mjs` exposed via `node scripts/context.mjs plan:check <task-dir>`) that parses unit artifacts, builds the dependency DAG, detects cycles, and validates that parallel units (no dependency edge between them) have disjoint declared file scopes.
- [ ] **FR-02 (Plan Review Skill):** Create `skills/productivity/plan-review/SKILL.md` (triggered by `/plan-review`) that audits a plan in a fresh session before execution: runs the deterministic checker, verifies cold-start executability of context packets, and confirms every master plan AC maps to at least one test.
- [ ] **FR-03 (Test Skill):** Create `skills/engineering/test/SKILL.md` (triggered by `/test`) that turns a unit's Verification section into concrete tests written test-first (failing assertions first, then implementation), with rigorous guidance on architecture tests, contract tests, and migration tests.
- [ ] **FR-04 (Execute Skill Integration):** Update `skills/engineering/execute/SKILL.md` to formally delegate test authoring to `skills/engineering/test/SKILL.md` instead of improvising.
- [ ] **FR-05 (Dedicated Unit Diff Review Skill):** Create `skills/engineering/review/SKILL.md` (triggered by `/review`) to perform independent unit diff review (scope fence check, missing tests check, SOLID audit, and DoD completion) on the worktree prior to the developer batch checkpoint.

### Edge Cases & Failure Modes

- **Edge Case 1: Dynamic / Glob Scopes in Unit Files:** Units might declare `app/Modules/Orders/*` rather than explicit file paths. The deterministic checker must resolve or flag overly broad glob scopes that might conceal overlap.
- **Edge Case 2: Shared Config or Migrations:** Two parallel units might both need to touch `database/migrations/` or `.env.example`. The checker must enforce explicit sequencing or flag the shared resource conflict.
- **Edge Case 3: Superficial Architecture Tests:** Agents often write trivial mock tests instead of true structural boundary checks. The `test` skill must provide concrete actionable patterns (e.g., AST/dependency checks or strict structural assertions).

## 3. Technical & Architectural Context

- **Affected Layers:** Context Factory CLI & Scripts (`scripts/`), Skills (`skills/productivity/`, `skills/engineering/`), Orchestrator Contract (`orchestrator/SHARED.md`).
- **Existing Files to Inspect / Modify:**
  - `skills/engineering/execute/SKILL.md` (Execution loop)
  - `skills/productivity/plan/SKILL.md` (Plan contract & unit structure)
  - `docs/templates/Unit.md` (Unit artifact contract)
  - `skills/engineering/verify/SKILL.md` (Existing verification skill)
  - `scripts/harness-cli.mjs` / `scripts/context.mjs` (CLI entry point)
  - `context-manifest.json` (Catalog inventory)
- **Data Model & Schema Changes:** None; documentation and CLI tooling only.

## 4. Scope & Boundaries

- **In Scope:**
  - Deterministic plan checking script for acyclic DAG and disjoint file scopes.
  - `plan-review` skill authoring and manifest registration.
  - `test` skill authoring and manifest registration.
  - `review` skill authoring and manifest registration.
  - Updating `execute` skill to coordinate with `test` and `review`.
- **Out of Scope:**
  - Replacing the core `plan` or `grill` skills.
  - Third-party test runners or heavy AST parser dependencies (use standard Node.js built-ins).

## 5. References & External Context

- [[docs/decisions/0024-unit-execution-review-and-testing-skills|ADR 0024: Unit Lifecycle Primitives: Plan Review, Test-Driven Execution, and Diff Review]]
- [[skills/engineering/execute/SKILL|Execute Skill]]
- [[skills/productivity/plan/SKILL|Plan Skill]]
- [[docs/templates/Unit|Unit Template]]
