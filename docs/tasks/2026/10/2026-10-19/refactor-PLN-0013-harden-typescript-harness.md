---
title: "Harden TypeScript harness"
type: task
status: planned
plan_contract_version: 3
plan_id: "PLN-0013"
created: "2026-10-19"
tags: [task, harness, typescript]
target_branch: "master"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
discovery_brief: "../../../../discovery/typescript-agent-harness-solidification/brief.md"
---

# Harden TypeScript harness

## Outcome

Make Context Factory select small, relevant context for TypeScript work, and make its CLI, generated checks, rules, skills, workflows, host entries, and status claims agree with executable behavior. This artifact plans changes; it does not implement them.

## Pre-planning record

### Actors and goals

- Developers and agents need concise context for a question or scoped change.
- Maintainers need one canonical contract and safe CLI and host bridge maintenance.
- Reviewers need inspectable binding, scope, revision, test, and human evidence.

### Domain language

- **Selection:** request and scope to rules, skills, workflows, and knowledge. **Binding:** selected directives and source hashes. **Host checks:** configured lint, typecheck, test, and build commands. **Report identity:** host, scope, binding, and revision.
- Canonical definitions stay in `orchestrator/SHARED.md`, rule descriptors, and the released brief.

### Language stack and applicable rules

- **Declared stack:** JavaScript `.mjs` implementation of a TypeScript-focused catalog and host bridge. JS/JSX does not inherit a TypeScript PASS label.
- **Current binding limitation:** preflight can PASS with `bindingId:null`; this plan makes no code-conformance claim. Units pin current global directives in `<language_rules>` and refresh hashes if sources change during execution.
- **Precedence:** applicable rules supersede conflicting procedural text. An automated gate requires an executable verifier, input, receipt, and failing test; human evidence stays evidence-blocking.

### Scenario coverage

| ID | Actor and situation | Expected outcome | Failure/recovery |
|---|---|---|---|
| S-01 | Direct workflow question | Short information context | Do not route through lifecycle execution |
| S-02 | Scoped Next, React, or Solid task | Rules follow package evidence | No framework claim without package evidence |
| S-03 | Empty or JS/JSX-only scope | No TypeScript PASS | BLOCKED or UNSUPPORTED with reason |
| S-04 | Host check missing | CI reports unconfigured | No dead command or green skip |
| S-05 | Old or foreign report | Status rejects current PASS | Identify mismatch and next check |
| S-06 | Existing host file/link | Preserve owner and report collision | Explicit repair path |
| S-07 | Catalog or entry drift | Validation fails | Synchronize manifest, host inventory, lock, entries |
| S-08 | Human evidence missing | Workflow stops | Request named receipt |
| S-09 | Phase transition | Verify before next phase | Stop on unresolved gate |

### Decision ledger

| ID | Decision | Evidence and effect |
|---|---|---|
| D-01 | Remove runtime `conform` and false report claims; use explicit host checks | User answer on 2026-10-19; CLI lacks command while generated CI invokes it |
| D-02 | Keep and reconcile factory-local `.agents/` and `.claude/` | User answer on 2026-10-19 overrides older deletion direction |
| D-03 | Keep shared contract, scoped rules, independent skills, and coordinating workflows | Current catalog and grounding G-01 to G-08 |
| D-04 | Require real scope and directive coverage before material preflight success | Current null binding and JSX zero-directive cases |
| D-05 | Set context budgets from measured fixtures; retain security/global duties | Direct question baseline estimated 31,775 tokens; no canonical target |

## Unknowns and blockers

- None for planning. Execution units must measure routing budgets and identify report consumers before setting thresholds or changing schemas.

## Acceptance criteria

| ID | Source | Criterion | Unit | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | D-01, S-04 | Accepted decision and active contract/guidance state executable host checks and evidence accurately | 01.01 | `node scripts/validate-context.mjs` | planned |
| AC-02 | D-01, S-04 | Public CLI index imports; no active generated command invokes missing conform; CI executes emitted checks | 01.02 | `node --test evals/tests/cli/github-gate.test.mjs` | planned |
| AC-03 | D-04, S-03 | Empty, JS/JSX-only, and zero-directive material scope cannot produce TypeScript PASS | 01.03 | `node --test tests/cli/preflight.test.mjs` | planned |
| AC-04 | D-05, S-01 | Questions and task intents load needed procedures and knowledge within measured budgets | 02.01 | `node --test evals/tests/resolver/intent-routing.test.mjs` | planned |
| AC-05 | S-02, S-03 | Scope and package evidence determine TypeScript/framework applicability | 02.02 | `node --test evals/tests/resolver/framework-scope.test.mjs` | planned |
| AC-06 | D-03, S-07 | Rule modes reflect verifier capability; applicable security/global directives remain | 02.03 | `node --test evals/tests/rules/catalog-coverage.test.mjs` | planned |
| AC-07 | D-03, S-08, S-09 | Skills stand alone; workflows coordinate tiers and checkpoints without copied policy | 02.04 | `node --test evals/tests/bridge/workflow-routing.test.mjs` | planned |
| AC-08 | D-02, S-06, S-07 | Factory entries and bridge agree; collision, link, idempotence, pnpm profile pass | 03.01 | `node --test tests/bridge/bridge-generator.test.mjs` | planned |
| AC-09 | S-05 | Status only accepts matching host, scope, binding, revision evidence; doctor claims remain narrow | 03.02 | `node --test evals/tests/cli/host-status.test.mjs` | planned |
| AC-10 | S-04, S-07, S-09 | Final catalog and full suite have no known regression | 03.03 | `node --test evals/tests/**/*.test.mjs` | planned |
| AC-11 | D-01, S-07 | `plan:check` validates sibling master and brief instead of reporting an inapplicable green result | 01.04 | `node --test tests/cli/plan-check-layout.test.mjs` | planned |

