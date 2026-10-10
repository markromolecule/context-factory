---
title: "TypeScript Pragmatic Design Principles Discovery Record"
type: discovery-record
status: ready
created: "2026-10-10"
sourceContext: docs/context/rules/pragmatic-design-principles-and-rule-alignment.md
sourceContextHash: sha256:0388e05890bd5e60dff576646ecfb7152b03d8e2665de5bfab4a72dc8ad6e446
---

# TypeScript Pragmatic Design Principles Discovery Record

## Idea and release condition

Add canonical TypeScript knowledge for YAGNI, KISS, composition over inheritance, and Law of Demeter / tell, don't ask. Add concise rules that agents actually receive for affected TypeScript files. Treat Law of Demeter and tell, don't ask as one combined check: callers request behavior from the owner instead of traversing collaborator internals to inspect state and decide. Reconcile existing prescriptions for SOLID abstractions and file splits with the user-confirmed default of the smallest design that meets a present need, documenting exceptions. Release one plan-facing brief when conflicts and scenario challenges are resolved and the user-confirmed understanding is recorded.

**Actors and authority:** The user owns principle scope and acceptable exceptions. Factory maintainers own knowledge, rule text, metadata, selectors, maps, and evaluations. Host TypeScript developers and reviewers apply the selected rules. Human maintainers alone provide required human evidence or governed waivers. No host application RBAC model is introduced.

## Grounding claim packet: TypeScript design principles

Selection: `docs/Wiki.md` and `knowledge/README.md` identify five active canonical SOLID notes. Their `lastVerified` date is 2026-08-23, `reviewAfter` is 2027-02-23, and directly linked rules were checked in this checkout on 2026-10-10. Their broad `software-architecture` scope is relevant to TypeScript architecture, but the requested new principle definitions are absent from the Wiki. Existing note metadata points some `appliesTo` entries at old `skills/plan/**` and `skills/refactor/**` paths; those links should be corrected during implementation rather than assumed to select the current grouped skill paths. No source claim is promoted into an implementation decision solely because it is canonical.

| ID | Source and heading | Authority, lifecycle, last verified, content hash | Selection reason | Status and bounded claim |
| --- | --- | --- | --- | --- |
| G-00 | `knowledge/README.md` / Canonical Knowledge Items | canonical index, active, 2026-07-25, `sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac` | Check whether the new principles already have a canonical owner. | **unknown:** no Wiki entry currently grounds YAGNI, KISS, composition over inheritance, Law of Demeter, or tell, don't ask. The user request defines the target scope; later knowledge authoring supplies definitions and provenance. |
| G-01 | `knowledge/principles/solid-ocp.md` / Modern Extension Mechanisms in TypeScript & React | canonical, active, 2026-08-23, `sha256:84e740e2edf570f6230017ef82229a97577c7ce643918ba48b89b08d0cd441ea` | Extension-point guidance is the main YAGNI/composition tension. | **verified:** the note prefers polymorphic composition and strategy registries for extension; the linked `rules/solid/open-closed.md` contains unconditional MUST language for stable extension interfaces. |
| G-02 | `knowledge/principles/solid-srp.md` / Invariants & Rules | canonical, active, 2026-08-23, `sha256:24df5b9e6f3d9f41c493482ea03bbbeeecd46a194b616eea4345dad1849c7461` | Distinguish cohesion from mandatory file count. | **verified:** the note says cohesion is not line count; the linked `rules/solid/single-responsibility.md` separately mandates files for every layer. |
| G-03 | `knowledge/principles/solid-dip.md` / Core Mental Model & Terminology | canonical, active, 2026-08-23, `sha256:bee94e6fad38ddaa42c18b947d09b64cfda07382c4b43dfc65b6a5a68f13121d` | Preserve dependency direction while avoiding premature ports. | **verified:** high-level policy depends on contracts rather than infrastructure; the linked rule prescribes domain interfaces and infrastructure adapters. |
| G-04 | `knowledge/principles/solid-isp.md` / Segregation in TypeScript & Modern Web Systems | canonical, active, 2026-08-23, `sha256:a98d552187337a3201d5fea71eff7709486bd2e8c0f434ed24a037c0155e949c` | Narrow contracts and ownership matter to tell, don't ask. | **verified:** callers should depend on only the data and methods they use; this does not itself require a class or new interface for each operation. |
| G-05 | `knowledge/principles/solid-lsp.md` / Behavioral Subtyping Contract Rules | canonical, active, 2026-08-23, `sha256:093586a96f40d85d94c67f158296c5840bb8b4ba75079ecc31df7fa7d6dc84ca` | Constrain inheritance when it genuinely exists. | **verified:** subclasses or implementations must preserve substitutability; this is a condition on inheritance, not a mandate to create it. |

