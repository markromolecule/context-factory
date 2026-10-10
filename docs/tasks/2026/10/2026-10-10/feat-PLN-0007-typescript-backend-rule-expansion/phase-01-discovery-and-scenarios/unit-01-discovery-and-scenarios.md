---
title: "Superseding ADR and operation-first backend boundaries"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.01"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, unit, architecture]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Superseding ADR and Operation-first Backend Boundaries

> Task branch: `feat/PLN-0007-typescript-backend-rule-expansion` · Base commit: `a1ffd01afeaff61e1ec2f649e60d23a51ed313a9`

## Objective

Give one authoritative operation-first backend module contract, including the simple-read exception, while preserving transport, policy, and persistence separation.

## Context packet

- **Current evidence:** ADR 0001 / Decision and `rules/typescript/backend/module-architecture.md` / Required shape prescribe `dto/`, `data/`, `services/`, and `controllers/` inside `src/modules/<feature>/`. `controllers-and-routes.md` says delegate business decisions to services and persistence to data functions; `service-layer.md` already allows skipping a pure pass-through service.
- **Accepted target:** The user chose operation folders by default under `src/modules/<feature>/`; `index.ts` is the cross-module public surface; no sideways operation imports. Commands and authorization-sensitive reads require service/policy; simple reads may call data directly. An established `src/features/` host needs an explicit convention rather than an implicit second default.
- **Boundary details:** Route composes paths/middleware; controller parses input and maps public response/errors; service takes plain values and injected data/transaction contracts, owns policy and transaction; data handles persistence and accepts transaction context. A retryable command orders external effects outside the open transaction and defines idempotency/compensation. Module-root files hold only concerns actually shared across operations. File suffix vocabulary includes types/errors/mapper/schema/policy/events/tests without forcing empty files. A root `<feature>.data.ts` is for shared reads/mappers, not an alternate operation dump.
- **Acceptance:** AC-01, AC-02, and the architecture portion of AC-04. The tenant-sensitive negative case must make the direct data shortcut inapplicable.
- **Decision authority:** User confirmation on 2026-10-10; a new ADR supersedes only ADR 0001's folder-layout portion and retains vertical capability ownership and separate responsibilities.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.arch.layers][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
</language_rules>

**Rule satisfaction:** Cite current ADR/rule source for claims; restrict edits to the named boundary; keep transport/policy/persistence distinct in the rule example and architecture test. Recompile these planning hashes at execution; semantic checks require named human evidence, not the unit author's claim.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` returns `feat/PLN-0007-typescript-backend-rule-expansion`; stop otherwise.
- Verify the released brief hash and that ADR number 0037 is still unallocated before creating it; if occupied, choose the next free number and update this unit's file fence in review.
- `git status --short` contains no unrelated changes; preserve any owner work.

## Scope

**In scope:** `docs/decisions/0037-operation-first-backend-modules.md` (new), `docs/decisions/README.md`, `rules/typescript/backend/module-architecture.md`, `rules/typescript/backend/controllers-and-routes.md`, `rules/typescript/backend/service-layer.md`, `evals/tests/rules/backend-module-architecture.test.mjs` (new), `evals/tests/rules/catalog-coverage.test.mjs`, `context-manifest.json`, `context-lock.json`.

**Out of scope:** Application source under `src/`, DTO/serialization rule creation, backend-testing rule creation, conformance adapter changes, archived task text, host migrations.

## Steps

1. Add failing architecture/contract assertions for operation-local tree, root-sharing rule, public `index.ts`, complete suffix vocabulary, simple-read allowance, command/sensitive-read service requirement, and no controller policy/ORM. Include a cross-tenant read negative case and a two-write transaction example check. Run the narrow test and record the expected failure.
2. Write new ADR with three viable layouts, explicit tradeoffs, the user-selected option, compatibility for established `src/features/` hosts, rollback, and `supersedes: ["0001"]`. Link it from `docs/decisions/README.md`; do not rewrite ADR 0001's history.
3. Rewrite `module-architecture.md` around operation folders and no-sideways/public-contract imports. Reconcile `controllers-and-routes.md` and `service-layer.md` so the direct read path is permitted only when policy/orchestration is absent. State transaction injection without prescribing an ORM or mandatory platform folder.
4. Keep old directive IDs only where the statement's meaning survives; record each changed/new ID and mode in the test. Semantic ownership is evidence-blocking until a verifier exists. Do not claim a linter already enforces a renamed rule.
5. Run `npm run sync` for the new ADR/test inventory and lock, then focused test, lint, and doctor. Review the exact diff against the in-scope list and obtain fresh unit conformance evidence.

## Verification

- **Architecture test:** `node --test evals/tests/rules/backend-module-architecture.test.mjs`. Justification: catches contradictory dependency paths and cross-module imports that ordinary syntax tests miss.
- **Contract test:** The same file checks the public `index.ts`, file suffix, and simple-read/policy boundary examples. Justification: consumers otherwise learn two incompatible module contracts.
- **Negative/abuse case:** A tenant-sensitive read must require service/policy and no raw database row reaches a controller. Justification: direct data reads could bypass isolation.
- **Catalog and sync:** `npm run sync`, `npm run lint`, `node scripts/context.mjs doctor`; record context version, lock digest, evaluation and validation counts.
- **Conformance:** Compile fresh `context-cli preflight "PLN-0007 Unit 01.01" --stack typescript --scope "<exact changed files>"`; run `context-cli conform` on the same scope with named human evidence and save a PASS receipt. Stop on FAIL/BLOCKED. The final whole-diff receipt is a later gate.

## Rollback

Revert this unit's commit as one change, including ADR, linked map, rule text, test, manifest, and lock. Retain ADR 0001 as the current contract after rollback; do not leave two active defaults.

## Definition of done

- [ ] AC-01, AC-02, and architecture part of AC-04 have observable failing-then-passing cases.
- [ ] Exact task branch and file fence verified; no unrelated edits.
- [ ] ADR and rules agree; focused test, lint, doctor, `/review`, and fresh conformance PASS recorded.
- [ ] Unit committed on the task branch only after the required evidence gate.
