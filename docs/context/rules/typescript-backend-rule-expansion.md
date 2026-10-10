---
title: "TypeScript backend rule expansion and module architecture"
type: context
status: ready
created: "2026-10-10"
tags: [context, typescript, backend, rules]
feature: "typescript-backend-rule-expansion"
---

# TypeScript Backend Rule Expansion and Module Architecture Context Specification

## 1. Overview & Objective

- **Problem:** The backend module rule mandates capability-local folders split by layer, describes mostly create/update/delete operations, and leaves DTO serialization, testing, dependency injection, transactions, module contracts, and read paths underspecified. The user wants stronger TypeScript output with less repeated input.
- **Value:** A developer can name a backend task once and receive the smallest applicable, unambiguous rules. Maintainers can verify the resulting module boundaries without relying on claims made only in prose.
- **Success criteria for the eventual rule change:**
  1. A representative create and read operation can follow the documented default layout without contradictory import or naming rules.
  2. DTO input parsing, domain values, persistence shapes, response serialization, service policy, transactions, and module public imports each have one clear owner.
  3. Testing guidance covers service, controller, data, route, and module contract behavior without duplicating the existing data-access testing rule.
  4. Affected-file binding selects these rules and excludes unrelated TypeScript guidance; compare rendered prompt tokens and directive counts before and after. Generated-code quality needs behavior tests, not a token estimate alone.
  5. Every blocking directive has a real verifier or named human evidence. Missing tools or unsupported checks must not yield a claimed automated pass.

### Decision ledger

| ID | Status | Decision / proposal | Authority |
| --- | --- | --- | --- |
| D-01 | decided | Operation-first folders replace `dto/`, `data/`, `services/`, and `controllers/` as the default layout inside `src/modules/<feature>/`. Layer suffixes retain responsibility boundaries. | User reply, 2026-10-10 |
| D-02 | decided | Address the backend gaps in the pasted feedback first: compact DTO/serialization and backend testing rules, with common runtime validation and database-adapter testing retained as canonical owners for their existing concerns. | User reply, 2026-10-10 |
| D-03 | decided | A simple read controller may call data directly when it has no authorization-sensitive decision, business policy, or orchestration. Commands and policy-bearing reads use a service. | User reply, 2026-10-10 |
| D-04 | derived design constraint | Keep `module-architecture.md` focused on shape, dependencies, naming, and public contracts. Give DTO/serialization and backend test behavior separate compact owners, with references to existing common/database rules instead of duplicate directives. | User's minimal-input goal; current catalog ownership |
| D-05 | derived compatibility constraint | Use colocated `.test.ts` as the documented default and recognize `.spec.ts` where a host already uses it. `src/modules/` is the default root; a host with an established `src/features/` convention needs an explicit profile/override rather than conflicting implicit defaults. | Existing rule/test globs and D-01 |

## 2. Requirements & User Stories

### User stories

- As a backend developer, I want a create operation's files together so a change stays locally discoverable.
- As an API maintainer, I want one request schema and explicit response serialization so transport contracts cannot silently become database models or leak internal fields.
- As a reviewer, I want dependency, transaction, and public-contract rules that name the allowed seam and can be checked honestly.
- As a rule maintainer, I want the relevant rules selected from file scope with minimal duplicated prompt text.

### Candidate functional requirements

- [ ] Define the default module tree around operations (`create-<feature>/`, `get-<feature>/`, `list-<features>/`, `search-<features>/`, `update-<feature>/`, `delete-<feature>/`) and keep shared helpers at module root. No sideways imports between operation folders; identify exceptions for genuinely shared domain types and policy.
- [ ] Define suffixes for routes, DTOs, controllers, services, data, types, errors, mappers, persistence schemas, policies, events, and tests. Avoid mandatory empty files and specify what a root `<feature>.data.ts` may own.
- [ ] Define where transport schemas end, where domain types begin, how persistence records are mapped, and where response shapes and serialization live. Preserve existing single-schema request validation and safe public errors.
- [ ] Define service signatures with plain input/output and explicit dependencies. State how the composition root supplies data functions and a transaction/unit-of-work boundary without exposing HTTP objects or ORM clients to services.
- [ ] Define `index.ts` exports and cross-module import restrictions. Clarify whether platform concerns (`db`, logger, configuration, auth middleware) need a separate `src/platform/` contract and when direct calls or events are appropriate.
- [ ] Define command and query paths: commands and policy-bearing reads use a service; simple reads may go controller → data. Controllers still validate input, enforce transport gates, and serialize safe output, never implement business policy. Update `controllers-and-routes.md` and `service-layer.md` to agree.
- [ ] Define colocated operation tests and appropriate service, controller, data, route, and public-contract checks; retain isolated database/API adapter coverage in `testing-data-access-layer.md`.
- [ ] Use colocated `.test.ts` by default; support `.spec.ts` for established host conventions. The rule selector and test runner must discover whichever suffix the host adopts.
- [ ] Design rule applicability and enforcement by actual host path/stack and available tooling. Do not label a new linter or scaffold check implemented until it runs and catches a violating fixture.
- [ ] During implementation, reconcile ADR 0001, the Rules map, manifest/lock, affected rules, examples, and evaluation fixtures; measure baseline and changed binding/prompt size and generated behavior.

