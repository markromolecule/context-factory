---
title: "Laravel Common Rules and Artisan Standards"
type: task
status: completed
created: "2026-09-18"
tags: [task, rules, laravel, common, artisan, naming-conventions]
---

# Laravel Common Rules and Artisan Standards

## Outcome

Add a dedicated, comprehensive `rules/laravel/common/` ruleset to Context Factory containing:
1. `rules/laravel/common/naming-conventions.md`: Complete, authoritative naming standards across all Laravel components (Models, Tables, Pivots, Keys, Relations, Controllers, Requests, Resources, Policies, Events, Listeners, Jobs, Mailables, Notifications, Enums, Routes, Artisan commands, Blade components, Config).
2. `rules/laravel/common/artisan-commands.md`: CLI discipline covering signatures, argument/option conventions (`--force`, `--dry-run`), safe production execution, memory-safe streaming (`chunkById`, `cursor()`, `DB::disableQueryLog()`), progress bars, action/job delegation, and standard exit codes.
3. `rules/laravel/common/project-structure.md`: Modular domain architecture (`app/Modules/<Domain>/`), dedicated component-first Blade frontend hierarchy (`resources/views/layouts/`, design-system `components/`, modular views), modern Laravel 11/12 lean `bootstrap/app.php` bootstrapping, and configuration hygiene.
4. `rules/laravel/common/anti-patterns.md`: Exhaustive anti-patterns and bad habits guide (untyped arrays, N+1 query loops, mass assignment vulnerabilities, env caching failures, monolithic controllers) with synchronized cross-references across all Laravel rules.
5. Harmonization of the rule indexer (`app/cli/core/indexer.mjs`), `context-manifest.json`, `docs/Rules.md`, and `context-lock.json` with zero doctor diagnostic errors.

## Pre-planning record

- **Context Specification:** [[docs/context/rules/laravel-common-and-artisan-standards|Laravel Common Conventions and Artisan Standards Specification]]
- **Governing Decisions:** [[docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards|ADR 0022]]

### Actors and goals

- **Laravel Application Developers:** Need predictable conventions and CLI safety standards so code is idiomatic, maintainable, and safe in production.
- **AI Coding Agents:** Need deterministic, machine-enforceable rules to generate consistent names, skinny commands, and lean Laravel 11/12 structure without hallucinating ad-hoc patterns.
- **Factory Maintainers:** Require clean symmetry between TypeScript and Laravel rule taxonomies and passing diagnostic health checks.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Developer creates multi-word model and pivot table | Laravel stack declared | Model `OrderItem`, table `order_items`, pivot `course_student` follow exact casing | Flag irregular plurals or non-alphabetical pivots | Planned |
| SC-02 | Developer generates Artisan command processing 100k records | Batch data processing task | Command uses `chunkById()` with `$this->withProgressBar()` and `DB::disableQueryLog()` | Reject unbounded `->get()` causing OOM crashes | Planned |
| SC-03 | Command mutates production data | Production environment | Command prompts `$this->confirmToProceed()` unless `--force` is passed | Command aborts execution safely if unconfirmed | Planned |
| SC-04 | Developer passes untyped array or un-eager-loaded relation | Code development | Flagged as anti-pattern; recommend typed DTO / `with('relation')` | Remediated via `anti-patterns.md` | Planned |
| SC-05 | Context Factory doctor diagnostic run | New rules added | `node scripts/context.mjs doctor` passes with zero lint, lock, or evaluation errors | Auto-repair or regenerate lock via `npm run lock` | Planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D1 | Directory taxonomy for common Laravel rules | Create `rules/laravel/common/` | Matches `rules/typescript/common/` symmetry and user preference | Merging into `foundation/` (too crowded; mixes core PHP syntax with Laravel component naming) | ADR 0022 |
| D2 | Standalone Artisan command rule vs bundled | Dedicated `artisan-commands.md` | Artisan commands are a primary application entry point with unique memory, safety, and streaming concerns | Bundling into `conventions.md` (dilutes CLI memory and production safety standards) | Context Spec |
| D3 | Modular architecture and Blade frontend structure | Modular `app/Modules/` and 3-tier `resources/views/` | User requirement for maintainability, scaling, and frontend Blade focus | Flat global MVC structure | `project-structure.md` |
| D4 | Dedicated Anti-Patterns and Bad Habits rule | Author `anti-patterns.md` | High-impact defensive guide addressing top failure modes (untyped arrays, N+1, mass assignment, env cache, monolithic controllers) | Scattering across individual rules without a central checklist | `anti-patterns.md` |

### Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | SC-01 / D1 | Exhaustive naming conventions rule authored | `rules/laravel/common/naming-conventions.md` | Rule inspection & schema validation | Completed |
| AC-02 | SC-02, SC-03 / D2 | Dedicated Artisan command standards rule authored | `rules/laravel/common/artisan-commands.md` | Rule inspection & schema validation | Completed |
| AC-03 | D3 | Modular architecture and Blade frontend rule authored | `rules/laravel/common/project-structure.md` | Rule inspection & schema validation | Completed |
| AC-04 | SC-04 / D4 | Anti-patterns and bad habits guide authored and synchronized | `rules/laravel/common/anti-patterns.md` | Rule inspection & cross-reference verification | Completed |
| AC-05 | SC-05 | Indexer supports `laravelCommon` and regenerates MOCs | `app/cli/core/indexer.mjs` updated | `node scripts/context.mjs lock` succeeds | Completed |
| AC-06 | SC-05 | Factory health diagnostic passes completely | All manifest, lock, and symlink checks pass | `node scripts/context.mjs doctor` returns HEALTHY | Completed |

## Scope

- Create `rules/laravel/common/naming-conventions.md`
- Create `rules/laravel/common/artisan-commands.md`
- Create `rules/laravel/common/project-structure.md`
- Create `rules/laravel/common/anti-patterns.md`
- Synchronize cross-references across `foundation/conventions.md`, `database/query-optimization.md`, `http/requests-and-validation.md`, `application/business-logic-and-actions.md`
- Update `app/cli/core/indexer.mjs` with `laravelCommon` group
- Regenerate `context-manifest.json`, `docs/Rules.md`, and `context-lock.json`
- Verify context health with `node scripts/context.mjs doctor`

## Non-goals

- Modifying existing TypeScript rules
- Rewriting existing Laravel domain rules (`eloquent-and-models.md`, `requests-and-validation.md`)
- Authoring application-level PHP source code

## Constraints and decisions

- Require strict frontmatter with `alwaysApply: true`, `name`, `description`, and `scope` on all new rules.
- Maintain compatibility with `context.mjs resolve` scoring and multi-language stack selection.

## Phases

- [x] `phase-01-discovery-and-scenarios.md` — Phase 1 — Specification Review and Architecture Alignment
- [x] `phase-02-architecture-and-contracts.md` — Phase 2 — Authoring Common Rules (Naming, Artisan, Structure)
- [x] `phase-03-implementation-and-tests.md` — Phase 3 — Indexer Update and MOC Synchronization
- [x] `phase-04-verification-and-release.md` — Phase 4 — Context Validation, Lock Synchronization, and Doctor Verification

## Verification

- `node app/cli/bin/context-cli.mjs sync`: Discovered all 54 rules, updated `docs/Rules.md` with `### Common`, regenerated `context-manifest.json` and `context-lock.json`.
- `node scripts/harness-cli.mjs lint`: PASS — All 54 rules, 12 skills, 12 workflows, and wikilinks validated.
- `node app/cli/bin/context-cli.mjs resolve "create laravel naming conventions and artisan commands" --stack laravel`: Resolved 26 rules including all 4 common rules with zero TypeScript leakage.
- `node scripts/context.mjs doctor`: PASS (All 4 checks passed, HEALTHY status).

## Result

Successfully authored and integrated `rules/laravel/common/` containing `naming-conventions.md`, `artisan-commands.md`, `project-structure.md`, and `anti-patterns.md`. All rules are indexed in `docs/Rules.md` under `## Laravel -> ### Common` and verified with 100% passing health checks.
