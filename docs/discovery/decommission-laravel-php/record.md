---
title: "Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem Discovery Record"
type: discovery-record
status: ready
created: "2026-10-09"
sourceContext: docs/context/refactors/decommission-laravel-php-ecosystem.md
sourceContextHash: sha256:91c82a040d838e8c7799a02860c3c3431199c272d90c30b3a77aa0658f6f0bde
---

# Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem Discovery Record

## Idea and Release Condition

Remove all Laravel and PHP implementations, rules, adapters, evaluation cases, and fixtures from Context Factory to dedicate the system exclusively to the TypeScript web and backend ecosystem (Next.js, SolidJS, React, Node.js ESM). Release one plan-facing brief only after all boundaries, decommissioning targets, edge cases, and CLI failure diagnostics are verified against codebase evidence and accepted architectural decisions.

## Grounding Claim Packet: Decommissioning Scope

Selection: Checked against `docs/Wiki.md` and `knowledge/README.md`. The canonical LLM Wiki indexes general software principles (`factory.principles.solid.*`) and contains no note regarding Laravel stack decommissioning. Repository source code, manifests, and accepted ADRs (0021, 0022, 0023, 0029, 0036) serve as authoritative evidence for this discovery.

| Claim ID | Source / heading | Authority / lifecycle / verified date / content hash | Selection reason | Status and content |
| --- | --- | --- | --- | --- |
| G-DEC-001 | `knowledge/README.md` / Canonical Knowledge Items | canonical index / active / 2026-07-25 / `sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac` | Verified against active Wiki inventory | **unknown:** no canonical Wiki entry for Laravel stack decommissioning; rely on repository source and ADR 0036. |

## Repository Facts and Decisions

| ID | Class | Evidence | Finding and consequence |
| --- | --- | --- | --- |
| R-01 | verified fact | `rules/laravel/` | 23 active rule files exist under `rules/laravel/` spanning anti-patterns, application, common, database, foundation, http, presentation, and security. All must be deleted. |
| R-02 | verified fact | `orchestrator/conformance/adapters/laravel.mjs` | Standalone Laravel adapter implements `artisan test` and `composer check` conformance. Must be deleted. |
| R-03 | verified fact | `app/cli/commands/conform.mjs` | Imports and calls `registerLaravelAdapter()`. Must be removed. |
| R-04 | verified fact | `app/cli/commands/doctor.mjs` | Diagnostics check hardcodes `laravel` adapter readiness. Must be updated to TypeScript-only. |
| R-05 | verified fact | `scripts/context-core.mjs` | Infers `laravel` stack from keywords (`laravel`, `artisan`, `blade`, `eloquent`). Must be removed. |
| R-06 | verified fact | `evals/tests/conformance/laravel-adapter.test.mjs` | Unit tests assert Laravel adapter behavior. Must be deleted along with `evals/fixtures/laravel-conformance/`. |
| R-07 | verified fact | `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs`, `unit-06-03-laravel-data-security.test.mjs` | Tests assert Laravel rules and catalog coverage. Must be deleted. |
| R-08 | verified fact | `evals/cases/laravel-resolution.json` | Evaluation case asserts Laravel prompt resolution. Must be replaced with a TypeScript evaluation case. |
| R-09 | verified fact | `rules/global/` & `rules/solid/` | Shared rules contain dual PHP and TypeScript code examples. Must be scrubbed to pure TypeScript. |
| R-10 | accepted decision | ADR 0036 | Formally accepts decommissioning of Laravel and PHP to dedicate Context Factory exclusively to TypeScript. Supersedes ADR 0022 and ADR 0023. |
| R-11 | user decision | Discovery Q-01 | Requests explicitly demanding `--stack laravel` must emit an informative error explaining that Laravel was decommissioned in ADR 0036 and Context Factory is dedicated exclusively to TypeScript (exit code 2 BLOCKED). |

## Scenarios

### Scenario S-01: Pure TypeScript Prompt & Context Resolution (Happy Path)
- **Input:** User asks a generic backend architecture or data access question.
- **Expected Outcome:** Resolver selects only TypeScript rules (`rules/typescript/backend/...`, `rules/typescript/database/...`). Zero PHP or Laravel rules are returned or loaded.

### Scenario S-02: Explicit `--stack laravel` Invocation (Unsupported Stack Diagnostic)
- **Input:** Developer or CI job runs `context-cli conform --stack laravel` or `context-cli preflight --stack laravel`.
- **Expected Outcome:** Command halts immediately with exit code 2 (`BLOCKED`) and diagnostic message: `"Stack 'laravel' is not supported. Laravel and PHP support was decommissioned in ADR 0036; Context Factory is dedicated exclusively to the TypeScript ecosystem."`.

### Scenario S-03: Conformance & Doctor Diagnostics (Single-Stack Conformance)
- **Input:** Developer runs `node scripts/context.mjs doctor`.
- **Expected Outcome:** Conformance check reports `Adapters: typescript (ready) | Stacks: none unsupported`. Zero mention of Laravel. 100% HEALTHY.

### Scenario S-04: Shared SOLID Rules Inspection
- **Input:** Agent inspects `rules/solid/dependency-inversion.md` or `knowledge/principles/solid-dip.md`.
- **Expected Outcome:** Code snippets feature clean, idiomatic TypeScript classes, interfaces, and React Context providers with zero PHP/Laravel examples.

## Release Gate

All unknowns resolved. All target files identified. Ready for brief release.
