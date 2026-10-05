---
title: "Language Rule Lifecycle Binding & Active Enforcement"
type: context
status: ready
created: "2026-10-05"
tags: [context, rules, lifecycle, execution, plan, review, language-rules, prompting]
feature: "language-rule-lifecycle-binding"
---

# Language Rule Lifecycle Binding & Active Enforcement Context Specification

## 1. Overview & Objective

- **Problem Statement:** 
  When AI agent tasks follow a strong procedural workflow (`context` → `plan` → `execute` → `review`), LLMs heavily focus on satisfying the procedural milestones (scaffolding phases, unit files, git worktrees, task checkboxes) while treating language- and framework-specific rules (`rules/typescript/*`, `rules/laravel/*`, `rules/flutter/*`) as passive background noise. Because language rules are not actively bound into each procedural step and lack explicit precedence, models frequently produce code that violates framework conventions, naming rules, type safety, or architectural boundaries.

- **Business / User Value:** 
  - Prevents language and framework rule drift across long multi-phase agent sessions.
  - Eliminates post-execution rewrites and human code-review corrections for language idiomaticity.
  - Ensures deterministic compliance with declared project stacks (e.g., Laravel Eloquent conventions or TypeScript strict typing) across all generated units.

- **Success Criteria:**
  - Language rules are actively bound into every phase of the lifecycle (`context`, `plan`, `execute`, `review`/`verify`).
  - Units embed explicit `<language_rules>` blocks in their context packets immediately before execution instructions.
  - Explicit precedence is established: if a procedural plan instruction and an applicable language rule conflict, the language rule strictly takes precedence.
  - `/review` adds a dedicated Language Rules Conformance Gate before developer checkpoints.

### Decision Ledger

| ID | Status | Decision | Rationale / Authority |
| --- | --- | --- | --- |
| D-01 | decided | Active In-Phase Rule Wiring: Every lifecycle phase explicitly references, binds, and checks language rules rather than treating them as background context. | User issue diagnosis and architecture recommendations. |
| D-02 | decided | Clear Delimiters (`<language_rules>`): Encapsulate language rules in explicit XML tags within unit context packets so agents can anchor attention. | Prompt attention anchoring principle. |
| D-03 | decided | Explicit Authority Precedence: In `orchestrator/SHARED.md` and unit templates, declare that language rules strictly override conflicting plan steps. | Eliminates ambiguity during code generation. |
| D-04 | decided | Point-of-Generation Proximity: In `docs/templates/Unit.md`, place `<language_rules>` immediately before the unit execution steps to prevent context decay. | Attention decay mitigation. |
| D-05 | decided | Mandatory Verification Gate in `/review`: Diff review must verify worktree diffs against the unit's declared language rules before batch checkpoints. | Catch rule drift before human review. |
| D-06 | decided | Unit-Scoped Rule Subsets: Plans inline only the 2–4 rules matching the unit's touched files with concrete checkable directives, preventing prompt bloat and context dilution. | User-confirmed on 2026-10-05. |

---

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer in a TypeScript project*, I want `/plan` to embed the relevant TypeScript rules (`type-safety`, `runtime-validation`, `error-handling`) directly into each unit's context packet inside `<language_rules>`, so that the execution session produces strictly typed code without `any` or loose schemas.
- *As a developer in a Laravel project*, I want `/execute` to treat Laravel naming and Eloquent rules as higher priority than plan task text, so that controllers remain thin and business logic is placed into dedicated actions/models rather than monolithic handlers.
- *As a code reviewer*, I want `/review` to audit the worktree diff against the unit's bound `<language_rules>` at Gate 4, so that rule violations are flagged and fixed before the batch checkpoint is presented to the user.

### Scenario Coverage

| ID | Actor / Situation | Preconditions | Expected Outcome | Failure / Recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Planning a unit with backend API changes | Stack is TypeScript; rules resolved | Unit artifact contains `<language_rules>` listing `controllers-and-routes.md` and `runtime-validation.md` with concrete constraints | Missing block flagged during `plan-review` | proposed |
| SC-02 | Executing unit with contradictory plan step (e.g. "return raw array") | Plan step contradicts language rule | Agent follows language rule (e.g., DTO/Resource), citing rule precedence | Fails `/review` if agent followed faulty plan step | proposed |
| SC-03 | Worktree diff review via `/review` | Unit execution finished; tests pass | Gate checks diff for language rule compliance (naming, error handling, typing) | If rule violated, unit marked FAIL and repaired before checkpoint | proposed |

