---
title: "Backend module testing rule and suffix compatibility"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.02"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, unit, testing]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 02.02: Backend Module Testing Rule and Suffix Compatibility

> Task branch: `feat/PLN-0007-typescript-backend-rule-expansion` · Base commit: `a1ffd01afeaff61e1ec2f649e60d23a51ed313a9`

## Objective

Define a focused test matrix for operation-local services, controllers, data, routes, and public module contracts, while preserving existing adapter-test ownership and host test naming.

## Context packet

- **Current evidence:** `module-architecture.md` has one verification paragraph. `controllers-and-routes.md` describes handler/integration tests. `service-layer.md` calls for dependency fakes. `database/testing-data-access-layer.md` specifies isolated DB/API adapter tests but its `appliesTo` includes `.test.ts` paths only. The pasted proposal uses `.spec.ts`, while the confirmed default is `.test.ts`.
- **Accepted target:** New compact `rules/typescript/backend/testing.md` owns which module boundary is tested and with what kind of case; it links to the existing database-adapter testing owner for DB/network mechanics. Co-locate `.test.ts` by default and recognize an established `.spec.ts` host. A pure read with no policy does not get a fabricated service test; a policy-bearing read has service authorization tests. Contract tests protect `index.ts` and serialized output.
- **Cases:** Service fake dependencies and rollback; controller malformed params/body and HTTP mapping; data real boundary and empty/constraint behavior; route middleware/auth composition; public index deep-import guard; internal-field serialization; tenant-sensitive read negative case. No mandatory test file for an absent layer.
- **Acceptance:** AC-06 and the test-discovery portion of AC-07.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
</language_rules>

**Rule satisfaction:** The matrix assigns one purpose to each test type, limits adapter details to the existing data rule, and binds test naming to host evidence. The new rule does not promise automatic semantic test coverage without a verifier. Refresh source hashes at execution.

## Preconditions

- Units 01.01 and 02.01 are complete and catalog state is synchronized; branch identity matches.
- Inspect current host test globs in the data rule and the actual catalog selection path before changing applicability.

## Scope

**In scope:** `rules/typescript/backend/testing.md` (new), `rules/typescript/database/testing-data-access-layer.md`, `rules/typescript/backend/module-architecture.md`, `evals/tests/rules/backend-testing.test.mjs` (new), `evals/tests/rules/catalog-coverage.test.mjs`, `docs/Rules.md`, `context-manifest.json`, `context-lock.json`.

**Out of scope:** Replacing DB/API adapter fixtures, forcing all hosts to use `.spec.ts`, creating placeholder service files/tests, adding a test runner dependency, UI/common TypeScript testing catalog.

## Steps

1. Write failing rule-selection and contract tests for `.test.ts` default, `.spec.ts` established-host scope, service/controller/data/route/index boundaries, and no service-test requirement for a policy-free read. Include tenant-sensitive read negative case.
2. Add `backend/testing.md` with stable IDs, applicability, and explicit unit/integration/architecture/contract test purposes. Do not copy the isolated DB/migration/network mock details from `testing-data-access-layer.md`.
3. Update the data rule's applicability to include adopted `.spec.ts` locations and operation-local data tests as needed, without broadening database-only directives onto unrelated service tests. Add reference from module rule, update Rules map and inventory, then regenerate lock with `npm run sync`.
4. Run the focused test, binding regression, catalog coverage, lint, and doctor. Review scope and obtain a fresh conformance receipt with named human evidence for semantic directives.

## Verification

- **Contract/selection tests:** `node --test evals/tests/rules/backend-testing.test.mjs evals/tests/rules/rule-binding.test.mjs`. Justification: catches suffix/root mismatches that silently omit guidance for operation tests.
- **Negative authorization case:** Rule/test matrix must require service policy coverage for tenant-sensitive reads. Justification: simple-read shortcut otherwise escapes scrutiny.
- **Existing adapter tests:** `node --test evals/tests/conformance/typescript-adapter.test.mjs` if data-rule applicability changes binding; justification: guard against an unintended adapter-test scope shift.
- **Catalog:** `npm run lint`, `node scripts/context.mjs doctor`; record actual source/lock/evaluation results.
- **Conformance:** Fresh unit-scope preflight/conform with named human evidence; stop on FAIL/BLOCKED and keep phase incomplete.

## Rollback

Revert the testing rule, data-rule applicability, module reference, test, map, manifest, and lock together. Existing `.test.ts` adapter coverage must remain available.

## Definition of done

- [ ] AC-06 and relevant AC-07 suffix selection cases pass after an initial failing test.
- [ ] No duplicate data-adapter policy and no test required for a layer that is absent.
- [ ] In-scope review, catalog sync, focused tests, lint, doctor, and fresh conformance PASS recorded.
- [ ] Unit committed on the exact task branch after its gate.
