---
title: "Backend rule selection, payload, and whole-task verification"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, unit, integration]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 04.01: Backend Rule Selection, Payload, and Whole-task Verification

> Task branch: `feat/PLN-0007-typescript-backend-rule-expansion` · Base commit: `a1ffd01afeaff61e1ec2f649e60d23a51ed313a9`

## Objective

Prove short backend requests select only relevant guidance, measure the actual rendered prompt, and close the full acceptance matrix with fresh integrated evidence.

## Context packet

- **Current evidence:** `orchestrator/rules/binding-compiler.mjs` matches rule applicability to scope paths; `scripts/context-core.mjs` resolves request/stack/scope. `evals/tests/rules/rule-binding.test.mjs` checks scope and UI/framework exclusion. `evals/tests/rules/code-generation-evaluation.test.mjs` exercises the rendered payload. `evals/tests/rules/catalog-coverage.test.mjs` pins catalog counts. `docs/Rules.md`, `context-manifest.json`, and `context-lock.json` must agree.
- **Accepted target:** `src/modules/<feature>` is the backend default. Existing `src/features/` hosts and `.spec.ts` tests remain supported when host evidence says so; `.test.ts` is the default. A short create/read request plus affected path must select architecture, DTO, and testing rules as relevant without UI/React/Next.js/SolidJS leakage. The rendered provider payload, not only the selected-rule list, is the input-size measure. Correct create/read behavior is evaluated separately.
- **Cases and acceptance:** AC-07 and AC-08 plus whole-task AC-01..06. Create with two writes needs service transaction ownership and safe output; simple read can call data without a pass-through service; tenant-sensitive read uses policy/service; serializer does not expose an added persistence field. Capture baseline and final payload bytes/tokens with the same renderer, fixtures, request, stack, and scope. Report any increase honestly; a size reduction alone does not prove quality.
- **Authority:** User-confirmed backend-first scope and compatibility decisions. No target token budget or automatic model-behavior claim was supplied.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.arch.layers][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
</language_rules>

**Rule satisfaction:** Bind to the actual task scope, use failing selection/behavior cases before selector edits, and record precise observed payload/evaluation results. A reviewer supplies named human evidence for semantic claims; planning source hashes are refreshed at execution.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` equals `feat/PLN-0007-typescript-backend-rule-expansion`; stop on detached/mismatched HEAD or unrelated dirty files.
- Units 01.01, 02.01, 02.02, and 03.01 have reviewed commits, current catalog state, and PASS receipts. Inspect their actual rule metadata, IDs, and any changed evaluation harness before finalizing fixtures.
- Capture the pre-change rendered payload from the verified base commit or stored baseline fixture with the same renderer and fixed requests. Preserve inputs so the comparison is reproducible.

## Scope

**In scope:** `evals/tests/rules/rule-binding.test.mjs`, `evals/tests/rules/code-generation-evaluation.test.mjs`, `evals/datasets/features/typescript-backend-codegen.json` (new), `evals/tests/rules/catalog-coverage.test.mjs` only for actual catalog count changes, `orchestrator/rules/binding-compiler.mjs` and `scripts/context-core.mjs` only if a failing test proves a selector defect, `docs/Rules.md`, `context-manifest.json`, `context-lock.json` for final synchronization and map corrections.

**Out of scope:** New UI/framework guidance, host application edits, a generic rules recommender, a new tokenizer/model dependency, automatic merge or remote push.

## Steps

1. Add failing binding/contract cases for short create/read prompts scoped to `src/modules/orders/...`, established `src/features/orders/...`, `.test.ts`, and `.spec.ts`. Assert the relevant backend rule IDs appear in the **rendered provider payload**, unrelated UI/framework IDs do not, and a pathless ambiguous request does not pretend to know a host convention. Include a policy-sensitive read negative case.
2. Diagnose failures at rule `appliesTo`, stack inference, and binding compilation. Change `binding-compiler.mjs` or `context-core.mjs` only when a failing test proves metadata alone cannot represent the needed scope. Preserve existing React/Next.js/SolidJS package-aware selection and multi-package path behavior.
3. Add a small reproducible backend evaluation dataset for create/two-write failure, simple bounded read, tenant-sensitive read, and internal-row-field addition. Evaluate selected/rendered guidance and representative generated output against architecture, response privacy, transaction, and test-boundary criteria. Do not label a rule-selection assertion as generated-code quality.
4. Measure baseline and final rendered prompt bytes (and tokens only with the same available tokenizer) for the fixed requests. Record delta and quality result independently; remove duplicated prose at the owning rule if input grows without adding distinct guidance. Do not set an invented savings threshold.
5. Run `npm run sync`, update catalog coverage from actual generated inventory if needed, and reconcile ADR index, Rules map, manifest, and lock. Review the full task diff against all unit file fences and acceptance rows; resolve overlap or stale hashes before final tests.
6. Run focused tests, lint, all evaluations, and doctor. Compile a fresh binding and run conformance over the **entire task diff** with named human evidence, then record exact diff/binding hashes, statuses, and unresolved findings in the finalization ledger. Stop on FAIL/BLOCKED. Submit for independent `/review` and `/plan-review`-approved execution checkpoint; merge only after developer approval and post-merge verification.

## Verification

- **Contract/selection tests:** `node --test evals/tests/rules/rule-binding.test.mjs`. Justification: catches missing/backend-overbroad rendered guidance that a catalog count cannot see.
- **Integration/evaluation tests:** `node --test evals/tests/rules/code-generation-evaluation.test.mjs` with the new dataset. Justification: selection and input size alone do not show whether examples protect policy, transaction, and serialized output boundaries.
- **Catalog regression:** `node --test evals/tests/rules/catalog-coverage.test.mjs`; `npm run sync` and `node scripts/context.mjs doctor`. Justification: new rules or changed metadata can leave manifest/map/lock or count stale.
- **Whole-task gate:** `npm run lint`, `node evals/run-evals.mjs`, fresh whole-diff `context-cli preflight` and `context-cli conform` with named human evidence, final `/review`, developer checkpoint. Inspect report verdict and each blocking result; no FAIL/BLOCKED/TOOL_UNAVAILABLE/UNSUPPORTED counts as PASS.

## Rollback

Revert this unit's selector/evaluation/catalog changes together. If an earlier rule fails integration, reopen its owner unit and regenerate inventory/lock rather than masking the failure in the selector. No merge while any acceptance criterion or evidence gate is unresolved.

## Definition of done

- [ ] AC-07's default and compatibility cases pass, with rendered payload delta and code-quality observations recorded separately.
- [ ] AC-08 and AC-01..06 are reconciled against the whole task diff, with no stale map, inventory, lock, or receipt.
- [ ] Focused tests, lint, evaluations, doctor, `/review`, and whole-diff conformance PASS are recorded on the exact task branch.
- [ ] Finalization ledger names the observed hashes, statuses, reviewer, and any remaining checkpoint; unit committed only after its gate.
