---
title: "Language Rule Lifecycle Binding, Precedence, and Verification"
type: decision
status: accepted
created: "2026-10-05"
tags: [adr, rules, context, plan, execute, review, verification, prompt-engineering, lifecycle]
---

# 0027 — Language Rule Lifecycle Binding, Precedence, and Verification

## Context

In multi-phase agent execution lifecycles (`context` → `plan` → `execute` → `review`), LLM attention is dominated by procedural execution mechanics (e.g. creating git worktrees, partitioning unit steps, marking checkboxes, structuring branch topology). 

While Context Factory provides comprehensive language and framework rule sets (`rules/typescript/`, `rules/laravel/`, `rules/flutter/`, `rules/solid/`), models frequently treat these rules as passive background context. When generation begins inside an execution worktree, the procedural momentum of the unit steps eclipses language standards, leading to code that violates framework conventions, misses runtime validation, relies on loose typing, or ignores project naming rules.

The user diagnosed this exact failure mode:
1. Procedural structures overshadow rules if rules are kept in isolated sections.
2. Rules are not referenced or bound inside the steps themselves.
3. Rules buried far from the generation locus suffer from prompt attention decay.
4. Absence of explicit conflict precedence creates ambiguity when a plan step subtly contradicts a language idiom.
5. Verification gates audit file scopes and test counts, but lack explicit checkpoints for language rule compliance.

Success requires ensuring that language rules actively govern every phase of the lifecycle, anchor attention directly at the generation locus, carry explicit authority precedence, and are verified before developer checkpoints.

## Options Considered

### Option 1: Passive Global Admonition & System Prompt Pointers
- Keep rules in existing static documentation folders.
- Add general reminders to top-level system prompts or skill descriptions instructing agents to "remember to follow language rules".
- *Rejected:* Fails in production. Procedural workflows occupy the working context; passive reminders are pushed out of attention. When generation begins, the model focuses on the step checklist and neglects background rules.

### Option 2: Post-Execution AST Linter & Dedicated Rewrite Agent
- Introduce a separate "Language Rule Auditor Agent" that runs after each unit execution, using custom scripts or AST parsers to detect violations and rewrite generated code.
- *Rejected:* High token overhead, slow multi-agent roundtrips, and brittle syntax parsing across diverse language stacks. Rewriting code post-hoc introduces hallucinations and risks breaking working tests, rather than getting generation right the first time.

### Option 3: Active Lifecycle Rule Binding with Delimited `<language_rules>`, In-Phase Wiring, Precedence Rule, and Diff Review Gate (Selected)
- **Phase-by-Phase Wiring:**
  - *Context:* Identify the active language stack and enumerate applicable rule files and key constraints.
  - *Plan:* Every unit binds only its relevant rule subset (2–4 rules matching touched files) into its context packet and states how each rule is satisfied. `plan-review` audits the presence of these blocks.
  - *Execute:* Position `<language_rules>` immediately before generation steps to eliminate attention decay. Establish strict conflict precedence: language rules override conflicting plan text.
  - *Review:* Add a dedicated Language Rules Conformance Gate to `/review` before presenting batch checkpoints.
- **Clear Delimiters:** Standardize on `<language_rules>...</language_rules>` XML tags to provide distinct attention anchors for LLMs.
- **Concrete Directives:** Bind checkable, actionable constraints (e.g., "no implicit any; validate via Zod safeParse; FormRequest for controller inputs") rather than vague stylistic advice.
- *Selected:* Directly solves the attention decay problem, enforces mathematical clarity on conflict precedence, adds zero external dependencies, and integrates seamlessly into the existing 3-tier unit execution model.

## Decision

Adopt **Option 3**.

### 1. The Six Core Pillars

1. **In-Phase Lifecycle Wiring & Scoped Subsets:**
   - **Context (`context`):** Identify declared project stack (`typescript`, `laravel`, etc.) and record applicable rules in the context spec.
   - **Plan (`plan`):** For each unit, select only the specific subset of language rules (typically 2–4 rules) directly matching its touched files, inline them into `<language_rules>`, and document how the implementation satisfies each rule. Avoid full catalog inlining to prevent prompt dilution.
   - **Execute (`execute`):** Re-anchor on `<language_rules>` immediately prior to emitting code.
   - **Review (`review`):** Verify the diff against declared language rules before marking the unit verified.

2. **Standard Delimiters (`<language_rules>`):**
   - Unit context packets in `docs/templates/Unit.md` will standardize on the `<language_rules>` tag:
   ```markdown
   <language_rules>
   - [rule-name.md]: Concrete checkable directive
   - [rule-name.md]: Concrete checkable directive
   </language_rules>
   ```

3. **Point-of-Generation Proximity:**
   - In `docs/templates/Unit.md`, place `<language_rules>` at the end of `## Context packet`, immediately preceding `## Steps`, ensuring maximum attention weight during token generation.

4. **Concrete, Checkable Constraints:**
   - Prohibit vague guidelines. Extract actionable constraints (e.g., "use typed FormRequest", "no raw DB queries", "use custom AppError classes") and positive/negative boundaries.

5. **Strict Conflict Precedence:**
   - Amend `orchestrator/SHARED.md` and unit templates with the explicit invariant:
   > *If an implementation step in a plan and an applicable language rule conflict, the language rule strictly takes precedence.*

6. **Dedicated Diff Review Gate:**
   - Add Gate 4 ("Language Rules Conformance Audit") to `skills/engineering/review/SKILL.md` to pre-screen diffs for rule compliance before batch checkpoints.

## Consequences

### Dependency Direction and Contracts
- `orchestrator/SHARED.md` establishes unambiguous authority: User instructions > ADRs > Language Rules > Procedural Plan Steps > Default Skill Conventions.
- Unit templates (`docs/templates/Unit.md`) gain a formal `<language_rules>` section.
- `plan-review` enforces that no unit enters execution without bound language rules.

### Token Economy and Context Budget
- Units inline only the *specific relevant rule subset* (typically 2-4 rules) rather than the entire 20-rule catalog. This prevents token bloat and keeps prompt weight focused.

### Performance and Operations
- Zero runtime dependencies added.
- Existing pure Node.js scripts remain clean and deterministic.

### Migration and Rollback
- Existing plans continue to function; new plans generated with `/plan` will automatically include `<language_rules>`.
- Reverting this decision involves removing `<language_rules>` from unit templates and the corresponding gate from `/review`.

## Validation and Review Date

- Verify that `/context` and `docs/templates/Context.md` include language rule resolution.
- Verify that `/plan` generates units with populated `<language_rules>` blocks.
- Verify that `/review` diff audit catches language rule violations in test scenarios.
- Review date: 2027-04-05.
