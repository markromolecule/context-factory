---
title: "Author plan-review Skill"
type: unit
parent: "phase-02-plan-review-skill"
unit: "02.01"
status: planned
created: "2026-09-28"
tags: [task, unit, skill, plan-review, productivity]
depends_on: ["01.03"]
parallelizable_with: ["03.01", "04.01"]
---

# Unit 02.01: Author plan-review Skill

> Phase: phase-02-plan-review-skill · Depends on: 01.03 · Parallelizable with: 03.01, 04.01

## Objective

Author `skills/productivity/plan-review/SKILL.md` and its agent interface YAML, defining the pre-execution audit procedure that checks deterministic DAG/scope validity, cold-start context packet sufficiency, and AC-to-test mapping before execution begins.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - Productivity skills live in `skills/productivity/<skill>/SKILL.md`.
  - OpenAI agent schema requires `display_name`, quoted `short_description` (25-64 chars), and `default_prompt` mentioning `$plan-review`.
  - `skills/productivity/README.md` lists all member skills with wiki-links.
- Acceptance Criteria Served:
  - `AC-02`: `plan-review` audits plans cold-start, validating deterministic checks, context packet sufficiency, and AC-to-test mapping.
- Decisions Constraining Unit:
  - `D-02`: Must execute `node scripts/context.mjs plan:check <task-dir>` as its first mandatory gate.

## Preconditions

Phase 1 completed (`scripts/plan-check.mjs` available and tested).

## Scope

**In scope:** `skills/productivity/plan-review/SKILL.md`, `skills/productivity/plan-review/agents/openai.yaml`, `skills/productivity/README.md`.
**Out of scope:** Modifying `execute` or `verify` skills.

## Steps

1. Create directory `skills/productivity/plan-review/` and `skills/productivity/plan-review/agents/`.
2. Author `skills/productivity/plan-review/SKILL.md`:
   - Frontmatter: `name: plan-review`, `description: Audit an implementation plan in a fresh session before execution to verify acyclic dependencies, disjoint parallel file scopes, cold-start executability, and acceptance criteria test mapping (/plan-review, [PLAN_REVIEW]).`
   - Mandatory Check 1: Deterministic check via `node scripts/context.mjs plan:check <task-dir>`.
   - Mandatory Check 2: Master plan Acceptance Criteria traceability audit.
   - Mandatory Check 3: Cold-start context packet inspection per unit.
   - Mandatory Check 4: Justified test plan inspection (no naked "add tests").
   - Output: Structured Plan Audit Report (Approved / Changes Required).
3. Author `skills/productivity/plan-review/agents/openai.yaml`:
   - `display_name: "Plan Review"`
   - `short_description: "Audit task plans for cycles, overlaps, and test coverage"`
   - `default_prompt: "Use $plan-review to audit the referenced plan before execution starts."`
4. Update `skills/productivity/README.md` to link `plan-review/SKILL.md`.

## Verification

- Test type(s):
  - Contract / Interface tests: Verifies frontmatter validity, directory name matching, 25-64 char short_description, and group README link invariant using `node scripts/context.mjs lint`.
- Cases:
  - Skill frontmatter schema valid.
  - `openai.yaml` short description length within 25-64 characters.
  - Group index link verified.
- Commands: `node scripts/context.mjs lint`

## Rollback

Delete `skills/productivity/plan-review/` and revert `skills/productivity/README.md`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-02
- [ ] Skill document and agent interface created with zero lint errors
- [ ] Group README links member skill correctly
- [ ] All listed verification passes
