---
title: "Pragmatic Design Principles and Rule Alignment"
type: context
status: ready
created: "2026-10-10"
tags: [context, rules, knowledge, architecture, code-quality]
feature: "pragmatic-design-principles-and-rule-alignment"
---

# Pragmatic Design Principles and Rule Alignment Context Specification

## 1. Overview & Objective

- **Problem statement:** The factory has canonical SOLID knowledge and rules but no explicit YAGNI, KISS, composition over inheritance, or Law of Demeter / tell, don't ask entries for TypeScript work. Some existing mandatory SOLID wording can encourage premature interfaces, strategies, class hierarchies, or file splits when a simpler design would meet the current requirement.
- **User value:** Authors and reviewers can select a small, coherent design, justify an abstraction when it serves a current need, and check that the factory's own rules teach the same behavior.
- **Confirmed application policy:** These principles are defaults with justified exceptions. An exception must name the present requirement, existing contract, or boundary that warrants more structure; a hypothetical future variant is not sufficient on its own. Security, authorization, tenant, and data-integrity requirements remain in force.
- **Success criteria for the eventual change:**
  1. Canonical knowledge explains each named principle, its scope, counterexamples, and interaction with SOLID and existing architecture constraints. YAGNI and KISS remain distinguishable concepts even if one rule covers both.
  2. Applicable rules give explicit, noncontradictory guidance for avoiding speculative work, choosing simple code, composing behavior, and keeping object collaboration behind narrow public contracts.
  3. An inventory of existing directives that conflict with these principles is reviewed and each finding is resolved or recorded with a justified exception. At minimum review `rules/solid/open-closed.md`, `rules/solid/single-responsibility.md`, `rules/solid/dependency-inversion.md`, global quality and architecture rules, and applicable TypeScript backend/UI rules.
  4. Representative resolver/binding checks show the guidance reaches relevant TypeScript and TSX planning, implementation, refactoring, and review cases without selecting it for unrelated stacks or duplicating prompt text.
  5. Every blocking directive has an operational verifier or named human evidence. Missing, unsupported, or ineffective verifiers cannot be reported as a pass. Inventory, maps, lock, evaluations, and doctor agree after implementation.

## 2. Requirements & User Stories

### User stories and scenarios

- As a feature developer, I want the smallest complete implementation so that hypothetical variants do not add unused interfaces, services, layers, or configuration.
- As an architect, I want to compose existing behavior where appropriate so that reuse does not require a brittle inheritance tree.
- As a reviewer, I want callers to request an operation through a public contract instead of traversing another object's internals and making decisions from exposed state.
- As a rule maintainer, I want conflicts between new principles and existing prescriptive rules identified explicitly so an agent is not given incompatible instructions.

### Functional requirements for the eventual change

- [ ] Define YAGNI, KISS, composition over inheritance, and Law of Demeter / tell, don't ask in canonical knowledge scoped to TypeScript with valid schema metadata, provenance, examples, and links to related knowledge.
- [ ] Define scoped rule directives with stable IDs, modes, and verifiers. Keep conceptual explanation in knowledge and concise behavioral constraints in rules.
- [ ] State when a direct function, conditional, cohesive file, or simple controller-to-data read is acceptable; avoid forcing a pattern solely to satisfy an example.
- [ ] State when an interface, service, strategy, component composition seam, or inheritance relationship is justified by current variability, policy, substitution contract, or host convention.
- [ ] Reconcile any existing mandatory pattern directive with the confirmed default-and-exception policy, using concrete criteria instead of requiring abstraction for every case.
- [ ] Clarify that encapsulation and narrow public APIs apply across modules and objects without requiring every data shape to become a class or every call to be wrapped.
- [ ] Audit and reconcile existing absolute wording, especially OCP extension interfaces and polymorphism, SRP file separation, and DIP ports/adapters, while preserving trust boundaries, domain policy ownership, and public contract protections.
- [ ] Add selection and conformance examples that distinguish a genuine violation from a simple, valid TypeScript implementation. Cover `.ts` and `.tsx` where applicable and demonstrate exclusion of unrelated stacks. Test the behavior of any claimed automated verifier with a violating fixture.
- [ ] Synchronize the affected canonical sources, manifest, maps, lock, and relevant evaluations; run doctor and report what passes, fails, or is unavailable.

