---
title: "Schema and Validation Contracts"
type: unit
parent: "phase-01-contract-foundation"
unit: "01.01"
branch: "task/0001/phase-01/schema-validation-contracts"
worktree: ".worktrees/0001/phase-01/schema-validation-contracts"
status: verified
created: "2026-10-06"
tags: [task, unit, schemas, validation]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Schema and Validation Contracts

> Worktree: `.worktrees/0001/phase-01/schema-validation-contracts` · Branch: `task/0001/phase-01/schema-validation-contracts`

## Objective

Define versioned contracts for rule descriptors, bindings, waivers, adapter results, and conformance reports, and make the dependency-free validator enforce the schema keywords those contracts rely on.

## Context packet

- `orchestrator/validator.mjs` currently supports basic type/required/properties/items/enum/format/minimum checks but ignores constraints already present in repository schemas such as `additionalProperties` and `minLength`.
- ADR 0029 requires distinct result states and rejects incomplete or over-broad waivers.
- AC-01, AC-05, and AC-06 depend on trustworthy structural validation.
- New files: `schemas/rule-descriptor.schema.json`, `rule-binding.schema.json`, `rule-waiver.schema.json`, `conformance-result.schema.json`, `conformance-report.schema.json`, and `evals/rule-contract-schema.test.mjs`.

<language_rules>
- `rules/global/code-quality.md`: Keep validation pure, deterministic, side-effect free, and covered by negative cases.
- `rules/typescript/common/type-safety.md`: Treat parsed JSON as unknown until schema validation succeeds; never use loose object assumptions.
- `rules/solid/single-responsibility.md`: Schema validation validates structure only; policy evaluation belongs to later rule-contract modules.
</language_rules>

> **Precedence Invariant:** If a step conflicts with these rules, the rule takes precedence.

## Preconditions

- Worktree is created from `task/0001/phase-01-integration`.
- No unit implementation from a later phase is present.

## Scope

**In scope:** `orchestrator/validator.mjs`; the five new schemas named above; `evals/rule-contract-schema.test.mjs`.

**Out of scope:** Markdown parsing, resolver selection, adapters, CLI behavior, and catalog migration.

## Steps

1. Specify stable IDs, applicability, three enforcement modes, verifier metadata, source/scope hashes, human authorization, expiry/review trigger, evidence, and the full result-state enum.
2. Extend `validateSchema()` only with required draft-07 primitives needed by these and existing schemas: string length/pattern, array uniqueness, object `additionalProperties`, and enum/const composition as justified by tests.
3. Add positive fixtures and negative cases for duplicate entries, unknown fields, blank authority, invalid modes/statuses, and incomplete evidence.
4. Keep error paths deterministic and precise enough for CLI remediation.

## Verification

- **Unit tests:** prevent the validator from silently accepting structurally invalid contracts.
- **Contract tests:** prove each schema accepts one canonical record and rejects each required failure class.
- Command: `node --test evals/rule-contract-schema.test.mjs` (PASS: 22/22 passed in 88ms).
- Regression: `node --test` (PASS: 72/72 tests passed).

```text
▶ Unit 01.01: Schema and Validation Contracts
  ▶ Extended Draft-07 Validator Primitives (5 passed)
  ▶ Contract: rule-descriptor.schema.json (3 passed)
  ▶ Contract: rule-binding.schema.json (2 passed)
  ▶ Contract: rule-waiver.schema.json (3 passed)
  ▶ Contract: conformance-result.schema.json (7 passed)
  ▶ Contract: conformance-report.schema.json (2 passed)
✔ Unit 01.01: Schema and Validation Contracts (22 passed)
```

## Rollback

Remove the new schemas/tests and revert only the new validator keyword branches; existing validation behavior must remain unchanged.

## Definition of done

- [x] AC-01, AC-05, and AC-06 schema requirements are executable.
- [x] Negative cases fail for the intended property path.
- [x] `/review` confirms no policy logic leaked into the generic validator.
- [x] Unit commit is clean and scoped.
