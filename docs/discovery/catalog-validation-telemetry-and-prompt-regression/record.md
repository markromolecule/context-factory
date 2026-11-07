---
title: "Catalog Validation, Harness Telemetry, and Prompt Regression Discovery"
type: discovery-record
status: ready
created: "2026-11-07"
sourceContext: docs/context/harness/catalog-validation-telemetry-and-prompt-regression.md
sourceContextHash: sha256:9f4923afa57eabe72c76cbaa74b42c2c37f29bed3ed1bd6eaa77c71beccea7b7
---

# Catalog Validation, Harness Telemetry, and Prompt Regression Discovery Record

## Outcome, actors, and authority

The maintainer requested three linked improvements: stronger catalog/schema checks, task-level harness efficiency data, and deterministic prompt/rule regression tests. The maintainer confirmed on 2026-11-07 that metrics cover Context Factory harness-owned runs only and that the current single-provider-call runner remains the execution boundary. The maintainer then confirmed the complete scoped understanding for planning. This record releases discovery for a plan; it does not authorize production implementation in this context run.

The catalog author owns source definitions and deliberate contract changes; the harness owns observed run metrics; local hook and CI own pass/fail; the reviewer decides whether a changed fixture expectation is intentional. No external host session is a telemetry source or authority for this feature.

## Grounding claim packet for grill

| ID | Source, heading, scope, authority, lifecycle | Last verified and content hash | Selection reason, status, and consequence |
| --- | --- | --- | --- |
| G-01 | `knowledge/principles/kiss.md` § Core Mental Model & Distinction; context-factory; canonical, active | `lastVerified: 2026-10-10`; checked against current file 2026-11-07; `sha256:caa4c31363d68199e25ce4e67e9ab80e0ec55588348ce31d6ca4e8808fba8405` | verified: favor a direct extension of the existing validation and evaluation path. This principle does not itself specify a parser or metric schema. |
| G-02 | `knowledge/principles/yagni.md` § Core Mental Model & Distinction; context-factory; canonical, active | `lastVerified: 2026-10-10`; checked against current file 2026-11-07; `sha256:ff5bf723ec8c758403a4502b7ab4d893139d83fe4e4e7f6a7f52ae83b2634a2e` | verified: no speculative tool-loop or host telemetry adapter. The user explicitly excluded those in this scope. |

The Wiki has no scoped canonical answer for the telemetry report format, numerical token target, action-count semantics, or prompt-regression fixture schema. Repository code, accepted ADRs, and the user's decisions below govern those boundaries. No conflicting Wiki claims were found in the applicable scope.

## Repository evidence and reconciled contracts

| ID | Evidence | Finding and consequence |
| --- | --- | --- |
| R-01 | `scripts/validate-context.mjs`, `context-manifest.json` | Existing validator checks inventory, metadata, selected references, wiki links, and lock freshness. Extend demonstrated gaps with negative fixtures; do not create an independent catalog truth. |
| R-02 | `app/cli/commands/hook.mjs`, `app/cli/commands/doctor.mjs`, `.github/workflows/context-factory.yml` | Existing hook and pull-request workflow run doctor; doctor invokes validator and 27 fixture evaluations. Add new checks to this chain. |
| R-03 | `node app/cli/bin/context-cli.mjs doctor --quiet` on 2026-11-07 | Exit 0, including 27/27 evaluation cases. Baseline catalog health is verified; missing negative coverage is not disproved by this result. |
| R-04 | `orchestrator/runner.mjs`, `schemas/run-result.schema.json` | Runner makes one provider call; successful results include provider tokens; no agent tool dispatch, tool loop, or retry loop exists. Optional `toolCalls` in the schema is not evidence of executed tools. |
| R-05 | `evals/run-evals.mjs`, `evals/cases/workflow-discovery.json`, `schemas/evaluation-report.schema.json` | Existing fixtures cover routing/selection and mock outputs, with token details for datasets. They do not observe runner stage order or validation-gate omission. |
| R-06 | `docs/templates/Task.md`, `docs/templates/Phase.md`, `docs/templates/Unit.md` | Step templates are Markdown files with frontmatter/sections; no separate workflow-step JSON catalog exists. Validate supported template invariants and links to real resources. |
| R-07 | ADR 0004 and ADR 0008 (accepted); ADR 0041 (accepted and superseding historical runtime-conformance policy) | Keep canonical Markdown/manifest and offline deterministic evaluations. ADR 0008 rejected a heavier Zod/Ajv stack for the runner. Doctor proves factory health only, not host code conformance. |
| R-08 | `orchestrator/SHARED.md` § 10 versus `orchestrator/runner.mjs` | Shared contract mentions retries, while current runner does not implement them. Count only observed provider attempts and stage outcomes; do not infer agent iterations. Reconcile policy wording during implementation if it would otherwise imply nonexistent instrumentation. |

