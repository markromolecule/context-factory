---
title: "TypeScript Backend Rule Expansion Discovery Record"
type: discovery-record
status: ready
created: "2026-10-10"
sourceContext: docs/context/rules/typescript-backend-rule-expansion.md
sourceContextHash: sha256:37bcd9dd4f31196593fb2b19a29baf455e73e9878b31562f460a580dcff721b0
---

# TypeScript Backend Rule Expansion Discovery Record

## Idea and Release Condition

Strengthen backend TypeScript output with less repeated input. Replace the default layer-folder layout inside a business module with operation-first folders, define distinct DTO/serialization and backend-testing owners, and make boundary and enforcement claims checkable. Release a plan-facing brief only after current contracts, conflicting guidance, failure cases, and the user's decisions are reconciled.

**Actors and authority:** The user sets desired architecture and scope; host backend developers apply the rules; factory maintainers own catalog, selectors, tests, and verifier implementations; human maintainers provide required evidence or waivers. The confirmed context decisions are target requirements, while accepted ADR 0001 remains the description of current policy until explicitly superseded.

## Grounding Claim Packet: Backend Module Boundaries

Selection: `docs/Wiki.md` and `knowledge/README.md` index active canonical SOLID notes. Only SRP and DIP directly address this backend boundary. Their `lastVerified` fields are 2026-08-23, their review dates are 2027-02-23, and their linked rule texts were rechecked on 2026-10-10. The Wiki has **no grounded answer** for operation-first folders, direct controller-to-data reads, DTO serialization, test suffixes, or specific verifier implementations; repository rules, accepted ADRs, code, and user decisions govern those questions.

| Claim ID | Source / heading | Authority, lifecycle, last verified, content hash | Selection reason | Status and claim |
| --- | --- | --- | --- | --- |
| G-BE-001 | `knowledge/principles/solid-srp.md` / Architectural Boundaries & Responsibility Separation | canonical, active, 2026-08-23, `sha256:24df5b9e6f3d9f41c493482ea03bbbeeecd46a194b616eea4345dad1849c7461` | Transport, policy, and persistence ownership; corroborated by `rules/solid/single-responsibility.md` | **verified:** one operation folder may contain separate responsibility files; co-location does not permit mixing HTTP, policy, and persistence. |
| G-BE-002 | `knowledge/principles/solid-dip.md` / Invariants & Rules in TypeScript | canonical, active, 2026-08-23, `sha256:bee94e6fad38ddaa42c18b947d09b64cfda07382c4b43dfc65b6a5a68f13121d` | Service dependency and transaction seam; corroborated by `rules/solid/dependency-inversion.md` | **verified:** policy-bearing services depend on supplied contracts, not concrete ORM/SDK clients. |
| G-BE-003 | `knowledge/README.md` / Canonical Knowledge Items | canonical index, active, 2026-07-25, `sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac` | Inventory check for a module-shape or DTO/test note | **unknown:** no applicable canonical Wiki note specifies those details. Do not promote the pasted feedback or archived tasks into Wiki authority. |

## Repository Evidence and Resolutions

| ID | State | Current evidence | Consequence / resolution |
| --- | --- | --- | --- |
| R-01 | verified | `rules/typescript/backend/module-architecture.md` / Required shape; ADR 0001 / Decision | Current default uses `dto/`, `data/`, `services/`, `controllers/` inside `src/modules/<feature>/`. User selected operation-first as target; plan a superseding ADR before replacing current rule guidance. |
| R-02 | verified | `module-architecture.md` / Dependency direction; `controllers-and-routes.md` / Boundaries; `service-layer.md` / create-for-coordination | Current diagram implies controller → service → data, though service guidance permits omitting pass-through services. User selected direct controller → data for reads without policy or orchestration; all three rule owners must agree. |
| R-03 | verified | `runtime-validation.md`; `testing-data-access-layer.md`; `controllers-and-routes.md` | Request parsing, response safety, and data-adapter tests already have owners. New files should add missing DTO/response mapping and module-test coverage without duplicating these constraints. |
| R-04 | verified | `module-architecture.md` frontmatter; `testing-data-access-layer.md` frontmatter | Module rule matches both `src/modules/**` and `src/features/**`, but states only `src/modules/**` as required shape. Testing globs name `.test.ts`; pasted example names `.spec.ts`. Default and explicit host compatibility need selection tests. |
| R-05 | verified | `orchestrator/rules/binding-compiler.mjs` / `compileRuleBinding` | Binding selects by stack and affected file scope and carries directive statements. Acceptance must compare actual rendered prompt payload, not only Markdown size. |
| R-06 | verified | `orchestrator/conformance/adapters/typescript.mjs` / `evaluate`; `orchestrator/conformance/evidence-gate.mjs` / `evaluateDirectiveEvidence` | Several `ts.module.*` automated labels lack ID-specific checks and fall through to `heuristic-pass`, which has a verifierType and can satisfy the gate. Existing labels are not proof of actual enforcement. |
| R-07 | accepted decision | ADR 0029 / Contract decisions; ADR 0034 / Decision | Blocking checks need real evidence; scoped compact additions should not duplicate the shared baseline. |
| R-08 | confirmed user decision | Context specification D-01 to D-03 and E-10; user reply 2026-10-10 | Backend gaps first; operation-first default; bounded simple-read exception; complete shared understanding confirmed. |

## Decision Tree and Answers

