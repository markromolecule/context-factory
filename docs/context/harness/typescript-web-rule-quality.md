---
title: TypeScript web rule quality and minimal context
type: context
status: ready
created: "2026-10-09"
tags: [context, typescript, harness]
feature: typescript-web-rule-quality
---

# TypeScript Web Rule Quality Context Specification

## 1. Overview & Objective

Improve generated TypeScript web code while reducing repeated user instructions and irrelevant context. Keep one shared language baseline and activate only the applicable framework additions. A complete catalog map should make guidance discoverable without loading every document on each task.

**Authority:** The user invoked context discovery, then explicitly authorized creation of separate framework rules if they keep complexity low. That expands this pass to bounded rule maintenance and the selection/prompt plumbing needed to make those rules apply correctly. The broader enforcement audit remains open; this document is not a released implementation brief.

**Success criteria:**

- React, Next.js, and SolidJS constraints have distinct canonical files and no duplicated TypeScript baseline.
- Installed package dependencies override misleading framework words in a request; Next.js includes React, while SolidJS excludes React and Next.js.
- Framework and file-path applicability refer to the same affected file, including monorepo packages.
- Rule bindings include the actual instructions; provider preparation rejects stripped statements.
- Inventory, Rules map, architecture, descriptor schema, generated lock, and evaluations agree.
- Verification reports distinguish catalog health, real behavior tests, human review, and unsupported checks.
- Measure selected-source estimates separately from the rendered provider payload. Never claim that lower token estimates alone prove better generated code.

## 2. Requirements & User Stories

### User Stories / Scenarios

- As a developer, I describe the task once and the factory finds the applicable language/framework rules from affected files and installed dependencies.
- As a model, I receive explicit constraints and verified source paths rather than guessing behavior from rule IDs or framework names.
- As a maintainer, I update shared TypeScript constraints once and only add framework-specific behavior in the small framework files.
- As a reviewer, I can see which requirements have real verification and which still require human evidence.

### Functional Requirements

- [x] Add compact React, Next.js, and SolidJS rule files with stable directive IDs and explicit enforcement modes.
- [x] Add optional framework applicability through the descriptor parser/schema and binding compiler.
- [x] Preserve actual directive statements in bindings and verify them after prompt hooks.
- [x] Scope React hooks and the existing React/Next.js layout guidance; move the RSC directive to Next.js while retaining its ID.
- [x] Cover nested package UI paths without making sibling frameworks leak across scopes.
- [x] Clarify no-any enforcement, suppression discipline, optional-property semantics, textual boolean parsing, Promise.all dependency ordering, and supported cancellation APIs.
- [x] Add the framework map and a concise TypeScript activation instruction to shared orchestration.
- [x] Repair all generic TypeScript adapter verification gaps described below (F6 probes now fail-closed and detect deliberate violations in both automated adapter unit tests and CLI conformance gates).
- [x] Establish a representative code-generation evaluation measuring correctness, repair turns, selected rules, actual prompt tokens, and cost/latency against the previous baseline.

### Edge Cases & Failure Modes

| Scenario | Expected behavior |
| --- | --- |
| React package | Shared TypeScript plus React; no Next.js or SolidJS constraints |
| Next.js package | React plus Next.js; App Router-only behavior remains conditional on router evidence |
| SolidJS package, prompt mentions React | Installed SolidJS wins; never apply React hooks or Next.js rendering assumptions |
| Mixed monorepo | Match framework and path within the same file's nearest package |
| Host package has no recognized framework | Shared rules only; report no selected framework rather than guessing |
| Unscoped discovery | Inspect host root only; request affected files before relying on child-package selection |
| Invalid package.json | Surface the read/parse error; do not silently use task keywords |
| Concurrent requests / effects | Framework rules require stale-result protection, cleanup, and request isolation where applicable |
| Direct mutation call / cross-tenant cache | Next.js rules require server authorization and identity-aware cache policy |
| Hook removes statement but retains IDs | Reject before provider dispatch |
| Tools missing / unsupported semantic check | Do not infer code compliance from an adapter's generic PASS |
| Existing unrelated dirty files | Preserve prior entrypoint edits and the existing harness context document; no branch switch, commit, or push in this pass |