## Accepted decisions and non-goals

| ID | Decision | Reason and alternatives |
| --- | --- | --- |
| D-01 | Strengthen the existing validator and doctor path for skills, workflows, supported plan templates, config manifests, and references; use the same gate in hook and CI. | The gate already exists. A separate competing validator would create drift. Exact schema representation is a plan-level design choice. |
| D-02 | Measure Context Factory harness-owned runs only. | Explicit user answer on 2026-11-07. External Codex/Claude/Gemini host sessions and hosted telemetry are excluded. |
| D-03 | Keep the current runner execution model. Report provider usage, provider attempts, and lifecycle-stage failures by task ID. Mark tool-call failure and agent-loop iteration metrics `unavailable` while no such execution occurs. | Explicit user answer on 2026-11-07. Calling one provider invocation a full agent iteration or reporting zero tool failures would misrepresent the evidence. |
| D-04 | Make prompt/rule regressions observe workflow selection plus runner stage order and validation-gate outcomes under deterministic mock fixtures. | This is the observable sequence in the current harness. Do not claim tests prove external agent tool sequences. |
| D-05 | Keep the telemetry report local, bounded, versioned, and free of prompts, credentials, tool payloads, and personal data. | Supports debugging without expanding data collection. Report errors explicitly and preserve primary run errors. |
| D-06 | Prefer the existing dependency-free ESM validator unless a new dependency's benefits justify revisiting ADR 0008. | The suggested Zod/TypeBox mechanism is not a requirement and conflicts with the accepted dependency trade-off if adopted without review. |

**Non-goals:** New agent tool/retry loop, live host instrumentation, hosted metrics, currency cost estimates, live model CI, production application telemetry, full prompt/tool payload logging, and application code conformance claims from doctor results.

## Scenario challenge

| ID | Class and challenge | Expected outcome, failure/recovery, and evidence |
| --- | --- | --- |
| S-01 | Happy path: valid catalog and mock task | One local/CI gate passes; routing and stage/gate fixtures pass; report ties provider usage and attempts to the task ID. |
| S-02 | Boundary: bad frontmatter, missing resource, wrong-case path, bad workflow reference, or malformed supported template | Validator fails with a file/field diagnostic; author fixes source or manifest and reruns. Negative fixtures prove each supported invariant. |
| S-03 | Boundary: provider supplies no usage or mock values | Usage is unknown or labeled mock, respectively. No assumed zero or real-cost claim. |
| S-04 | Failure: provider or lifecycle stage fails | The original run failure is preserved; failed attempt/stage appears in metrics; partial metrics are labeled; subsequent run can be correlated by task ID. |
| S-05 | Regression: prompt or rule changes selection, order, or gate | Fixture compares observed workflow/stages/gate result and fails in doctor/CI; reviewer can intentionally revise expectation with evidence. |
| S-06 | Concurrency: two runs share a task ID; write is interrupted | Each run remains distinguishable; aggregate cannot silently lose or double count; corrupt/partial report is diagnosed and repairable. |
| S-07 | Abuse/security: fixture references outside-root file or metrics could leak secret content | Reject out-of-root path; persist only bounded numeric/status metadata and opaque task/run IDs. |
| S-08 | Lifecycle: catalog/report schema changes and older reports exist | Version and compatibility behavior are explicit; unsupported data fails clearly or follows a documented migration. |
| S-09 | Policy boundary: catalog doctor passes but host code check is absent | Report factory health only; no application code PASS or external tool-sequence claim, per ADR 0041. |

## Risks, remaining assumptions, and coverage audit

- **Risk:** A generic text scan for scripts can misread examples and code fences. Define supported reference syntax and test false positives as well as missing real paths.
- **Risk:** The custom frontmatter parser may accept malformed YAML by ignoring lines; negative fixtures should reveal the exact supported syntax and failure mode.
- **Risk:** Telemetry may be partial when provider usage is absent or a process exits before writing. Preserve unknown/partial state and avoid false complete aggregates.
- **Risk:** Mock stage fixtures can prove harness ordering and gates, but not the behavior of a live model or external IDE agent.
- **Remaining non-material assumptions:** Storage location, retention bound, exact schema fields, and command spelling can be selected during planning if they preserve local-only, redacted, versioned, and concurrent-run-safe behavior. No exact percentage cost target was requested or measured.

**Coverage audit:** The record identifies desired outcomes, actors and authority, primary and negative journeys, catalog/run/report lifecycle, integration points, privacy constraints, concurrency and recovery, accepted boundaries, and measurable acceptance tests. The user confirmed the scoped understanding on 2026-11-07 after two material choices. There are no remaining material unknowns or unresolved evidence conflicts. **Ready for plan brief: yes.**
