---
title: "Executable Rule Conformance Harness"
type: task
status: planned
created: "2026-10-06"
tags: [task, harness, rules, conformance, adapters, evidence]
target_branch: master
base_branch: "task/0001-executable-rule-conformance-harness"
context: "docs/context/harness/executable-rule-conformance-guardrails.md"
decision: "docs/decisions/0029-executable-rule-conformance-harness.md"
---

# Executable Rule Conformance Harness

## Outcome

Deliver a model-neutral, fail-closed rule-conformance lifecycle that proves which scoped directives reached generation and which checks the resulting diff satisfied. Preserve Markdown rules and ADR 0027 prompt proximity, but add machine-readable directive contracts, immutable bindings, mandatory prompt compilation, deterministic plan validation, stack adapters, governed human waivers, evidence reports, lifecycle gates, and cross-editor CLI parity.

The first release gate covers the core contract and TypeScript. Execution must stop for developer inspection after Phase 5. Laravel proceeds only in Phase 6 after that checkpoint.

## Pre-planning record

### Actors and goals

- **Developer/human maintainer:** receives inspectable rule selection and conformance evidence and exclusively authorizes waivers.
- **Planner:** binds stable directive IDs appropriate to the declared stack and exact unit scope.
- **Executor/provider adapter:** receives a compiled prompt contract and cannot bypass blocking preflight failures.
- **Reviewer/verifier:** consumes immutable conformance evidence rather than restating compliance from the diff alone.
- **Rule author:** maintains human-readable Markdown with stable, machine-readable directive metadata.
- **CI/editor bridge:** invokes the same repository/CLI gates regardless of editor-native hook support.

### Domain language

- **Rule descriptor:** parsed rule-level applicability plus stable directive records from canonical Markdown.
- **Directive mode:** exactly one of `automated-blocking`, `evidence-blocking`, or `advisory`.
- **Unsupported directive:** unclassified/unmigrated guidance that cannot be counted as enforced.
- **Binding manifest:** immutable selection of directive IDs, source hashes, stack, workflow, affected scope, and active waivers.
- **Conformance adapter:** stack-specific implementation of the model-neutral check port.
- **Conformance report:** per-directive result and evidence tied to binding and diff hashes.
- **Governed waiver:** human-authorized, scoped, expiring exception with rationale and compensating evidence.

### Language stack and applicable rules

- **Implementation stack:** pure Node.js ESM, JSON Schema, Markdown, repository-native subprocess tools.
- **Initial enforced stack:** TypeScript; Laravel follows after the Phase 5 checkpoint; Flutter remains unsupported.
- **Planning rules:** `rules/global/evidence-and-claims.md`, `rules/global/architecture-conformance.md`, `rules/global/code-quality.md`, `rules/solid/single-responsibility.md`, `rules/solid/open-closed.md`, `rules/solid/interface-segregation.md`, and `rules/solid/dependency-inversion.md`.
- **Precedence:** user directives and accepted ADRs govern policy; scoped directive contracts govern procedural implementation steps; undocumented deviations fail.

### Current-state evidence

| Evidence | Verified finding |
| --- | --- |
| `orchestrator/runner.mjs:216-249` | Default provider dispatch receives raw prompt/system prompt plus selection metadata; selected source contents are not compiled by default. |
| `scripts/harness-cli.mjs:63-109,175-189` | `bundle` materializes contents but `run` does not consume the bundle. |
| `scripts/context-core.mjs:380-393` | `alwaysApply` can select every allowed stack rule for any action before touched scope is known. |
| `scripts/plan-check.mjs:243-246,365-388` | Non-empty block presence is the only rule check and does not affect `isValid`. |
| `evals/plan-check.test.mjs:13-51` | A plan with no `<language_rules>` is a passing fixture. |
| `evals/run-evals.mjs:11-24,50-83` | Evaluations check selection/text/fixture fields, not generated-code rule violations. |
| `app/cli/core/bridge-generator.mjs:419-563` | Bridges point to `resolve` but do not require a bundle receipt or conformance result. |

### Scenario coverage

