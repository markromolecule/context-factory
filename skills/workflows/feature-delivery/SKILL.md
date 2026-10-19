---
name: feature-delivery
description: Deliver a product capability from scoped outcome through implementation, verification, documentation, and handoff.
scope: New features and material behavior changes that do not require a more specific workflow.
primaryAgent: pm-agent
participatingAgents: [ba-agent, architect-agent, ux-agent, devops-agent]
rules:
  - rules/global/code-quality.md
  - rules/global/evidence-and-claims.md
  - rules/global/architecture-conformance.md
skills:
  - context
  - grill
  - plan
  - plan-review
  - execute
  - test
---

# Feature Delivery

## Triggers

Use when a request adds or materially changes user-visible or system behavior. Compose this workflow with a more specific workflow when security, migration, or dependency risk is central.

- **T0 (Direct Questions / Factual Inquiries):** Inquiries regarding existing features, code explanation, or factual questions require no workflow; answer directly from inspected evidence.
- **T1 (Small Isolated Changes):** Single-file modifications with no public API, schema, authorization, or dependency impact require proportional tests and direct implementation without a multi-phase task plan.
- **T2 (Scoped Feature Delivery):** Multi-file feature delivery or changes affecting public API surfaces. Requires context resolution, a task plan under `docs/tasks/`, preflight receipt, and phased execution.
- **T3 (New System / Product / Ambiguous Capability):** Greenfield services, new products, or materially ambiguous capabilities. Requires pre-planning discovery with `context` or `grill` first, releasing a verified brief, implementation planning with `plan`, and explicit plan approval via `plan-review` before production execution begins.


## Required inputs

- Desired outcome, actors, and measurable acceptance criteria.
- Current-state source and test evidence.
- Scope, non-goals, constraints, dependencies, and known rollout risk.

## Applicable rules and skills

Load global rules and only the domain rules relevant to touched files. For a new system, product, or feature context, author and grill requirements with `context` or `grill`; `grill` releases one verified brief to `plan`. `plan-review` reviews the plan and issues an approved execution packet. Use `execute` only with that current packet.

## Phases

1. For a new feature, system, or materially ambiguous capability, open pre-planning with `context` or `grill`; inspect repository evidence and resolve one decision at a time.
2. Persist actors, goals, terminology, scenarios, constraints, non-goals, decisions, and unknowns in the correct context specification (`docs/context/`), glossary, task, and ADR artifacts.
3. Audit scenario coverage and obtain confirmation of shared understanding before implementation planning.
4. Use `plan` to turn the accepted context/discovery record into dependency-ordered work and measurable verification.
5. Require explicit plan approval before `execution` or production implementation begins.
6. Implement the smallest complete vertical slice with tests and documentation.
7. Run focused checks, then the broader affected typecheck, test, lint, and build checks.
8. Review acceptance criteria, security, accessibility, observability, rollout, and rollback impact.

## Quality gates

- Every acceptance criterion maps to code and verification evidence.
- Every planned acceptance criterion traces to a resolved goal, scenario, constraint, or accepted decision.
- New-system work has a completed grill record and explicit plan approval before coding.
- Relevant rules and skills were selected explicitly; unrelated context was not loaded.
- Public contracts, errors, configuration, and documentation agree with behavior.
- No unresolved high-severity review finding remains.

## Stop and escalation conditions

Stop for user direction when a missing product decision changes scope materially, a destructive action lacks authorization, a breaking contract has unknown consumers, or required external access is unavailable.

## Artifacts and completion

Use a task artifact for multi-phase work and an ADR for durable architecture. Report changed outcomes, evidence, tests, migrations/configuration, deviations, remaining risks, and follow-up work without claiming checks that were not run.
