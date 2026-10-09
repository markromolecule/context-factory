---
title: "Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem"
type: context
status: ready
created: "2026-10-09"
tags: [context, refactor, typescript, decommissioning, laravel]
feature: "decommission-laravel-php"
---

# Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem

## 1. Overview & Objective

- **Problem Statement:** Context Factory currently maintains a parallel Laravel and PHP ecosystem stack comprising 23 rule documents (`rules/laravel/`), a dedicated conformance adapter (`orchestrator/conformance/adapters/laravel.mjs`), test fixtures (`evals/fixtures/laravel-conformance/`), evaluation test cases, and doctor diagnostic branches. Maintaining dual-ecosystem assets introduces cognitive overhead, bloats rule indexing, creates false-positive keyword triggers in prompt resolution, and diverts maintenance effort away from the primary mission: providing deep, rigorous, high-assurance context, skills, and conformance enforcement for the modern TypeScript ecosystem (Next.js, SolidJS, React, Node.js ESM).
- **Business / User Value:** By completely removing Laravel and PHP implementations, Context Factory simplifies its architecture, eliminates dual-stack drift, optimizes prompt compilation speed and context window efficiency, and establishes a single-minded focus on best-in-class TypeScript engineering guidelines.
- **Success Criteria:**
  - 100% removal of active `rules/laravel/` files (23 markdown files removed).
  - Removal of `orchestrator/conformance/adapters/laravel.mjs` and its CLI registration (`app/cli/commands/conform.mjs` and `doctor.mjs`).
  - Removal of Laravel-specific evaluation fixtures (`evals/fixtures/laravel-conformance/`) and tests (`evals/tests/conformance/laravel-adapter.test.mjs`, `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs`, `evals/tests/rules/unit-06-03-laravel-data-security.test.mjs`, `evals/cases/laravel-resolution.json`).
  - Purification of global and SOLID rules: eliminate Laravel and PHP code snippets, replacing them with TypeScript examples or purely language-agnostic contracts.
  - Context manifest and lockfile cleanly synchronized with zero dangling paths.
  - `npm test`, `npm run lint`, and `node scripts/context.mjs doctor` pass 100% with `HEALTHY` status.

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As an agent or developer working in Context Factory, I want prompts and rules to focus exclusively on TypeScript patterns, so that I never receive irrelevant PHP/Laravel directives or code suggestions.*
- *As a system maintainer, I want the conformance runner and doctor diagnostics to evaluate only TypeScript capabilities, so that adapter registry and tool checks remain streamlined and fast.*

### Functional Requirements

- [ ] **FR-01 (Rule Decommissioning):** Delete the entire `rules/laravel/` directory (23 rule files across anti-patterns, application, common, database, foundation, http, presentation, and security).
- [ ] **FR-02 (Adapter Decommissioning):** Remove `orchestrator/conformance/adapters/laravel.mjs`. Unregister Laravel adapter from `app/cli/commands/conform.mjs` and remove `laravel` stack status from `app/cli/commands/doctor.mjs`.
- [ ] **FR-03 (Resolver & Schema Streamlining):** Remove Laravel stack keyword inference (`laravel`, `artisan`, `blade`, `eloquent`) from `scripts/context-core.mjs` and stack enum constraints in `schemas/rule-descriptor.schema.json` if present.
- [ ] **FR-04 (Evaluations & Fixtures Cleanup):** Remove `evals/fixtures/laravel-conformance/`, `evals/cases/laravel-resolution.json`, and all Laravel-specific test suites in `evals/tests/`. Replace or update evaluation suite runner to reflect TypeScript exclusivity.
- [ ] **FR-05 (Global & SOLID Rule Purification):** Scrub PHP and Laravel syntax examples from `rules/global/` and `rules/solid/`, replacing them with idiomatic TypeScript equivalents.
- [ ] **FR-06 (Historical Record Integrity):** Mark ADR 0022 and ADR 0023 as `superseded` by ADR 0036. Preserve archived tasks in `docs/tasks/2026/09/` as read-only historical records without mutating closed git history.
- [ ] **FR-07 (Inventory & Doctor Health):** Deregister all removed files from `context-manifest.json`, regenerate `context-lock.json`, and verify `doctor` diagnostics pass 100%.

### Edge Cases & Failure Modes

