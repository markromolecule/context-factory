---
title: "Phase 2 — Code Review and Optimization Workflow"
type: phase
parent: "0001-task-execution-control-and-modular-refactoring"
phase: "02"
status: completed
created: "2026-08-22"
tags: [task, phase, workflow, optimization, review]
---

# Phase 2 — Code Review and Optimization Workflow

## Objective

Create `workflows/code-review-and-optimization.md` to serve as a specialized guardrail assessing, suggesting improvements for, and optimizing code generated during implementation plans.

## Dependencies & Prerequisites

- Phase 1 completed.

## Impacted Files & Components

- `workflows/code-review-and-optimization.md` (new workflow file).
- `docs/Workflows.md` (workflow index map updated).

## Implementation Tasks

- [x] Task 2.1 — Create `workflows/code-review-and-optimization.md` with all 7 required workflow sections (Triggers, Required inputs, Applicable rules and skills, Phases, Quality gates, Stop and escalation conditions, Artifacts and completion).
- [x] Task 2.2 — Define the 5 review stages:
  1. *Diff & Contract Analysis:* Pin all modified/created files from task or plan.
  2. *Quality & Performance Audit:* Verify ESR query indexing, TypeScript type narrowing, React render efficiency, async discipline, and dead code removal.
  3. *Modularity Assessment:* Detect lengthy multi-function files violating single responsibility.
  4. *Targeted Optimization & Refactoring:* Propose 1-3-1 recommendations or invoke `skills/refactor` for modular breakdown.
  5. *Regression Verification:* Run test suites and compiler checks to ensure identical functional behavior.
- [x] Task 2.3 — Add triggers: `/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]`, and post-execution review.

## Verification & Testing

- Validated workflow YAML frontmatter (`name: code-review-and-optimization`, `scope`, `description`).
- Validated presence of all 7 mandatory markdown sections with `node scripts/context.mjs lint`.
- Verified inclusion in `docs/Workflows.md` and `context-manifest.json`.

## Risks & Rollback

- Workflow must not perform unsolicited breaking changes; any optimization must preserve external interfaces and pass test suites.
