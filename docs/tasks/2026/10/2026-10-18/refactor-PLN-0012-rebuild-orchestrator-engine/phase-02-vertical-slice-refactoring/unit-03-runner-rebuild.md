---
title: "Rebuild AI Execution Runner and Providers"
type: unit
parent: "phase-02-vertical-slice-refactoring"
unit: "02.03"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: planned
created: "2026-10-18"
tags: [task, unit, orchestrator, runner, providers]
depends_on: ["02.02"]
parallelizable_with: []
---

# Unit 02.03: Rebuild AI Execution Runner and Providers

> Phase: phase-02-vertical-slice-refactoring · Depends on: 02.02 · Parallelizable with: none  
> Task branch: refactor/PLN-0012-rebuild-orchestrator-engine · Base commit: 6c438fe680f30ff876188e056618ee058f57abc9

## Objective

Rebuild and streamline [`orchestrator/runner.mjs`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/runner.mjs) with clean 3-stage lifecycle hook execution (`beforeContext`, `onPromptPrepare`, `afterResponseValidate`), structured error reporting via `ProviderError`, native `fetch` provider adapters (OpenAI, Anthropic, Gemini), and deterministic offline `mockProvider`.

## Context packet

- **Core Functionality in `runner.mjs`:**
  - `ProviderError` class with status and details.
  - Providers:
    - `mockProvider`: deterministic replay or synthetic context-aware output.
    - `openAIProvider`: native fetch call to `https://api.openai.com/v1/chat/completions`.
    - `anthropicProvider`: native fetch call to `https://api.anthropic.com/v1/messages`.
    - `geminiProvider`: native fetch call to `https://generativelanguage.googleapis.com/v1beta`.
  - `PROVIDERS` lookup map.
  - `executeRun`:
    - Generates 16-character SHA-256 `runId`.
    - Stage 1: `beforeContext` hook.
    - Context resolution via `resolveContext`.
    - Prompt compilation via `compilePrompt`.
    - Stage 2: `onPromptPrepare` hook + post-hook `validatePromptIntegrity`.
    - Provider dispatch.
    - Stage 3: Output schema validation (`loadSchema` / `validateSchema`) + `afterResponseValidate` hook.
    - Asserts conformant `runResult` against `run-result.schema.json`.

<language_rules>
- [directive:cf.arch.solid][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 02.01 and Unit 02.02 complete.
- Active branch is `refactor/PLN-0012-rebuild-orchestrator-engine`.

## Scope

**In scope:** `orchestrator/runner.mjs`  
**Out of scope:** `app/cli/commands/run.mjs`, CLI flag parsing.

## Steps

1. Implement payload builders (`buildOpenAIPayload`, `buildAnthropicPayload`, `buildGeminiPayload`).
2. Implement clean provider adapters with resilient error handling and token counting.
3. Author `executeRun` coordinating the 3-stage lifecycle, prompt compilation, schema validation, and timing metrics.
4. Verify execution using `evals/tests/rules/code-generation-evaluation.test.mjs` and `evals/run-evals.mjs`.

## Verification

- **Automated Tests:**
  - `node --test evals/tests/rules/code-generation-evaluation.test.mjs`
  - `node evals/run-evals.mjs`
- **Justification:** Exercises model runner lifecycle, mock provider determinism, and schema output conformance.

## Rollback

- `git checkout HEAD -- orchestrator/runner.mjs`

## Definition of done

- [ ] Maps to acceptance criteria: AC-04
- [ ] Executed on task branch `refactor/PLN-0012-rebuild-orchestrator-engine`
- [ ] Code generation and eval runner test cases pass
