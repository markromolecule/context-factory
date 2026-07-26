---
name: design-taste
description: Route product and interface design work to reusable experience, component, and critique guidance.
scope: End-to-end product experience, interface systems, pages, flows, reusable components, and design review.
---

# Taste

Taste is the factory's reusable design judgment layer. Skills describe what an agent does; taste describes the qualities and pattern contracts used to judge whether a designed system is coherent, purposeful, accessible, and aligned with the user's intent.

Do not invoke taste as if it were a skill. Start with the appropriate skill; the skill loads the relevant taste guidance.

## Quick start

For a new system or an experience whose goals are still unclear:

```text
$grill-with-docs

Stress-test this system idea before design or coding. Resolve the actors,
goals, terminology, primary and exceptional scenarios, permissions,
constraints, non-goals, and success measures one question at a time.
Record every answer in the task artifact and stop before implementation.
```

After the grill is confirmed:

```text
$design-pattern

Craft the end-to-end product experience from the accepted pre-planning
record. Apply the relevant taste guidance, define the experience map,
visual system, page and flow patterns, reusable component contracts,
responsive behavior, accessibility, and quality review. Do not implement
until the design direction and implementation plan are approved.
```

For an already-defined component:

```text
$design-pattern

Define and review the reusable component pattern for [component].
Cover its purpose, consumers, anatomy, variants, content, behavior,
complete state matrix, accessibility, responsiveness, tokens,
composition rules, misuse cases, and verification.
```

## Design crafting workflow

| Stage | Primary procedure | Taste guidance | Required result | Gate |
|---|---|---|---|---|
| 1. Understand | `grill-with-docs` | None yet | Confirmed actors, goals, language, scenarios, constraints, and unknowns | Shared understanding confirmed |
| 2. Map the experience | `design-pattern` | [[taste/product-experience|Product experience]] | Journey, information architecture, page/flow inventory, feedback, and recovery | Primary and exceptional paths are complete |
| 3. Establish the system | `design-pattern` | Design-system worksheet and visual-system references | Personality, hierarchy, tokens, typography, color, spacing, shape, imagery, motion, and voice | Observable choices reflect user intent |
| 4. Define components | `design-pattern` | [[taste/component-contracts|Component contracts]] | Component inventory and a contract for every new or changed reusable component | States, semantics, responsive behavior, and consumers are known |
| 5. Compose | `design-pattern` | Product experience and component contracts | Representative pages and flows using realistic content and conditions | Components work together across the journey |
| 6. Critique | `design-pattern` | [[taste/quality-bar|Design quality bar]] | Evidence-backed passes, findings, exceptions, and corrections | No unresolved completion blocker |
| 7. Plan delivery | `implementation-plan` | Accepted design artifacts | Dependency-ordered implementation and verification plan | User approves before coding |

## Inputs to collect

Inspect or ask for only what the repository cannot answer:

- product outcome, actors, primary tasks, and success measures;
- accepted task record, glossary, constraints, decisions, and non-goals;
- existing brand assets, design tokens, components, and usage conventions;
- reference products and the specific qualities to borrow;
- content types, realistic density, localization, and device context;
- data, permission, mutation, latency, failure, and recovery behavior;
- accessibility target and supported input methods;
- implementation stack and technical boundaries.

Mark missing preferences as `[Open]`. Use `[Assumption]` only for reversible choices, and never disguise an unresolved product decision as a visual default.

## Recommended design artifact

Use the target repository's existing design-document convention. When none exists, create one design artifact under `docs/design/` containing:

1. outcome, actors, constraints, non-goals, and source decisions;
2. experience map and exceptional journeys;
3. information architecture and page/flow inventory;
4. visual-system decisions and token model;
5. component inventory and contracts;
6. representative compositions for mobile and desktop;
7. accessibility, content, responsive, and state requirements;
8. quality-bar review, exceptions, and unresolved findings;
9. implementation handoff with acceptance and verification criteria.

Link the design artifact to the task plan. Keep domain vocabulary in the glossary and hard-to-reverse architecture rationale in ADRs.

## Component-by-component loop

For each component or page pattern:

1. Confirm the user need and known consumers.
2. Reuse an established primitive or component when its contract fits.
3. Define anatomy, content limits, variants, behavior, states, semantics, responsiveness, tokens, and composition.
4. Exercise realistic short, long, empty, loading, invalid, error, denied, stale, offline, success, and localized content where applicable.
5. Place it in a representative page or flow; an isolated component preview is insufficient.
6. Review it against the quality bar and record justified exceptions.
7. Map the accepted contract to implementation and verification criteria.

## Ready-for-planning checklist

A design is ready for `implementation-plan` when:

- user intent and measurable success are traceable to the proposed experience;
- primary, boundary, failure, abuse, interruption, and recovery scenarios are covered where relevant;
- navigation, information hierarchy, feedback, and system status are coherent;
- every new reusable component has a complete contract and known consumers;
- representative mobile and desktop compositions use realistic content;
- accessibility and responsive behavior are specified rather than assumed;
- tokens and existing primitives are reused, with justified exceptions;
- the quality-bar review has no unresolved blocker;
- remaining unknowns have owners and do not conceal a material scope decision;
- the user has approved the design direction.

Taste does not override product evidence, accepted design-system decisions, accessibility requirements, or user direction.
