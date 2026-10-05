---
title: "Language Rule Lifecycle Binding & Active Enforcement"
type: task
status: completed
created: "2026-10-05"
tags: [task, rules, lifecycle, execution, plan, review, language-rules]
target_branch: master
base_branch: "task/0002-language-rule-lifecycle-binding"
---

# Language Rule Lifecycle Binding & Active Enforcement

## Outcome

Eliminate language-rule drift during agent executions by actively binding language- and framework-specific rules (`rules/typescript/`, `rules/laravel/`, `rules/flutter/`, etc.) into every phase of the development lifecycle (`context` → `plan` → `execute` → `review`). This establishes explicit conflict precedence (language rules override procedural plan text), anchors `<language_rules>` at the point of code generation in unit context packets, and adds a pre-screening verification gate in `/review` before developer checkpoints.

## Pre-planning record

### Actors and goals

- **Developer / Agent:** Wants generated code to strictly adhere to language idioms, naming conventions, and type-safety rules without human intervention or post-execution rewrite loops.
- **Planner / PM Agent:** Wants planning tools to automatically identify and bind scoped subsets of language rules (2–4 rules matching touched files) into unit specifications with concrete checkable directives.
- **Reviewer / QA:** Wants an automated gate during `/review` to verify worktree diffs against declared language rules before presenting batch checkpoints.

### Domain language

- **`<language_rules>` Block:** Standardized XML-delimited tag placed at the end of a unit's `## Context packet` immediately before `## Steps`, containing the scoped subset of checkable rule directives.
- **Unit-Scoped Rule Subset:** A focused selection of 2–4 language rules matching only the files touched by that unit, preventing prompt bloat and context dilution.
- **Conflict Precedence:** The authoritative invariant: *If a procedural implementation step in a plan and an applicable language rule conflict, the language rule strictly takes precedence.*
- **Point-of-Generation Proximity:** Locating rule constraints immediately before generation steps to prevent model attention decay.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Planning a unit touching API routes and controllers | Stack is TypeScript; rules resolved | Unit artifact contains `<language_rules>` listing `controllers-and-routes.md` and `runtime-validation.md` with concrete constraints | Missing block flagged during `plan-review` | planned |
| SC-02 | Executing unit where plan step contradicts language rule | Plan specifies raw untyped object return | Agent follows language rule (typed DTO/Resource), citing precedence | Fails `/review` if agent followed contradictory plan step | planned |
| SC-03 | Worktree diff review via `/review` | Unit execution finished; tests pass | Gate 4 audits diff against declared `<language_rules>` (naming, error handling, typing) | If rule violated, unit marked FAIL and repaired before checkpoint | planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | How to prevent models from treating rules as background context? | Wire rules into every phase (`context`, `plan`, `execute`, `review`). | User diagnosis: procedural workflows overshadow background rules unless wired in-step. | Passive system prompt admonition (fails in practice). | [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]] |
| D-02 | How to format rules in unit context packets? | Use standardized XML delimiters: `<language_rules>...</language_rules>`. | Provides distinct attention anchors for LLMs. | Markdown bullet list without delimiter (easily lost in text). | [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]] |
| D-03 | What happens if plan instructions and language rules clash? | Language rules strictly supersede procedural plan text. | Eliminates ambiguity; protects architectural invariants. | Plan takes precedence or silent fallback. | [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]] |
| D-04 | Where in the unit artifact should rules live? | In `## Context packet` directly preceding `## Steps`. | Point-of-generation proximity prevents attention decay. | Buried at the top of plan or in a separate file. | [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]] |
| D-05 | How to enforce rule compliance during execution? | Add Gate 4 ("Language Rules Conformance Audit") to `/review`. | Catches rule violations before human checkpoint. | Post-execution AST rewrite agent (too heavyweight). | [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]] |
| D-06 | Should units inline all rules or scoped subsets? | Unit-scoped rule subsets (2–4 rules matching touched files). | User choice: prevents context bloat and prompt dilution while keeping constraints sharp. | Full stack inlining (15–20 rules in every unit). | [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]] |

