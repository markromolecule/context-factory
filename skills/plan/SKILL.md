---
name: plan
description: Create an evidence-backed, phased implementation plan without changing production code. Use when a user asks for a plan, design proposal, implementation breakdown, migration plan, or task artifact that another developer or agent will execute later (/plan, [PLAN]).
---

# Create an Implementation Plan

Do not implement the feature while this skill is active unless the user explicitly expands the request.

## Workflow

1. Ingest and analyze the user-provided context (e.g. a grilled context specification under `docs/context/` created via `context`, or direct user input) end-to-end.
2. Restate the requested outcome, boundaries, and measurable success criteria.
3. For new-system, feature, or materially ambiguous work, ensure requirements and scenarios are grounded in a completed `context` specification or `grill` discovery record; stop and trigger `context` / `grill` if goals, scenarios, edge cases, boundaries, or material decisions remain unresolved.
4. Inspect relevant source files, tests, configuration, schemas, and existing conventions.
5. Separate verified facts, assumptions, open decisions, and out-of-scope work.
6. Use the 1-3-1 rule only for material unresolved choices; make a recommendation.
7. Identify affected files, public contracts, data changes, consumers, and rollback risks.
8. Audit architectural choices against SOLID principles (`rules/solid/`): enforce single-responsibility decomposition, open/closed extension strategies, substitutable contracts, lean client interfaces, and dependency inversion before finalizing task breakdowns.
9. Divide work into dependency-ordered phases with concrete verification steps.
10. Organize and create the task directory under `docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-<type>-<feature>/`:
   - **Master Plan Artifact:** `README.md` (or `<type>-<id>-<feature>.md`) using `docs/templates/Task.md` containing outcome, criteria, scope, decision ledger, and phase index.
   - **Phase Breakdown Artifacts:** `phase-01-<feature>.md`, `phase-02-<feature>.md`, etc. using `docs/templates/Phase.md` detailing step-by-step tasks, affected files, verification checks, and rollback plans for each phase.

## Plan requirements

Include:

- outcome and measurable acceptance criteria;
- traceability from user context, goals, scenarios, constraints, and decisions to acceptance criteria;
- current-state evidence with verified file paths;
- scope and non-goals;
- decisions and assumptions;
- modular phase breakdowns with concrete files, functions, and checklists;
- tests and validation for each phase;
- migration, environment, security, observability, and rollback impact when relevant;
- dependencies and blockers;
- final release and documentation checks.

Do not prescribe files that were not inspected unless clearly marked as new. Avoid vague tasks such as “handle errors”; name the boundary and expected behavior.

## Completion

Validate that phases are executable in order, every acceptance criterion maps to a task/test, and no open decision is disguised as an implementation step. Return the created task folder path and a concise summary of the phases.