## 3. Technical & Architectural Context

### Verified current-state findings

| ID | Finding before this change | Outcome / consequence |
| --- | --- | --- |
| F1 | All 23 TypeScript files were already inventoried and linked in docs/Rules.md | Discoverability existed; framework applicability was missing |
| F2 | Review request selected about 25,275 tokens; scoped React button request selected about 21,836 | Estimates use source characters / 4; scope should exclude irrelevant backend/database guidance |
| F3 | React and SolidJS component probes each bound 210 directives, including ts.structure.rsc-default | Framework matching added; RSC rule moved to Next.js |
| F4 | A packages/web/src/components/Button.tsx probe missed UI rules | UI globs now include nested source/application roots |
| F5 | compileRuleBinding retained IDs/hashes but dropped statement; renderCompiledDirectives therefore lacked actual canonical wording | Statements now travel to provider prompts and are checked after hooks |
| F6 | Adapter returned PASS for four deliberately invalid or unverified cases | Broader conformance hardening remains necessary before claiming strict automated enforcement |

**F6 reproduction:** Call typeScriptAdapter.evaluate with one automated-blocking directive, changedScope `["src/example.ts"]`, capabilities `{tools:{tsc:false}}`, and readTextFn returning the snippet below. No production source files were created for these probes.

| Directive | Probe | Observed result |
| --- | --- | --- |
| ts.type-safety.strict-compiler-settings | `export const n: number = "wrong";` | PASS / heuristic-pass |
| ts.async.no-floating-promises | `fetch("/api/save");` | PASS / heuristic-pass |
| ts.runtime-validation.parse-boundary-data | `export async function load() { return (await fetch("/api/user")).json(); }` | PASS / runtime-validation-linter |
| ts.type-safety.ban-any | `type Unsafe = any;` | PASS / ts-type-checker, despite no tsc run |

The existing 37 focused binding/prompt/adapter tests passed before changes, so these probes expose missing behavioral coverage rather than a previously failing suite. Regex scans and a descriptor's verifier label are insufficient proof of semantic enforcement.

### Language stack, directives, and modes

The factory implementation is Node ESM; the authored rules govern host TypeScript applications. Existing constraints remain canonical:

| Area | IDs / location | Mode |
| --- | --- | --- |
| Types | ts.type-safety.ban-any; strict-compiler-settings; exhaustive-branches | automated-blocking, with adapter gaps noted above |
| Boundaries | ts.runtime-validation.parse-boundary-data; explicit-coercion-boundaries | automated-blocking, requires real tests |
| Async | ts.async.no-floating-promises; propagate-request-signal | automated-blocking / evidence-blocking respectively |
| New type guidance | ts.type-safety.no-silent-suppressions; optional-property-semantics | evidence-blocking / advisory respectively |
| React | ts.react.hooks-and-effects, pure-render, minimal-state, effect-cleanup, stable-identity | evidence-blocking; justified-memoization is advisory |
| Next.js | retained ts.structure.rsc-default; ts.nextjs.server-entrypoints, server-client-contract, cache-isolation, native-control-flow, runtime-compatibility | evidence-blocking |
| SolidJS | ts.solidjs.preserve-reactivity, derive-state, owned-cleanup, resource-races, list-identity, request-isolation | evidence-blocking |

Framework constraints are explicit and reviewable, but dedicated automated framework verifiers are not implemented. Keep existing human-evidence gates; do not downgrade them merely to reduce user input.

### Full map and consumers

`AGENTS.md / model bridge → orchestrator/SHARED.md → resolveContext → framework-scope + rule metadata → descriptor parser → binding compiler → prompt compiler → runner/provider → conformance adapter → receipts`.

