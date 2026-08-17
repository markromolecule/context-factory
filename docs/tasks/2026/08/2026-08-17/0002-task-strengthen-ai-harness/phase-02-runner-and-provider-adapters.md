---
title: "Phase 2: Pluggable Runner and Hook Lifecycle"
type: phase
parent: "docs/tasks/2026/08/2026-08-17/0002-task-strengthen-ai-harness/README.md"
phase: "2"
status: completed
created: "2026-08-17"
tags: [task, phase, runner, orchestrator, hooks, providers]
---

# Phase 2: Pluggable Runner and Hook Lifecycle

## Objective

Implement `orchestrator/runner.mjs` providing native `fetch`-based provider adapters (OpenAI, Anthropic, Gemini), a deterministic Mock/Replay runner, and the 3-stage hook lifecycle (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`).

## Dependencies & Prerequisites

- Phase 1 completed (`orchestrator/validator.mjs` and output schemas available).
- `scripts/context-core.mjs` for context resolution and bundling.

## Impacted Files & Components

- `orchestrator/runner.mjs` (NEW): Core execution engine managing lifecycle hooks, provider adapters, context bundle handoff, and output validation.
- `orchestrator/SHARED.md` (MODIFY): Document the runner interface and execution lifecycle contract.

## Implementation Tasks

- [x] Task 2.1: Implement native `fetch` provider adapters for OpenAI, Anthropic, and Gemini format payloads using Node.js built-ins.
- [x] Task 2.2: Implement deterministic `MockProvider` supporting recorded responses, golden fixture replay, and offline test runs.
- [x] Task 2.3: Implement the 3-stage lifecycle pipeline (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`) with fail-closed error handling.
- [x] Task 2.4: Integrate `orchestrator/validator.mjs` into `afterResponseValidate` to ensure all emitted outputs adhere strictly to schema invariants.

## Verification & Testing

- Verified `executeRun` using `MockProvider` with end-to-end hook pipeline execution (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`), schema output assertions against `schemas/run-result.schema.json`, and fail-closed error interception.

## Risks & Rollback

- **Risk:** Provider API payload variations over time.
- **Mitigation:** Normalize request/response formats into standard `run-result.schema.json` representation.
- **Rollback:** Delete `orchestrator/runner.mjs` and revert `orchestrator/SHARED.md`.
