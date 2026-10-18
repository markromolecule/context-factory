---
title: "Phase 1 — Current State Mapping and Contract Pinning"
type: unit
parent: "phase-01-boundary-analysis"
unit: "01.01"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: planned
created: "2026-10-18"
tags: [task, unit, orchestrator, boundary-analysis]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Current State Mapping and Contract Pinning

> Phase: phase-01-boundary-analysis · Depends on: none · Parallelizable with: none  
> Task branch: refactor/PLN-0012-rebuild-orchestrator-engine · Base commit: 6c438fe680f30ff876188e056618ee058f57abc9

## Objective

Map and pin the precise external contracts, exported symbols, parameter signatures, and return shapes for `validator.mjs`, `orchestrator/rules/`, and `runner.mjs`, establishing an immutable verification harness prior to rewriting code.

## Context packet

- **Contracts to Pin:**
  1. `orchestrator/validator.mjs`:
     - `validateSchema(data, schema, path = "#") -> { valid: boolean, errors: string[] }`
     - `assertValid(data, schema, name = "Data") -> true | throws ValidationError`
     - `loadSchema(schemaName: string) -> Promise<object>`
     - `ValidationError` (class extending Error with `.errors` property)
  2. `orchestrator/rules/descriptor-parser.mjs`:
     - `parseRuleDescriptor(markdownContent, rulePath, options = {}) -> object`
     - `parseRuleCatalog(rulesDir, options = {}) -> Promise<Array<object>>`
  3. `orchestrator/rules/binding-compiler.mjs`:
     - `matchesGlob(filePath, pattern) -> boolean`
     - `compileRuleBinding({ rules, stack, affectedScope, waivers, requireBinding, ... }) -> object`
  4. `orchestrator/rules/prompt-compiler.mjs`:
     - `assertSafePath(filePath)`
     - `renderCompiledDirectives(binding) -> string`
     - `compilePrompt({ request, systemPrompt, selection, binding, options }) -> { prompt, systemPrompt, binding }`
     - `validatePromptIntegrity({ prompt, systemPrompt, binding }) -> true | throws Error`
     - `buildContextBundle({ request, selection, binding, options }) -> Promise<{ ... }>`
  5. `orchestrator/runner.mjs`:
     - `executeRun({ request, provider, model, hooks, schema, fixture, apiKey, systemPrompt, options, stack, scope, workflow, requireBinding, binding }) -> Promise<RunResult>`
     - `PROVIDERS` dictionary (`mock`, `openai`, `anthropic`, `gemini`)
     - `ProviderError` class

<language_rules>
- [directive:cf.arch.solid][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` matches `refactor/PLN-0012-rebuild-orchestrator-engine`.
- Baseline evaluations pass: `npm test` returns 27/27 PASS.

## Scope

**In scope:** Pinning contract inventory, running and verifying current test suites against active modules.  
**Out of scope:** Modifying production files or changing schema definitions.

## Steps

1. Run all rule-related test suites in `evals/tests/rules/` to ensure current tests are green.
2. Confirm that `evals/tests/rules/rule-contract-schema.test.mjs`, `rule-descriptor-parser.test.mjs`, `rule-binding.test.mjs`, `prompt-compiler.test.mjs`, and `code-generation-evaluation.test.mjs` execute without unhandled errors.
3. Record exact export signatures into the boundary ledger.

## Verification

- **Automated Tests:**
  - Contract test: `node --test evals/tests/rules/rule-contract-schema.test.mjs` (verifies validator contract)
  - Unit tests: `node --test evals/tests/rules/rule-descriptor-parser.test.mjs` (verifies parser contract)
  - Unit tests: `node --test evals/tests/rules/rule-binding.test.mjs` (verifies binding compiler contract)
  - Integration test: `node --test evals/tests/rules/prompt-compiler.test.mjs` (verifies prompt compiler contract)
  - System test: `npm test` (verifies 27/27 eval suites pass)

## Rollback

- Revert any scratch test scripts.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01, AC-02, AC-03, AC-04, AC-05
- [ ] Executed on task branch `refactor/PLN-0012-rebuild-orchestrator-engine`
- [ ] Baseline test suites verified and pinned