### Functional Requirements

- [ ] **FR-01 (Context Specification Template & Skill):** Update `docs/templates/Context.md` and `skills/productivity/context/SKILL.md` to identify the active language stack and record applicable rule constraints during context formulation.
- [ ] **FR-02 (Unit Template `<language_rules>` Block):** Update `docs/templates/Unit.md` to include a mandatory `<language_rules>` block inside `## Context packet` positioned immediately before `## Steps`.
- [ ] **FR-03 (Plan Skill Integration):** Update `skills/productivity/plan/SKILL.md` to mandate that every decomposed unit identify its applicable language rule subset and state how each rule will be satisfied.
- [ ] **FR-04 (Plan Review Skill Gate):** Update `skills/productivity/plan-review/SKILL.md` to audit that every unit contains a non-empty, scoped `<language_rules>` block.
- [ ] **FR-05 (Execute Skill Generation Anchor & Precedence):** Update `skills/engineering/execute/SKILL.md` to instruct agents to read `<language_rules>` directly before generation and enforce strict precedence (language rules override plan text).
- [ ] **FR-06 (Review Skill Conformance Gate):** Update `skills/engineering/review/SKILL.md` to add a new gate ("Language Rules Conformance Audit") evaluating diffs against the declared `<language_rules>`.
- [ ] **FR-07 (Orchestrator Contract Precedence):** Update `orchestrator/SHARED.md` under `## Conflict order` and `## Working contract` to explicitly codify that language and domain rules supersede procedural plan descriptions in conflicts.

### Edge Cases & Failure Modes

- **Rule Dilution from Over-Inlining:** If a unit inlines 20 full rule files, prompt context balloons and dilutes attention. *Mitigation:* Units must bind only the *scoped subset* of rules matching touched files, with checkable directives.
- **Vague Rule Directives:** Rules phrased as "write clean code" cannot be verified. *Mitigation:* Extract concrete, checkable constraints (e.g., "no implicit any", "FormRequest validation required", "Zod safeParse").
- **Language Rule vs Task Requirement Conflict:** When a task genuinely requires deviating from a standard rule. *Mitigation:* Require an explicit documented exception in the unit's Decision Ledger with user/ADR authority.

---

## 3. Technical & Architectural Context

- **Affected Artifacts & Templates:**
  - `docs/templates/Context.md` (Add Language Stack & Rules section)
  - `docs/templates/Task.md` (Add Stack Rules inventory in Pre-planning)
  - `docs/templates/Unit.md` (Add `<language_rules>` in Context packet)
- **Affected Skills & Orchestrator:**
  - `skills/productivity/context/SKILL.md`
  - `skills/productivity/plan/SKILL.md`
  - `skills/productivity/plan-review/SKILL.md`
  - `skills/engineering/execute/SKILL.md`
  - `skills/engineering/review/SKILL.md`
  - `orchestrator/SHARED.md`
- **Precedence Hierarchy:**
  `User Directives > ADRs > Language Rules (<language_rules>) > Procedural Plan Steps > Default Skill Conventions`

---

## 4. Scope & Boundaries

- **In Scope:**
  - Standardizing the `<language_rules>` delimiter and structure across unit templates and execution prompts.
  - Updating skill procedures for `context`, `plan`, `plan-review`, `execute`, and `review`.
  - Updating `orchestrator/SHARED.md` to clarify the conflict resolution hierarchy.
- **Out of Scope:**
  - Modifying individual rule markdown contents in `rules/typescript/`, `rules/laravel/`, or `rules/flutter/`.
  - Introducing heavy runtime AST parsers or external linters into the pure Node.js core scripts.

---

## 5. References & External Context

- [[docs/decisions/0021-explicit-language-stack-selection|ADR 0021: Explicit Language Stack Selection]]
- [[docs/decisions/0024-unit-execution-review-and-testing-skills|ADR 0024: Unit Lifecycle Primitives: Plan Review, Test-Driven Execution, and Diff Review]]
- [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027: Language Rule Lifecycle Binding, Precedence, and Verification]]
- [[orchestrator/SHARED|Shared Orchestration Contract]]
