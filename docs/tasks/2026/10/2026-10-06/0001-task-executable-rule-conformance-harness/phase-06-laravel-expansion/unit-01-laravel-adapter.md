---
title: "Laravel Conformance Adapter"
type: unit
parent: "phase-06-laravel-expansion"
unit: "06.01"
branch: "task/0001/phase-06/laravel-adapter"
worktree: ".worktrees/0001/phase-06/laravel-adapter"
status: verified
created: "2026-10-06"
tags: [task, unit, laravel, adapter]
depends_on: ["05.04"]
parallelizable_with: []
---

# Unit 06.01: Laravel Conformance Adapter

## Objective

Implement Laravel verifier registration and tool discovery through the unchanged conformance port/report contracts.

## Context packet

- Phase 5 proves the core/TypeScript seam; this unit must not change core contracts to accommodate Laravel-specific behavior unless an incompatibility is escalated.
- Discover Composer scripts, Artisan, Pint, PHPStan/Psalm, Pest/PHPUnit, and architecture tooling when configured; do not install tools.
- AC-12 and SC-09.

<language_rules>
- `rules/laravel/foundation/conventions.md`: Respect host Laravel conventions and discover configured tools rather than assuming a scaffold.
- `rules/laravel/common/project-structure.md`: Keep Laravel-specific verification inside its adapter boundary.
- `rules/global/security-guardrails.md`: Execute argv arrays with bounded output/timeouts and no shell interpolation.
- `rules/solid/liskov-substitution.md`: Laravel returns the same statuses/evidence semantics as TypeScript.
</language_rules>

## Preconditions

- Developer explicitly continued after Phase 5.

## Scope

**In scope:** new `orchestrator/conformance/adapters/laravel.mjs`; adapter registration composition; new `evals/laravel-adapter.test.mjs`; new fixtures under `evals/fixtures/laravel-conformance/`.

**Out of scope:** Laravel rule metadata, core schema/status changes, dependency installation, and release files.

## Steps

1. Discover host PHP/Composer/Laravel capabilities from explicit project files and injected process service.
2. Register verifier IDs for validation/authorization boundaries, project structure, ORM/query discipline, migrations, transactions, and configured quality tools.
3. Map missing tools/timeouts/violations to shared statuses without special core branches.
4. Add conforming/violating/unavailable fixtures and adapter-substitution tests.

## Verification

- **Integration tests:** deterministic Laravel fixture commands and violated-rule outputs.
- **Architecture tests:** core modules remain free of Laravel imports/conditionals.
- **Security tests:** no shell interpolation or environment leakage.
- Command: `node --test evals/laravel-adapter.test.mjs`.

### Execution evidence (2026-10-06)

- Red: `node --test evals/laravel-adapter.test.mjs` failed with `ERR_MODULE_NOT_FOUND` for `orchestrator/conformance/adapters/laravel.mjs` before implementation.
- Green: `node --test evals/laravel-adapter.test.mjs evals/bridge-conformance.test.mjs` passed 14/14 tests, including fixture violations, `TOOL_UNAVAILABLE`, evidence-blocking semantics, core-boundary isolation, argv-only process execution, and doctor capability parity.
- Regression: `npm test` passed 31/31 evaluations.
- Conformance: `report-binding-adhoc-00-00-8df69748fa2b` — PASS; binding `sha256:8df69748fa2baeab448e826ba4213ef379aaff7c82feeb66223d50884a562de3`; diff `sha256:117f469d9a1c470e9ac7a2047c200f04ad3a7bc488f563b4f61efd7f20f4f693`. The adversarial PHP fixtures are intentionally excluded from this production-source receipt because one deliberately violates validation, authorization, and ORM rules; their detection is covered by the focused adapter test.
- Deferred release check: `npm run lint` remains non-zero because the new adapter/test are not yet added to `context-manifest.json` and `context-lock.json`; both are explicitly owned by Unit 06.04 final release gate.

## Rollback

Remove Laravel registration/adapter/fixtures; TypeScript enforcement remains complete.

## Definition of done

- [x] AC-12 adapter portion passes.
- [x] Shared schemas and statuses remain unchanged; no ADR escalation required.
- [x] Missing PHP tooling is honest TOOL_UNAVAILABLE.
- [x] Unit passes `/review`.
