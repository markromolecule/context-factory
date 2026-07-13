---
title: First-Class Development Workflows
type: decision
status: accepted
created: 2026-07-13
tags: [adr, workflows, orchestration, llm]
---

# 0003 — First-Class Development Workflows

## Context

Rules define constraints and skills define specialized procedures, but neither consistently coordinates an end-to-end development lifecycle across roles, gates, artifacts, verification, and escalation. The existing workflow map contained prose but no independently discoverable or validated workflow contracts.

## Options considered

1. Keep all lifecycle guidance in one `docs/Workflows.md` document.
2. Represent multi-stage delivery workflows as additional skills.
3. Add first-class workflow files with their own manifest inventory, map, metadata, and validation.

## Decision

Add `workflows/*.md` as a first-class context layer. Each workflow defines triggers, required inputs, applicable rules/skills, phases, quality gates, stop/escalation conditions, artifacts, and completion evidence.

Agents load only the most-specific matching workflow for multi-stage work and compose another workflow only when the selected workflow requires it. Workflows coordinate behavior but never expand user authorization.

## Consequences

- LLMs receive consistent lifecycle guardrails without loading every workflow on every task.
- Rules, skills, and workflows have distinct, reviewable responsibilities.
- The manifest, validator, architecture, shared load order, and workflow map must remain synchronized.
- Routine edits should not incur workflow ceremony; selection depends on trigger and risk.

## Validation and review date

Review after workflows have guided ten material tasks or by 2027-01-13. Evaluate incorrect workflow selection, missed gates, unnecessary context loading, escalation quality, and verification completeness.
