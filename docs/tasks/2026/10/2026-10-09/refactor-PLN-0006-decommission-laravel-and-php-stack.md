---
title: "Decommission Laravel and PHP Stack"
type: task
status: planned
plan_contract_version: 3
plan_id: "PLN-0006"
created: "2026-10-09"
tags: [task, refactor, typescript-focus]
target_branch: "master"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
discovery_brief: "../../../../../discovery/decommission-laravel-php/brief.md"
---

# Decommission Laravel and PHP Stack

## Outcome

Completely decommission and remove all Laravel and PHP rules, conformance adapters, evaluation fixtures, and test suites from Context Factory. Context Factory becomes dedicated 100% exclusively to the TypeScript ecosystem (React, Next.js, SolidJS, Node.js ESM). Explicit invocations of `--stack laravel` will fail-closed with exit code 2 (BLOCKED) citing ADR 0036.

## Pre-planning record

### Actors and goals

- **TypeScript Developer:** Relies on Context Factory to deliver high-quality, strict TypeScript rules and conformance without interference from unused PHP tooling.
- **CI/CD Pipeline:** Enforces automated-blocking gates across TypeScript projects and fails closed if legacy or decommissioned stacks are requested.
- **AI Coding Agent:** Resolves directives and generates pure TypeScript without dual-stack noise or PHP examples.
- **Context Factory Maintainer:** Maintains a streamlined, coherent single-ecosystem codebase with zero dangling manifest references or orphaned fixtures.

### Domain language

- **Decommissioned Stack:** A language stack formerly supported by Context Factory that has been formally retired via an accepted Architectural Decision Record (ADR 0036).
- **Fail-Closed Diagnostic:** An intentional, fatal CLI diagnostic response (exit code 2 `BLOCKED`) when a caller explicitly asks for a decommissioned or unsupported stack.
- **Single-Stack Conformance:** Context Factory operating solely with first-class TypeScript compiler, linter, and runtime conformance verification.

### Language stack and applicable rules

- **Declared Stack:** `typescript`
- **Rule Binding ID & Hash:** `binding-PLN-0006` (`sha256:d98e20e59fbe3b8b94e0498618d08a7d4d049a5ef53cfee38fd44c5bedcf3311`)
- **Active Directives:**

| Directive ID | Mode | Rule Path | Verifier |
|---|---|---|---|
| `cf.quality.delete-dead-code` | evidence-blocking | `rules/global/code-quality.md` | `human-evidence` |
| `cf.quality.minimal-complete-change` | evidence-blocking | `rules/global/code-quality.md` | `human-evidence` |
| `cf.arch.contracts` | evidence-blocking | `rules/global/architecture-conformance.md` | `human-evidence` |
| `cf.evidence.integrity` | evidence-blocking | `rules/global/evidence-and-claims.md` | `human-evidence` |

- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S-01 | Agent resolves context for backend task | Laravel decommissioned | Resolver selects pure TypeScript rules; 0 PHP rules exist | If PHP rules selected, fail plan check | planned |
| S-02 | Developer or CI runs `conform --stack laravel` | Laravel adapter removed | CLI emits informative BLOCKED diagnostic (exit code 2) citing ADR 0036 | If exit code != 2, fail regression test | planned |
| S-03 | Maintainer runs `doctor` | Single-stack TypeScript | Doctor checks report `Adapters: typescript (ready) | Stacks: none unsupported` and 100% HEALTHY | If doctor warns or fails, manifest sync required | planned |
| S-04 | Developer inspects shared SOLID rules | PHP scrubbed | Code snippets demonstrate TypeScript and React patterns exclusively | If PHP syntax remains, lint fails | planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | How should CLI handle explicit `--stack laravel` calls? | Emit informative exit 2 (BLOCKED) explaining Laravel was decommissioned in ADR 0036 | Explicit user decision during grill discovery; prevents silent fallback or confusing generic failures | Silent fallback to TypeScript, generic unknown stack error | ADR 0036, Discovery Q-01 |
| D-02 | What happens to closed historical task plans mentioning Laravel? | Keep historical tasks intact as immutable historical records | Factory invariant: historical plans under `docs/tasks/2026/09/` are audit logs | Rewriting historical plans or deleting past completed tasks | ADR 0036 |
| D-03 | How should shared rules (`rules/global/`, `rules/solid/`) be updated? | Remove PHP language identifiers from `appliesTo` and replace dual PHP snippets with pure TypeScript | Ensures factory is focused exclusively on TypeScript without confusing mixed examples | Keeping dual PHP snippets in shared rules | ADR 0036 |

## Unknowns and blockers

