---
title: "New Project Progressive Contract-Driven Workflow"
type: task
status: completed
created: "2026-08-20"
tags: [task, workflow, contract-driven, backend-first, progressive-delivery, loop-engineering]
---

# New Project Progressive Contract-Driven Workflow

## Outcome

Established and operationalized the **New Project Progressive Contract-Driven & Loop-Engineered Workflow** across the Context Factory and project repositories. This workflow guarantees that every new project or major domain feature adheres to:
1. Pre-planning discovery and interrogation via `grill-with-docs` before `implementation-plan`.
2. Progressive vertical-slice delivery (one module at a time, strictly avoiding the "one-tap" big-bang fallacy).
3. Robust backend-first architecture (`routes → controllers → services → data` + Zod DTOs).
4. Dual-loop engineering model:
   - **Inner Loop:** Automated TDD & self-correction cycle across 4 test layers (`data`, `service`, `controller`, `routes`) + `tsc`.
   - **Outer Loop:** Progressive module promotion and multi-module regression check.
5. Interactive Scalar contract documentation and live client validation via typed `useQuery`/`useMutation` hooks before UI drafting.

---

## Pre-planning record

### Actors and goals

- **Lead Architect / Engineer:** Wants a deterministic, loop-engineered engineering discipline that eliminates drifted types, missing tests, and premature UI fabrication.
- **AI Agent / Assistant:** Requires closed-loop feedback signals, explicit phase gates, and clear stopping conditions to deliver vertical backend modules autonomously and reliably.
- **Frontend Engineer / Consumer:** Needs reliable, live-documented API endpoints (Scalar) and typed hooks with tested cache invalidation before building UI components.

### Domain language

- **Inner Feedback Loop:** Automated test-driven self-correction cycle executing 4-layer tests and typecheck upon every code change until green.
- **Outer Progression Loop:** Macro lifecycle engine advancing from Module $N$ to Module $N+1$ only after Definition of Done and regression suites pass.
- **Progressive Vertical Slice:** Delivering an isolated, complete slice of functionality from database schema to client hook for a single domain module (e.g. Auth) before proceeding to the next.
- **Anti-One-Tap Model:** The explicit rejection of single-prompt monolithic code generation where entire multi-module applications are scaffolded in an unverified state.
- **4-Layer Backend Testing:** Dedicated test suites for Data access (`*.data.test.ts`), Services (`*.service.test.ts`), Controllers (`*.controller.test.ts`), and Route integration (`*.routes.test.ts`).
- **Client Hook Validation:** Lightweight React query/mutation smoke testing against live/mock endpoints to prove contract integrity before complex UI layout construction.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Engineer starts a greenfield project | Raw feature brief or prompt provided | Agent triggers `grill-with-docs`, interrogating 1 question at a time; stops before planning | If agent starts coding prematurely, gate blocks execution until discovery is audited | Completed |
| SC-02 | Engineer requests an implementation plan | Discovery record and schema locked | Agent triggers `implementation-plan`, creating phased module breakdown in vertical order | If module dependencies are cyclic, plan reorders them in strict dependency order | Completed |
| SC-03 | Agent executes Inner Loop for Module N | Plan approved for Module N | Agent builds vertical layers and loops through 4-layer tests + `tsc` until green | If test fails, loop ingests diagnostics and self-corrects surgically | Completed |
| SC-04 | Agent validates client-backend contract | Module N backend tests passing | Scalar docs generated; typed `useQuery` / `useMutation` hook created and tested end-to-end | If client hook encounters type mismatch or unhandled error status, fix contract first | Completed |
| SC-05 | Outer Loop advances to Module N+1 | Module N DoD satisfied | Full regression test runs on Modules 1..N; Outer loop advances to Module N+1 | If regression occurs, block promotion and fix breaking change | Completed |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | How should new projects resolve ambiguity before planning? | Mandate `grill-with-docs` as Phase 0/1 gate before `implementation-plan` | Prevents hallucinated requirements and ungrounded assumptions | Freeform planning without discovery | `skills/grill-with-docs/SKILL.md` |
| DEC-02 | How should multi-module projects be scaffolded? | Progressive module-by-module delivery (one complete vertical slice at a time) | Eliminates "one-tap" big-bang failures and cascading unverified errors | Monolithic multi-module scaffolding | `docs/context/new-project-workflow/index.md` |
| DEC-03 | How should test execution and bug correction be structured? | Dual-loop engineering (Inner TDD self-correction loop + Outer regression promotion loop) | Guarantees automated self-healing during development and zero regressions across modules | Linear fire-and-forget coding without automated feedback loops | `docs/decisions/0011-progressive-contract-driven-loop-engineering.md` |
| DEC-04 | What test granularity is required per backend module? | Dedicated test files for all 4 layers (`data`, `service`, `controller`, `routes`) | Ensures zero hidden regression and high diagnostic precision | Single shallow route test or zero unit tests | `rules/backend/module-architecture.md` |
| DEC-05 | How should frontend integration be proven before full UI build? | Lightweight `useQuery`/`useMutation` hooks smoke testing | Confirms runtime transport, caching, error states, and type safety with minimal UI overhead | Jumping directly to complex UI screen layout | `rules/hooks/mutation-hooks.md` |