### Scenarios and failure/recovery

| Scenario | Expected outcome | Failure/recovery evidence |
| --- | --- | --- |
| Create with validation, policy, and a transaction | Controller parses DTO and maps errors; service coordinates policy and atomic writes; data adapter performs persistence | Invalid input receives structured error; policy denial changes no rows; rollback covers every atomic write |
| Get/list/search with no business policy | Controller may call data directly, with explicit query parsing, response serialization, stable pagination, and no hidden data leak | Missing or malformed cursor/filter has defined response; direct path is prohibited if policy or orchestration appears |
| Authorization-sensitive read | Trusted policy boundary applies before data becomes visible | Cross-tenant or forbidden record returns safe response; no controller-only policy bypass |
| Operation reused by another module | Consumer imports only the feature's public contract | Deep import or sideways operation import is rejected by an actual architecture check or reviewed with named evidence |
| DTO and persistence shape diverge | Explicit mapping and output whitelist preserve API contract | Added internal field is absent from serialized response; unsafe cast/row return is caught |
| Retried multi-step command | One transaction context covers writes; external effects have defined order/idempotency | Midway failure rolls back or compensates; no duplicate side effect on retry |
| Host lacks proposed lint/generator tooling | Rule binding reports the missing capability; guidance remains usable | Conformance reports BLOCKED/unsupported or named human evidence rather than a false automated PASS |
| Small module or large module | Only needed files exist; split threshold is a review signal, not an unexplained hard limit | No placeholder files or arbitrary forced split; module growth has an ownership decision |

## 3. Technical & Architectural Context

- **Affected system:** Context Factory rules and selection/conformance machinery governing host TypeScript backends. No host API or database migration is requested in this discovery pass.
- **Current contract:** `rules/typescript/backend/module-architecture.md` requires `src/modules/<feature>/` with layer folders, has `appliesTo` for both `src/modules/**` and `src/features/**`, and declares route → controller → service → data. `docs/decisions/0001-vertical-backend-modules.md` accepts that organization; changing the default needs a revised architecture decision later.
- **Related owners:** `controllers-and-routes.md` owns transport validation and error mapping; `service-layer.md` owns explicit dependencies, policy, typed errors, and transactions; `common/runtime-validation.md` owns I/O parsing; `database/testing-data-access-layer.md` owns adapter tests. `service-layer.md` permits omitting a pass-through service, while the module rule's dependency diagram implies a mandatory service: this requires a single canonical answer.
- **Candidate directive IDs and modes:** Retain existing `ts.module.*` IDs only where semantics survive. Candidate new IDs include `ts.dto.request-response-separation`, `ts.dto.explicit-mapping`, `ts.module.operation-locality`, `ts.module.public-contract`, `ts.module.transaction-seam`, and `ts.backend-test.boundary-coverage`. Semantic ownership and transaction rules are **evidence-blocking** with named review evidence unless a real verifier is introduced; filename/import rules may be **automated-blocking** only after a violating fixture proves the check; growth and generator suggestions are **advisory**. The implementation must audit all IDs against existing owners and assign each exactly one check mode.
- **Enforcement reality:** `orchestrator/conformance/adapters/typescript.mjs` dispatches specific IDs for type safety, runtime validation, module imports, async lint, and strict compiler settings. Other automated-blocking IDs, including several `ts.module.*` IDs, currently fall through to a generic `heuristic-pass`. Descriptor labels alone do not establish enforcement.
- **Selection and input size:** `orchestrator/rules/binding-compiler.mjs` selects directives by stack and affected path and carries statement text into bindings. File scope and `alwaysApply` choices must be tested against actual rendered provider payload, not only source length.
- **Compatibility:** `src/modules/` is the accepted default. Current applicability also names `src/features/`, and older new-project context/task artifacts still illustrate layer folders. An eventual rollout must support an explicit established-host `src/features/` override and distinguish historical task records from active guidance. Existing `.test.ts` discovery must not silently lose coverage if a host uses `.spec.ts`.
- **Abstraction limits:** Specify a composition/transaction seam without requiring one named library. A platform folder may be recommended for genuinely cross-cutting infrastructure but should not become a mandatory `shared/` dumping ground. Events are an option for decoupled cross-module effects, not a universal substitute for direct calls. The roughly 15-operation split threshold and scaffold generator in the feedback are advisory proposals, not hard requirements.
- **Security/authorization:** Request data is untrusted, output must not expose internal rows/errors, and authorization-sensitive reads and writes need a trusted service/policy boundary. Tenant isolation and role logic depend on the host application; these rules must prescribe boundaries without inventing roles.
- **Data model:** Distinguish transport DTO, domain value, persistence model, and serialized response. This rule authoring creates no database tables or migrations.