| ID | Actor and situation | Expected outcome | Failure/recovery | Unit/test |
| --- | --- | --- | --- | --- |
| SC-01 | Planner scopes a TypeScript service unit | Only relevant common/service/architecture directives bind with hashes | Ambiguous scope blocks preflight | 02.01 resolver contract tests |
| SC-02 | Unit omits, placeholders, or mis-scopes rules | `plan:check` exits non-zero | Planner repairs before worktree execution | 02.02 negative plan fixtures |
| SC-03 | Provider run begins | Compiled directive contents and provenance reach provider | Compilation failure stops dispatch | 02.03 prompt-capture tests |
| SC-04 | Generated TypeScript violates a blocking directive | Adapter/report returns FAIL and checkpoint rejects | Executor repairs and reruns | 03.02/03.03 fixtures |
| SC-05 | Architecture directive needs judgment | Evidence-blocking result requires named human evidence | Missing evidence blocks | 03.01 report tests |
| SC-06 | Agent proposes an exception | Waiver remains inactive until human authorization | Expired/broad/self-approved waiver rejects | 03.01 waiver tests |
| SC-07 | Editor lacks prompt hooks | Repository CLI still enforces identical gates | Capability reported, never silently weakened | 04.02 bridge tests |
| SC-08 | Unmigrated rule is selected | Status is UNSUPPORTED and not counted as enforced | Catalog migration or scoped exclusion required | 01.02/05.03 coverage tests |
| SC-09 | Laravel phase starts after TypeScript proof | Same port/report contracts are reused | Stop if Phase 5 checkpoint is not approved | 06.01 architecture tests |

### Decision ledger

| ID | Decision | Rationale / authority | Artifact |
| --- | --- | --- | --- |
| D-01 | Adopt layered rule contracts and pluggable conformance adapters | Closes selection/delivery/evidence gaps without hosted policy infrastructure | ADR 0029 |
| D-02 | Fail closed with governed waivers | User-confirmed; advisory status preserves current trust gap | Context Q-01 |
| D-03 | Human maintainers alone authorize waivers | Generator/reviewer agents cannot be their own authority | Context Q-03 |
| D-04 | Require three explicit directive modes; unmigrated is unsupported | Prevents false enforcement claims | Context Q-04 |
| D-05 | CLI/repository gates are authoritative across editors | Guarantees portable minimum behavior | Context Q-05 |
| D-06 | Prove TypeScript first, then Laravel | Reduces diagnostic surface and validates adapter seam | Context Q-02 |
| D-07 | Use inline stable directive markers plus rule-level applicability metadata in canonical Markdown | Avoids sidecar drift and works with dependency-free parsing; syntax is contract-tested in Phase 1 | Plan design under ADR 0029 |

### SOLID boundary audit

| Principle | Plan consequence |
| --- | --- |
| SRP | Descriptor parsing, binding, prompt compilation, adapter execution, evidence gating, and CLI presentation are separate modules/units. |
| OCP | New stacks register adapters and verifier capabilities without adding stack conditionals to the conformance orchestrator. |
| LSP | Adapter contract tests require consistent result states, evidence shape, timeout behavior, and unsupported handling. |
| ISP | Adapters receive only binding, changed scope, host capabilities, and execution services—not complete runner or CLI state. |
| DIP | High-level runner/checkpoint logic owns port/report contracts; TypeScript/Laravel adapters depend on them. |

### Unknowns and blockers

No product-policy blocker remains. Exact host tool commands are discovered per repository by stack adapters and reported as TOOL_UNAVAILABLE when absent; no command is assumed successful.

## Acceptance criteria

