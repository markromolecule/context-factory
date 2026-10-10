---
title: "SOLID rule and knowledge reconciliation"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.01"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, unit, architecture]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: SOLID Rule and Knowledge Reconciliation

> Task branch: `feat/PLN-0008-typescript-pragmatic-design-rules` · Base commit: `298768ee210189f2f2221f3cf8f041bce2ad26bf`

## Objective

Make TypeScript OCP, SRP, and DIP guidance compatible with present-need YAGNI/KISS defaults without weakening real dependency boundaries.

## Context packet

- **Current evidence:** `rules/solid/open-closed.md` says “MUST” use strategies and stable extension interfaces; `single-responsibility.md` says distinct files and dedicated hooks are mandatory; `dependency-inversion.md` says ports/adapters and explicit injection are mandatory. Each rule's `appliesTo` is `.ts`/`.tsx`. Their `knowledge/principles/solid-*` notes have examples and summaries that may repeat overbroad claims. Current directive IDs are public rule contracts and should survive a narrowed statement when meaning remains.
- **Accepted target:** Default to a cohesive direct implementation for one present behavior. Use composition, a narrow function contract, a strategy, or an adapter when real variation or a real policy/infrastructure boundary warrants it. A direct controller-to-data read is valid only without policy. Keep SRP role separation and no direct infrastructure in high-level policy; do not require one file per symbol or a React hook for local trivial async state.
- **Acceptance:** AC-04. Prepare a directive-by-directive conflict matrix recording current wording, replacement trigger, valid exception, retained ID/mode, and any newly necessary ID. Review examples as well as directive statements; an unchanged example can still teach a conflicting default.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.arch.layers][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
- [directive:cf.solid.ocp-stable-extension-interfaces][mode:evidence-blocking] rules/solid/open-closed.md sourceHash:sha256:c6491ca6266744363f4f7826fe7872b46798bb1b7a3623d3e12b143fb5a51770
- [directive:cf.solid.srp-layer-separation][mode:evidence-blocking] rules/solid/single-responsibility.md sourceHash:sha256:37728363e83f920dde18f6c9b43c8a7cd4baeaa3bbb31ead290b86cd567ef6df
- [directive:cf.solid.dip-domain-ports-infrastructure-adapters][mode:evidence-blocking] rules/solid/dependency-inversion.md sourceHash:sha256:a65bef63584384e354b7e460c00e416b6d6025bb4420ca4b19e1d22d94eaeeea
</language_rules>

**Rule satisfaction:** Preserve actual transport/policy/persistence boundaries, use current-need examples, and retain stable IDs where semantics remain. A subjective “need” is judged with named human evidence, not a pretend linter.

## Preconditions

- Verify exact task branch and Unit 02.01 commit/receipt. Stop for unrelated dirty files.
- Read the current rule and knowledge files in scope, the new common rule, ADR 0037, and directive catalog before editing. Recompile planning hashes at execution.

## Scope

**In scope:** `rules/solid/open-closed.md`, `rules/solid/single-responsibility.md`, `rules/solid/dependency-inversion.md`, `knowledge/principles/solid-ocp.md`, `knowledge/principles/solid-srp.md`, `knowledge/principles/solid-dip.md`, `evals/tests/rules/pragmatic-solid-alignment.test.mjs` (new), `context-manifest.json`, `context-lock.json`.

**Out of scope:** LSP/ISP rewrites without a discovered contradiction, global quality rules, backend/UI owners (Unit 03.02), host code, a new inheritance hierarchy, and a mandatory refactor threshold.

## Steps

1. Write the conflict matrix in this unit's execution ledger before changing text. Add failing assertions for one-implementation acceptance, real-variant composition, cohesive role boundaries, and a real infrastructure crossing. Include a negative case where policy code directly constructs an ORM/SDK client.
2. Edit only conflicting OCP/SRP/DIP directives and examples. State the current-need trigger, the simplest valid form, and when a narrow contract or separate file is justified. Keep trust and dependency-direction prohibitions. Update their canonical knowledge notes to avoid contradictory advice.
3. Keep stable directive IDs when narrowing a contract; if meaning changes materially, create a new ID and record the migration in catalog tests. Do not label a structural directive automated unless its actual verifier rejects a violation.
4. Synchronize manifest/lock and run focused tests, lint, evaluations, doctor, preflight, and unit conformance with named human review. Review exact scope and commit after PASS.

## Verification

- **Architecture/contract test:** `node --test evals/tests/rules/pragmatic-solid-alignment.test.mjs`. It catches a mandatory interface, strategy, split, or hook reintroduced in any of the three rule owners and checks that the infrastructure boundary remains explicit; ordinary schema lint cannot detect contradiction.
- **Manual architecture review:** Compare all OCP/SRP/DIP directives and examples with the conflict matrix, including single and real multi-variant cases, LSP substitutability, and lean ISP contracts. This is needed because a text assertion cannot prove the chosen abstraction is justified.
- **Catalog/conformance:** `npm run sync`, `npm run lock`, `npm run lint`, `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`, then exact-scope preflight/conform and independent receipt verification. New rule IDs/modes require fresh catalog counts.

## Rollback

Revert the three SOLID rule/knowledge pairs, focused test, manifest, and lock together. No host migration or data rollback applies.

## Definition of done

- [ ] AC-04 conflict matrix covers every changed directive/example and explains the retained ID/mode.
- [ ] One-implementation and real-boundary cases pass without weakened policy/trust prohibitions.
- [ ] Exact branch/fence, tests, catalog, lint, evaluations, doctor, review, and fresh verified PASS receipt are recorded before commit.
