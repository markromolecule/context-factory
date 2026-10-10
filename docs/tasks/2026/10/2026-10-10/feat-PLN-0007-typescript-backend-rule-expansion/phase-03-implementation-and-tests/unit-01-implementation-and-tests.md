---
title: "Structural verifier and fail-closed TypeScript fallback"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.01"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, unit, conformance]
depends_on: ["02.02"]
parallelizable_with: []
---

# Unit 03.01: Structural Verifier and Fail-closed TypeScript Fallback

> Task branch: `feat/PLN-0007-typescript-backend-rule-expansion` · Base commit: `a1ffd01afeaff61e1ec2f649e60d23a51ed313a9`

## Objective

Make TypeScript backend architecture enforcement truthful: verify structural rules with real checks and keep unsupported semantic or unavailable cases from reaching report PASS.

## Context packet

- **Current evidence:** `orchestrator/conformance/adapters/typescript.mjs` dispatches selected exact IDs, then returns `PASS` with `verifierType: "heuristic-pass"` for other non-unsupported directives. `orchestrator/conformance/evidence-gate.mjs` accepts automated PASS when `verifierType` is present. `checkArchitectureBoundaries` also reports an advisory architecture PASS without inspecting source. An unhandled directive can therefore look enforced.
- **Accepted target:** `src/modules/<feature>/<operation>/` is the default; cross-module consumers use module `index.ts`; operation folders do not import sideways; role suffixes describe files. `src/features/` is supported only as an established host convention. A simple read may call data directly; sensitive reads and commands need policy/service. Only structural constraints with a proven verifier remain automated-blocking. Policy absence, serialization safety, and transaction semantics require named evidence until verified.
- **Acceptance:** AC-05. An unhandled automated ID must make `aggregateConformanceResults` BLOCKED/FAIL, not merely change adapter metadata. Human compensation must be explicit and represented as such. Existing known-ID checks keep their behavior.
- **Decision authority:** Confirmed discovery brief and ADR 0029 evidence model. No new host parser or import resolver dependency is assumed.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.arch.layers][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
</language_rules>

**Rule satisfaction:** Start with a failing adapter/report test, restrict edits to the conformance seam, and preserve dependency direction. Refresh planning hashes with preflight. Named human evidence identifies the reviewer and inspected artifacts; an agent's own assertion is insufficient.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` equals `feat/PLN-0007-typescript-backend-rule-expansion`; stop for detached/mismatched HEAD or unrelated dirty files.
- Unit 02.02 and predecessors are reviewed, committed, catalog-synced, and have fresh PASS receipts. Inspect actual directive IDs/modes and result schema before dispatch work.
- Preserve current ban-any, compiler, promise, runtime-validation, and module-import checks.

## Scope

**In scope:** `orchestrator/conformance/adapters/typescript.mjs`, `orchestrator/conformance/evidence-gate.mjs` only if a report test proves a bypass, `evals/tests/conformance/typescript-adapter.test.mjs`, `evals/tests/conformance/conformance-gate.test.mjs`, `evals/fixtures/typescript/backend/` (new), relevant backend rule modes/IDs if verifier truth requires correction, `context-manifest.json`, `context-lock.json` for changed rules.

**Out of scope:** Automatic proof that a read lacks policy, general TypeScript import resolution, host app migrations, new third-party parser/linter, waivers, unrelated stack adapters.

## Steps

1. Add a failing adapter-plus-aggregate test for an unknown automated-blocking ID: no `heuristic-pass` PASS and no aggregate PASS. Cover unknown evidence-blocking IDs with missing versus named human evidence, and unknown advisory IDs as non-enforced.
2. Add positive/negative fixtures for operation-local imports, module `index.ts` versus deep import, sideways operation imports, forbidden upward imports, and role suffix/name violations. Include relative paths and unresolved alias/tsconfig cases. For every automated ID, prove full changed-scope coverage and detection or `TOOL_UNAVAILABLE`/`NOT_AUTOMATABLE` when resolution is insufficient.
3. Dispatch only exact structural directive IDs to their verifier. Replace generic PASS fallback with non-PASS outcomes for unhandled blocking modes and non-enforced advisory reporting for advisory modes. Ensure status/mode/verifierType/aggregate verdict agree; tighten the evidence gate only where a test shows a concrete bypass. Preserve known verifier cases.
4. Reconcile rule modes with actual coverage: structural constraints are automated only if fixtures prove them; semantic directives remain evidence-blocking. Run `npm run sync` if rules or inventory change. Never claim an unproved code check exists.
5. Run focused suites, lint, evaluations, doctor, and fresh preflight/conform on exact unit scope. Review diff and record newly blocked host rules as rollout impact, not passing exceptions.

## Verification

- **Unit tests:** `node --test evals/tests/conformance/typescript-adapter.test.mjs`. Justification: catches dispatch regressions and missing-tool paths in the adapter itself.
- **Architecture tests:** Good/bad fixture pairs in that suite cover public imports, operation isolation, and suffix paths. Justification: syntax checks cannot prove dependency direction.
- **Integration/contract tests:** `node --test evals/tests/conformance/conformance-gate.test.mjs` passes adapter results into aggregation and asserts non-PASS for unknown automated IDs, tool unavailability, and missing human evidence. Justification: adapter status alone does not prove the public report verdict is honest.
- **Regression:** Existing exact-ID checks remain PASS on valid scope and FAIL/BLOCKED on invalid or unavailable scope; advisory results never count as enforced passes.
- **Catalog:** `npm run lint`, `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`; refresh lock with `npm run sync` if catalog files change.
- **Conformance:** Fresh `context-cli preflight "PLN-0007 Unit 03.01" --stack typescript --scope "<exact changed files>"` and matching `context-cli conform` with named human evidence as needed. Stop on FAIL/BLOCKED; save binding/diff hashes and receipt.

## Rollback

Revert adapter, gate, fixtures/tests, and matching rule/catalog changes together. Rollback re-exposes the known false-PASS risk, so the phase stays incomplete until a corrected verifier passes.

## Definition of done

- [ ] AC-05 has failing-then-passing structural and aggregate-report cases.
- [ ] No unhandled automated directive returns `heuristic-pass` PASS; unresolved checks and missing evidence block progression.
- [ ] Known-verifier regressions, lint, evaluations, doctor, `/review`, and fresh conformance PASS are recorded.
- [ ] Exact file fence and task branch verified; unit committed after its gate.
