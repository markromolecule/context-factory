---
title: Pre-planning Gate and Design Taste Layer
type: task
status: completed
created: 2026-07-26
tags: [task, context, planning, design]
---

# Pre-planning Gate and Design Taste Layer

## Outcome

Make `grill-with-docs` the first pre-planning skill for new systems and materially ambiguous capabilities, and add reusable design-taste guidance that expands `design-pattern` from visual-system work to end-to-end experiences and component contracts.

## Pre-planning record

### Actors and goals

- Product owner: expose goals, scenarios, decisions, and unknowns before coding.
- Designer/developer agent: translate user intent into coherent flows and reusable component patterns.
- Reviewer: verify traceability, accessibility, responsiveness, and conformance.

### Domain language

- **Pre-planning grill:** decision-by-decision discovery before implementation planning.
- **Taste:** reusable design judgment applied by a skill; not an executable skill registry.
- **Component contract:** the anatomy, behavior, states, semantics, composition, and verification expected of a reusable component.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S1 | Owner proposes a new system | Goals and scenarios are incomplete | Grill runs before implementation planning | Unknowns remain explicit blockers | covered |
| S2 | Agent designs a product flow | Product intent is stable | Experience guidance shapes the full journey | Return to grill if product decisions are missing | covered |
| S3 | Agent creates a component family | Consumers and system tokens are known | Complete component contracts and compositions are produced | Avoid or document unjustified variants | covered |
| S4 | Reviewer assesses design completion | Representative flows exist | Quality bar produces evidence-backed findings | Incomplete states prevent completion | covered |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D1 | Where should discovery live? | First pre-planning skill | Separates shared understanding from file-level planning | Plan-only discovery, universal questionnaire | ADR 0005 |
| D2 | Where should design judgment live? | Canonical `taste/` layer | Preserves one design skill with progressive disclosure | Monolithic skill, fragmented skills | ADR 0006 |

### Unknowns and blockers

None.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC1 | S1, D1 | New-system resolution selects the grill and planning chain | Skill, workflow, resolver, evaluation | Context evaluation | complete |
| AC2 | S2–S4, D2 | Design work can select canonical taste guidance | Taste files, resolver, design skill | Context evaluation and validator | complete |
| AC3 | D1, D2 | Inventory, maps, decisions, and lock agree | Manifest and documentation updates | Context doctor | complete |

## Scope

Canonical context, routing, documentation, templates, evaluations, and validation.

## Non-goals

- Automatically implementing after the grill.
- Replacing project-specific design systems or component libraries.
- Treating taste as subjective permission to override evidence.

## Constraints and decisions

Preserve progressive disclosure and existing Context Factory artifact conventions.

## Phases

- [x] Phase 1 — define the pre-planning skill and lifecycle gate
- [x] Phase 2 — add the taste layer and expand design-pattern
- [x] Phase 3 — synchronize inventory, routing, maps, decisions, and evaluations
- [x] Phase 4 — regenerate the lock and validate

## Verification

- `quick_validate.py skills/grill-with-docs` — passed.
- `quick_validate.py skills/design-pattern` — passed.
- `node scripts/context.mjs resolve "Pre-plan a new billing system before coding"` — selected `grill-with-docs`, `implementation-plan`, and `repository-discovery`; excluded execution and taste context.
- `node scripts/context.mjs resolve "Design a reusable combobox component and review its quality"` — selected `design-pattern`, component contracts, and the design quality bar.
- `node scripts/context.mjs doctor` — structural validation passed; lock current; 10/10 behavioral evaluations passed.

## Deviations

The upstream update command is not used as the canonical source because it installs into an agent-specific directory. Context Factory keeps an adapted, reviewed copy in its manifest and documents upstream synchronization as a maintenance action.

## Result

Implemented in Context Factory 3.2.1. Final lock digest: `sha256:f34c718de7a9687dfcc2fc2b1ada23c4a2d4978ad4d65c33f483501aa1b7f70d`.