## Scope

- Contract and superseding ADR decision; CLI, generated CI, preflight, plan checker, resolver, framework scope, status, bridge, validator; selected rules, skills, workflows; active docs, manifest, host inventory, lock; focused and integrated tests.
- A discovered file owner change must be recorded in the unit receipt and deviation ledger before scope expands.

## Non-goals

- Host product features, general multi-stack conformance adapters, historical task rewrites, external publishing, and runtime code-conformance engine.

## Constraints and decisions

- Host package-manager contract is pnpm-only per ADR 0040. Missing checks are unconfigured, never green.
- `orchestrator/SHARED.md` is canonical; host entries are thin discovery adapters.
- Doctor, symlink health, plan hashes, and preflight selection do not prove host code correctness.
- Reconcile ADR 0029, 0035, and conformance text in ADR 0039 through a recorded superseding decision before downstream implementation; preserve historical rationale.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
|---|---|---|
| Existing conform consumers | Dead command or misleading success | 01.01 inventories; 01.02 tests emitted commands; 03.03 searches |
| Context thinning drops security | Unsafe omission | 02.01 and 02.03 negative fixtures |
| Framework inference leaks across packages | Wrong rule | 02.02 sibling/nested fixtures |
| Bridge overwrites local owner | Data loss | 03.01 collision/idempotence fixtures |
| Stale report appears current | False completion | 03.02 identity tests and unknown state |
| Catalog edits stale rule hashes | Blocked execution | Refresh bindings with review before each unit |
| Integration failures | Incomplete delivery | 03.03 full suite and exact failure ledger |

## Task branch

| Field | Recorded decision |
|---|---|
| Target branch | `master` |
| Task branch | `refactor/PLN-0013-harden-typescript-harness` |
| Base commit | `e53ab5b1489618bedeee44292716acd1cd91249c` |
| Check | `git symbolic-ref --quiet --short HEAD` and `git rev-parse master` matched the clean base at scaffold |

## Phases

- [ ] `phase-01-boundary-analysis/phase.md` — Contract truth and CLI gates (01.01–01.04)
- [ ] `phase-02-vertical-slice-refactoring/phase.md` — Context selection, scope, catalog, workflow (02.01–02.04)
- [ ] `phase-03-integration-tests/phase.md` — Host bridge, status, integrated evidence (03.01–03.03)

## Dependency graph and boundary audit

- Contract 01.01 precedes CLI 01.02 and the separate intent, rule, and workflow tracks 02.01, 02.03, and 02.04. Preflight 01.03 follows CLI 01.02 because both touch `scripts/harness-cli.mjs`. Plan checker 01.04 is independent of those seams. Framework scope 02.02 follows resolver intent 02.01 because both touch `scripts/context-core.mjs`.
- Host bridge 03.01 follows workflow 02.04 because it publishes those entries. Status 03.02 follows CLI 01.02 and is logically independent of bridge 03.01. Integration 03.03 waits for all terminal tracks: 01.03, 01.04, 02.02, 02.03, 03.01, and 03.02. Independent units still execute serially on this task branch; phase completion is a separate checkpoint.
- **Single responsibility:** CLI command truth, preflight, resolver intent, package scope, catalog metadata, workflow composition, bridge ownership, and status identity have separate units. **Open/closed:** package-specific routing extends through package evidence and descriptors rather than prompt-only framework exceptions. **Substitution:** every emitted host command must behave as its declared check and report unsupported configuration honestly. **Lean interfaces:** the resolver returns only selected context and reasons; status consumes identified reports. **Dependency direction:** host adapters depend on canonical shared policy and catalog, never the reverse.
- Architecture checks are required at the CLI/host command boundary (01.02), resolver/package boundary (02.02), skill/workflow boundary (02.04), host owner boundary (03.01), and status/report boundary (03.02). Each unit states the executable or review check for that seam.

## Verification

- Planning: `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`, `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-19/refactor-PLN-0013-harden-typescript-harness`, `node scripts/validate-context.mjs`, `git diff --check`.
- Execution: unit commands, then fresh `node scripts/context.mjs doctor`, `node --test tests/**/*.test.mjs`, and `node --test evals/tests/**/*.test.mjs`. Any failure stays a failure.
- Historical input baseline on 2026-10-19: doctor 27/27, core tests 36/36, full evaluations 203/207. These are not acceptance evidence.

## Deviations

- None in the plan. Record execution scope, budget, or schema changes here with evidence and review.

## Plan done-check

- [x] Acceptance criteria map to bounded units and concrete verification commands.
- [x] Blockers are resolved for planning; execution gates remain explicit.
- [x] Risks and dependencies have mitigations.
- [x] Task branch, target base, and clean checkout were verified at scaffold.

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Evidence | Verification |
|---|---|---|---|---|
| Phase 01 | task branch | pending | pending | `node --test evals/tests/cli/github-gate.test.mjs` |
| Phase 02 | task branch | pending | pending | `node --test evals/tests/bridge/workflow-routing.test.mjs` |
| Phase 03 | task branch | pending | pending | `node scripts/context.mjs doctor` |
| Final merge | task branch to master | pending | pending | `node --test evals/tests/**/*.test.mjs` |

Finalization requires `/review` of the whole task diff, every unit and phase receipt, the full acceptance matrix, fresh doctor and test results at the final revision, and a separate merge decision. No plan or partial phase receipt substitutes for that integrated evidence.

## Result

- Plan only; no implementation or final verification claimed.
