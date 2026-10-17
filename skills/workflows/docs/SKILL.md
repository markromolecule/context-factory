---
name: docs
description: Synthesize evidence-backed development and system reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation with tables and conclusions.
scope: System reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation.
primaryAgent: pm-agent
participatingAgents: [architect-agent, ba-agent, devops-agent]
rules:
  - rules/global/evidence-and-claims.md
  - rules/global/architecture-conformance.md
  - rules/global/code-quality.md
skills:
  - docs
  - grill
  - explore
---

# Documentation & System Reporting Workflow

## Triggers

Use when the user requests technical documentation, evidence-backed system reports, performance mitigation summaries, architectural digests, post-mortems, or sprint retrospectives (`/doc`, `/docs`, `[DOC]`, `[DOCS]`, `/documentation`, `[DOCUMENTATION]`).

## Required inputs

- Documentation topic, target subsystem, or performance area.
- Intended audience (executive, engineering team, auditor/compliance).
- Historical evidence targets in `docs/context/`, `docs/tasks/`, `docs/decisions/`, and git history.

## Applicable rules and skills

Apply `rules/global/evidence-and-claims.md`, `rules/global/architecture-conformance.md`, and `rules/global/code-quality.md`. Load `skills/productivity/docs/SKILL.md` for historical traversal, embedded grilling discovery, and tabular synthesis. Use `explore` for inspecting codebase files and git logs.

## Phases

1. **Request Intake & Scope Parsing:** Identify the requested report topic, timeframe, and audience.
2. **Historical & Evidence Traversal:** Systematically inspect `docs/context/` specs, `docs/tasks/` plans, `docs/decisions/` ADRs, and codebase commits/benchmarks.
3. **Embedded Grill Discovery:** If scope, metrics, or timeframe are underspecified, ask exactly one question at a time with clear trade-offs.
4. **Tabular Synthesis:** Format problems, interventions, and metrics into standardized markdown comparison tables.
5. **Formulate Evidence-Backed Conclusions:** Classify claims according to evidence rules and state actionable next steps.
6. **Artifact Output:** Scaffold the final report using `docs/templates/Report.md` under `docs/reports/` (or host project documentation directory).

## Quality gates

- Every summary claim maps to verified task files, source commits, or test runs.
- Comparative metric tables include baseline, observed, and delta calculations where data exists.
- Architectural trade-offs reference applicable ADRs under `docs/decisions/`.
- No unverified assertions are stated as facts without explicit qualification.

## Stop and escalation conditions

Stop for user clarification when the target system, timeframe, or baseline benchmark is missing or completely ambiguous.

## Artifacts and completion

Write the report to `docs/reports/YYYY/MM/YYYY-MM-DD-<topic>.md` using `docs/templates/Report.md`. Output report path, key conclusions, and recommended follow-up actions without modifying production code.
