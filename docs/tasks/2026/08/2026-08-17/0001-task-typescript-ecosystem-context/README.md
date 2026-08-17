---
title: TypeScript Ecosystem Rules and Skills Integration
type: task
status: completed
created: 2026-08-17
tags: [task, typescript, rules, skills, context]
---

# TypeScript Ecosystem Rules and Skills Integration

## Outcome

Establish dedicated TypeScript ecosystem rules and specialized skills in Context Factory to enforce strict type safety, runtime boundary schema validation, disciplined error handling, non-floating async control, and compiler diagnostics across fullstack TypeScript codebases.

## Pre-planning record

### Actors and goals

- TypeScript Engineer: write strictly typed code, derive types from runtime schemas, and avoid runtime unhandled promise or type assertion errors.
- Agent / Orchestrator: deterministically route TypeScript compiler errors, schema modeling requests, and type safety constraints to canonical context.
- Reviewer: audit PRs against strict type standards and boundary validation requirements.

### Domain language

- **Branded / Nominal types:** primitive types intersected with a unique symbol tag to prevent accidental identifier confusion.
- **Runtime validation boundary:** untrusted I/O boundaries where external payloads are parsed with schemas (Zod, Valibot, ArkType) before reaching business logic.
- **Discriminated union:** object types sharing a common literal tag property allowing exhaustive type narrowing.
- **Verbatim module syntax:** TypeScript compiler mode where type-only imports are strictly distinguished and erased at compile time.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S1 | Agent encounters TS compiler error or circular type recursion | `tsc` emits error codes | Selects `typescript-diagnostics` skill and analyzes root cause without `any` escapes | Fix circular references or inference limits | covered |
| S2 | Agent defines request/response contracts for API | Endpoint requires validation | Selects `zod-schema-modeling` skill and `runtime-validation` rule | Derive DTO types using `z.infer` | covered |
| S3 | Agent writes asynchronous operations | Functions return promises | Adheres to `async-discipline` rule; bans floating promises and propagates `AbortSignal` | Catch unhandled promises | covered |
| S4 | Agent handles expected domain errors | Service function fails validation | Adheres to `error-handling` rule; uses Result types instead of untyped exceptions | Map errors safely | covered |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D1 | Should TypeScript rules live under global, frontend, or a dedicated category? | Dedicated `rules/typescript/` | TypeScript applies equally to backend, frontend, scripts, and libraries | Fragment across frontend/backend, monolithic mega-rule | ADR / Context Factory |
| D2 | Which runtime schema library to highlight in skill? | Zod as primary with generalized boundary patterns | Widespread standard in React/Next/Node ecosystems | Joi, manual runtime checks | Skill |

### Unknowns and blockers

None.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC1 | S1–S4, D1 | 5 TypeScript rules created with complete constraints and clean frontmatter | `rules/typescript/*.md` | Validation and inspection | complete |
| AC2 | S1–S2, D2 | 2 TypeScript skills created with agent YAML interfaces | `skills/typescript-diagnostics/`, `skills/zod-schema-modeling/` | Validation and inspection | complete |
| AC3 | D1, D2 | Inventory, orchestrators, documentation maps, and context lock agree | Manifest, maps, and orchestrator updates | `node scripts/context.mjs doctor` | complete |

## Scope

- 5 TypeScript rules in `rules/typescript/`
- 2 TypeScript skills in `skills/`
- Orchestrator updates, manifest inventory, and documentation maps in `docs/`
- Validation and context hash locking

## Non-goals

- Enforcing a specific framework (Next.js, Remix, Hono) inside pure TypeScript rules.
- Replacing ESLint or TypeScript compiler itself.

## Constraints and decisions

- Maintain model-neutral shared contracts in `orchestrator/SHARED.md`.
- Ensure all skills adhere to frontmatter requirements (only `name` and `description`).

## Phases

- [x] `phase-01-rules.md` — Phase 1: Define TypeScript rules
- [x] `phase-02-skills.md` — Phase 2: Define TypeScript skills and agent interfaces
- [x] `phase-03-orchestration-and-manifest.md` — Phase 3: Update manifest, orchestrators, and doc maps
- [x] `phase-04-verification-and-lock.md` — Phase 4: Run lock and complete health doctor

## Verification

- `node scripts/context.mjs lint` — validates manifest inventory, frontmatters, and Obsidian wiki links.
- `node scripts/context.mjs lock` — updates `context-lock.json` with fresh sha256 digests.
- `node scripts/context.mjs doctor` — full suite validation and behavioral evaluations (passed).

## Deviations

Cleaned up legacy frontmatter fields (`scope:`, `alwaysApply:`) in existing skills (`knowledge-grounding`, `repository-discovery`, `verification-review`) to adhere to Context Factory skill schema invariants.

## Result

Implemented in Context Factory 3.3.0. 5 rules, 2 skills, 2 agent resources added and synchronized with all orchestrators and maps. Final lock verified via `node scripts/context.mjs doctor`.
