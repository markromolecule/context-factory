---
title: "TypeScript Agent Harness Reliability and Context Efficiency Discovery"
type: discovery-record
status: ready
created: "2026-10-19"
sourceContext: docs/context/harness/typescript-agent-harness-solidification.md
sourceContextHash: sha256:121256207943209da5ee7c26eabec22ffe452e9744c26ffdf0c49cf5a7ae9940
---

# TypeScript Agent Harness Reliability and Context Efficiency Discovery Record

## Outcome and authority

The user requested a plan after a repository audit and confirmed two material directions on 2026-10-19: remove runtime `conform`, and keep/reconcile factory-local `.agents/` and `.claude/`. This record releases planning only; no production code changes or release are authorized. The plan must stay in the TypeScript-host and Node ESM factory scope, minimize loaded context, and make verification claims match executable checks.

## Grounding claim packet for grill

| ID | Source and authority | Hash and verification | Status, selection reason, and consequence |
| --- | --- | --- | --- |
| G-01 | `knowledge/principles/kiss.md`, canonical active | `sha256:caa4c31363d68199e25ce4e67e9ab80e0ec55588348ce31d6ca4e8808fba8405`, checked 2026-10-19 | verified: use the smallest direct CLI/selector changes; no replacement generic adapter framework. |
| G-02 | `knowledge/principles/yagni.md`, canonical active | `sha256:ff5bf723ec8c758403a4502b7ab4d893139d83fe4e4e7f6a7f52ae83b2634a2e`, checked 2026-10-19 | verified: remove dead runtime conformance references and speculative hooks. |
| G-03 | `knowledge/principles/single-responsibility.md`, canonical active | `sha256:7a1cb91c3089f9d3b90aaa6e388a9b8f9e64b663cbd0f7a6744e9e9d9bdb9816`, checked 2026-10-19 | verified: split plan units by CLI contract, selector, catalog, host bridge, and status responsibilities. |
| G-04 | `knowledge/principles/dependency-inversion.md`, canonical active | `sha256:051f4434a24f22eadaa630c3c934be6dfa7e19cff27a05a76e38fbedec808827`, checked 2026-10-19 | verified: generated host instructions depend on shared canonical policy; avoid copied lifecycle contracts. |
| G-05 | ADR 0039, accepted | `sha256:bc02ed473359d8389dbb2df939ff1484142eb3f062be6713cbdd9c9cee8dcad7`, checked 2026-10-19 | conflict: first-class workflows and TypeScript focus remain relevant, but its `conform` assumption conflicts with the current user choice and missing command. A new ADR amendment is required in implementation. |
| G-06 | ADR 0040, accepted | `sha256:c0b6d23c1706f5d6f883037ea43f4b42a0db2eef52a0f5191e6484b1fdf9a419`, checked 2026-10-19 | verified: active CLI, CI, and host guidance use pnpm. `.claude/CLAUDE.md` currently drifts. |
| G-07 | ADR 0033, accepted | `sha256:0a16e49e089d2395ef0b333b49391ad5515193a4e7338ba883e186d805663f69`, checked 2026-10-19 | verified: plan alone creates one task branch after brief release; downstream units execute serially and verify exact branch. |
| G-08 | ADRs 0029/0035 and prior PLN-0011 brief | Accepted ADRs, older released brief; live files checked 2026-10-19 | conflict: conformance policy text persists while runtime is absent. User reaffirmed removal. Prior `.agents`/`.claude` deletion scope is superseded for this new effort by the explicit keep decision. |

No canonical Wiki item defines a numerical context-token target or proves native host discovery. The plan must measure selector budgets and distinguish link tests from host invocation smoke evidence.

## Repository evidence

