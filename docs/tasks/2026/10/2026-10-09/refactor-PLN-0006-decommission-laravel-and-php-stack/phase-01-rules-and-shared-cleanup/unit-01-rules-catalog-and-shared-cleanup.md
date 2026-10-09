---
title: "Purge Laravel Rules and Scrub Shared SOLID/Global Rules"
type: unit
parent: "phase-01-rules-and-shared-cleanup"
unit: "01.01"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, unit, rules]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Purge Laravel Rules and Scrub Shared SOLID/Global Rules

> Phase: phase-01-rules-and-shared-cleanup · Depends on: none · Parallelizable with: none
> Task branch: refactor/PLN-0006-decommission-laravel-and-php-stack · Base commit: d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6

## Objective

Delete all 23 active rule files under `rules/laravel/` and scrub PHP syntax, file globs, and dual-language snippets from shared rules under `rules/solid/` and `rules/global/` to leave the rule catalog 100% focused on TypeScript.

## Context packet

- 23 active rules exist under `rules/laravel/` across 8 subdirectories: `anti-patterns/`, `application/`, `common/`, `database/`, `foundation/`, `http/`, `presentation/`, and `security/`.
- ADR 0036 establishes that Context Factory decommissions Laravel/PHP to focus exclusively on the TypeScript ecosystem.
- `rules/solid/` currently specifies `appliesTo: ["**/*.ts", "**/*.tsx", "**/*.php", "**/*.dart"]` and contains dual PHP/TypeScript code snippets.
- `rules/global/` rules currently specify `appliesTo` including `"**/*.php"`.
- Serves Acceptance Criteria AC-01 and AC-02.

<language_rules>
- [directive:cf.quality.delete-dead-code][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.quality.minimal-complete-change][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.arch.adrs][mode:evidence-blocking] rules/global/architecture-conformance.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` exactly matches `refactor/PLN-0006-decommission-laravel-and-php-stack`; stop if detached or mismatched.
- ADR 0036 and discovery brief are committed on base.

## Scope

**In scope:**
- `orchestrator/rules/descriptor-parser.mjs`
- `rules/laravel/`
- `rules/solid/single-responsibility.md`
- `rules/solid/open-closed.md`
- `rules/solid/liskov-substitution.md`
- `rules/solid/interface-segregation.md`
- `rules/solid/dependency-inversion.md`
- `rules/global/architecture-conformance.md`
- `rules/global/evidence-and-claims.md`
- `rules/global/naming-conventions.md`
- `rules/global/security-guardrails.md`
- `rules/global/code-quality.md`

**Out of scope:**
- `orchestrator/conformance/adapters/laravel.mjs` (handled in Unit 02.01)
- `evals/` test fixtures and suites (handled in Unit 03.01)
- `context-manifest.json` and lockfile (handled in Unit 04.01)

## Steps

1. Delete all 23 files and directories under `rules/laravel/`:
   - `rules/laravel/anti-patterns/` (3 files)
   - `rules/laravel/application/` (2 files)
   - `rules/laravel/common/` (3 files)
   - `rules/laravel/database/` (5 files)
   - `rules/laravel/foundation/` (2 files)
   - `rules/laravel/http/` (3 files)
   - `rules/laravel/presentation/` (2 files)
   - `rules/laravel/security/` (3 files)
2. Update all 5 rules in `rules/solid/`:
   - Remove `"**/*.php"` and `"**/*.dart"` from `appliesTo` frontmatter, retaining `["**/*.ts", "**/*.tsx"]`.
   - In `single-responsibility.md`: replace any PHP snippets and references with pure TypeScript and React patterns.
   - In `open-closed.md`: replace any PHP snippets with TypeScript polymorphic strategy patterns.
   - In `liskov-substitution.md`: ensure contract examples use TypeScript interfaces and substitutable implementations.
   - In `interface-segregation.md`: ensure fine-grained interface examples use TypeScript interfaces and React props.
   - In `dependency-inversion.md`: ensure dependency injection examples use TypeScript port interfaces, class constructors, and React Context.
3. Update `rules/global/` rules:
   - In `architecture-conformance.md`, `evidence-and-claims.md`, `naming-conventions.md`, `security-guardrails.md`, and `code-quality.md`: remove `"**/*.php"` and `"**/*.dart"` from `appliesTo`.
4. Run `node scripts/context.mjs lint` to verify catalog descriptors and markdown syntax pass without errors.

## Verification

- **Automated Tests:**
  - Test type(s): architecture & contract check — validates that no PHP rules remain in the catalog and that all shared rules are pure TypeScript without syntax or glob defects.
  - Cases: rule catalog parsing has 0 PHP rules; `rules/laravel/` directory no longer exists; shared rules parse with valid frontmatter.
  - Commands: `node scripts/context.mjs lint`
- **Conformance Gate:**
  - Command: `context-cli conform --scope rules/solid/ rules/global/ --out .context-runs/PLN-0006-U0101/conformance-report.json`
  - Conformance Report: `[report.id]` (Verdict: PASS)

## Rollback

- Restore deleted `rules/laravel/` files and revert changes to `rules/solid/` and `rules/global/` via `git checkout HEAD -- rules/`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01, AC-02
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
- [ ] Conformance report passes (PASS) with zero blocking violations
