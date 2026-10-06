---
title: "Fail-Closed Plan Rule Validation"
type: unit
parent: "phase-02-binding-and-prompt"
unit: "02.02"
branch: "task/0001/phase-02/fail-closed-plan-check"
worktree: ".worktrees/0001/phase-02/fail-closed-plan-check"
status: verified
created: "2026-10-06"
tags: [task, unit, plan-check, validation]
depends_on: ["01.02"]
parallelizable_with: ["02.01"]
---

# Unit 02.02: Fail-Closed Plan Rule Validation

## Objective

Make plan validation reject missing, placeholder, nonexistent, wrong-stack, irrelevant, stale, or contradictory rule bindings and include the result in exit status.

## Context packet

- `scripts/plan-check.mjs:243-246` accepts any non-whitespace block.
- `scripts/plan-check.mjs:365-388` excludes language-rule validity from `isValid`.
- `evals/plan-check.test.mjs:13-51` currently expects a plan with no rule block to pass; this fixture must be reversed.
- AC-04 and SC-02.

<language_rules>
- `rules/global/code-quality.md`: Diagnostics identify unit, directive, failure class, and remediation without vague warnings.
- `rules/global/evidence-and-claims.md`: A PASS exit requires every blocking plan invariant to have executable evidence.
- `rules/solid/single-responsibility.md`: Parsing unit contracts and evaluating plan validity remain separate helpers.
</language_rules>

## Preconditions

- Phase 1 parser/schema contract is available.

## Scope

**In scope:** `scripts/plan-check.mjs`; `evals/plan-check.test.mjs`; new focused fixtures under `evals/fixtures/plans/rule-bindings/`.

**Out of scope:** resolver implementation, prompt compilation, code conformance, and task template prose.

## Steps

1. Parse directive references and concrete directives from each unit; reject template placeholder text.
2. Validate referenced paths/IDs exist, match declared stack/scope, have current hashes where present, and do not contradict steps without a valid waiver reference.
3. Include rule validity in `isValid`, JSON output, console PASS/FAIL, and process exit code.
4. Replace the current missing-block success fixture and add one fixture per failure class plus a valid scoped plan.

## Verification

- **Unit tests:** parser/diagnostic helpers.
- **Contract/CLI tests:** exact non-zero exit behavior for all AC-04 cases.
- Command: `node --test evals/plan-check.test.mjs` (12/12 passed).
- Command: `node --test` (98/98 passed).
- Doctor & Sync: `npm run sync && node scripts/context.mjs doctor` (healthy).

## Rollback

Revert rule-specific checks and fixtures; DAG/scope validation remains untouched.

## Definition of done

- [x] AC-04 passes and missing bindings cannot produce PASS.
- [x] JSON and human output agree.
- [x] Existing DAG/scope cases remain green.
- [x] Unit passes `/review`.