- None. All architectural decisions (ADR 0036) and user requirements (Discovery Q-01 fail-closed exit code 2) are resolved and recorded.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | R-01, S-01, ADR 0036 | All 23 active rule files under `rules/laravel/` are removed, leaving 0 PHP rules in the catalog | Unit 01.01 | `node scripts/context.mjs lint` | planned |
| AC-02 | R-09, S-04, ADR 0036 | Shared rules under `rules/solid/` and `rules/global/` are scrubbed of PHP syntax and examples | Unit 01.01 | `npm run lint` | planned |
| AC-03 | R-02, R-03, ADR 0036 | `orchestrator/conformance/adapters/laravel.mjs` is deleted and unregistered from CLI commands | Unit 02.01 | `node scripts/context.mjs doctor` | planned |
| AC-04 | R-04, R-05, S-02, Q-01 | Explicit `--stack laravel` invocation in CLI exits code 2 (BLOCKED) with diagnostic citing ADR 0036 | Unit 02.01 | `node scripts/context.mjs conform --stack laravel` | planned |
| AC-05 | R-06, R-07, R-08, ADR 0036 | Laravel test files and fixtures deleted, and evaluation case replaced with TypeScript backend case | Unit 03.01 | `npm test` | planned |
| AC-06 | S-02, Q-01, ADR 0036 | Regression tests verify fail-closed diagnostic and exit code 2 for decommissioned Laravel stack | Unit 03.01 | `node --test evals/tests/conformance/decommissioned-stack.test.mjs` | planned |
| AC-07 | R-10, S-03, ADR 0036 | Manifest and lockfile re-indexed with zero dangling entries, achieving 100% HEALTHY doctor | Unit 04.01 | `node scripts/context.mjs doctor` | planned |

## Scope

**In scope:**
- Purging all 23 files in `rules/laravel/`
- Scrubbing PHP references and code snippets from `rules/solid/` and `rules/global/`
- Deleting `orchestrator/conformance/adapters/laravel.mjs`
- Updating CLI commands `conform.mjs` and `doctor.mjs` to unregister Laravel and handle decommissioned stack diagnostics
- Updating `scripts/context-core.mjs` stack inference
- Deleting `evals/fixtures/laravel-conformance/` and Laravel test suites
- Replacing `evals/cases/laravel-resolution.json` with TypeScript case
- Adding regression test for `--stack laravel` exit 2 BLOCKED
- Synchronizing `context-manifest.json` and `context-lock.json`

**Out of scope:**
- Modifying closed historical plans under `docs/tasks/2026/09/`
- Adding third-party npm dependencies to core
- Modifying any TypeScript rules or TypeScript conformance logic

## Non-goals

- Supporting legacy PHP projects or backward-compatible artisan commands in new tasks
- Removing TypeScript web or backend rules

## Constraints and decisions

- Zero runtime npm dependencies in Context Factory core.
- Strict single task branch: `refactor/PLN-0006-decommission-laravel-and-php-stack`.
- Fail-closed execution when an unsupported or decommissioned stack is explicitly targeted.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
|---|---|---|
| Dangling references in manifest | Doctor fails lockfile/manifest validation | Unit 04.01 scrubs deleted paths and re-generates lockfile |
| Broken relative imports in evaluation suite | npm test fails during suite run | Unit 03.01 deletes or updates all test files referencing Laravel adapter |
| Accidental removal of core TypeScript features | Regression in existing TypeScript workflows | Unit 02.01 preserves all TypeScript adapter logic and runs existing tests |

## Task branch

| Field | Recorded decision |
|---|---|
| Target branch | `master` |
| Task branch | `refactor/PLN-0006-decommission-laravel-and-php-stack` |
| Base commit | `d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6` |

## Phases

- [ ] `phase-01-rules-and-shared-cleanup/phase.md` — Phase 1: Rule Catalog and Shared Rules Cleanup
- [ ] `phase-02-adapters-and-orchestrator/phase.md` — Phase 2: Adapter and Conformance Engine Decommissioning
- [ ] `phase-03-evals-fixtures-and-tests/phase.md` — Phase 3: Evals, Fixtures, and Test Suite Modernization
- [ ] `phase-04-manifest-sync-and-doctor-verification/phase.md` — Phase 4: Manifest Synchronization, Lockfile Pinning, and Final Conformance

## Verification

- `node scripts/context.mjs lint` — Verifies catalog and Markdown rules syntax (AC-01, AC-02)
- `node scripts/context.mjs conform --stack laravel` — Verifies exit code 2 and informative diagnostic (AC-04)
- `npm test` — Verifies full test suite passes without Laravel dependencies (AC-05, AC-06)
- `node scripts/context.mjs doctor` — Verifies single-stack healthy status and lockfile integrity (AC-03, AC-07)

## Deviations

None.

## Plan done-check

- [x] Acceptance criteria map to units and verification commands.
- [x] Blockers are resolved or absent.
- [x] Risk and dependency register is populated with mitigations.
- [x] Task branch and target base are verified on clean git checkout.

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Conformance Report | Verification Command |
|---|---|---|---|---|
| Phase 01 Verification | `refactor/PLN-0006-decommission-laravel-and-php-stack` | pending | pending | `npm run lint` |
| Phase 02 Verification | `refactor/PLN-0006-decommission-laravel-and-php-stack` | pending | pending | `node scripts/context.mjs doctor` |
| Phase 03 Verification | `refactor/PLN-0006-decommission-laravel-and-php-stack` | pending | pending | `npm test` |
| Phase 04 Verification | `refactor/PLN-0006-decommission-laravel-and-php-stack` | pending | pending | `node scripts/context.mjs doctor` |
| Task Finalization | `refactor/PLN-0006-decommission-laravel-and-php-stack` to `master` | pending | pending | `node scripts/context.mjs doctor` |
