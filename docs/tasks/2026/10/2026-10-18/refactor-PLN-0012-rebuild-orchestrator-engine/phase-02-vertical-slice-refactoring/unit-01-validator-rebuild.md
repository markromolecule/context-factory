---
title: "Rebuild Pure ESM JSON Schema Validator"
type: unit
parent: "phase-02-vertical-slice-refactoring"
unit: "02.01"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: complete
created: "2026-10-18"
tags: [task, unit, orchestrator, validator]
depends_on: []
parallelizable_with: []
---

# Unit 02.01: Rebuild Pure ESM JSON Schema Validator

> Phase: phase-02-vertical-slice-refactoring · Depends on: none · Parallelizable with: none  
> Task branch: refactor/PLN-0012-rebuild-orchestrator-engine · Base commit: 6c438fe680f30ff876188e056618ee058f57abc9

## Objective

Rebuild and streamline [`orchestrator/validator.mjs`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/validator.mjs) as a modular, pure-ESM, zero-dependency Draft-07 schema validator with high diagnostic clarity, enforcing contracts for all project schemas.

## Context packet

- **Public Exports Required:**
  - `ValidationError` (class extending Error with `errors` property)
  - `validateSchema(data, schema, path = "#") -> { valid: boolean, errors: string[] }`
  - `assertValid(data, schema, name = "Data") -> true | throws ValidationError`
  - `loadSchema(schemaName: string) -> Promise<object>`
- **Keywords to Support:**
  - `type` (primitive types, array of types, integer vs number distinctions)
  - `required` (array of required property keys)
  - `properties` (nested object schemas)
  - `additionalProperties` (`false` or nested schema object)
  - `enum` (array of allowed primitive or literal values)
  - `const` (strict deep equality check)
  - `pattern` (regular expression pattern string)
  - `format` (`date`, `date-time`)
  - `minLength`, `maxLength` (string length bounds)
  - `minimum`, `maximum` (numeric bounds)
  - `items` (array element schema)
  - `minItems`, `maxItems` (array length bounds)
  - `uniqueItems` (array uniqueness check)

<language_rules>
- [directive:cf.arch.solid][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Phase 1 baseline verified.
- Active branch is `refactor/PLN-0012-rebuild-orchestrator-engine`.

## Scope

**In scope:** `orchestrator/validator.mjs`  
**Out of scope:** `schemas/` definitions, other orchestrator files.

## Steps

1. Implement streamlined type resolution (`getType(value)` handling null, array, integer, number, string, boolean, object).
2. Author clean keyword validation handlers (`validateType`, `validateString`, `validateNumber`, `validateObject`, `validateArray`).
3. Implement `validateSchema(data, schema, path = "#")` dispatching sequentially and accumulating path-based errors.
4. Implement `assertValid(data, schema, name = "Data")` and `loadSchema(schemaName)`.
5. Verify against `evals/tests/rules/rule-contract-schema.test.mjs`.

## Verification

- **Automated Tests:**
  - Contract test: `node --test evals/tests/rules/rule-contract-schema.test.mjs`
  - CLI Schema verification: `node app/cli/bin/context-cli.mjs validate`
- **Justification:** Contract tests ensure every JSON schema in the repository is validated identically without false positives or negatives.

## Rollback

- `git checkout HEAD -- orchestrator/validator.mjs`

## Definition of done

- [ ] Maps to acceptance criteria: AC-01
- [ ] Executed on task branch `refactor/PLN-0012-rebuild-orchestrator-engine`
- [ ] `evals/tests/rules/rule-contract-schema.test.mjs` passes 100%
