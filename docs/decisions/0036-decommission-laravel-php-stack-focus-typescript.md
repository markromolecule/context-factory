---
title: Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem
type: decision
status: accepted
created: "2026-10-09"
tags: [adr, refactor, architecture, typescript, laravel, decommissioning]
---

# 0036 — Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem

## Context

Context Factory previously supported a dual-ecosystem model under ADR 0021, ADR 0022, and ADR 0023, maintaining an active Laravel/PHP stack alongside its TypeScript stack. This included 23 specialized rule definitions (`rules/laravel/`), a dedicated conformance adapter (`orchestrator/conformance/adapters/laravel.mjs`), evaluation test cases (`evals/cases/laravel-resolution.json`), adapter test suites, and sample fixtures.

However, the primary strategic scope and operational focus of Context Factory is the modern TypeScript web and backend ecosystem (Next.js, SolidJS, React, Node.js ESM, and TypeScript-first APIs). Maintaining dual-stack rule catalogs and conformance adapters introduces several architectural drawbacks:
1. **Rule Catalog Bloat:** 23 Laravel rules inflate manifest size, rule descriptor indexing time, and lockfile maintenance.
2. **Context Dilution:** Generic prompts occasionally trigger PHP/Laravel rule suggestions due to overlapping keyword heuristics.
3. **Dual Conformance Maintenance:** Upkeep of the Laravel stack adapter and its test suites expends development bandwidth without providing value to TypeScript-focused workflows.
4. **Mixed Code Examples in Global Rules:** Shared SOLID and global rules contain dual PHP and TypeScript examples, complicating instruction clarity for agents.

## Options considered

1. **Retain Laravel as a Deprecated / Inactive Stack:** Keep the files in `rules/laravel/` but mark them `status: deprecated` or `status: archived` in frontmatter. Do not remove the adapter or tests.
   - *Pros:* Zero breaking changes for any hypothetical Laravel consumers.
   - *Cons:* Fails to solve catalog bloat, prompt dilution, or dual-stack maintenance burden. Retains dead weight in active inventory.
2. **Extract Laravel Stack to an External Plugin Repository:** Move `rules/laravel/`, the adapter, and its tests to an external git submodule or standalone plugin.
   - *Pros:* Preserves the code elsewhere if needed in the future.
   - *Cons:* Introduces repository federation complexity and maintenance overhead for an ecosystem the team does not actively use.
3. **Complete Decommissioning and Clean Removal (1-3-1 Recommended):** Remove all 23 `rules/laravel/` files, delete `orchestrator/conformance/adapters/laravel.mjs`, remove the adapter registration from CLI commands (`app/cli/commands/conform.mjs` and `doctor.mjs`), remove Laravel test suites and fixtures, scrub PHP examples from global and SOLID rules, and cleanly synchronize the manifest and lockfile. Any explicit request for `--stack laravel` fails fast as an unsupported stack per ADR 0029.
   - *Pros:* Cleanly purifies Context Factory to 100% TypeScript; eliminates all dead code; improves indexing performance and prompt relevance; zero ambiguity for coding agents.
   - *Cons:* Breaking change for any requests explicitly demanding Laravel rules (acceptable as this is the user's explicit objective).

## Decision

Adopt **Option 3**: Completely decommission and remove all Laravel and PHP implementations from Context Factory to dedicate the system exclusively to the TypeScript ecosystem.

1. **Rule Removal:** Delete all 23 markdown files under `rules/laravel/`.
2. **Adapter Removal:** Delete `orchestrator/conformance/adapters/laravel.mjs` and unregister it from CLI entrypoints (`app/cli/commands/conform.mjs` and `app/cli/commands/doctor.mjs`).
3. **Evaluations & Fixtures Removal:** Delete `evals/fixtures/laravel-conformance/`, `evals/tests/conformance/laravel-adapter.test.mjs`, `evals/tests/rules/unit-06-02-laravel-http-application.test.mjs`, and `evals/tests/rules/unit-06-03-laravel-data-security.test.mjs`. Replace `evals/cases/laravel-resolution.json` with an equivalent TypeScript evaluation test case or remove it.
4. **Scrubbing Shared Rules:** Clean all PHP code snippets from `rules/global/` and `rules/solid/`, replacing them with idiomatic TypeScript equivalents.
5. **Historical Integrity:** Mark ADR 0022 and ADR 0023 as `status: superseded` with a reference to ADR 0036. Leave closed historical task directories under `docs/tasks/2026/09/` intact as immutable git history.
6. **Fail-Closed Unsupported Stack:** If `--stack laravel` is requested, the system reports `UNSUPPORTED_STACK`, halting execution per ADR 0029.

## Consequences

- Context Factory becomes a pure, specialized, high-assurance TypeScript knowledge and conformance factory.
- Prompt indexing and compilation speed improve with reduced rule volume.
- All coding agent instructions, skills, workflows, and evaluation datasets align exclusively with TypeScript best practices.
- Supersedes ADR 0022 and ADR 0023.
- Reversibility: If multi-language support is ever re-introduced, it will be designed via an isolated external plugin architecture rather than monorepo rule mixing.

## Validation and review date

Review on changes to supported stack architectures. Validated by `npm test`, `npm run lint`, and `node scripts/context.mjs doctor`.