## Repository observations and conflict ledger

| ID | State | Evidence | Resolution for the target change |
| --- | --- | --- | --- |
| R-01 | verified current state | `context-manifest.json` knowledge/rules inventory; `docs/Rules.md`; `docs/Wiki.md` | The inventory contains SOLID but none of the requested principles. New entries and links need synchronization. |
| R-02 | conflict with confirmed target | `rules/solid/open-closed.md` / Mandatory Directives; G-01 | Current MUST wording can force stable interfaces/strategies before actual variation exists. User decision D-01 makes simplicity the default. Preserve OCP for real extension pressure and make the trigger explicit; the current rule remains authoritative until edited. |
| R-03 | conflict with confirmed target | `rules/solid/single-responsibility.md` / Mandatory Directives; G-02; ADR 0037 | Current “distinct files” wording can impose empty or pass-through layers. ADR 0037 says add only files with a role. Reconcile to cohesive responsibilities and real boundaries, preserving transport/policy/persistence separation when those responsibilities exist. |
| R-04 | conflict with confirmed target | `rules/solid/dependency-inversion.md` / Mandatory Directives; G-03 | Current port/adapter wording can require an interface for a single straightforward dependency. Preserve inward dependency direction and explicit seams at real external/policy boundaries; define when a type contract or function argument suffices. |
| R-05 | verified current state | `rules/global/code-quality.md`; `rules/global/architecture-conformance.md` | Global rules already mention minimal complete change and speculative abstractions, but apply to both TypeScript and JavaScript. New guidance and any reconciled directive must select only `.ts`/`.tsx` or otherwise avoid changing JavaScript semantics. |
| R-06 | verified current state | `rules/typescript/backend/service-layer.md`; `rules/typescript/ui/code-organization.md`; ADR 0037 | A policy-free simple read needs no pass-through service; UI code becomes shared on actual reuse and may stay cohesive. Keep these compatible exceptions. |
| R-07 | verified current state | ADR 0034; `scripts/context-core.mjs`; `orchestrator/rules/binding-compiler.mjs` | Rule selection must follow affected file and package metadata, not prompt words. Shared TypeScript guidance should not duplicate framework rules or leak into unrelated stacks. |
| R-08 | verified current state | `orchestrator/conformance/adapters/typescript.mjs`; `orchestrator/conformance/evidence-gate.mjs`; `evals/tests/conformance/typescript-adapter.test.mjs`; ADR 0029 | Unhandled automated directives return `NOT_AUTOMATABLE`; missing named human compensation blocks completion. New subjective principles need honest advisory or human-evidence modes until an ID-specific verifier rejects a violation. |
| R-09 | verified current state | `workflows/context-maintenance.md`; `orchestrator/SHARED.md` | Implementation must synchronize source, manifest, maps, lock, evaluations, and doctor. Discovery does not create a task branch or change production rules. |

The apparent conflicts R-02 to R-04 are resolved **for planning** by the user-confirmed default-and-exception policy, not by claiming the current files already agree. The future change must revise the conflicting directive text and examples together. No active canonical note supersedes another; the target decision proposes a governed revision, with history retained.

## Decision tree and answers

| Branch | Answer or issue | State |
| --- | --- | --- |
| Outcome | Explicit TypeScript principles that produce smaller complete designs and a rule catalog without contradictory prescriptions. | settled by context |
| Actors and authority | User sets scope; factory maintainers author rules; host developers/reviewers consume them; human maintainer supplies required evidence/waiver. | settled |
| Domain concepts | YAGNI avoids speculative capability; KISS prefers the simplest clear solution; composition assembles behavior from existing parts; Law of Demeter / tell, don't ask is one combined check against reaching through collaborators to decide from exposed state. | settled by user Q-01 |
| Applicability | `.ts` and `.tsx` only, including framework code only when package/path selection applies; no new plain-JavaScript guidance. | settled by user D-02 and ADR 0034 |
| Exceptions | A current requirement, accepted contract, or real boundary can justify more structure; hypothetical future use alone cannot. Trust, authorization, tenant, and data integrity remain binding. | settled by user D-01 |
| Rule ownership | Distinct YAGNI and KISS knowledge concepts; compact TypeScript rule ownership may combine overlapping directives; existing rules require targeted reconciliation. | settled by user D-03 |
| Workflow and states | Discovery record becomes ready and one brief is released; implementation later changes draft knowledge/rules to active only with synchronized inventory, maps, lock, and checks. Stale source or binding requires reissue. | settled by skill and workflow |
| Data and integrations | No application schema, network API, credential, or external integration change. Knowledge frontmatter and rule descriptors are the affected contracts. | settled by source |
| Security and privacy | Existing trust, authorization, tenant, and data-isolation directives remain binding. No new personal data is collected or exposed by the principle catalog. | settled by context and shared contract |
| Observability | No application telemetry is introduced. Selection results, conformance statuses, evaluation output, and doctor results provide implementation evidence. | settled by workflow |
| Failure and recovery | Ambiguous or conflicting directives must be repaired before claiming aligned output. Unsupported blocking verifier gives `NOT_AUTOMATABLE`/`BLOCKED`, never a success claim. | settled by shared contract and R-08 |
| Rollout and lifecycle | Update knowledge, affected rules, selection/tests, maps, manifest, lock, and context version together; run doctor and relevant behavior checks; recompile stale bindings/receipts. | settled by workflow |
| Non-goals | No host application refactor, framework/library mandate, blanket removal of SOLID, or weaker trust boundaries. | settled by context |