| ID | Criterion | Unit(s) | Verification |
| --- | --- | --- | --- |
| AC-01 | Schemas/parser reject duplicate IDs, invalid modes/verifiers, unsafe paths, malformed markers, and incomplete waivers/reports | 01.01, 01.02 | Schema/parser unit and negative tests |
| AC-02 | Binding is deterministic and scoped by stack, workflow, paths/layers, hashes, and waivers; broad fallback selection is invalid for material generation | 02.01 | Resolver/binding contract tests |
| AC-03 | Default provider paths receive compiled directive contents and provenance without custom hooks | 02.03 | Prompt-capture integration tests |
| AC-04 | `plan:check` fails missing, placeholder, nonexistent, wrong-stack, irrelevant, stale, or contradictory bindings | 02.02 | CLI negative fixtures and exit assertions |
| AC-05 | Conformance port, waiver validator, aggregator, and evidence gate preserve distinct states and block incomplete results | 03.01 | Contract/state-transition tests |
| AC-06 | Self-approved, expired, scope-mismatched, or evidence-free waivers reject; valid human waivers remain auditable | 03.01 | Waiver tests |
| AC-07 | TypeScript adapter detects deliberate type, validation, module-boundary, and architecture violations | 03.02 | Fixture integration tests |
| AC-08 | CLI and lifecycle cannot report success over failed blocking results | 03.03, 04.01, 04.03 | CLI/lifecycle integration tests |
| AC-09 | All generated bridges reference authoritative commands and doctor reports parity honestly | 04.02 | Bridge/doctor tests |
| AC-10 | Evaluations contain adversarial violations and prove rejection, not only selection | 04.03 | Negative cases/datasets |
| AC-11 | TypeScript/global/SOLID catalogs expose stable directive metadata; coverage excludes unsupported directives | 05.01-05.03 | Catalog audit and doctor |
| AC-12 | Laravel reuses the adapter/report contract without core stack conditionals | 06.01-06.04 | Architecture and fixture tests |
| AC-13 | Manifest, maps, schemas, lock, evaluations, decision index, docs, version, and doctor agree | 05.03, 06.04 | Sync, eval, doctor, lock check |

## Scope

- Directive contract syntax and validation; artifact-aware binding; prompt compilation; plan/lifecycle gates.
- Generic evidence, waiver, and report contracts.
- TypeScript then Laravel adapters and catalog metadata migration.
- CLI, bridge, doctor, maps, manifest, lock, evaluations, and version synchronization.

## Non-goals

- Hosted policy service, automatic rewrite agent, replacement of native tools, Flutter enforcement, or changes to application repositories.

## Dependency graph

```text
01.01 -> 01.02 -> {02.01, 02.02}
02.01 -> 02.03
{02.02, 02.03} -> 03.01 -> 03.02 -> 03.03
03.03 -> {04.01, 04.02} -> 04.03
04.03 -> {05.01, 05.02, 05.03} -> 05.04 -> DEVELOPER CHECKPOINT
05.04 -> 06.01 -> {06.02, 06.03} -> 06.04
```

## Worktree & Branch Topology

