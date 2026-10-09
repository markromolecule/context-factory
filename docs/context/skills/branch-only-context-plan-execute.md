---
title: "Branch-Only Context to Plan to Execute"
type: context
status: ready
created: "2026-10-08"
tags: [context, skills, planning, execution, git]
feature: "branch-only-context-plan-execute"
---

# Branch-Only Context to Plan to Execute

## 1. Overview & Objective

Replace task checkout management in the context, plan, and execute lifecycle with one regular task branch. Keep the established `context` → `grounding` → `grill` → `plan` → `plan-review` → `execute` artifact ownership and approval gates. Success means the planner creates the branch after a fresh released brief and before plan writing; every downstream writer checks the exact branch; no new plan prescribes checkout modes, paths, or teardown.

## 2. Requirements & User Stories

- As a planner, I need a branch derived from the released brief and reserved plan ID so the plan and execution share one Git identity.
- As an executor or reviewer, I need to stop on a detached or mismatched branch before changing files.
- As a maintainer, I need dirty files, an existing conflicting branch, or the wrong base to be reported without stashing, resetting, or switching them away.
- Preserve historical plans and decisions as historical records.

### Scenarios

| Situation | Expected outcome |
|---|---|
| Ready context, fresh grounding and brief, clean intended base | Plan creates `<type>/PLN-NNNN-<slug>` before writing artifacts. |
| Dirty checkout or detached HEAD | Stop and report state; preserve files. |
| Existing same-task branch already checked out | Verify identity and ancestry, then resume planning. |
| Existing unrelated branch or wrong base | Stop and report collision or base mismatch. |
| Downstream writer on another branch | Stop before changes and report expected and actual branch. |
| Independent units | Preserve dependency information but run serially in one checkout. |

## 3. Technical & Architectural Context

Affected contracts: `skills/productivity/context/SKILL.md`, `skills/productivity/plan/SKILL.md`, `skills/engineering/execute/SKILL.md`, downstream review and verification skills, `orchestrator/SHARED.md`, task templates, task scaffold, and plan checker. Existing naming and atomic `PLN-NNNN` reservations are defined by `scripts/plan-id-reservation.mjs`. Historical v2 plans may retain their recorded checkout metadata; new plans use a branch-only v3 contract. No application schema or production code changes are involved.

## 4. UI/UX & Interaction Guidelines

Report exact current branch, expected branch, target base, and any dirty paths when a branch gate fails. Show the task branch and base commit in plans and packets.

## 5. Scope & Boundaries

In scope: lifecycle skill wording, branch gates, new-plan templates and checker, supporting shared guidance and a superseding ADR. Out of scope: rewriting historical plans, deleting existing Git checkouts or tooling, and changing approval or conformance gates.

## 6. References & External Context

- `docs/decisions/0031-skill-lifecycle-handoffs-and-task-git-policy.md`
- `docs/templates/Context.md`, `docs/templates/Task.md`, `docs/templates/Phase.md`, `docs/templates/Unit.md`
- User brief of 2026-10-08.
