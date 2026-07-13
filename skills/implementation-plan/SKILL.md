---
name: implementation-plan
description: Create an evidence-backed, phased implementation plan without changing production code. Use when a user asks for a plan, design proposal, implementation breakdown, migration plan, or task artifact that another developer or agent will execute later.
---

# Create an Implementation Plan

Do not implement the feature while this skill is active unless the user explicitly expands the request.

## Workflow

1. Restate the requested outcome and success criteria.
2. Inspect relevant source, tests, configuration, schemas, and existing conventions.
3. Separate verified facts, assumptions, open decisions, and out-of-scope work.
4. Use the 1-3-1 rule only for material unresolved choices; make a recommendation.
5. Identify affected files, public contracts, data changes, consumers, and rollback risks.
6. Divide work into dependency-ordered phases with concrete verification.
7. Save the plan under `docs/tasks/YYYY/MM/YYYY-MM-DD/<type>-<id>-<feature>.md` using `docs/templates/Task.md`.

## Plan requirements

Include:

- outcome and measurable acceptance criteria;
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