### Unknowns and blockers

- *None. Requirements, workflow structure, and loop-engineering mechanisms are fully grounded.*

---

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | SC-01 / DEC-01 | `docs/context/new-project-workflow/index.md` specifies `grill-with-docs` pre-planning discovery contract | Update Phase 0 & 1 with 1-question-at-a-time discovery contract | File inspection & link check | Completed |
| AC-02 | SC-02 / DEC-02 | Progressive module-by-module execution is documented with anti-one-tap guidelines | Add mental model, Mermaid flow, and progressive delivery loop | Document validation | Completed |
| AC-03 | SC-03 / DEC-03 | Inner and Outer loop-engineering mechanics are formalized across task phases | Formalize automated TDD self-correction and outer regression loops in phase breakdowns | Phase file inspection & ADR 0011 | Completed |
| AC-04 | SC-04 / DEC-04 | 4-layer backend testing is mandated with explicit test file naming and scope | Document `*.data.test.ts`, `*.service.test.ts`, `*.controller.test.ts`, `*.routes.test.ts` | Verification against rules | Completed |
| AC-05 | SC-05 / DEC-05 | Contract documentation and client hook validation phase is established | Document Scalar live docs + `useQuery`/`useMutation` smoke testing | Workflow review | Completed |
| AC-06 | System Health | Context lock and doctor evaluations pass with zero errors | Run `context.mjs lock` and `doctor` | `node scripts/context.mjs doctor` | Completed |

---

## Scope

- Documentation and workflow specification in `docs/context/new-project-workflow/index.md`.
- Dual-loop engineering architecture (Inner TDD self-healing loop + Outer module progression loop).
- Architecture Decision Record `docs/decisions/0011-progressive-contract-driven-loop-engineering.md`.
- Phased task execution plans under `docs/tasks/2026/08/2026-08-20/0004-task-new-project-progressive-contract-driven-workflow/`.
- Context factory lock synchronization and health diagnostics.

---

## Non-goals

- Modifying existing application runtime code outside the context factory specification.
- Replacing existing unit test runner harnesses.

---

## Constraints and decisions

- Must conform to Context Factory 3.5.0 schema and validation rules.
- Must preserve Markdown formatting, clickable file links, and Mermaid visual diagrams.
- Must ensure all 12/12 evaluations pass via `node scripts/context.mjs doctor`.

---

## Phases

- [x] `phase-01-discovery-and-scenarios.md` — Phase 1: Discovery, Scenarios, and Boundary Analysis
- [x] `phase-02-architecture-and-contracts.md` — Phase 2: Architecture, Contracts, and Data Modeling
- [x] `phase-03-implementation-and-tests.md` — Phase 3: Incremental Implementation, 4-Layer Testing, and Inner Loop Engineering
- [x] `phase-04-verification-and-release.md` — Phase 4: Scalar Docs, Client Hooks, Outer Progression Loop, and Release Gate

---

## Verification

- `node scripts/context.mjs doctor` -> Pass (12/12 evaluations).
- `node scripts/context.mjs lock --check` -> Pass (digest current).
- `node scripts/context.mjs resolve "new project workflow"` -> Pass.
- `node scripts/harness-cli.mjs task:list` -> Verified Task 0004 indexed as completed.

---

## Deviations

*None.*

---

## Result

*Completed and fully verified. Workflow and architecture decision records published.*