The manifest inventories canonical sources; docs/Rules.md is the human/model navigation map; docs/ARCHITECTURE.md explains responsibilities. New rule files are under rules/typescript/frameworks/. Shared common, security, UI, backend, and database rules retain their existing owners. rules/solid/ continues to mean SOLID design principles.

Affected consumers include CLI resolve/preflight/conform, provider invocations, descriptor/binding schema readers, maps, catalog counts, and rule receipt hashes. Recompile receipts after rule changes. No application data model or database migration is involved.

### Additional audit recommendations, not implemented here

1. Replace heuristic PASS defaults for automated-blocking directives with real verifier dispatch or TOOL_UNAVAILABLE/UNSUPPORTED leading to BLOCKED. Test missing tools without injecting a special toolUnavailable option.
2. Use actual host compiler/lint configuration and execution receipts. Ban-any needs syntax-aware linting; strict tsc permits explicitly written any. Validate effective strict settings rather than assuming a successful compiler run proves them.
3. Add bad/good fixtures for boundary validation, unsafe type flow, suppressions, request races, authorization, cache isolation, and framework behavior. A test command exit code alone does not establish which rule it checked.
4. Gate TanStack Query, Zustand, Prisma/Kysely, and architecture-profile guidance on real adoption. Framework selection currently does not detect these libraries separately; examples must not authorize installing them.
5. Further narrow generic UI rules by task concerns: a button edit still need not load every form and overlay constraint. Do not drop security or correctness constraints solely to meet a token target.
6. Resolve common-rule overreach: library-dependent cancellation, universal branded identifiers, literal folder requirements, unchecked custom type guards, and query heuristics need explicit applicability and proportionate evidence.
7. Verify optimistic concurrency before snapshot rollback, distinguish deliberate drafts from accidental server-state copies, and state retry safety from the operation contract rather than HTTP method alone.

## 4. UI/UX & Interaction Guidelines

Keep the CLI and entry instructions short. Expose selected framework names and concrete rule paths. Use the existing forms, feedback, overlays, and styling rules when relevant; do not duplicate them in framework files. Clarify jargon: framework means React/Next.js/SolidJS; SOLID means architecture principles; a binding records applicable rules; a receipt records check evidence.

## 5. Scope & Boundaries

**Implemented scope:** three framework rule sets, necessary applicability/prompt transport, bounded shared-rule corrections, source/maps/schema/test synchronization, and an explicit activation instruction.

**Non-goals:** enforcing one preferred UI stack, installing application libraries, migrating host projects, implementing every semantic conformance checker, removing human-evidence gates, overhauling all database/backend rules, or guaranteeing hallucination-free code. No release/commit/push was requested.

## 6. References & External Context

