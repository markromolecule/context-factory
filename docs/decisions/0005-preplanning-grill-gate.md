---
title: Pre-planning Grill Gate
type: decision
status: accepted
created: 2026-07-26
tags: [adr, planning, discovery, skills]
---

# 0005 — Pre-planning Grill Gate

## Context

Implementation plans can appear complete while carrying unresolved goals, ambiguous domain language, missing actors, and uncovered failure scenarios. Chat-only discovery also loses detailed constraints when it is summarized into a later plan.

## Options considered

1. Keep discovery inside `implementation-plan`. This is simple, but mixes product clarification with executable planning and encourages premature file-level commitments.
2. Require `grill-with-docs` as the first pre-planning skill for new systems and materially ambiguous capabilities, preserving each answer before plan synthesis.
3. Require a fixed questionnaire for every change. This is deterministic but burdens routine work and cannot follow decision dependencies naturally.

## Decision

Adopt option 2. `grill-with-docs` opens the pre-planning lifecycle, inspects repository evidence, asks one unresolved question at a time with a recommendation, records answers and scenarios in the task artifact, maintains implementation-neutral glossary language, and creates ADRs only for durable trade-offs. It stops before coding and hands a confirmed record to `implementation-plan`.

## Consequences

- New-system planning begins from traceable shared understanding.
- Routine and already-specified changes do not pay the grilling cost.
- Task artifacts require richer scenario and decision sections.
- Plan approval becomes an explicit gate before execution.
- Upstream skill updates must be reviewed and adapted to preserve Context Factory artifact paths and stop conditions.

## Validation and review date

Review after ten new-system planning sessions or by 2027-01-26. Measure unresolved decisions discovered after planning, scenario-to-acceptance traceability, planning rework, and accidental implementation before approval.
