---
title: "Catalog Validation, Harness Telemetry, and Prompt Regression"
type: context
status: ready
created: "2026-11-07"
tags: [context, harness, validation, telemetry, evaluations]
feature: "catalog-validation-telemetry-and-prompt-regression"
---

# Catalog Validation, Harness Telemetry, and Prompt Regression Context Specification

## 1. Overview & Objective

**Problem.** Catalog edits can leave skill, workflow, template, and manifest contracts inconsistent. Existing evaluations prove routing and selected text, but do not assert an ordered sequence of harness actions. Run results include provider token usage without task-level aggregation or a stage-failure history. The current runner has no tool loop, so actual tool-call failure and loop counts are not observable.

**Value.** Maintainers should find broken catalog references before merging, see which tasks consume context or repeatedly fail, and catch prompt/rule changes that alter workflow selection or required validation behavior.

**Proposed success criteria.**

1. A single local/CI command rejects malformed supported catalog metadata, missing or mis-cased referenced files, invalid manifest entries, and broken workflow/template contracts with a file-specific diagnostic; representative invalid fixtures fail and the unchanged catalog passes.
2. Every Context Factory harness-owned task run can be associated with a task ID and an inspectable, versioned summary of provider-reported tokens, provider invocation attempts, and lifecycle-stage failures. Missing provider usage is explicitly unknown, never zero by implication; tool-call failure frequency and agent-loop iterations are `unavailable` while the runner does not execute either. Metrics do not change run success semantics.
3. Deterministic fixtures detect a wrong workflow, omitted required validation gate, or wrong runner stage order; the same suite runs locally and in CI with no live model credentials. Baseline cases continue passing.

These are acceptance targets for planning, not claims about current behavior. Exact count thresholds, storage, and parser/library choice are implementation decisions once the contract is settled.

## 2. Requirements & User Stories

- As a skill or workflow author, I want a failing, actionable validation result for bad metadata or references before merge.
- As a harness maintainer, I want comparable per-task efficiency and failure summaries so I can identify expensive or repeatedly failing paths.
- As a rule maintainer, I want fixture failures when a prompt change routes work incorrectly or skips a required validation action.

**Functional requirements**

- FR-01: Validate the canonical `context-manifest.json` inventory against current files, skill and workflow frontmatter, workflow references to rules/skills, and referenced scripts/resources. Include applicable task/phase/unit step templates and JSON configuration contracts. Preserve canonical Markdown as the authored source and report unsupported constructs explicitly.
- FR-02: Wire catalog validation into the existing local hook and pull-request gate, with the same command and deterministic exit status. Preserve existing doctor/lock checks rather than creating a second contradictory source of truth.
- FR-03: Capture run/task identity, provider-reported input/output/total tokens where available, provider invocation attempts, and lifecycle-stage failures. Aggregate by task ID and expose both individual-run and aggregate data in a machine-readable local report. Distinguish estimates, mock values, actual usage, and unavailable tool/loop metrics. Do not count a single provider call as a complete agent-loop iteration.
- FR-04: Keep logs bounded and redacted: no prompts, API keys, tool arguments/results, or personal data in the metrics report. Do not turn telemetry-write failure into a false successful audit record.
- FR-05: Add offline fixtures that declare prompt/request state, expected workflow selection, and required runner stage sequence or gate outcomes. An assertion must observe a real harness boundary, not merely search Markdown for a sentence. Do not label lifecycle stages as tool calls.
- FR-06: Include positive and negative fixtures for catalog validation, routing, validation rejection, failed lifecycle/provider actions, missing usage data, and any new schema/version compatibility behavior.

**Scenario coverage**

| ID | Situation | Expected outcome and recovery |
| --- | --- | --- |
| S-01 | Valid catalog, hook, and PR run | Same validator passes; no catalog rewrite is required. |
| S-02 | Missing skill resource, malformed frontmatter, bad workflow reference, or broken template contract | File-specific nonzero diagnostic blocks merge; author fixes source or manifest and reruns. |
| S-03 | Task runs through a provider with usage data | Per-run and per-task summaries agree with observed usage and identity. |
| S-04 | Provider omits usage or a lifecycle/provider action fails | Unknown usage stays unknown; failed stage/attempt is counted; the original error remains visible. Tool-failure and loop metrics stay unavailable. |
| S-05 | Prompt/rule edit changes workflow, runner order, or a required gate | Deterministic fixture fails with expected versus observed stage/selection details; author updates code or deliberately revises fixture contract. |
| S-06 | Concurrent runs share a task ID or metrics write is interrupted | Aggregation preserves distinct runs and avoids corrupt or silently partial totals; retry or repair is documented. |
| S-07 | Fixture or catalog input attempts path escape or carries secrets | Paths remain inside the approved root; metrics omit sensitive payloads; invalid input fails explicitly. |
| S-08 | Format evolves or old report is read | Version is explicit; unsupported versions fail clearly or use a documented migration path. |

## 3. Technical & Architectural Context