| Branch | Answer | State |
| --- | --- | --- |
| Outcome | Improve backend TypeScript output and reduce selected context without weakening verification. | settled |
| Actors and permissions | Factory maintainers change rules and verifiers; host developers consume them; only human maintainers provide evidence/waivers. No application RBAC model is invented. | settled |
| Domain language | Feature module owns a capability; operation folder owns one use case; controller is transport; service owns policy/orchestration; data owns persistence; DTO is transport schema/shape; serialized response is public output. | settled |
| Default shape | `src/modules/<feature>/` with operation folders and root files only for genuinely shared concerns. `src/features/` needs an explicit established-host override. | settled by user; compatibility derived from current scope |
| Dependency direction | Commands and policy-bearing reads use service → data; simple reads may use controller → data; routes compose. No sideways operation imports or deep cross-module imports. | settled by user |
| DTO and output | Per-operation request schemas, explicit DTO → domain → persistence mapping, and safe output serialization; retain single-schema parsing and no internal leaks. | settled at requirement level |
| Testing | Colocated `.test.ts` default with `.spec.ts` support for established hosts; focused service/controller/data/route/public-contract evidence, retaining adapter test owner. | settled by catalog compatibility |
| Transactions and integrations | Services receive a supplied transaction/unit-of-work seam; data functions receive transaction context. No ORM/HTTP objects in policy service; no mandatory new library or platform folder. | settled at boundary level |
| Enforcement | ID-specific verifier plus bad/good fixture before automated-blocking claim; otherwise named evidence or advisory as appropriate. No heuristic PASS for unsupported blocking rules. | settled by ADR 0029 and source gap |
| Rollout | Superseding ADR, rules, selection/conformance checks, maps, manifest/lock, evaluations, and historical compatibility updated as one governed change. Host applications are not migrated in this task. | settled |
| Non-goals | UI/common TypeScript catalog expansion, ORM/validation framework mandate, default generator dependency, hard operation-count threshold, host application migration. | settled |

## Conflict Ledger

| ID | Claims in tension | Resolution and evidence | State |
| --- | --- | --- | --- |
| C-01 | Accepted ADR 0001 and current module rule prescribe layer folders; user wants operation folders. | Current policy remains factual; target is a user-confirmed change. A new ADR must explicitly supersede the folder decision while retaining responsibility separation. | resolved for planning |
| C-02 | Current route/service wording implies a service for every operation; user allows simple read shortcut. | Permit direct data reads only without authorization-sensitive policy or orchestration. Update both rule owners and prove the negative case. | resolved for planning |
| C-03 | Some `automated-blocking` labels imply checks that adapter dispatch does not implement. | Acceptance requires ID-specific checks or honest evidence mode and deliberate violation fixtures before any PASS claim. | resolved as required remediation |
| C-04 | Pasted `.spec.ts` example and `src/features` scope differ from current `.test.ts`/`src/modules` defaults. | `.test.ts` and `src/modules/` remain defaults; explicitly support adopted host alternatives without two implicit defaults. | resolved for planning |

## Scenario Challenge and Coverage

| Class | Scenario | Required outcome and recovery | Evidence | State |
| --- | --- | --- | --- | --- |
| Happy path | Create an entity with validation, policy, and two writes. | Operation-local files; one request schema; injected service; same transaction context; safe serialized response. | R-01 to R-03; G-BE-001/002 | covered |
| Happy path | List entities without policy/orchestration. | Controller parses bounded query, calls data, serializes public output; no pass-through service. | R-02; user D-03 | covered |
| Boundary | Read is tenant- or permission-sensitive. | Direct data shortcut disallowed; trusted service/policy boundary prevents cross-tenant exposure. | G-BE-001; user D-03 | covered |
| Boundary | Persistence gains an internal field or an operation shares mapping code. | Output whitelist excludes field; shared code moves to module root, no sideways operation import. | R-03; user feedback | covered |
| Failure | Invalid cursor/body or transaction fails after first write. | Structured error; no public stack/row leak; transaction rolls back and retryable effects follow contract. | R-03; G-BE-002 | covered |
| Abuse | Cross-module deep import or malformed file suffix. | Real architecture/name check fails, or named human evidence gates; no heuristic pass. | R-05/06; ADR 0029 | covered |
| Concurrency | Two operations share a transaction or a command is retried. | Atomic writes use same transaction context; external effects avoid duplicate execution. | G-BE-002; service rule | covered |
| Lifecycle | Rule shape changes while host uses `src/features/`/`.spec.ts`; binding is stale. | Explicit host override retained, tests discovered, binding/lock/receipts regenerated; changed source invalidates prior evidence. | R-04/05; ADR 0029 | covered |

## Risks, Unknowns, and Release Audit

- **Risk:** An operation-first tree can still violate SRP if code combines roles; rule and examples must enforce suffix responsibility and imports.
- **Risk:** Simple reads can conceal tenant policy; negative authorization scenario and review guidance must force a service when policy exists.
- **Risk:** Broad `alwaysApply` metadata and duplicated directives may increase input despite smaller files; acceptance compares scoped payload and behavior.
- **Non-material implementation details:** Exact new IDs, verifier mechanism, and optional generator are selected during planning/execution against the stated acceptance contract. No new library is presumed.
- **Material unknowns:** None. Source context is ready, its hash was verified on 2026-10-10, the user confirmed the shared understanding, and every applicable happy-path, boundary, failure, abuse, concurrency, and lifecycle challenge has an expected outcome.
- **Release decision:** One brief may be released for `plan`. No production rules, ADRs, or application code are changed by this discovery record.
