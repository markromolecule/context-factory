---
title: "Phase 1 — Discovery, Scenarios, and Boundary Analysis"
type: phase
parent: "0004-task-new-project-progressive-contract-driven-workflow"
phase: "01"
status: completed
created: "2026-08-20"
tags: [task, phase, discovery, grill-with-docs]
---

# Phase 1 — Discovery, Scenarios, and Boundary Analysis

## Objective

Establish pre-planning discovery protocols utilizing `@skills/grill-with-docs/SKILL.md` to stress-test requirements, define actor boundaries, establish canonical glossary terminology, and audit scenario coverage prior to implementation planning.

## Dependencies & Prerequisites

- Raw feature brief or context specification in `docs/context/`.
- Repository source code and existing decisions available for inspection via `repository-discovery`.

## Impacted Files & Components

- `skills/grill-with-docs/SKILL.md` — Discovery and pre-planning interrogation skill.
- `docs/context/new-project-workflow/index.md` — Workflow specification (Phases 0 & 1).
- `docs/decisions/0011-progressive-contract-driven-loop-engineering.md` — ADR 0011.
- `docs/tasks/2026/08/2026-08-20/0004-task-new-project-progressive-contract-driven-workflow/README.md` — Task decision ledger and scenario matrix.

## Implementation Tasks

- [x] Task 1.1 — Define structured pre-planning interview contract (ask 1 question at a time, explain trade-offs, provide recommended answers).
- [x] Task 1.2 — Map actor boundaries, authentication models, permission levels, and multi-tenant constraints.
- [x] Task 1.3 — Formalize domain terminology in the project glossary following `references/glossary-format.md`.
- [x] Task 1.4 — Author Architecture Decision Records (ADRs) under `docs/decisions/` for non-obvious, irreversible architectural choices (`0011-progressive-contract-driven-loop-engineering.md`).
- [x] Task 1.5 — Perform discovery coverage audit ensuring all happy paths, edge cases, failure modes, and recovery paths are bounded before planning.

## Verification & Testing

- Validated that all unknowns and assumptions are resolved in the decision ledger (DEC-01 through DEC-05).
- Confirmed ADR 0011 is authored and indexed in `docs/decisions/README.md`.
- Verified pre-planning grilling gates in `docs/context/new-project-workflow/index.md`.

## Risks & Rollback

- **Risk:** Premature implementation planning on unverified assumptions.
- **Rollback:** Stop execution immediately and return to `@skills/grill-with-docs/SKILL.md` until ambiguity is cleared.
