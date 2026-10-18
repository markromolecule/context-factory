---
title: "Rebuild Orchestrator Engine"
type: task
status: draft
plan_contract_version: 3
plan_id: "PLN-0012"
created: "2026-10-18"
tags: [task, refactor, orchestrator, runner, validator, rules]
target_branch: "master"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
---

# Rebuild Orchestrator Engine

## Outcome

Streamline, clean, and rebuild the Context Factory orchestration engine (`orchestrator/validator.mjs`, `orchestrator/rules/`, and `orchestrator/runner.mjs`) to eliminate technical debt, enhance modularity, and improve maintainability while strictly preserving existing public contracts, lifecycle hooks, and CLI integrations (`context-cli`, `scripts/context.mjs resolve`, `scripts/session-core.mjs`, and evaluation suites).

## Pre-planning record

### Actors and goals

- **Core Factory Maintainers:** Want a modern, cleanly structured, zero-dependency engine for schema validation, rule binding compilation, and model dispatch with low cognitive overhead and robust error boundaries.
- **AI Agents & CLI Consumers:** Expect deterministic context resolution, preflight rule bindings, session state validation, and provider execution to continue working without breaking changes.
- **Evaluation Framework:** Requires reliable golden dataset evaluations and deterministic mock execution without regressions.

### Domain language

Link the canonical glossary in [`docs/Wiki.md`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/Wiki.md) and [`orchestrator/SHARED.md`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/SHARED.md).
Key terms:
- **Rule Descriptor:** Parsed representation of a Markdown rule file containing frontmatter metadata and inline directive markers.
- **Rule Binding:** Deterministic association between affected files, tech stack, and applicable rule directives, authenticated via SHA-256 hash (`bindingHash`).
- **Prompt Compilation:** Rendering compiled rule directives and system instructions into prompt payloads with verified directive integrity.
- **Lifecycle Hooks:** 3-stage extension points (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`).
- **Schema Invariant:** Contract verification using Draft-07 JSON Schema subsets without external dependencies.

### Language stack and applicable rules

- **Declared Stack:** `javascript` / `typescript` (pure Node.js ESM)
- **Rule Binding ID & Hash:** `binding-PLN-0012` compiled via `context-cli preflight`
- **Active Directives:**

| Directive ID | Mode | Rule Path | Verifier |
|---|---|---|---|
| `cf.arch.solid` | automated-blocking | `rules/global/architecture-conformance.md` | `linter` |
| `cf.arch.direction` | automated-blocking | `rules/global/architecture-conformance.md` | `linter` |
| `cf.evidence.verification` | automated-blocking | `rules/global/evidence-and-claims.md` | `test` |
| `ts.type-safety.ban-any` | automated-blocking | `rules/typescript/common/type-safety.md` | `ts-type-checker` |
| `ts.runtime-validation.zero-trust-boundaries` | automated-blocking | `rules/typescript/common/runtime-validation.md` | `test` |

- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Context Resolver (`scripts/context-core.mjs`) calls `compileRuleBinding` and `parseRuleCatalog` | Rule catalog exists on disk under `rules/` | Returns accurate descriptors, matching bindings, and valid `bindingHash` | Descriptive error identifying malformed rule file | Planned |
| SC-02 | Session Engine (`scripts/session-core.mjs`) saves state | Valid session payload passed to `validateSchema` | Validation passes; invalid payloads throw `ValidationError` with path details | Report precise error path | Planned |
| SC-03 | CLI Run (`context-cli run` or `evals/run-evals.mjs`) executes run | `executeRun` called with `mock` or live provider | 3-stage hooks execute, prompt integrity verified, output validated against schema | Rejection on schema failure; error object returned | Planned |
| SC-04 | Preflight & CLI Doctor run | Workspace clean; manifest synchronized | `npm test` and `node scripts/context.mjs doctor` succeed with 100% PASS | Doctor surfaces pinpointed remediation | Planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | Should public API signatures be modified during rebuild? | No. Preserve exact function signatures and exported names. | Consumers in `scripts/context-core.mjs`, `scripts/session-core.mjs`, `app/cli/commands/`, and `evals/` must not break. | Redesigning public APIs, which would require cascading updates across dozens of files. | Plan README |
| D-02 | What is the rebuild sequence across the orchestrator modules? | 1. `validator.mjs` -> 2. `orchestrator/rules/` -> 3. `runner.mjs`. | `runner.mjs` depends on both `validator.mjs` and `rules/prompt-compiler.mjs`. `rules/` depends on schemas and validators. | Top-down or random order. | Phase Index |
| D-03 | How should third-party dependencies be handled in the rebuilt modules? | Maintain zero external dependencies; use pure Node.js built-ins (`node:fs/promises`, `node:crypto`, `node:path`, native `fetch`). | Preserves Context Factory portability across all developer environments. | Adding npm packages (e.g. `ajv`, `axios`). | Plan README |

### Unknowns and blockers

- None. Pre-planning and boundary analysis confirmed all contracts and caller dependencies.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | SC-02, D-01 | `orchestrator/validator.mjs` rebuilt with pure ESM JSON schema validation supporting types, required, enums, regex pattern, format, min/max length, min/max items, uniqueItems, and additionalProperties. | `orchestrator/validator.mjs` | `node --test evals/tests/rules/rule-contract-schema.test.mjs` | Planned |
| AC-02 | SC-01, D-01 | `orchestrator/rules/descriptor-parser.mjs` parses rule frontmatter and inline directive markers cleanly and builds full catalog without regex crashes. | `orchestrator/rules/descriptor-parser.mjs` | `node --test evals/tests/rules/rule-descriptor-parser.test.mjs` | Planned |
| AC-03 | SC-01, D-01 | `orchestrator/rules/binding-compiler.mjs` and `prompt-compiler.mjs` compile bindings, match globs, render directives, and validate prompt integrity deterministically. | `orchestrator/rules/binding-compiler.mjs`, `prompt-compiler.mjs` | `node --test evals/tests/rules/rule-binding.test.mjs`, `prompt-compiler.test.mjs` | Planned |
| AC-04 | SC-03, D-01 | `orchestrator/runner.mjs` implements clean 3-stage lifecycle (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`), native fetch providers (OpenAI, Anthropic, Gemini), and deterministic mock provider. | `orchestrator/runner.mjs` | `node --test evals/tests/rules/code-generation-evaluation.test.mjs` | Planned |
| AC-05 | SC-04, D-01 | Full evaluation suite (`npm test`) passes 27/27 evaluations and `context:resolve` produces valid outputs without regression. | System-wide verification | `npm test` & `node scripts/context.mjs resolve "auth webhook"` | Planned |

