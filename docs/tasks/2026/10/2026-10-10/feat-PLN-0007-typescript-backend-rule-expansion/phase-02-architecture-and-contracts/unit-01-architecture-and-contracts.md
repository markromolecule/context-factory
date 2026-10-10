---
title: "Per-operation DTO and response serialization rule"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.01"
task_branch: "feat/PLN-0007-typescript-backend-rule-expansion"
base_commit: "a1ffd01afeaff61e1ec2f649e60d23a51ed313a9"
status: planned
created: "2026-10-10"
tags: [task, unit, dto, serialization]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Per-operation DTO and Response Serialization Rule

> Task branch: `feat/PLN-0007-typescript-backend-rule-expansion` · Base commit: `a1ffd01afeaff61e1ec2f649e60d23a51ed313a9`

## Objective

Give each backend operation one request schema and an explicit public-output mapping without letting transport DTOs become domain or persistence models.

## Context packet

- **Current owners:** `rules/typescript/common/runtime-validation.md` requires parsing unknown I/O data, schema-derived types, safe parse, and structured validation errors. `rules/typescript/backend/controllers-and-routes.md` forbids raw ORM rows/internal errors in responses. Neither defines a per-operation request/response file contract or explicit DTO → domain → persistence → public-response mapping.
- **Accepted target:** A compact new `rules/typescript/backend/dto-and-serialization.md` applies to backend DTOs/controllers/mappers only. Separate request schema from response shape, derive request type from schema, explicitly map persistence values to domain and public output, and whitelist response fields. Refer to existing parsing and error rules rather than duplicating directive text. No mandatory Zod, ORM, mapper library, or new database schema.
- **Failure cases:** malformed body/query never reaches service; a new internal row field is not serialized; `undefined`/missing/nullable fields follow an explicit public contract; list results use the same serializer as a single result where appropriate. A service sees plain domain/use-case values and typed errors, not `req`/`res`.
- **Acceptance:** AC-03 and DTO-related AC-04; request/response types must remain transport-facing while injected service/transaction contracts remain domain-facing.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
</language_rules>

**Rule satisfaction:** The new rule references existing validation and response-safety IDs, scopes only backend DTO/mapper/controller files, and keeps one source for each policy. The focused contract test exercises the new behavior; named reviewer evidence covers semantic mapping until a real verifier exists. Recompile planning hashes at execution.

## Preconditions

- Unit 01.01 is complete and the branch matches `feat/PLN-0007-typescript-backend-rule-expansion`.
- Re-read the current `runtime-validation.md`, `controllers-and-routes.md`, and updated module rule to prevent duplicate directive ownership.

## Scope

**In scope:** `rules/typescript/backend/dto-and-serialization.md` (new), `rules/typescript/backend/module-architecture.md`, `evals/tests/rules/backend-dto-serialization.test.mjs` (new), `evals/tests/rules/catalog-coverage.test.mjs`, `docs/Rules.md`, `context-manifest.json`, `context-lock.json`.

**Out of scope:** Changing application DTOs, modifying common runtime-validation semantics, adopting a serializer library, backend-testing rule, adapter verifier implementation.

## Steps

1. Write a failing contract test that parses the new descriptor, selects it for a sample operation DTO/controller scope, and checks concrete rule examples for malformed input, internal-field exclusion, and request/response separation. Include a sample service input with no transport object and an output mapper with explicit fields.
2. Add the compact new rule with stable IDs and per-directive `appliesTo`, mode, and verifier metadata. Use evidence-blocking for semantic mapping where no machine check exists; mark only proven checks automated. Reference `ts.runtime-validation.*` and `ts.controllers.no-leak-internals` as related owners, without copying their directive statements.
3. Adjust the module rule only enough to point to the DTO owner and keep file naming consistent. Add the rule to `docs/Rules.md` and manifest; run `npm run sync` to refresh generated inventory/lock.
4. Run focused test, catalog coverage/lint, and doctor. Review diff for accidental changes to common rules or application files. Compile a fresh unit binding and obtain a PASS conformance receipt with any required named human evidence.

## Verification

- **Contract test:** `node --test evals/tests/rules/backend-dto-serialization.test.mjs`. Justification: catches a transport/persistence type conflation or raw-row response that catalog parsing alone misses.
- **Negative input/privacy cases:** Assert malformed body and internal persistence field stay outside service/public response. Justification: otherwise a happy-path fixture could pass while unsafe output remains.
- **Catalog checks:** `node --test evals/tests/rules/catalog-coverage.test.mjs`, `npm run lint`, `node scripts/context.mjs doctor`; update count assertions from parsed catalog facts, not estimates.
- **Conformance:** Fresh `context-cli preflight` and `context-cli conform` for exact unit diff with named human evidence; save report ID, binding hash, diff hash, and PASS verdict. Stop on FAIL/BLOCKED.

## Rollback

Revert the new rule, module-rule reference, focused test, map, manifest, and lock in one unit revert. The prior common parsing and controller response rules remain authoritative.

## Definition of done

- [ ] AC-03 and DTO portion of AC-04 have failing-then-passing contract and negative cases.
- [ ] New directive IDs, modes, and owner references are unique; no duplicated common validation policy.
- [ ] In-scope diff, catalog sync, focused tests, lint, doctor, `/review`, and fresh conformance PASS are recorded.
- [ ] Unit committed on the exact task branch after its gate.
