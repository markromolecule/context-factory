---
title: "Execution Control, Code Review Optimization Workflow, and Modular Refactoring Skill"
type: task
status: completed
created: "2026-08-22"
tags: [task, execute, refactor, optimization, workflow, skills]
---

# Execution Control, Code Review Optimization Workflow, and Modular Refactoring Skill

## Outcome

Establish strict phase-by-phase execution control and developer checkpointing in `execute` (renamed from `execution`), introduce a dedicated `code-review-and-optimization` workflow to verify and optimize generated implementation plan code, and create an autonomous and manual `refactor` skill to decompose complex monolithic files into modular, maintainable units.

## Pre-planning record

### Actors and goals
- **Developer:** Wants full oversight during plan execution with mandatory stops at every phase boundary, plus the ability to optimize and refactor code on demand.
- **AI Assistant / LLM:** Needs a strict directive to halt after completing single phases, a structured workflow to audit code quality post-implementation, and a specialized procedure to refactor complex files safely without breaking contracts.
- **Tech Lead / Reviewer:** Requires evidence-backed validation and clean, modular codebase architecture.

### Domain language
- **Phase-Stop Gate:** Mandatory execution pause at the conclusion of each phase file where the agent reports verification diffs/evidence and stops.
- **Post-Implementation Review:** Systematic quality audit assessing query performance, type safety, render efficiency, and dead code removal on newly written code.
- **Modular Refactoring:** Structural decomposition of oversized, multi-responsibility files into cohesive, single-responsibility files while preserving public contracts.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Developer runs multi-phase plan via `/execute` | Plan exists with 3 phases | Agent completes Phase 1, runs tests, presents evidence, and strictly stops | Agent does not proceed to Phase 2 until user approves | Planned |
| SC-02 | Developer runs `/optimize` on plan-affected files | Code generated from plan | Workflow analyzes diffs, checks ESR indexing & type hygiene, and suggests optimizations | Issues highlighted with 1-3-1 recommendations | Planned |
| SC-03 | LLM detects 300+ line god-service during review | Complex file with multiple concerns | LLM recommends or triggers `refactor` to split into domain files with barrel exports | External consumers stay intact, tests pass | Planned |
| SC-04 | User manually invokes `/refactor <file>` | Target file specified | `refactor` decomposes file into sub-components/hooks/services and updates imports | If tests fail, refactor rolls back | Planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | How should execution skill be named? | Rename `skills/execution` $\rightarrow$ `skills/execute` | Matches consistent action verb taxonomy (`grill`, `plan`, `execute`, `verify`, `explore`, `refactor`) | Keeping noun `execution` | `skills/execute/SKILL.md` |
| DEC-02 | How strict should phase stops be? | Mandatory hard stop at every phase boundary | Prevents autonomous multi-phase runaways and ensures developer inspection | Optional phase stops | `skills/execute/SKILL.md` |
| DEC-03 | How should optimization workflow be structured? | Dedicated `workflows/code-review-and-optimization.md` | Independent guardrail after implementation plan execution | Merging silently into release readiness | `workflows/code-review-and-optimization.md` |
| DEC-04 | How should refactor skill trigger? | Hybrid: Autonomous LLM suggestion + Manual `/refactor` | Flexible for both AI proactive modularization and human intent | Autonomous-only or manual-only | `skills/refactor/SKILL.md` |

### Unknowns and blockers
- None. Context specification in `docs/context/skills/execution-control-and-modular-refactoring.md` is complete and verified.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | DEC-01 | `skills/execution` renamed to `skills/execute` with frontmatter `name: execute` | `skills/execute/SKILL.md` | `node scripts/context.mjs lint` | Planned |
| AC-02 | DEC-02, SC-01 | `execute` strictly stops on every phase with structured checkpoint report | `skills/execute/SKILL.md` | Contract inspection | Planned |
| AC-03 | DEC-03, SC-02 | `workflows/code-review-and-optimization.md` created with 5-stage review | `workflows/code-review-and-optimization.md` | Schema/workflow validation | Planned |
| AC-04 | DEC-04, SC-03, SC-04 | `skills/refactor/SKILL.md` and `openai.yaml` created | `skills/refactor/SKILL.md` | Harness skill resolution | Planned |
| AC-05 | System Integrity | All manifest entries, orchestrators, subagents, maps, and lockfile updated | All context adapters | `node scripts/context.mjs doctor` | Planned |

## Scope

- Rename `skills/execution/` to `skills/execute/` and update all references.
- Update `skills/execute/SKILL.md` with strict phase-stop rules and reporting format.
- Create `workflows/code-review-and-optimization.md`.
- Create `skills/refactor/SKILL.md` and `skills/refactor/agents/openai.yaml`.
- Update all entrypoints, orchestrators, subagents, manifest, and lockfile.
- Create ADR 0015.

## Non-goals

- Modifying core domain rules under `rules/`.
- Automatic destructive code deletions without developer confirmation.
- Modifying target application production runtime code.

## Constraints and decisions

- Follow Context Factory schema standards: all skills must have exactly `name` and `description` in frontmatter.
- Workflows must contain all 7 mandatory sections.
- Skill count increases from 9 to 10 (`context`, `grill`, `plan`, `execute`, `refactor`, `adr`, `verify`, `explore`, `security`, `grounding`).

## Phases

- [x] **Phase 1: Rename `execution` to `execute` and Implement Mandatory Phase Stops** (Completed) — `phase-01-rename-and-strict-stop-execute-skill.md`
- [x] **Phase 2: Code Review and Optimization Workflow** (Completed) — `phase-02-code-review-and-optimization-workflow.md`
- [x] **Phase 3: Modular Refactoring Skill** (Completed) — `phase-03-modular-refactoring-skill.md`
- [x] **Phase 4: Orchestrators, Subagents, Documentation Maps, and Manifest** (Completed) — `phase-04-orchestrators-subagents-and-manifest.md`
- [x] **Phase 5: Verification, Evaluations, Lockfile, and Doctor** (Completed) — `phase-05-verification-evals-and-lock.md` — Phase 5: Run full test suite, evaluations, lock generation, and doctor

## Verification

- `node scripts/context.mjs lint`
- `node scripts/context.mjs lock`
- `node scripts/context.mjs doctor`
- `node scripts/context.mjs resolve "/execute phase 1"`
- `node scripts/context.mjs resolve "/optimize generated code"`
- `node scripts/context.mjs resolve "/refactor src/services/user.ts"`

## Deviations

## Result
