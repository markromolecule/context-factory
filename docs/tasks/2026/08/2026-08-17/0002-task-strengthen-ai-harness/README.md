---
title: Strengthen Context Factory AI Harness
type: task
status: completed
created: 2026-08-17
tags: [task, harness, orchestrator, evals, cli, runner, validator]
---

# Strengthen Context Factory AI Harness

## Outcome

Enhance the Context Factory harness to provide robust execution, schema validation, golden dataset evaluations, and a unified CLI interface for building, testing, and running context pipelines.

## Pre-planning record

### Actors and goals

- **AI Developer / User**: Define golden input/output datasets and run automated evaluations against workflows and skills.
- **Orchestrator / Runner**: Execute agent prompts, model calls, and skill hook lifecycle with validated structured outputs.
- **CI / Harness CLI**: Provide a unified CLI entry point (`scripts/harness-cli.mjs` or subcommands) to build bundles, validate schemas, and run evaluation suites.

### Domain language

- **Runner**: Component executing lifecycle hooks, context bundling, and optional model invocation or agent dispatch.
- **Validator**: Engine validating outputs against JSON schemas in `schemas/`.
- **Golden Dataset**: Curated input/output evaluation cases ensuring regressions are detected.
- **Harness CLI**: Unified command-line interface for context bundling, evaluation execution, lock verification, and diagnostics.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S1 | CLI runs full evaluation suite | Test cases in `evals/cases/` and datasets in `evals/datasets/` | Runs unit context resolution and mock-based golden workflow datasets; reports test metrics | Emits path-level diffs and exits with status 1 | covered |
| S2 | Runner executes workflow with model provider | Provider configured (or `--mock` flag provided) | Executes 3-stage lifecycle (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`), calls model or replay, validates output | Fails closed on hook rejection or validation failure | covered |
| S3 | Validator checks output against canonical schema | Valid or invalid JSON output payload generated | Strictly validates types, required fields, formats, and properties against `schemas/*.schema.json` | Emits exact path, received value, and expected constraint error | covered |
| S4 | Runner receives invalid LLM response schema | Model produces malformed or schema-violating JSON | Validator intercepts violation in `afterResponseValidate` | Rejects output, logs structured error, prevents corrupt downstream state | covered |
| S5 | CLI runs without live API keys | CI environment without secrets | Default execution routes through deterministic Mock/Replay provider | Zero API errors, zero external network dependency | covered |
| S6 | Backward-compatible invocation of `scripts/context.mjs` | Legacy scripts or IDE commands invoke `node scripts/context.mjs doctor` | Transparently delegates to the unified harness engine | Identical exit codes, output, and behavior | covered |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D1 | How should LLM execution vs. deterministic context preparation be bounded? | Pluggable, dependency-free native `fetch` provider adapters with Mock/Replay runner | Preserves zero npm dependencies, model neutrality, and allows offline CI evaluations without API keys | Heavy npm vendor SDKs, Dispatch-only without CLI execution | Task README / ADR 0008 |
| D2 | What lifecycle stages should skill hooks expose? | Explicit 3-stage lifecycle (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`) | Deterministic, easy to trace and test, prevents recursive middleware bugs | Full onion middleware pipeline, Post-validation-only hook | Task README / ADR 0008 |
| D3 | How should output schema validation be handled? | Dependency-free pure ESM JSON Schema validator with canonical output schemas (`run-result`, `evaluation-report`, `claim-evidence`) | Zero npm dependencies, strict schema compliance, path-level error diagnostics | External Ajv/Zod packages, loose regex assertions | Task README / ADR 0008 |
| D4 | How should golden datasets and evals be structured? | Layered evaluation hierarchy: unit cases (`evals/cases/`) + workflow golden datasets (`evals/datasets/`) executed via `evals/run-evals.mjs` | Backward compatible, clean separation between fast routing tests and end-to-end golden verification | Monolithic merge breaking existing tests, loose unstructured markdown | Task README / ADR 0008 |
| D5 | How should `scripts/harness-cli.mjs` and `scripts/context.mjs` be unified? | Unified CLI under `scripts/harness-cli.mjs` with rich subcommands; `scripts/context.mjs` acts as backward-compatible alias | Clean single engine, rich command interface, zero breaking changes to existing docs/workflows | Hard deletion breaking legacy scripts, split disconnected CLIs | Task README / ADR 0008 |

### Unknowns and blockers

None. All 5 core architectural and operational branches have been resolved and agreed upon.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC1 | D1, D2, S2, S5 | `orchestrator/runner.mjs` implements 3-stage lifecycle hooks (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`) with native `fetch` provider adapters (OpenAI, Anthropic, Gemini) and deterministic Mock/Replay runner | `orchestrator/runner.mjs` | Automated unit & replay tests | complete |
| AC2 | D3, S3, S4 | `orchestrator/validator.mjs` provides pure-ESM JSON schema validation; canonical output schemas created in `schemas/` (`run-result.schema.json`, `evaluation-report.schema.json`, `claim-evidence.schema.json`) | `orchestrator/validator.mjs`, `schemas/*.schema.json` | Schema validator unit tests | complete |
| AC3 | D4, S1 | `evals/datasets/` contains representative golden workflow datasets; `evals/run-evals.mjs` executes unit cases, golden datasets, and live runs | `evals/datasets/**`, `evals/run-evals.mjs` | `node evals/run-evals.mjs --datasets` | complete |
| AC4 | D5, S6 | `scripts/harness-cli.mjs` provides subcommands (`resolve`, `bundle`, `run`, `validate`, `eval`, `lock`, `doctor`); `scripts/context.mjs` delegates seamlessly | `scripts/harness-cli.mjs`, `scripts/context.mjs` | CLI invocation verification | complete |
| AC5 | All, D1-D5 | Context manifest, ADR 0008, doc maps, and lockfile updated; `node scripts/context.mjs doctor` passes | Manifest, ADR, Docs, Lockfile | `node scripts/context.mjs doctor` | complete |

## Scope

- Create `orchestrator/runner.mjs` (pluggable providers + 3-stage hook lifecycle + mock runner).
- Create `orchestrator/validator.mjs` (pure ESM JSON Schema validator).
- Create output schemas in `schemas/` (`run-result.schema.json`, `evaluation-report.schema.json`, `claim-evidence.schema.json`).
- Create `evals/datasets/` with golden datasets across primary workflows.
- Create `evals/run-evals.mjs` test runner.
- Create `scripts/harness-cli.mjs` and wire `scripts/context.mjs` as transparent alias.
- Create ADR 0008 documenting the execution harness design.
- Update `context-manifest.json`, documentation maps, and generate fresh `context-lock.json`.

## Non-goals

- Introducing heavy external npm dependencies (`node_modules`).
- Replacing existing unit cases in `evals/cases/`.
- Building a hosted cloud backend/gateway service.

## Constraints and decisions

- Zero external npm dependencies (pure Node.js 18+ ESM built-ins).
- Maintain 100% backward compatibility for existing scripts, contracts, and workflows.
- Adhere to `orchestrator/SHARED.md` model-neutral orchestration contracts.

## Phases

- [x] `phase-01-validator-and-schemas.md` — Phase 1: Output Schemas & Pure ESM Validator
- [x] `phase-02-runner-and-provider-adapters.md` — Phase 2: Pluggable Runner & Hook Lifecycle
- [x] `phase-03-golden-datasets-and-eval-runner.md` — Phase 3: Golden Datasets & Eval Harness
- [x] `phase-04-unified-cli-and-adr.md` — Phase 4: Unified Harness CLI & ADR 0008
- [x] `phase-05-sync-and-verification.md` — Phase 5: Manifest, Docs, Lock, and Doctor Verification

## Verification

- `node evals/run-evals.mjs`: 11/11 evaluations passed (8 unit + 3 golden datasets) in 37ms.
- `node scripts/harness-cli.mjs run "deliver new feature" --provider mock`: Verified mock execution, 3-stage hooks, and output schema validation.
- `node scripts/harness-cli.mjs lint`: 0 errors across 28 rules, 12 skills, 8 workflows, 5 schemas, 8 decisions, 7 tools, 3 golden datasets, and 103 Markdown files.
- `node scripts/harness-cli.mjs lock --check`: Verified lockfile currency (`sha256:b12c76af67ed77b3c4fbbbef14ccbe03da2b28f2a63e741a502389915661d378`).
- `node scripts/harness-cli.mjs doctor` & `node scripts/context.mjs doctor`: 100% healthy.

## Deviations

None. All implementation matched the approved pre-planning discovery record and ADR 0008.

## Result

Context Factory upgraded to version 3.4.0. Implemented pure ESM runner, 3-stage hook lifecycle, pure ESM schema validator, canonical output contracts, golden workflow datasets, unified harness CLI, and ADR 0008. Full health verified via doctor and 11/11 passing evaluations.
