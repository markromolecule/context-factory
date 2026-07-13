---
name: feature-delivery
description: Deliver a product capability from scoped outcome through implementation, verification, documentation, and handoff.
scope: New features and material behavior changes that do not require a more specific workflow.
---

# Feature Delivery

## Triggers

Use when a request adds or materially changes user-visible or system behavior. Compose this workflow with a more specific workflow when security, migration, frontend UX, or dependency risk is central.

## Required inputs

- Desired outcome, actors, and measurable acceptance criteria.
- Current-state source and test evidence.
- Scope, non-goals, constraints, dependencies, and known rollout risk.

## Applicable rules and skills

Load global rules and only the domain rules relevant to touched files. Use `implementation-plan` for plan-only or multi-phase work, `execution-plan` for an existing plan, and task-specific skills such as `backend-module` or `form-dialog` when triggered.

## Phases

1. Inspect the repository, affected contracts, consumers, tests, and current behavior.
2. Separate evidence, assumptions, open decisions, scope, and non-goals.
3. Resolve material decisions with the 1-3-1 rule and record durable choices.
4. Plan dependency-ordered work when multiple risky or separately deployable phases exist.
5. Implement the smallest complete vertical slice with tests and documentation.
6. Run focused checks, then the broader affected typecheck, test, lint, and build checks.
7. Review acceptance criteria, security, accessibility, observability, rollout, and rollback impact.

## Quality gates

- Every acceptance criterion maps to code and verification evidence.
- Relevant rules and skills were selected explicitly; unrelated context was not loaded.
- Public contracts, errors, configuration, and documentation agree with behavior.
- No unresolved high-severity review finding remains.

## Stop and escalation conditions

Stop for user direction when a missing product decision changes scope materially, a destructive action lacks authorization, a breaking contract has unknown consumers, or required external access is unavailable.

## Artifacts and completion

Use a task artifact for multi-phase work and an ADR for durable architecture. Report changed outcomes, evidence, tests, migrations/configuration, deviations, remaining risks, and follow-up work without claiming checks that were not run.