- **Stack and ownership:** Node.js ESM factory tooling in `scripts/`, `orchestrator/`, `app/cli/`, and `evals/`; TypeScript application rules are catalog content. Candidate global rules include `rules/global/code-quality.md`, `rules/global/evidence-and-claims.md`, and `rules/global/security-guardrails.md`. ADR 0008 chose a dependency-free ESM runner and validator over a heavy SDK/Zod/Ajv stack; adding Zod or TypeBox would need an explicit reconsideration of that accepted trade-off.
- **Current gates:** `scripts/validate-context.mjs`, `app/cli/commands/lint.mjs`, `app/cli/commands/doctor.mjs`, `app/cli/commands/hook.mjs`, and `.github/workflows/context-factory.yml`. The current hook/CI already call doctor; extending that chain should be evaluated before a new command is added.
- **Current execution:** `orchestrator/runner.mjs` resolves context, compiles a prompt, calls one provider, validates a response, and returns a run result. It does not currently dispatch agent tools or iterate an agent loop. `schemas/run-result.schema.json` permits `tokens` and `toolCalls`, but current result construction only populates tokens on success. The requested telemetry is limited to this observable execution path.
- **Current evaluation:** `evals/run-evals.mjs` has selection cases and mock-provider datasets. It records run tokens in dataset details but has no action-order assertion. `schemas/evaluation-report.schema.json` defines its report shape.
- **Canonical catalog:** `context-manifest.json`, `context-lock.json`, `skills/**/SKILL.md`, `skills/**/agents/openai.yaml`, `docs/templates/{Task,Phase,Unit}.md`, and workflow skill frontmatter. The existing frontmatter parser is a small custom parser; the JSON validator is dependency-free. Zod/TypeBox is a suggested implementation option, not an established dependency requirement.
- **Authority and data:** Maintainers own catalog contract changes and fixture expectations. The harness owns run observations. CI/hook owns pass/fail. No application database or external telemetry service is implied. Local run data must be scoped to the repository/task and treated as potentially sensitive operational data.

## 4. Interaction Guidelines

CLI failure output should identify the invalid path and field/reference plus an actionable reason. Telemetry output should label actual, estimated, mock, and unavailable usage distinctly. No visual UI is required.

## 5. Scope & Boundaries

**In scope:** Existing validator/doctor/hook/CI integration, catalog and template contract checks, per-task metrics for Context Factory harness-owned runs, deterministic prompt/rule workflow regression fixtures, report schemas, and documentation for maintainers.

**Out of scope:** Hosted telemetry, pricing/currency estimates, logging full prompt or tool payloads, live-model evaluation in CI, production application telemetry, live Codex/Claude/Gemini host-session instrumentation, and a new tool-calling/retry agent loop in the runner. Tool failure frequencies and loop iteration counts remain unavailable until such a loop is separately specified and implemented.

## 6. References & External Context

- `docs/decisions/0004-deterministic-context-harness.md`
- `docs/decisions/0008-pluggable-ai-execution-harness.md`
- `docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md` (workflow catalog decision; its runtime conformance clause was superseded by ADR 0041)
- `docs/context/harness/typescript-agent-harness-solidification.md` (historical audit; verify current source before reusing a finding)

## 7. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `scripts/validate-context.mjs` | verified | Checks manifest version, file inventory, skill/workflow metadata, several cross-references, and evaluation entries. | Scope is strengthening an existing validator, not introducing validation from scratch. |
| E-02 | `app/cli/commands/hook.mjs`, `.github/workflows/context-factory.yml`, `app/cli/commands/doctor.mjs` | verified | Hook and PR workflow call doctor, which invokes validator and evaluations. | New checks can join the existing gate. |
| E-03 | `node app/cli/bin/context-cli.mjs doctor --quiet` on 2026-11-07 | verified | Exit 0; lint, lock, editor checks pass and evaluations are 27/27. | A green baseline does not demonstrate the proposed negative cases. |
| E-04 | `orchestrator/runner.mjs`, `schemas/run-result.schema.json` | verified | One provider dispatch per run; tokens are returned on success; optional `toolCalls` schema field is not populated by the runner. | Tool-failure and loop telemetry require a defined observable action boundary. |
| E-05 | `evals/run-evals.mjs`, `evals/cases/workflow-discovery.json` | verified | Cases compare selection and contract text; datasets use mock output. | Action order and validation-gate behavior need executable fixtures. |
| E-06 | `docs/templates/Task.md`, `docs/templates/Phase.md`, `docs/templates/Unit.md` | verified | Existing plan-step templates are Markdown files, not a separate workflow-step JSON catalog. | Define supported template invariants against actual files. |
| E-07 | `orchestrator/SHARED.md` section 10 | verified | Calls for trace IDs, redacted logs, and lifecycle hooks; describes retries, while current `executeRun` has no visible retry loop. | Resolve intended versus implemented iteration semantics before setting a metric contract. |
| E-08 | `docs/decisions/0008-pluggable-ai-execution-harness.md` | verified | Accepted a dependency-free native ESM runner and validator, explicitly rejecting a heavier SDK/Zod/Ajv dependency stack at that time. | Prefer extending current validator unless a new dependency is justified and the decision revised. |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | Should telemetry include only Context Factory harness-owned runs, or live sessions in external agent hosts? | decision | User | no | Confirmed harness-owned runs only on 2026-11-07. |
| U-02 | What is the exact observable tool/action and iteration boundary after U-01 is resolved? | decision | User | no | On 2026-11-07, user chose to measure the current runner only. Count provider attempts and lifecycle-stage failures. Mark tool-call failures and agent-loop iterations unavailable because no such loop exists. |
| U-03 | Which catalog/template fields should be required beyond the current validator? | assumption | Maintainer during planning | no | Keep current canonical fields; add checks only for demonstrated supported contracts and negative fixtures. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **User confirmation of shared understanding:** confirmed on 2026-11-07 in this chat after the telemetry and execution boundaries were summarized; user answered "Yes, release this scope."
- **Material unknowns or conflicts:** none; user confirmation of the scoped shared understanding remains pending.
- **Ready for grill:** yes