## Question log and unknowns

| ID | Question | Why it matters | Recommendation and trade-off | Owner / state |
| --- | --- | --- | --- | --- |
| Q-01 | Are Law of Demeter and tell, don't ask distinct but related TypeScript checks, or one combined check? | They constrain reach-through coupling and decisions made from exposed state; rule shape must reflect the user's intended relationship. | **Selected by user, 2026-10-10:** one combined check. Cover both reach-through and misplaced decisions in one directive/example set; retain explicit DTO/serialization exceptions. This is more compact but needs one negative case for each failure mode. | user / resolved |

## Scenario challenge and coverage

| Class | Concrete TypeScript scenario | Expected outcome and recovery | Basis | State |
| --- | --- | --- | --- | --- |
| Happy path | A use case has one implementation and no present variant. | A direct function or cohesive module is valid; no speculative strategy, class base, service, or interface. | User D-01; R-02 to R-04 | covered |
| Happy path | Two current behaviors share a caller contract. | Compose the variants or a focused strategy when it reduces duplication and keeps substitution behavior sound. | G-01; G-05; user D-01 | covered |
| Boundary | A small read appears to need no service but crosses tenant policy. | Use the trusted policy boundary; simplicity does not bypass authorization. | ADR 0037; shared contract | covered |
| Boundary | A caller accesses `order.customer.account.status` to choose an order action. | The combined check directs the caller to request behavior at the proper owner; an explicit boundary DTO remains valid when transfer of data is the contract. | User Q-01; G-04 | covered |
| Failure | New rule wording conflicts with a mandatory SOLID directive. | Record both IDs, revise the authoritative directive and examples, or document a current justified exception before claiming alignment. | R-02 to R-04 | covered |
| Abuse | A generator hides domain decisions behind a DTO traversal or labels an unimplemented subjective check automated. | Review both parts of the combined check with negative fixtures or named human evidence; no automatic PASS from the label alone. | R-08; user Q-01 | covered |
| Concurrency | Two callers use one mutable owner and act on a stale snapshot. | Keep the invariant at the owner/policy boundary; specify atomicity where required rather than trusting caller-side decisions. | User Q-01; existing policy/transaction rules | covered |
| Lifecycle | A newly added TypeScript rule changes while a host uses a stale binding. | Rebind affected files and regenerate conformance evidence; inventory/map/lock/doctor stay synchronized. | R-07 to R-09 | covered |

## Risks and release audit

- **Risk:** Broad global edits could alter JavaScript policy despite the TypeScript-only decision. Use path-scoped directives or narrowly worded reconciliation and test non-TypeScript exclusion.
- **Risk:** OCP and DIP examples make every interface seem mandatory. Include a one-implementation good case and a justified multi-variant case.
- **Risk:** The combined check could be misread as banning legitimate DTO reads, serialization, validation, or pure data transformations. State those exceptions explicitly in the rule and examples.
- **Risk:** Knowledge note `appliesTo` skill globs point to older paths. Check current routing and update metadata if needed in implementation.
- **Non-material implementation choices:** Exact new directive IDs, grouping into rule files, and whether an ID-specific verifier is feasible are selected during planning against the acceptance contract. Do not claim an automated mode without proof.
- **Material unknowns:** None. The user confirmed TypeScript-only scope, distinct YAGNI/KISS knowledge, default-and-exception application, the rule audit, and one combined Law of Demeter / tell, don't ask check on 2026-10-10. The source context is ready and its hash was verified; all applicable scenario classes now have expected outcomes.
- **ADR decision:** No ADR is created by discovery. Existing ADR 0034 governs framework selection and ADR 0037 governs operation-first backend boundaries; a later plan should propose an ADR only if implementation changes an accepted architecture boundary rather than clarifying rule text.
- **Release decision:** Release one `brief.md` for `plan`. No production rule, knowledge note, or ADR is changed by this discovery record.
