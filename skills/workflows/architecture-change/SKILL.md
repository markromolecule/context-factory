---
name: architecture-change
description: Change durable system boundaries, dependency direction, shared patterns, or public contracts with explicit evidence, decisions, migration, and architecture verification.
scope: Cross-module architecture, shared abstractions, public contracts, persistence strategies, deployment topology, and system-wide patterns.
primaryAgent: architect-agent
participatingAgents: [pm-agent, threat-agent, devops-agent]
rules:
  - rules/global/evidence-and-claims.md
  - rules/global/architecture-conformance.md
  - rules/global/code-quality.md
  - rules/global/1-3-1-rule.md
skills:
  - adr
  - plan
  - execute
  - refactor
---

# Architecture Change

## Triggers

Use when work changes dependency direction, module ownership, a public contract with known consumers, persistence strategy, runtime topology, or a pattern intended for multiple modules.

- **T0 (Direct Questions):** Inquiries regarding existing architecture, boundaries, or ADR history require no workflow; inspect files and answer directly.
- **T1:** Architecture changes by definition alter durable system boundaries or shared contracts and are never classified as T1.
- **T2 (Internal Boundary Refactoring):** Cross-module refactoring within settled architecture requires a task plan (`docs/tasks/`), ADR when choosing among durable alternatives, and phased execution.
- **T3 (Systemic Architecture Change):** Modifying public contracts with known consumers, introducing new frameworks, persistence shifts, or new runtime topologies. Requires pre-planning discovery (`context` / `grill`) when intent is ambiguous, ADR evaluation, phased plan, and review approval before execution.

## Required inputs

- Desired outcome, current boundary evidence, affected consumers, constraints, and measurable architecture qualities.
- Compatibility, migration, rollout, rollback, ownership, and decision authority.

## Applicable rules and skills

Apply evidence-and-claims, architecture-conformance, code-quality, security, and 1-3-1. For a new system or an architecture request with unresolved goals and scenarios, start with `grill`. Use `grounding` before proposing a boundary and `adr` to record a durable choice. Use `plan`/`execution` for multi-phase migration.

## Phases

1. When the system intent is not settled, grill goals, actors, scenarios, domain language, constraints, and non-goals before architecture planning.
2. Discover current boundaries, contracts, dependency direction, consumers, tests, and relevant decisions.
3. Define the architecture problem, qualities, constraints, assumptions, non-goals, and authority.
4. Compare exactly three viable approaches and record the accepted decision.
5. Design compatibility, incremental migration, observability, rollback, and exception handling.
6. Implement the smallest end-to-end boundary slice, resolve applicable rules, and execute configured host checks (lint, test, typecheck, and build).
7. Migrate consumers in dependency order without parallel sources of business policy.
8. Verify contracts, dependency rules, behavior, operations, documentation, and removal of temporary bridges.

## Quality gates

- Current and target boundaries are supported by inspected evidence.
- Decision authority, tradeoffs, consumers, compatibility, and recovery are explicit.
- Configured host checks (lint, test, typecheck, build) and architecture contract tests pass with zero blocking errors; evidence-blocking directives carry named human evidence.
- No undocumented circular dependency, parallel policy source, or permanent compatibility shim remains.

## Stop and escalation conditions

Stop when decision authority is missing, consumers are unknown for a breaking contract, migration cannot be made recoverable, security/data boundaries are ambiguous, or a required architecture quality cannot be verified.

## Artifacts and completion

Maintain an implementation task and accepted ADR. Completion requires migrated consumers, passing host and architecture test suites with zero blocking violations, synchronized diagrams/contracts/runbooks, removed or owned exceptions, and an evidence-backed handoff.
