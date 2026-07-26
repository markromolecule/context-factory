---
name: implementation-plan
description: Create an evidence-backed, phased implementation plan without changing production code. Use when a user asks for a plan, design proposal, implementation breakdown, migration plan, or task artifact that another developer or agent will execute later.
---

# Create an Implementation Plan

Do not implement the feature while this skill is active unless the user explicitly expands the request.

## Workflow

1. Restate the requested outcome and success criteria.
2. For new-system or materially ambiguous work, require a completed `grill-with-docs` discovery record; stop and return to grilling if goals, scenarios, boundaries, or material decisions remain unresolved.
3. Inspect relevant source, tests, configuration, schemas, existing conventions, and the accepted pre-planning task record.
4. Separate verified facts, assumptions, open decisions, and out-of-scope work.
5. Use the 1-3-1 rule only for material unresolved choices; make a recommendation.
6. Identify affected files, public contracts, data changes, consumers, and rollback risks.
7. Divide work into dependency-ordered phases with concrete verification.
8. Save or refine the plan under `docs/tasks/YYYY/MM/YYYY-MM-DD/<type>-<id>-<feature>.md` using `docs/templates/Task.md`.

## Plan requirements

Include:

- outcome and measurable acceptance criteria;
- traceability from pre-planning goals, scenarios, constraints, and decisions to acceptance criteria;
- current-state evidence with file paths;
- scope and non-goals;
- decisions and assumptions;
- phase checklists with concrete files/functions;
- tests and validation for each phase;
- migration, environment, security, observability, and rollback impact when relevant;
- dependencies and blockers;
- final release and documentation checks.

Do not prescribe files that were not inspected unless clearly marked as new. Avoid vague tasks such as “handle errors”; name the boundary and expected behavior.

## Completion

Validate that phases are executable in order, every acceptance criterion maps to a task/test, and no open decision is disguised as an implementation step. Return the plan path and a concise decision summary.