- **Unsupported Stack Request:** If a user or prompt explicitly queries for Laravel or PHP, Context Factory should fail fast or report that only the `typescript` stack is supported, rather than silently falling back to incorrect rules.
- **Dangling References in Shared Rules:** If any rule or document links to `rules/laravel/...`, link linter or doctor will fail. All links must be updated or removed.
- **Evaluation Dataset Counts:** When `evals/cases/laravel-resolution.json` is removed or replaced, `evals/run-evals.mjs` must be updated if case counts are asserted.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:** Rules (`rules/`), Orchestrator (`orchestrator/conformance/`), CLI (`app/cli/`), Evaluations (`evals/`), Manifest (`context-manifest.json`).
- **Language Stack & Rules:** Single unified stack: `typescript`. Rules enforced: `cf.arch.separation-of-concerns`, `cf.code.single-responsibility`.
- **Existing Files to Delete:**
  - `rules/laravel/**` (23 files)
  - `orchestrator/conformance/adapters/laravel.mjs`
  - `evals/fixtures/laravel-conformance/**`
  - `evals/tests/conformance/laravel-adapter.test.mjs`
  - `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs`
  - `evals/tests/rules/unit-06-03-laravel-data-security.test.mjs`
  - `evals/cases/laravel-resolution.json`
- **Existing Files to Modify:**
  - `app/cli/commands/conform.mjs` (remove `registerLaravelAdapter`)
  - `app/cli/commands/doctor.mjs` (remove `laravel` adapter check)
  - `scripts/context-core.mjs` (remove laravel keyword mappings)
  - `rules/global/architecture-conformance.md` (remove PHP/Laravel references)
  - `rules/global/code-quality.md` (remove PHP/Laravel references)
  - `rules/global/evidence-and-claims.md` (remove PHP/Laravel references)
  - `rules/global/naming-conventions.md` (remove PHP/Laravel references)
  - `rules/global/security-guardrails.md` (remove PHP/Laravel references)
  - `rules/solid/dependency-inversion.md` (remove PHP/Laravel references)
  - `rules/solid/interface-segregation.md` (remove PHP/Laravel references)
  - `rules/solid/liskov-substitution.md` (remove PHP/Laravel references)
  - `rules/solid/open-closed.md` (remove PHP/Laravel references)
  - `rules/solid/single-responsibility.md` (remove PHP/Laravel references)
  - `context-manifest.json` (remove deleted files)
  - `context-lock.json` (regenerate)
  - `docs/decisions/README.md` (index ADR 0036 and mark 0022/0023 superseded)
  - `docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards.md` (`status: superseded`)
  - `docs/decisions/0023-laravel-modular-domain-architecture-and-unified-conventions.md` (`status: superseded`)

## 4. Scope & Boundaries

- **In Scope:** Complete removal of Laravel and PHP rules, adapter, fixtures, tests, and CLI mentions; purification of global rules to TypeScript-only; authoring ADR 0036; updating manifest and lock.
- **Out of Scope / Non-Goals:**
  - Modifying closed historical task directories in `docs/tasks/2026/09/` (these represent completed git commits and historical record).
  - Creating new TypeScript rules (handled in subsequent dedicated task).

## 5. References & External Context

- [ADR 0021 — Explicit Language Stack Selection](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0021-explicit-language-stack-selection.md)
- [ADR 0022 — Pragmatic Laravel Rule Taxonomy (Superseded)](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards.md)
- [ADR 0023 — Laravel Modular Domain Architecture (Superseded)](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0023-laravel-modular-domain-architecture-and-unified-conventions.md)
- [ADR 0035 — Host Conformance Receipts and Offline Fixture Modes](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md)

## 6. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `rules/laravel/` | verified | 23 active rule files exist under `rules/laravel/` | All 23 files must be cleanly deleted and deregistered |
| E-02 | `orchestrator/conformance/adapters/laravel.mjs` | verified | Adapter implements Laravel conformance checking via artisan/composer | Remove adapter file and deregister from CLI |
| E-03 | `evals/tests/conformance/laravel-adapter.test.mjs` | verified | 7 unit tests assert Laravel adapter behavior | Remove test file and deregister from manifest |
| E-04 | `evals/cases/laravel-resolution.json` | verified | Evaluation case tests Laravel prompt resolution | Replace with TypeScript evaluation case or remove |
| E-05 | `rules/solid/*.md` | verified | SOLID rule files contain PHP example code snippets alongside TypeScript | Clean PHP examples to keep rules purely TypeScript-focused |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | How should requests explicitly specifying `--stack laravel` be handled? | resolved | maintainer | no | Emit an informative unsupported-stack diagnostic explaining that Laravel/PHP was decommissioned in ADR 0036 and Context Factory is dedicated exclusively to TypeScript (exit code 2 BLOCKED). |
| U-02 | Should `evals/cases/laravel-resolution.json` be deleted or replaced? | resolved | maintainer | no | Replace with a dedicated TypeScript resolution case to maintain evaluation count or remove and adjust total. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **Ready for grill:** yes
- **Context content hash:** sha256:91c82a040d838e8c7799a02860c3c3431199c272d90c30b3a77aa0658f6f0bde
