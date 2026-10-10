---
title: "Shared TypeScript pragmatic design rule"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.01"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, unit, rules]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Shared TypeScript Pragmatic Design Rule

> Task branch: `feat/PLN-0008-typescript-pragmatic-design-rules` · Base commit: `298768ee210189f2f2221f3cf8f041bce2ad26bf`

## Objective

Bind a short TypeScript rule that favors the smallest complete present design and keeps a decision with the owner of its data.

## Context packet

- **Current evidence:** `rules/typescript/common/` holds shared TypeScript guidance and `docs/Rules.md` indexes it. The rule compiler binds by stack and affected path. A plain request without affected paths cannot safely infer a host convention. PLN-0007 made unimplemented automated IDs fail closed; new subjective directives should not claim a linter/typechecker merely by metadata.
- **Accepted decisions:** YAGNI and KISS are distinct, composition is a default for real variation, and Law of Demeter/tell-don't-ask is one combined check. All are defaults with justified exceptions. A hypothetical future variant does not require an interface, registry, service, or file split. Tenant/authorization, validation, serialization, and data integrity still require their real boundaries.
- **Cases and acceptance:** AC-02 and AC-03. A single implementation may be a direct function with a concrete collaborator. A second present implementation can justify a narrow injected function or strategy. A caller must request an action from the owner instead of reading nested internals and deciding for it. A DTO mapper may read fields to validate or serialize; a pure data transformation remains allowed. One combined directive must cover reach-through and owner-decisions, not separate competing checks.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.minimal-complete-change][mode:evidence-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
</language_rules>

**Rule satisfaction:** Limit edits to one common rule and its contract/catalog files, add a failing test before behavior changes, and keep examples minimal. Use evidence-blocking or advisory modes for subjective judgments until an ID-specific verifier rejects a bad case. Fresh conformance requires named reviewer evidence.

## Preconditions

- Verify exact task branch; Unit 01.01 notes, maps, and lock are committed and valid. Stop for unrelated dirty state.
- Inspect current common-rule metadata, binding compiler, and conformance adapter before selecting IDs, `alwaysApply`, and `appliesTo`.

## Scope

**In scope:** `rules/typescript/common/pragmatic-design.md` (new), `evals/tests/rules/pragmatic-design.test.mjs` (new), `docs/Rules.md`, `context-manifest.json`, `context-lock.json`.

**Out of scope:** Existing SOLID/backend/UI rule edits (Units 03.01/03.02), selector/adapter changes without a proved defect and scope amendment, host code, plain-JavaScript rules, inheritance frameworks, and generated scaffold code.

## Steps

1. Add a failing focused contract test for four distinct directive IDs, TypeScript/TSX applicability, one combined Demeter/tell-don't-ask statement, and absence from a `.js` scope. Use real resolver/binding output for scope assertions rather than only parsing a frontmatter string.
2. Add representative good/bad cases: one simple function versus speculative strategy; a real two-variant case with composed behavior; caller reach-through versus owner method; DTO mapping/validation/serialization allowed. The contract test may inspect examples, but semantic correctness also needs named human review.
3. Create the one common rule with stable IDs, short statements, explicit present-need criteria and exceptions, `stack: typescript`, and `.ts`/`.tsx` applicability. Keep framework-neutral text in this owner; do not duplicate it in React, Next.js, or SolidJS rules.
4. Synchronize Rules map, manifest, and lock; run test, lint, and doctor. Compile exact-scope preflight/conformance, record binding/diff hash and named semantic evidence, review, then commit.

## Verification

- **Contract test:** `node --test evals/tests/rules/pragmatic-design.test.mjs`. It catches accidental directive splitting, missing exceptions, false `.js` binding, and one-implementation overreach that catalog lint cannot detect.
- **Binding integration:** The same suite calls `resolveContext` with `.ts`, `.tsx`, and `.js` affected paths and checks binding IDs. It catches a metadata rule that validates but never reaches a host.
- **Catalog:** `npm run sync`, `npm run lock`, `npm run lint`, `node scripts/context.mjs doctor`. This catches an unindexed or stale rule.
- **Conformance:** Fresh `context-cli preflight` and `context-cli conform` on the exact changed files; no missing human evidence, waiver, or `NOT_AUTOMATABLE` is accepted as PASS. Persist and verify the receipt.

## Rollback

Revert the new rule, test, map, manifest, and lock together. No data or host migration exists.

## Definition of done

- [ ] AC-02/AC-03 good/bad cases fail before the rule and pass afterward; one combined directive owns the reach-through decision.
- [ ] Rule selection is TypeScript/TSX scoped, with legitimate DTO exceptions and no new unsupported automated claim.
- [ ] Catalog, focused test, lint, doctor, exact branch/file fence, review, and fresh conformance receipt PASS before commit.
