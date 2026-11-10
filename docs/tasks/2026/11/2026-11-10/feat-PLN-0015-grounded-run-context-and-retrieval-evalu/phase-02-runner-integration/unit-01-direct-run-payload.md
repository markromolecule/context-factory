---
title: "Send bounded sources to every direct provider"
type: unit
parent: "phase-02-runner-integration"
unit: "02.01"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, unit, harness]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Send bounded sources to every direct provider

> Task branch: `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`; base commit: `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. Depends on: 01.01.

## Objective

Make each direct `executeRun` provider call consume the selected source payload under a pre-dispatch cap, with a safe, inspectable budget receipt.

## Context packet

- Verified released brief: `docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`. This unit serves AC-01, AC-02, AC-03, and AC-06. User confirmed the two-goal scope on 2026-11-10.
- Existing `executeRun` resolves context, calls `compilePrompt`, runs `onPromptPrepare`, checks binding integrity, then sends `prompt`, `systemPrompt`, `selection`, and `binding` to the provider. It never calls `buildContextBundle`; only compiled directives are in `systemPrompt`. The existing bundle has source content and hashes.
- Phase 1 Unit 01.01 will export a bounded assembly function and an inclusion/omission receipt. Expected state: its tests prove exact-cap and overflow behavior, whole-file optional omission, and safe source-data serialization. Stop if that contract changed.
- `app/cli/commands/run.mjs` and `scripts/harness-cli.mjs` both call `executeRun`; the latter manually parses flags. `schemas/run-result.schema.json` currently has `additionalProperties:false`, so a new `inputBudget` receipt requires a schema change. Do not hide the receipt inside provider output. `scripts/validate-context.mjs` compares all `evals/**/*.mjs` files with `context-manifest.json` tools, so the new `run-budget.test.mjs` also requires a manifest entry and regenerated `context-lock.json`.
- Implementation is JavaScript/ESM. Current TypeScript preflight cannot certify `.mjs`; use the global directives below and actual Node/host checks.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
- [directive:cf.sec.untrusted-input-boundaries][mode:evidence-blocking] rules/global/security-guardrails.md contentHash:sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3
- [directive:cf.sec.rate-limiting-and-bounds][mode:automated-blocking] rules/global/security-guardrails.md contentHash:sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes if rule sources change; these are selection receipts only.

## Preconditions / Expected state from dependencies

- `git symbolic-ref --quiet --short HEAD` must equal `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`.
- Verify the brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`.
- Unit 01.01 is complete with its passing test and review receipts. Inspect its exported function and budget shape; stop if downstream steps need a changed contract.

## Scope

**In scope:**
- `orchestrator/runner.mjs`
- `app/cli/commands/run.mjs`
- `app/cli/bin/context-cli.mjs`
- `scripts/harness-cli.mjs`
- `schemas/run-result.schema.json`
- `evals/tests/rules/prompt-compiler.test.mjs`
- `evals/tests/cli/run-budget.test.mjs` (new)
- `context-manifest.json`
- `context-lock.json`

**Out of scope:** Resolver routing, evaluation dataset semantics, provider SDK migration, unrelated model-default/retry/schema-hook defects, host application code, and new dependencies.

## Steps

1. After resolution, build the selected source bundle and use Unit 01.01's assembler to create the provider prompt. Keep the caller's request unchanged and append source material in the lower-priority request/data part rather than promoting it into system instructions. Supply the same prepared text to built-in and custom providers.
2. Keep `onPromptPrepare` capable of adding context, then validate both binding integrity and every included source's path, hash, and full content in the final prepared `prompt` and `systemPrompt`. A hook that removes, changes, or promotes retrieved source text into system instructions must fail before dispatch. Recalculate the cap over that final prepared input immediately before provider dispatch. If integrity, overflow, or path safety fails, return a failed run and prove provider invocation count is zero. Avoid persisting source text in error output.
3. Add a validated `maxInputTokens` option to `executeRun`, `context-cli run`, and `scripts/context.mjs run`. Default from `selection.budget.maxRecommendedTokens`; reject zero, negative, non-integer, or non-finite overrides. Add concise help text. Use the same semantics on both command paths.
4. Add an `inputBudget` result field and schema entry containing cap, labeled local estimated usage, included path/hash pairs, and omitted path/hash pairs. Keep provider-reported `tokens` separate; source bodies and prompt text do not enter the new receipt. Update the schema contract and CLI display only as needed.
5. Add `evals/tests/cli/run-budget.test.mjs` to `context-manifest.json` tools, run `node scripts/context.mjs lock`, and verify manifest and lock health. This inventory work belongs to the same unit that creates the new test.

## Verification

- **Integration and public CLI contract tests:** `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs`. Capture a custom provider's actual prompt for KISS/YAGNI and assert path, hash, full text, request, and directives; check built-in provider payload builders receive that prepared prompt; assert zero dispatch when required content, hook-added text, or a hook removing/changing/promoting an included source violates the contract. Exercise both run commands with valid and invalid `maxInputTokens`; validate `inputBudget` against `schemas/run-result.schema.json`; assert no source body appears in the receipt. Run `node scripts/context.mjs doctor` after regenerating the lock to verify the new test is inventoried.
- **Host checks:** From repository root, run configured `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` for the current revision and record command, scope, exit code, revision/diff identity, and result. `typecheck` is unconfigured, not PASS.
- **Human evidence:** Review prompt role placement and source-data boundary; record selected rule hashes and the changed public contract in the unit receipt. If a new result consumer needs work, amend the plan first.

## Rollback

Revert this unit's runner, CLI, schema, and test changes on the task branch. The prior direct run behavior returns; no persisted data or remote state requires migration.

## Definition of done

- [ ] AC-01, AC-02, AC-03, and AC-06 are proven at the provider boundary with positive and negative tests.
- [ ] Unit 01.01 and brief preconditions hold on the recorded branch.
- [ ] All nine scoped files are reviewed; any new consumer is reconciled before edit.
- [ ] Focused and configured host checks pass with revision-bound receipts; missing checks are unconfigured.
- [ ] Changes are committed on the task branch before Phase 3.
