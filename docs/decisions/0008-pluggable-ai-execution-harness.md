---
title: Pluggable AI Execution Harness, Hooks, and Schema Validation
type: decision
status: accepted
created: 2026-08-17
tags: [adr, harness, runner, validator, evals, hooks]
---

# 0008 — Pluggable AI Execution Harness, Hooks, and Schema Validation

## Context

Context Factory established deterministic context selection, bundling, and hash locking in [[docs/decisions/0004-deterministic-context-harness|ADR 0004]]. However, testing end-to-end agent workflows, verifying structured outputs against schema contracts, and managing skill hook lifecycles required manual or ad-hoc scripts. A strengthened execution harness was required to execute model calls, intercept lifecycle stages, strictly validate structured outputs, and run automated golden regression suites without introducing heavy external npm dependencies.

## Options considered

1. **Heavy Vendor SDKs and Framework Dependencies:** Install `@google/genai`, `@anthropic-ai/sdk`, `openai`, and `ajv`/`zod`.
   - *Pros:* Off-the-shelf SDK methods.
   - *Cons:* Bloats repository with `node_modules`, introduces supply-chain maintenance, and makes offline CI execution brittle.
2. **Pluggable Pure ESM Runner, Native Fetch Adapters, and Built-in Mock Replay:** Implement dependency-free native fetch adapters with a 3-stage hook lifecycle (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`), a pure ESM JSON schema validator, and a layered evaluation suite (unit cases + golden workflow datasets).
   - *Pros:* 100% dependency-free pure ESM; deterministic offline CI execution via mock replay; strict path-level schema validation.
   - *Cons:* Requires maintaining lightweight request/response adapters for provider formats.
3. **Dispatch-Only Without CLI Execution:** Restrict the harness to prompt generation and delegate all model execution to external IDE hosts.
   - *Pros:* Simplest codebase.
   - *Cons:* Prevents automated end-to-end regression evaluations in CI.

## Decision

Adopt Option 2. Implement:
1. `orchestrator/runner.mjs` with native fetch provider adapters (`openai`, `anthropic`, `gemini`), deterministic `mock` replay, and 3-stage lifecycle hooks.
2. `orchestrator/validator.mjs` with canonical output schemas (`schemas/run-result.schema.json`, `schemas/evaluation-report.schema.json`, `schemas/claim-evidence.schema.json`).
3. Layered evaluation hierarchy: unit context cases in `evals/cases/` + workflow golden datasets in `evals/datasets/` executed by `evals/run-evals.mjs`.
4. Unified Harness CLI (`scripts/harness-cli.mjs`) with `scripts/context.mjs` providing backward-compatible aliasing.

## Consequences

- End-to-end workflow execution and structured outputs are verifiable automatically in CI without external API keys or costs.
- Skill hooks have deterministic interception points for query enrichment, prompt customization, and output schema assertions.
- Output payloads are strictly validated against draft-2020-12 compatible JSON schemas with path-level error reporting.
- 100% backward compatibility is preserved for existing scripts, documentation, and agent entry points.

## Validation and review date

Review after 50 automated harness runs or by 2027-02-17. Measure evaluation pass rates, schema validation error clarity, mock fidelity, and execution overhead.