## Scope

- **In scope:**
  - `orchestrator/validator.mjs`
  - `orchestrator/rules/descriptor-parser.mjs`
  - `orchestrator/rules/binding-compiler.mjs`
  - `orchestrator/rules/prompt-compiler.mjs`
  - `orchestrator/runner.mjs`
  - Unit and integration tests under `evals/tests/rules/`
- **Out of scope:**
  - Changing schemas under `schemas/`
  - Modifying CLI commands under `app/cli/commands/`
  - Modifying `scripts/context-core.mjs` or `scripts/session-core.mjs`
  - Modifying rule markdown files under `rules/`

## Non-goals

- Adding external npm dependencies (e.g. `ajv`, `zod`, `langchain`).
- Changing the contract of `executeRun` or altering schema validation outputs.
- Deprecating existing provider adapters (`openai`, `anthropic`, `gemini`, `mock`).

## Constraints and decisions

- Zero external dependencies; standard Node.js ESM built-ins only.
- 100% backward compatibility for all exported function signatures and return object structures.
- All code changes strictly authored on task branch `refactor/PLN-0012-rebuild-orchestrator-engine`.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
|---|---|---|
| Incomplete schema validator regex or keyword support | High | Re-use comprehensive test suite in `evals/tests/rules/rule-contract-schema.test.mjs` to verify every Draft-07 primitive before advancing. |
| Prompt compiler breaking directive integrity check | High | Validate prompt integrity using existing `validatePromptIntegrity` test fixtures before integrating with runner. |
| Breaking `scripts/context-core.mjs` resolver imports | Critical | Retain exact function signatures (`compileRuleBinding`, `matchesGlob`, `parseRuleCatalog`, `parseRuleDescriptor`). |

## Task branch

| Field | Recorded decision |
|---|---|
| Target branch | `master` |
| Task branch | `refactor/PLN-0012-rebuild-orchestrator-engine` |
| Base commit | `6c438fe680f30ff876188e056618ee058f57abc9` |

## Phases

- [ ] `phase-01-boundary-analysis/phase.md` — Phase 1 — Current State Mapping and Contract Pinning
- [ ] `phase-02-vertical-slice-refactoring/phase.md` — Phase 2 — Vertical Slice Refactoring
- [ ] `phase-03-integration-tests/phase.md` — Phase 3 — Comprehensive Integration and Verification

## Verification

- **Baseline Tests:** `npm test` (all 27 eval suites passing).
- **Schema Contracts:** `node --test evals/tests/rules/rule-contract-schema.test.mjs`.
- **Descriptor & Binding Tests:** `node --test evals/tests/rules/rule-descriptor-parser.test.mjs` and `rule-binding.test.mjs`.
- **Prompt & Runner Tests:** `node --test evals/tests/rules/prompt-compiler.test.mjs` and `code-generation-evaluation.test.mjs`.
- **System Doctor:** `node scripts/context.mjs doctor`.

## Deviations

- None.

## Plan done-check

- [ ] Acceptance criteria map to units and verification.
- [ ] Blockers are resolved or absent.
- [ ] Risks and dependencies are recorded.
- [ ] Task branch and target base are verified.

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Conformance Report | Verification Command |
|---|---|---|---|---|
| Phase 01 Verification | `refactor/PLN-0012-rebuild-orchestrator-engine` | pending | pending | `npm test` |
| Phase 02 Verification | `refactor/PLN-0012-rebuild-orchestrator-engine` | pending | pending | `node --test evals/tests/rules/*.test.mjs` |
| Phase 03 Verification | `refactor/PLN-0012-rebuild-orchestrator-engine` | pending | pending | `npm test && node scripts/context.mjs resolve "auth webhook"` |
