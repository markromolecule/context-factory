---
title: "Adversarial Lifecycle Evaluations"
type: unit
parent: "phase-04-lifecycle-and-bridges"
unit: "04.03"
branch: "task/0001/phase-04/adversarial-evaluations"
worktree: ".worktrees/0001/phase-04/adversarial-evaluations"
status: planned
created: "2026-10-06"
tags: [task, unit, evals, adversarial]
depends_on: ["04.01", "04.02"]
parallelizable_with: []
---

# Unit 04.03: Adversarial Lifecycle Evaluations

## Objective

Make the evaluation suite fail on violated rules, missing evidence, forged waivers, stripped prompts, and weakened bridges instead of testing only selection membership.

## Context packet

- `evals/run-evals.mjs` currently compares selected paths and fixture fields.
- Feature dataset golden output checks only workflow/status.
- The evaluation runner must exercise real preflight/conformance state while remaining deterministic/offline.
- AC-08 and AC-10.

<language_rules>
- `rules/global/evidence-and-claims.md`: Each evaluation failure names the violated directive and observed evidence.
- `rules/global/code-quality.md`: Fixtures are minimal, executable, and cover a single failure reason.
- `rules/typescript/common/error-handling.md`: Expected rejection is distinct from harness error; tests assert both status and exit semantics.
</language_rules>

## Preconditions

- Units 04.01 and 04.02 merged into the phase branch.

## Scope

**In scope:** `evals/run-evals.mjs`; new `evals/lifecycle-conformance.test.mjs`; new cases/datasets/fixtures under `evals/cases/` and `evals/datasets/conformance/`; update existing golden cases only where new required fields are intentional.

**Out of scope:** production core logic, catalog-wide metadata migration, and release/version files.

## Steps

1. Add deterministic evaluation assertions for binding receipt, compiled prompt receipt, conformance status, blocking outcome, and evidence completeness.
2. Add one minimal case for each adversarial class: missing binding, wrong stack, stale hash, code violation, forged/expired waiver, tool unavailable, prompt stripping, and bridge omission.
3. Ensure golden fixtures cannot bypass execution by directly supplying a success object.
4. Preserve existing routing evaluations and label selection-only coverage honestly.

## Verification

- **Integration/evaluation tests:** catch the exact production gaps documented in the context spec.
- **Mutation-style check:** flip one expected blocking result to success and prove the suite fails.
- Commands: `node --test evals/lifecycle-conformance.test.mjs`; `npm test`.

## Rollback

Remove new adversarial cases/assertions without changing core behavior; never rewrite them as selection-only successes.

## Definition of done

- [ ] AC-08 and AC-10 pass.
- [ ] At least one deterministic case proves each guardrail can reject bad output.
- [ ] Existing routing evaluations remain green.
- [ ] Unit passes `/review`.