### Boundary, failure, and lifecycle scenarios

| Scenario | Expected behavior |
| --- | --- |
| One concrete use case has no known variants | A direct implementation is permitted; no speculative strategy interface or class hierarchy is required. |
| Two behaviors vary today behind a stable caller contract | Composition or a focused strategy may be selected with evidence of the real variation. |
| A caller reaches through several objects to read mutable state and decide another object's behavior | Keep the decision with the owner of that state and expose a cohesive operation, subject to serialization and data-transfer boundaries. |
| A small implementation crosses an authorization, transaction, or tenant boundary | Existing trust and policy rules still govern; simplicity cannot bypass the boundary. |
| A principle appears to conflict with an active directive | Identify both directive IDs, resolve the conflict in canonical text, and document the present requirement or boundary that justifies an exception; do not ask an agent to satisfy incompatible absolutes. |
| A proposed rule is called automated but its verifier cannot reject a violating case | Report the rule as advisory, evidence-blocking, or unsupported according to actual capability; never claim an automated pass. |

## 3. Technical & Architectural Context

- **Affected domain:** Context Factory knowledge, rules, selection/binding, evaluations, and documentation for TypeScript hosts. No host application code, database schema, UI, or network API change is inherent to this request.
- **Stack and rule scope:** Factory scripts are JavaScript; the requested guidance applies to TypeScript and TSX source only. Examples and selection should follow the affected package's actual framework. Candidate existing directives include `cf.quality.minimal-complete-change` (evidence-blocking), `cf.quality.no-any-or-swallowed-errors` (automated-blocking, but bundles speculative abstractions), `cf.arch.patterns` (advisory), `cf.arch.solid` (claimed automated-blocking), `cf.solid.ocp-stable-extension-interfaces` (evidence-blocking), and `ts.service.create-for-coordination` (advisory). Candidate new IDs are provisional: `ts.quality.yagni-kiss`, `ts.arch.prefer-composition`, and `ts.arch.tell-dont-ask`. Do not set a blocking mode without a real verifier or human-evidence route. Existing global/SOLID wording may need scoped clarification so a TypeScript-only principle does not silently alter JavaScript or other stacks.
- **Potential source files:** `knowledge/principles/`, `rules/global/code-quality.md`, `rules/global/architecture-conformance.md`, `rules/solid/`, selected `rules/typescript/` files, `orchestrator/SHARED.md`, `scripts/context-core.mjs`, `context-manifest.json`, `context-lock.json`, `docs/Rules.md`, `docs/Wiki.md`, `knowledge/README.md`, and relevant evaluations. Exact implementation file list belongs to a later reviewed brief and plan.
- **Existing contracts:** `schemas/knowledge.schema.json` requires stable dotted IDs, source metadata, scope, authority, and lifecycle status. Rule descriptors require a stable directive ID, mode, statement, content hash, and supported verifier. `workflows/context-maintenance.md` requires synchronization and evidence for new selection or completion behavior.
- **Security and authorization:** No new user-facing permission boundary. New simplicity guidance must preserve existing authorization, tenant, data-isolation, and trust-gate rules. Human waivers and evidence follow the shared contract.
- **Data model:** No schema or migration expected.

## 4. UI/UX & Interaction Guidelines

No product UI change. Rule and knowledge pages should be short, searchable, and use one clear example of each principle with counterexamples that show where the principle does not apply.

## 5. Scope & Boundaries

- **In scope for discovery:** Define the principle set, TypeScript applicability, conflict cases, expected rule audit, and measurable verification. Preserve the distinction between knowledge that explains and rules that direct behavior.
- **In scope for eventual implementation, subject to discovery release:** Add canonical entries and rules; reconcile conflicting directives; update selection, maps, manifest, lock, and focused evaluations as required by changed behavior.
- **Out of scope:** Guidance for non-TypeScript stacks, including plain JavaScript; rewriting host application code; adding speculative architectural frameworks; weakening authorization or other safety boundaries; declaring a verifier operational from rule text alone.
- **Current skill boundary:** This `/context` invocation writes only this specification. It does not create a task branch, implementation plan, rule, knowledge note, or production change.