| Phase | Unit | Branch | Worktree | Merge target |
| --- | --- | --- | --- | --- |
| 01 | 01.01 | `task/0001/phase-01/schema-validation-contracts` | `.worktrees/0001/phase-01/schema-validation-contracts` | `task/0001/phase-01-integration` |
| 01 | 01.02 | `task/0001/phase-01/descriptor-parser-pilot` | `.worktrees/0001/phase-01/descriptor-parser-pilot` | `task/0001/phase-01-integration` |
| 02 | 02.01 | `task/0001/phase-02/binding-resolver` | `.worktrees/0001/phase-02/binding-resolver` | `task/0001/phase-02-integration` |
| 02 | 02.02 | `task/0001/phase-02/fail-closed-plan-check` | `.worktrees/0001/phase-02/fail-closed-plan-check` | `task/0001/phase-02-integration` |
| 02 | 02.03 | `task/0001/phase-02/prompt-compiler-runner` | `.worktrees/0001/phase-02/prompt-compiler-runner` | `task/0001/phase-02-integration` |
| 03 | 03.01 | `task/0001/phase-03/conformance-evidence-gate` | `.worktrees/0001/phase-03/conformance-evidence-gate` | `task/0001/phase-03-integration` |
| 03 | 03.02 | `task/0001/phase-03/typescript-adapter` | `.worktrees/0001/phase-03/typescript-adapter` | `task/0001/phase-03-integration` |
| 03 | 03.03 | `task/0001/phase-03/cli-enforcement` | `.worktrees/0001/phase-03/cli-enforcement` | `task/0001/phase-03-integration` |
| 04 | 04.01 | `task/0001/phase-04/lifecycle-contracts` | `.worktrees/0001/phase-04/lifecycle-contracts` | `task/0001/phase-04-integration` |
| 04 | 04.02 | `task/0001/phase-04/bridge-doctor-parity` | `.worktrees/0001/phase-04/bridge-doctor-parity` | `task/0001/phase-04-integration` |
| 04 | 04.03 | `task/0001/phase-04/adversarial-evaluations` | `.worktrees/0001/phase-04/adversarial-evaluations` | `task/0001/phase-04-integration` |
| 05 | 05.01 | `task/0001/phase-05/typescript-common-backend` | `.worktrees/0001/phase-05/typescript-common-backend` | `task/0001/phase-05-integration` |
| 05 | 05.02 | `task/0001/phase-05/typescript-data-ui` | `.worktrees/0001/phase-05/typescript-data-ui` | `task/0001/phase-05-integration` |
| 05 | 05.03 | `task/0001/phase-05/global-solid-contracts` | `.worktrees/0001/phase-05/global-solid-contracts` | `task/0001/phase-05-integration` |
| 05 | 05.04 | `task/0001/phase-05/typescript-release-gate` | `.worktrees/0001/phase-05/typescript-release-gate` | `task/0001/phase-05-integration` |
| 06 | 06.01 | `task/0001/phase-06/laravel-adapter` | `.worktrees/0001/phase-06/laravel-adapter` | `task/0001/phase-06-integration` |
| 06 | 06.02 | `task/0001/phase-06/laravel-http-application` | `.worktrees/0001/phase-06/laravel-http-application` | `task/0001/phase-06-integration` |
| 06 | 06.03 | `task/0001/phase-06/laravel-data-security` | `.worktrees/0001/phase-06/laravel-data-security` | `task/0001/phase-06-integration` |
| 06 | 06.04 | `task/0001/phase-06/final-release-gate` | `.worktrees/0001/phase-06/final-release-gate` | `task/0001/phase-06-integration` |

## Phases

- [x] `phase-01-contract-foundation/phase.md` — schemas, validator support, descriptor parser, and pilot rules.
- [x] `phase-02-binding-and-prompt/phase.md` — binding, plan checks, and prompt compilation.
- [x] `phase-03-typescript-enforcement/phase.md` — evidence gate, TypeScript adapter, and CLI.
- [ ] `phase-04-lifecycle-and-bridges/phase.md` — lifecycle contracts, bridges, and adversarial evaluations.
- [ ] `phase-05-typescript-catalog/phase.md` — TypeScript catalog migration and hard checkpoint.
- [ ] `phase-06-laravel-expansion/phase.md` — Laravel adapter/catalog and final release.

## Finalization & Merge Ledger

| Stage | Source | Target | Verification | Status |
| --- | --- | --- | --- | --- |
| Phase 01 | `task/0001/phase-01-integration` | task base | schema/parser tests + `/review` | merged |
| Phase 02 | `task/0001/phase-02-integration` | task base | resolver/plan/prompt tests | merged |
| Phase 03 | `task/0001/phase-03-integration` | task base | TypeScript adapter/CLI tests | merged |
| Phase 04 | `task/0001/phase-04-integration` | task base | lifecycle/bridge/adversarial evals | pending |
| Phase 05 | `task/0001/phase-05-integration` | task base | TypeScript catalog audit + doctor | pending; hard developer checkpoint |
| Phase 06 | `task/0001/phase-06-integration` | task base | Laravel adapter/catalog + doctor | pending |
| Final | task base | `master` | all ACs, evals, doctor, lock check | pending |

For each unit, create its worktree from the phase branch, run `/test` and `/review`, merge only verified commits, remove the worktree, prune metadata, and remove empty `.worktrees/0001/<phase>/` directories. Execution never modifies the primary working tree.

## Risks and rollback

- False blocking: pilot directives first; adapter registration can roll back without changing prose.
- Rule drift: content hashes invalidate stale bindings; audit rejects duplicate/missing metadata.
- Tool variability: TOOL_UNAVAILABLE remains distinct and blocking when required.
- Migration interruption: unsupported remains visible; partial catalogs are never advertised as enforced.

## Result

Planned only. No production implementation has begun.