## 4. UI/UX & Interaction Guidelines

The developer-facing rule map and CLI output should identify the small selected rule set and checks in compact language. Application UI is outside scope.

## 5. Scope & Boundaries

- **In scope for discovery:** TypeScript rule taxonomy, operation-first backend module shape, DTO/serialization and test concerns, interaction with existing backend/common/database rules, enforcement feasibility, verification scenarios, and migration/compatibility implications for starters and hosts.
- **Out of scope for this invocation:** Production rule edits, host application migration, introducing a particular ORM/validation library, installing lint/scaffold packages by default, and claiming that a generated shape or conformance check passes before it is tested.
- **Scope decision:** “Other” means the backend gaps in the attachment. A broader UI/common TypeScript catalog review is deferred.

## 6. References & External Context

- User-supplied architecture feedback: `/Users/joseph/.codex/attachments/b9dc666b-83fd-4c89-bfef-8dbf58decf4a/Pasted text.txt`.
- `docs/decisions/0001-vertical-backend-modules.md`, `docs/decisions/0027-language-rule-lifecycle-binding-and-verification.md`, `docs/decisions/0034-framework-scoped-typescript-rules.md`.
- `docs/context/harness/typescript-web-rule-quality.md` records the shared baseline plus small framework additions and distinguishes token measures from code quality.

## 7. Discovery Evidence & Handoff

### Evidence inventory

| ID | Source / location | State | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | User request and pasted feedback | verified as user input | Names DTO/serialization and testing, plus module architecture suggestions | Capture as desired direction, not automatic decisions |
| E-02 | `rules/typescript/backend/module-architecture.md` | verified current file | Layer folders, CUD examples, limited suffixes, two path roots | Resolve shape, naming, reads, and applicability |
| E-03 | `docs/decisions/0001-vertical-backend-modules.md` | verified accepted ADR | Existing layout is an architecture decision | Plan an explicit decision update before rule replacement |
| E-04 | `rules/typescript/backend/controllers-and-routes.md`; `service-layer.md`; `common/runtime-validation.md`; `database/testing-data-access-layer.md` | verified current files | Overlapping boundary and test ownership; pass-through exception | Avoid duplicate or contradictory rules |
| E-05 | `orchestrator/rules/binding-compiler.mjs`; `orchestrator/conformance/adapters/typescript.mjs` | verified current code | Binding is path scoped; TypeScript adapter has a generic pass fallback | Audit each proposed blocking verifier |
| E-06 | User reply, 2026-10-10 | decision | Operation-first is the new default | D-01 resolved |
| E-07 | User reply, 2026-10-10 | decision | Backend gaps come first | D-02 resolved; wider TypeScript catalog excluded |
| E-08 | `docs/context/new-project-workflow/index.md`; archived task 0004; `rules/typescript/database/testing-data-access-layer.md` | verified current files | Earlier layer-folder examples and `.test.ts` globs coexist with pasted `.spec.ts` example | Account for migration and test discovery |
| E-09 | User reply, 2026-10-10 | decision | Simple reads may call data directly | D-03 resolved; reconcile controller/service rules |
| E-10 | User confirmation, 2026-10-10 | decision | Confirmed the shared understanding of backend-first rules, operation-first layout, bounded direct reads, and honest enforcement | Readiness gate satisfied |

### Unknowns and blockers

| ID | Gap | Class | Owner | Blocks ready? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | Breadth of “other” TypeScript rules | resolved | User | no | Backend gaps in the attachment first |
| U-02 | Direct controller → data for simple reads versus stable use-case boundary | resolved | User | no | Direct reads allowed only without business policy, authorization-sensitive decisions, or orchestration |
| U-03 | Exact directive IDs and verifier implementations | implementation detail | Rule/harness maintainer | no | Candidate owners/modes and fail-closed acceptance contract are specified; implementation must prove every blocking check |
| U-04 | Whether a specific size threshold or scaffold generator is desired | assumption | Rule maintainer | no | Treat as advisory until evidence shows a need |
| U-05 | User confirmation of complete shared understanding | resolved | User | no | Confirmed on 2026-10-10 |

### Discovery handoff

- **Allowed recipients:** `grounding`, `grill`.
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`.
- **Ready for grill:** yes; user confirmed the shared understanding and no material discovery blocker remains.
- **Context content hash:** `sha256:37bcd9dd4f31196593fb2b19a29baf455e73e9878b31562f460a580dcff721b0` (SHA-256 of this file excluding this hash line).
