---
name: plan
description: Create an evidence-backed, phased implementation plan without changing production code, broken into atomic task units that can each be handed to a separate session or agent to execute. Every unit carries its own standalone context and a justified test plan (unit, integration, architecture, contract, or migration tests, chosen to fit what actually changes). Use when a user asks for a plan, design proposal, implementation breakdown, migration plan, or task artifact that another developer or agent will execute later (/plan, [PLAN]).
---

# Create an Implementation Plan

Do not implement the feature while this skill is active unless the user explicitly expands the request.

## Why break plans into units

A phase tells you *what order* things happen in. A unit tells a fresh session *everything it needs* to safely do one piece of that work — without having read this planning conversation, the master plan, or any other unit. Splitting work this finely buys you three things: different units can go to different sessions (or run concurrently, when they don't depend on each other), a unit that gets interrupted or loses context can be picked back up from its file alone, and a reviewer can judge one focused change against one focused test plan instead of an entire phase at once. It costs some duplication — each unit repeats the slice of context it needs instead of pointing back at the plan — but that duplication is exactly what makes cross-session execution reliable, so don't trim it to save space.

Size units by responsibility, not by line count. A unit should correspond to one coherent seam surfaced by the SOLID audit below — one responsibility, one contract, one boundary — not an arbitrary file count. If you can't describe what a unit does in one sentence, it's too big; if two units only ever make sense executed together, merge them.

## Workflow

1. Ingest and analyze the user-provided context (e.g. a grilled context specification under `docs/context/` created via `context`, or direct user input) end-to-end.
2. Restate the requested outcome, boundaries, and measurable success criteria.
3. For new-system, feature, or materially ambiguous work, ensure requirements and scenarios are grounded in a completed `context` specification or `grill` discovery record; stop and trigger `context` / `grill` if goals, scenarios, edge cases, boundaries, or material decisions remain unresolved.
4. Inspect relevant source files, tests, configuration, schemas, and existing conventions.
5. Separate verified facts, assumptions, open decisions, and out-of-scope work.
6. Use the 1-3-1 rule only for material unresolved choices; make a recommendation.
7. Identify affected files, public contracts, data changes, consumers, and rollback risks.
8. Audit architectural choices against SOLID principles (`rules/solid/`): enforce single-responsibility decomposition, open/closed extension strategies, substitutable contracts, lean client interfaces, and dependency inversion before finalizing task breakdowns. Note every boundary this audit surfaces — each is a candidate for an architecture test in step 10.
9. Map the work as a dependency graph, not just a line of phases. For every piece of work, decide what it genuinely must wait on versus what merely happened to be written next to it. Group sequential milestones into phases; within each phase, decompose into atomic units connected by explicit `depends_on` edges. Flag units with no edge between them as parallelizable — they're candidates for separate, concurrent sessions.
10. For each unit, choose its test types from what the unit actually changes, not by habit:
    - Logic isolated in one function or module, no new collaborators → **unit tests** covering the happy path plus the edge/error cases the context spec calls out.
    - Change crosses a component, process, or network/DB boundary → **integration tests** exercising that seam with real or realistic collaborators.
    - Change touches dependency direction, layering, or a boundary flagged in the SOLID audit → **architecture tests**: an automated check where the stack supports one (dependency-cruiser, ArchUnit, a custom lint rule), otherwise an explicit manual review checklist.
    - Change alters a public API, event payload, schema, or CLI surface → **contract tests**, plus a note on affected consumers.
    - Change touches data or schema → **migration tests**, forward and rollback.
    - Change touches auth, permissions, or input handling → add negative/abuse-case tests alongside whichever category above applies.
    - A pure refactor with no behavior change → say so explicitly and require the existing suite to still pass; don't invent new tests to fill a checklist.
    Justify every test type you assign in one line: what would break, undetected, without it. A test type with no justification doesn't belong on the unit.
11. Organize and create the task directory under `docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-<type>-<feature>/`:

- **Master Plan Artifact:** `README.md` (or `<type>-<id>-<feature>.md`) using `docs/templates/Task.md` — outcome, criteria, scope, decision ledger, the phase/unit dependency graph, and a phase index.
- **Phase Overview Artifacts:** `phase-01-<feature>/phase.md`, `phase-02-<feature>/phase.md`, etc. using `docs/templates/Phase.md` — the goal shared by that phase's units, context common to all of them, the unit index with dependency and parallelizable flags, and phase-level rollback.
- **Unit Artifacts:** `phase-01-<feature>/unit-01-<slug>.md`, `unit-02-<slug>.md`, etc. using `docs/templates/Unit.md` (see below — create it in the repo if it doesn't exist yet). Each unit must be self-contained: together with its phase overview and the repository itself, it must give a fresh session — one with no memory of this conversation or the master plan — everything needed to execute it correctly, including its own test plan.

## Plan requirements

Include:

- outcome and measurable acceptance criteria;
- traceability from user context, goals, scenarios, constraints, and decisions to acceptance criteria, down to the specific unit and test that verifies each one;
- current-state evidence with verified file paths;
- scope and non-goals, stated at both the plan level and the unit level;
- decisions and assumptions;
- a dependency graph distinguishing units that must run in order from units that can run in parallel, in separate sessions;
- modular unit breakdowns with concrete files, functions, and checklists, each carrying its own standalone context packet;
- a test plan per unit, typed (unit/integration/architecture/contract/migration/etc.) and justified by what the unit actually changes;
- migration, environment, security, observability, and rollback impact when relevant — at the unit level where the impact is unit-scoped, at the phase level where it isn't;
- dependencies and blockers;
- final release and documentation checks.

Do not prescribe files that were not inspected unless clearly marked as new. Avoid vague tasks such as "handle errors"; name the boundary and expected behavior. Hold tests to the same standard: avoid vague verification such as "add tests"; name the case, the seam it exercises, and the test type that fits it.

## Completion

Validate that:

- phases are executable in order, and the dependency graph between units is acyclic;
- every acceptance criterion maps to a unit and to a test that verifies it;
- no open decision is disguised as an implementation step;
- each unit's context packet is genuinely sufficient for a cold-start session — if executing it would require re-reading the master plan or this conversation, fold the missing piece into the unit instead of assuming it will be available.

Return the created task folder path and a concise summary of the phases, the units within each, and which units can run in parallel.