## 6. References & External Context

- `orchestrator/SHARED.md` — working contract, conflict order, conformance receipts, and context maintenance.
- `workflows/context-maintenance.md` — required synchronization and quality gates.
- `docs/context/rules/solid-principles-and-architecture.md` — prior SOLID context and integration pattern; current files take precedence where that historical context differs.
- `docs/context/rules/typescript-backend-rule-expansion.md` — recent minimal-input backend rule decisions.
- `docs/Rules.md`, `docs/Wiki.md`, `knowledge/README.md` — existing maps and authority model.

## 7. Discovery Evidence & Handoff

### Evidence inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | User request, 2026-10-10 | verified user intent | Names YAGNI/KISS, composition over inheritance, and Law of Demeter / tell, don't ask; asks for knowledge, rules, and alignment. | Cover both conceptual knowledge and prescriptive rules; audit existing rules. |
| E-02 | `knowledge/README.md`; `knowledge/principles/` | verified in checkout | Canonical principle notes currently cover SOLID. | New concepts need canonical entries and index links. |
| E-03 | `rules/global/code-quality.md`; `rules/global/architecture-conformance.md` | verified in checkout | Minimal change and anti-speculation exist in fragments; SOLID is explicitly required. | Add explicit guidance and reconcile overlap rather than duplicate it. |
| E-04 | `rules/solid/open-closed.md`, `rules/solid/single-responsibility.md`, `rules/solid/dependency-inversion.md` | verified in checkout | Several unconditional MUST directives prescribe extension interfaces, layer files, or ports. | Audit against YAGNI/KISS and composition before finalizing wording. |
| E-05 | `rules/typescript/backend/service-layer.md`; `rules/typescript/ui/code-organization.md` | verified in checkout | These already permit simple reads and delay promotion to shared modules until reuse. | Preserve those practical exceptions and remove contradictory advice elsewhere. |
| E-06 | `schemas/knowledge.schema.json`; `schemas/rule-descriptor.schema.json`; `workflows/context-maintenance.md` | verified in checkout | Knowledge and rule metadata, verifiers, and synchronization gates are specified. | Use supported enforcement modes and validate changed inventory/selection. |
| E-07 | `node scripts/context.mjs resolve "Add YAGNI and KISS, composition over inheritance, and Law of Demeter / tell don't ask to canonical knowledge and rules, and ensure rules explicitly follow these principles"` | verified command result, 2026-10-10 | Selected `workflows/context-maintenance.md` and 17 informational rules; no binding compiled. | Resolution identifies candidate scope but does not prove enforcement. |
| E-08 | User reply, 2026-10-10 | verified user decision | Selected TypeScript only rather than factory-wide application. | Scope notes and binding checks to `.ts` and `.tsx`; exclude other stacks. |
| E-09 | User reply, 2026-10-10 | verified user confirmation | Confirmed distinct YAGNI and KISS knowledge, concise TypeScript rules for the four concepts, and an audit of conflicting rules with justified exceptions. | Discovery scope and structure are confirmed. |

### Decisions, assumptions, and unknowns

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| D-01 | Apply the new principles when they conflict with an existing mandatory abstraction or file split. | decision | User | no | Defaults with justified exceptions, confirmed in user reply on 2026-10-10. Document the present requirement or boundary for each exception. |
| D-02 | Limit new guidance to TypeScript and TSX rather than every supported stack. | decision | User | no | Confirmed in user reply on 2026-10-10. |
| D-03 | Treat YAGNI and KISS as distinct knowledge concepts while allowing one compact combined rule if it avoids duplicate directives; audit conflicting existing rules. | decision | User | no | Confirmed in user reply on 2026-10-10. |

### Discovery handoff

- **Allowed recipients:** `grounding`, `grill`.
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`.
- **Ready for grill:** yes; decisions, scope, exceptions, and verification outcomes are explicit and confirmed by the user.
- **Context content hash:** `sha256:0388e05890bd5e60dff576646ecfb7152b03d8e2665de5bfab4a72dc8ad6e446` (SHA-256 of this file excluding this hash line).