### Unknowns and blockers

None. Requirements and architecture are fully specified in [[docs/context/rules/language-rule-lifecycle-binding|Context Spec]] and [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027]].

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | D-03, SHARED.md contract | `orchestrator/SHARED.md` establishes that language rules strictly supersede conflicting procedural plan steps | Unit 01.01 | Inspection of `orchestrator/SHARED.md` conflict order | planned |
| AC-02 | D-02, D-04, Templates | `docs/templates/Unit.md` contains `<language_rules>` at the end of `## Context packet` immediately before `## Steps` | Unit 01.02 | Template inspection | planned |
| AC-03 | D-01, Context Template | `docs/templates/Context.md` and `Task.md` feature explicit language stack and applicable rule sections | Unit 01.02 | Template inspection | planned |
| AC-04 | D-01, Context Skill | `skills/productivity/context/SKILL.md` instructs agents to identify active stack and pin applicable rules | Unit 02.01 | Skill inspection | planned |
| AC-05 | D-06, Plan Skill | `skills/productivity/plan/SKILL.md` mandates that units bind scoped rule subsets (2–4 rules) with checkable directives into `<language_rules>` | Unit 02.02 | Skill inspection | planned |
| AC-06 | D-01, Plan Review Skill | `skills/productivity/plan-review/SKILL.md` audits presence and scoping of `<language_rules>` blocks across units | Unit 02.03 | Skill inspection | planned |
| AC-07 | D-03, D-04, Execute Skill | `skills/engineering/execute/SKILL.md` mandates re-anchoring on `<language_rules>` before generation and enforces rule precedence | Unit 03.01 | Skill inspection | planned |
| AC-08 | D-05, Review Skill | `skills/engineering/review/SKILL.md` adds Gate 4: Language Rules Conformance Audit | Unit 03.02 | Skill inspection | planned |
| AC-09 | Tooling & Health | `scripts/plan-check.mjs` validates unit structures and `npm run doctor` passes cleanly | Unit 04.01, Unit 04.02 | `node scripts/context.mjs plan:check` & `npm run doctor` | planned |

## Scope

- Updating `orchestrator/SHARED.md` conflict order.
- Updating `docs/templates/Context.md`, `docs/templates/Task.md`, `docs/templates/Unit.md`.
- Updating `skills/productivity/context/SKILL.md`, `skills/productivity/plan/SKILL.md`, `skills/productivity/plan-review/SKILL.md`.
- Updating `skills/engineering/execute/SKILL.md`, `skills/engineering/review/SKILL.md`.
- Updating `scripts/plan-check.mjs` for rule block validation.
- Regenerating lock and verifying context doctor health.

## Non-goals

- Modifying existing rules in `rules/typescript/`, `rules/laravel/`, or `rules/flutter/`.
- Adding third-party linting daemon processes or external language servers.

## Constraints and decisions

- Zero external npm dependencies.
- Retain backwards compatibility with existing tasks and workflows.
- Strictly adhere to pure Node.js ESM.

## Worktree & Branch Topology