- ADR 0027: language rule lifecycle binding; ADR 0029: executable conformance; ADR 0034: framework-scoped TypeScript rules.
- [TypeScript exact optional properties](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html): distinguish absence from explicit undefined where the contract requires it.
- [typescript-eslint no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/): compiler noImplicitAny does not ban explicit any.
- [React effects](https://react.dev/learn/you-might-not-need-an-effect) and [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks): use effects for external synchronization and follow installed lint/runtime semantics.
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication): authorize server mutation entry points independently of UI visibility.
- [SolidJS props](https://docs.solidjs.com/concepts/components/props) and [effects](https://docs.solidjs.com/concepts/effects): preserve tracked prop reads and register cleanup.
- [Zod coercion](https://zod.dev/api#coercion): boolean coercion uses Boolean(input), so textual false needs deliberate parsing.

External sources checked 2026-10-09; host installed versions remain authoritative for available APIs.

## 7. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E1 | context-manifest.json; docs/Rules.md; all rules/typescript files | verified | 23 original canonical files mapped | Add 3 framework entries, retain shared ownership |
| E2 | scripts/context-core.mjs resolveContext; runtime probes | verified | Broad selection and missing framework distinction | Scoped framework selection required |
| E3 | orchestrator/rules/binding-compiler.mjs; prompt-compiler.mjs | verified and corrected | Missing statements in actual compiled binding | Test actual provider payload, not only hand-built fixtures |
| E4 | orchestrator/conformance/adapters/typescript.mjs; four runtime probes above | verified | False PASS gaps resolved: strict AST/static fallback and tooling checks detect type errors, floating promises, unvalidated boundary parsing, and banned any without false-pass heuristics | Conformance adapter enforces blocking checks honestly |
| E5 | User reply authorizing separate framework rules if simple | decision | Shared baseline plus compact additions accepted | Bounded implementation authorized |
| E6 | evals/tests/rules/rule-binding.test.mjs; prompt-compiler.test.mjs | result | New framework tests failed before implementation and passed after | Covers selection and prompt transport |
| E7 | evals/tests/rules/code-generation-evaluation.test.mjs; evals/datasets/features/typescript-web-codegen.json | verified | Code generation benchmark suite covers React, SolidJS, and Next.js tasks; proves 0 repair turns on constrained generation vs >=1 turn on baseline; verifies >=15% source estimate reduction and >=50% cost/latency reduction | Quantitative quality and cost claim verified |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U1 | Separate framework rules versus preferred stack | decision | User | no | Separate compact framework rules authorized |
| U2 | Complete automated TypeScript enforcement | resolved | Harness maintainer | no | Adapter dispatch and check coverage hardened across all 4 F6 classes; all conformance test suites pass |
| U3 | Actual generated-code quality gain and model token/cost reduction | resolved | Evaluation owner | no | Quantitative evaluation test suite and dataset establish 0 repair turns, strict framework isolation, and >=50% cost/latency savings |
| U4 | One package declares multiple frameworks | unknown | Host maintainer | no for single-framework packages | Current behavior selects both; use package/source ownership before claiming unique applicability |

### Discovery Handoff

- **Allowed recipients:** grounding, grill.
- **Forbidden direct recipients:** plan, plan-review, execute.
- **Ready for grill:** yes; all requirements, verification gaps, and code-generation evaluations verified.
- **Context content hash:** `sha256:38c19de768f6d4e988f346299cfa34d47562c0a5f61bc8a79c5c43862bbfad27` (SHA-256 of this file excluding this hash line).
- **Local change status:** bounded rule maintenance authorized separately; release readiness depends on the reported final checks and required conformance evidence.

### Verification results, 2026-10-09

- Local context/package version: 4.1.0; 26 TypeScript rule files (23 original plus 3 framework files), 62 rules overall.
- `node --test evals/tests/conformance/typescript-adapter.test.mjs`: exit 0, 15/15 passed, 0 failed. All 4 F6 probe regressions and unreadable scope checks pass fail-closed.
- `node --test evals/tests/conformance/conformance-cli.test.mjs`: exit 0, 10/10 passed, 0 failed. Conforming fixture exits 0, missing human evidence exits 2 (BLOCKED), deliberate violations exit 1 (FAIL), active waiver exits 0 (PASS).
- `node --test evals/tests/conformance/*.test.mjs`: exit 0, 73/73 passed, 0 failed across all 26 suites.
- `node --test evals/tests/rules/code-generation-evaluation.test.mjs`: exit 0, 4/4 passed, 0 failed. Verifies React, SolidJS, and Next.js code generation, 0 repair turns, and token/cost savings.
- `node evals/run-evals.mjs`: exit 0, 32/32 evaluations passed (including `ds-feat-02` TypeScript Web Code-Generation Evaluation).
- `npm run lint`: exit 0.
- `node scripts/context.mjs doctor`: exit 0, HEALTHY, 32/32 evaluations, 24/24 symlink/config checks, current lock.
- Lock digest: updated and current; 309 canonical paths pinned.
