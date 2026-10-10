---
title: "TypeScript selection, enforcement, and whole-task release"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, unit, integration]
depends_on: ["03.01", "03.02"]
parallelizable_with: []
---

# Unit 04.01: TypeScript Selection, Enforcement, and Whole-task Release

> Task branch: `feat/PLN-0008-typescript-pragmatic-design-rules` · Base commit: `298768ee210189f2f2221f3cf8f041bce2ad26bf`

## Objective

Verify TypeScript-only binding, rendered guidance, honest conformance, and synchronized catalog state across the full task diff.

## Context packet

- **Current evidence:** `evals/tests/rules/rule-binding.test.mjs` tests path and framework-aware binding; `evals/tests/rules/code-generation-evaluation.test.mjs` uses `compilePrompt` plus `buildOpenAIPayload` to inspect exact rendered JSON bytes and representative output quality. `evals/tests/rules/catalog-coverage.test.mjs` pins actual directive counts. `orchestrator/conformance/adapters/typescript.mjs` returns `NOT_AUTOMATABLE` for unimplemented automated IDs and requires named human compensation. `context-manifest.json`, `docs/Rules.md`, `docs/Wiki.md`, `knowledge/README.md`, `package.json`, and `context-lock.json` are release consumers.
- **Accepted target:** AC-06 through AC-08 plus integrated AC-01..05. A `.ts`/`.tsx` path selects the shared guidance once. A `.js`/`.jsx` path or unrelated stack does not gain the new guidance. Nearest package dependencies, not prompt words, determine React/Next.js/SolidJS additions. Measure actual provider payload bytes and report increase or decrease honestly; selection is not proof of generated-code correctness.
- **Cases:** One direct implementation; two present variants composed; reach-through decision moved to data owner; DTO read allowed; policy-free simple read direct to data; tenant-sensitive read through a trusted policy; JavaScript and misleading framework wording excluded. Missing human evidence must block a subjective blocking directive. A forged verifier label cannot turn an unimplemented rule into a real check.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.arch.layers][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
</language_rules>

**Rule satisfaction:** Use real binding and payload output, fail-first negative cases, exact-file scopes, and named semantic evidence. Do not treat advisory reporting, payload presence, or doctor as behavioral proof.

## Preconditions

- Verify exact task branch; all predecessor units are reviewed, committed, and receipt-valid. Stop for unrelated dirty state.
- Inspect final directive IDs/modes and package-selection behavior before writing assertions; update catalog counts from parsed output rather than guessed totals.

## Scope

**In scope:** `evals/tests/rules/rule-binding.test.mjs`, `evals/tests/rules/code-generation-evaluation.test.mjs`, `evals/tests/rules/catalog-coverage.test.mjs`, `evals/tests/conformance/typescript-adapter.test.mjs` only for a proved enforcement regression, `evals/datasets/features/typescript-pragmatic-design.json` (new), `docs/Rules.md`, `docs/Wiki.md`, `knowledge/README.md`, `context-manifest.json`, `package.json`, `context-lock.json`, `docs/execution/PLN-0008/ledger.md` (new), `docs/execution/PLN-0008/whole-task-conformance-report.json` (new).

**Out of scope:** Selector/adapter production changes without a failing test and scope amendment, host source, a new tokenizer or model dependency, automatic merge/push, invented human evidence, and implementing PLN-0007's deferred structural verifier.

## Steps

1. Add failing binding and rendered-payload cases for TypeScript/TSX positives, `.js`/`.jsx` and unrelated-stack negatives, nearest-package framework selection, and single versus real variant guidance. Assert the selected directive statement appears in the actual provider payload exactly once.
2. Add a small evaluation dataset with required `name`, `domain`, request, baseline metadata, fixed scopes, representative outputs, and quality criteria. Measure UTF-8 JSON bytes through the same `compilePrompt` and `buildOpenAIPayload` renderer for baseline and final. Report size and quality independently; do not invent a savings target or claim model-generated behavior from a fixture.
3. Add a conformance negative case: subjective blocking directives without named evidence yield BLOCKED, an unimplemented automated ID cannot yield PASS, and a real selected directive with named evidence gets a receipt whose mode/verifierType are honest. Change adapter code only after a failing test proves a concrete defect and the plan scope is amended.
4. Run `npm run sync`, decide/document the appropriate context-version update, update actual catalog counts and maps, then `npm run lock`. Reconcile every AC and conflict-matrix row against the final diff.
5. Run focused tests, lint, all evaluations, doctor, and `plan:check`. Compile fresh preflight and conform over the whole task source diff excluding mutable receipts; persist PASS report and verify its binding and content hash. Review exact scopes, record unresolved checks and named human evidence, then submit for independent review and developer checkpoint.

## Verification

- **Binding/integration tests:** `node --test evals/tests/rules/rule-binding.test.mjs evals/tests/rules/code-generation-evaluation.test.mjs`. They catch missing or overbroad selected/rendered guidance and distinguish payload size from representative output quality.
- **Conformance/contract test:** `node --test evals/tests/conformance/typescript-adapter.test.mjs` if an enforcement defect is proved; otherwise exercise the existing CLI no-evidence and named-evidence paths on the exact new directive scope. It catches false PASS where rule selection or prose alone would not.
- **Catalog and release:** `npm run sync`, `npm run lock`, `npm run lint`, `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`, `node scripts/context.mjs plan:check <task-dir> --json`, `git diff --check`. These catch missing inventory, invalid metadata, stale lock, and broken plan binding.
- **Whole-task receipt:** `context-cli preflight` and `context-cli conform` with the whole changed source scope, then `context-cli conform verify` with expected binding and scope. Record PASS/FAIL/BLOCKED exactly and stop on non-PASS.

## Rollback

Revert this unit's tests, dataset, catalog/version/lock, and release artifacts together. Reopen the earlier owning unit if an integrated rule or knowledge defect appears. No host or schema migration exists.

## Definition of done

- [ ] AC-06/AC-07 TypeScript/TSX positives, JavaScript/unrelated negatives, framework scope, and honest evidence paths are observed.
- [ ] AC-08 catalog/version/map/lock agree; rendered bytes and representative quality are reported separately.
- [ ] AC-01..05 are reconciled against the whole task diff with no stale rule or knowledge contradiction.
- [ ] Exact branch/fence, tests, lint, evaluations, doctor, review, and verified whole-diff PASS receipt are recorded; commit and merge occur only after gates and developer approval.