| Phase | Unit ID | Unit Title | Branch Name | Worktree Directory | Merge Target | Status |
|---|---|---|---|---|---|---|
| phase-01 | 01.01 | Orchestrator Precedence & Shared Contract | `task/0002/phase-01/orchestrator-precedence` | `.worktrees/0002/phase-01/orchestrator-precedence` | `task/0002/phase-01-integration` | merged |
| phase-01 | 01.02 | Context, Task, and Unit Templates Modernization | `task/0002/phase-01/templates-modernization` | `.worktrees/0002/phase-01/templates-modernization` | `task/0002/phase-01-integration` | merged |
| phase-02 | 02.01 | Context Skill Language Resolution | `task/0002/phase-02/context-skill-resolution` | `.worktrees/0002/phase-02/context-skill-resolution` | `task/0002/phase-02-integration` | merged |
| phase-02 | 02.02 | Plan Skill Scoped Rule Binding | `task/0002/phase-02/plan-skill-rule-binding` | `.worktrees/0002/phase-02/plan-skill-rule-binding` | `task/0002/phase-02-integration` | merged |
| phase-02 | 02.03 | Plan Review Audit Gate | `task/0002/phase-02/plan-review-audit-gate` | `.worktrees/0002/phase-02/plan-review-audit-gate` | `task/0002/phase-02-integration` | merged |
| phase-03 | 03.01 | Execute Skill Generation Anchor & Precedence | `task/0002/phase-03/execute-skill-anchor` | `.worktrees/0002/phase-03/execute-skill-anchor` | `task/0002/phase-03-integration` | merged |
| phase-03 | 03.02 | Review Skill Conformance Gate | `task/0002/phase-03/review-skill-conformance-gate` | `.worktrees/0002/phase-03/review-skill-conformance-gate` | `task/0002/phase-03-integration` | merged |
| phase-04 | 04.01 | Deterministic Plan Checker Script Validation | `task/0002/phase-04/plan-checker-validation` | `.worktrees/0002/phase-04/plan-checker-validation` | `task/0002/phase-04-integration` | merged |
| phase-04 | 04.02 | Full Lifecycle Synchronization & Doctor Verification | `task/0002/phase-04/sync-and-doctor` | `.worktrees/0002/phase-04/sync-and-doctor` | `task/0002/phase-04-integration` | merged |

## Phases

- [x] `phase-01-shared-contract-and-templates/phase.md` — Phase 1: Shared Orchestration Contract & Lifecycle Templates
- [x] `phase-02-upstream-planning-skills/phase.md` — Phase 2: Upstream Planning Skills (`context`, `plan`, `plan-review`)
- [x] `phase-03-downstream-execution-and-review-skills/phase.md` — Phase 3: Downstream Execution & Review Skills (`execute`, `review`)
- [x] `phase-04-tooling-verification-and-release/phase.md` — Phase 4: Tooling Verification & Release

## Verification

Commands to run for verification:
- `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0002-task-language-rule-lifecycle-binding`
- `npm run sync`
- `npm run doctor`

## Deviations

None. Branch naming adapted from `task/0002/phase-XX` to `task/0002/phase-XX-integration` to prevent git ref directory collision with unit branch slugs.

## Finalization & Merge Ledger

| Stage | Source Branch | Target Branch | Merge Commit SHA | Worktree Cleaned | Verification Command |
|---|---|---|---|---|---|
| Phase 01 Integration | `task/0002/phase-01-integration` | `task/0002-language-rule-lifecycle-binding` | `7786d72` | [x] | `git diff --stat` |
| Phase 02 Integration | `task/0002/phase-02-integration` | `task/0002-language-rule-lifecycle-binding` | `ae18e4e` | [x] | `git diff --stat` |
| Phase 03 Integration | `task/0002/phase-03-integration` | `task/0002-language-rule-lifecycle-binding` | `7740feb` | [x] | `git diff --stat` |
| Phase 04 Integration | `task/0002/phase-04-integration` | `task/0002-language-rule-lifecycle-binding` | `d983f0e` | [x] | `npm run doctor` |
| Task Base Finalization | `task/0002-language-rule-lifecycle-binding` | `master` | pending | [x] | `npm run doctor` |

## Result

All 4 phases (9 units) executed, verified, and integrated into `task/0002-language-rule-lifecycle-binding`. The development lifecycle actively binds language and framework rules from context specification and plan authoring through code generation and independent diff review gates. Plan checking confirms all units declare populated `<language_rules>` blocks and diagnostic doctor passes 100% HEALTHY.