| ID | Live evidence | Finding and plan consequence |
| --- | --- | --- |
| R-01 | `context-manifest.json`; parser | 36 rules, 12 procedural skills, 6 workflow skills, 355 directive markers. Exact selected subsets need scope-based checks. |
| R-02 | `scripts/context-core.mjs`; direct resolver probes | All knowledge paths are baseline; a plan-workflow question selected 17 rules and 2 skills, estimated 31,775 tokens. Plan an intent gate and on-demand knowledge. |
| R-03 | `app/cli/bin/context-cli.mjs`, `app/cli/index.mjs`, `app/cli/core/github-gate-generator.mjs` | `conform` is absent; index import fails; generated CI still calls it. Contract and executed-command tests are required. |
| R-04 | `app/cli/commands/preflight.mjs`; CLI probes | PASS occurs with null binding or with JSX scope and zero directives. Material requests need explicit coverage status. |
| R-05 | `app/cli/core/host-state.mjs` | The first found factory/host report is treated as current without revision or scope verification. Split historical and current report state. |
| R-06 | `.agents/skills.json`, `.agents/README.md`, `.claude/CLAUDE.md` | Current local host inventory/guidance disagree; keep and reconcile rather than delete. |
| R-07 | 2026-10-19 checks | `doctor` 27/27, core unit tests 36/36, broader evaluations 203/207. The two failing bridge assertions expose stale inventory/root expectations. |

## Resolved decisions and constraints

| ID | Decision | Reason and alternative disposition |
| --- | --- | --- |
| D-01 | Remove runtime `conform`; retain only truthful rule selection/binding and host-provided code checks. | Explicit user answer; restoring an adapter would enlarge maintenance and contradict the selected direction. Update ADRs and active contracts rather than leaving false gates. |
| D-02 | Keep `.agents/` and `.claude/` in the factory checkout. | Explicit user answer; prior PLN-0011 deletion scope is stale for this effort. Verify host discovery and collisions separately from factory doctor. |
| D-03 | Preserve canonical rule/skill/workflow separation. | Accepted inventory and user goal; each skill owns a standalone procedure, workflows own stage order and gates. |
| D-04 | Use a measured, task-sensitive context budget; no promised token reduction before evaluation. | Repository estimate is approximate and current prompts vary; define acceptance fixtures and thresholds in the plan. |
| D-05 | Do not classify JS/JSX as TypeScript PASS. | Exact scoped preflight probe returned PASS with zero directives; keep applicable global/security checks and report unsupported TypeScript checks explicitly. |

## Scenario challenge

| ID | Case | Expected outcome and evidence |
| --- | --- | --- |
| S-01 | Happy path: scoped TS or installed Next/React/Solid package | Resolver selects one relevant workflow/skill and matching rules with reasons; test actual selected paths and cost. |
| S-02 | Direct question or investigation | No delivery workflow; no unrelated backend/database bundle; source answer remains possible. |
| S-03 | Missing, JSX, or zero-coverage scope | Material preflight is BLOCKED/UNSUPPORTED, with global/security duties visible; no false PASS. |
| S-04 | CI with configured versus missing host commands | Configured checks execute; absent ones are unconfigured; no dead `conform` invocation. |
| S-05 | Malformed, stale, foreign-host, or no report | Status does not call it current PASS; one valid next action is shown. |
| S-06 | Existing owner file, broken link, rerun, or concurrent setup | Owner content preserved; known generated entry repaired, collision reported, idempotence tested. |
| S-07 | New catalog item or removed workflow | Inventory/map/lock and host entry tests detect drift; no duplicate canonical policy. |
| S-08 | Human evidence absent or host compiler/linter unavailable | State remains unresolved/unconfigured; no self-attested verification. |
| S-09 | Task-phase boundary and review handoff | Known T2 work avoids forced greenfield discovery; T3 still requires it; no next phase without entry evidence. |

**Coverage audit:** Outcome, actors, authority, file/package boundaries, exceptional paths, security of host-owned files, CI/status observability, rollout, rollback, and non-goals are represented above and in the ready context. No external data or schema migration is involved. User confirmation covers the two material conflicts; remaining budget values and file splits are reversible plan details. **Ready for plan brief:** yes.
