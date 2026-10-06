---
title: "Executable Rule Conformance Guardrails and Harness"
type: context
status: ready
created: "2026-10-06"
tags: [context, harness, rules, conformance, validation, llm, architecture]
feature: "executable-rule-conformance-guardrails"
---

# Executable Rule Conformance Guardrails and Harness Context Specification

## 1. Overview & Objective

- **Problem Statement:** Context Factory can resolve rule paths and instruct an LLM to follow them, but the current lifecycle does not reliably prove that the selected rule contents reached the model or that generated code conforms to them. The completed language-rule binding work in ADR 0027 improves prompt attention, yet critical gates remain advisory, structural, or dependent on the same LLM that produced the code.
- **User Value:** A developer should be able to trust that a Context Factory run selected the right rules for the actual stack and touched boundary, supplied those rules at generation time, rejected invalid planning contracts before execution, and produced inspectable conformance evidence before a unit is accepted.
- **Desired Outcome:** Move from prose-only rule reminders to a layered, deterministic contract spanning rule selection, prompt compilation, plan validation, code/tool validation, review evidence, editor bridges, and regression evaluations.

### Measurable Success Criteria

- A run records an immutable rule-binding manifest containing the selected rule paths, source hashes, selection reasons, declared stack, affected file/boundary scope, and any authorized exceptions.
- The default execution path supplies the selected rule contents or compiled directives to the provider; a provider cannot receive only the original user prompt plus a generic system message.
- `plan:check` exits non-zero when a unit is missing a rule block, references missing rules, uses unresolved placeholders, binds rules outside the declared stack/scope, or contains an unauthorized contradiction.
- Rule selection is narrow enough that generic action wording does not automatically bind every `alwaysApply` rule for the default stack.
- Post-generation validation combines deterministic checks with language-native tools where available and produces per-rule PASS, FAIL, WAIVED, or NOT_AUTOMATABLE evidence.
- A unit cannot reach a verified checkpoint when a blocking rule has failed or has no required evidence.
- Evaluation fixtures include intentionally non-conforming plans and code and prove that the harness rejects them.
- Generated editor bridges require agents to consume the resolved/bundled contract, not merely run a command that prints rule paths.

### Current-State Findings

| ID | Classification | Evidence | Finding |
| --- | --- | --- | --- |
| F-01 | verified fact | `scripts/context-core.mjs:380-393` | Rule selection treats every stack rule with `alwaysApply: true` as applicable to any action-scoped request, even before affected files or boundaries are known. |
| F-02 | verified fact | Resolver output captured on 2026-10-06 | `Create a typed TypeScript service` selected 22 rules, including controllers, database access, pagination, UI-independent SOLID rules, and security, demonstrating over-selection and attention dilution. |
| F-03 | verified fact | `orchestrator/runner.mjs:216-249` | `executeRun()` resolves a selection but, without a caller hook, forwards the original prompt and generic system prompt. The selection is metadata passed to the provider; selected source contents are not compiled into the prompt by default. |
| F-04 | verified fact | `scripts/harness-cli.mjs:63-109,175-189` | `bundle` materializes selected source contents, while `run` calls `executeRun()` directly and does not consume that bundle. The two paths are disconnected. |
| F-05 | verified fact | `scripts/plan-check.mjs:243-246,365-388` | Plan validation checks only that a `<language_rules>` block contains non-whitespace. Missing blocks are excluded from the `isValid` result, so JSON and process exit status can report success despite `languageRules.valid: false`. |
| F-06 | verified fact | `evals/plan-check.test.mjs:13-51` | The passing-plan fixture contains no `<language_rules>` block and is expected to exit zero, preserving the advisory behavior in the regression suite. |
| F-07 | verified fact | `evals/run-evals.mjs:11-24,50-83` and `evals/datasets/features/feature-delivery.json:18-21` | Evaluations verify selection membership, contract text fragments, and fixture output fields such as workflow/status; they do not test generated-code conformance or rejection of a violated rule. |
| F-08 | verified fact | `app/cli/core/bridge-generator.mjs:419-563` | Generated editor instructions tell agents to run `resolve` and follow folders, but do not require loading a bundle, acknowledging exact rule hashes, or submitting machine-checkable conformance evidence. |
| F-09 | verified fact | `docs/decisions/0027-language-rule-lifecycle-binding-and-verification.md:37-45,53-79` | The accepted solution deliberately relies on scoped prompt binding and LLM diff review, and adds no external executable enforcement. The newly reported failure is therefore a gap beyond ADR 0027 rather than evidence that its documented changes are absent. |

## 2. Requirements & User Stories

### Actors and User Stories

- *As a developer*, I want non-conforming generated code to be rejected before a checkpoint, so that rule compliance is not a trust-based claim.
- *As a planner*, I want each unit's rules derived from declared stack and file/boundary scope, so that units receive neither missing nor irrelevant standards.
- *As an executor/model adapter*, I want one compiled rule contract at the point of generation, so that prompt assembly does not depend on each caller implementing a custom hook correctly.
- *As a reviewer*, I want rule-by-rule evidence tied to the actual diff and tool outputs, so that I can distinguish automated proof, manual inspection, waivers, and unsupported checks.
- *As a rule author*, I want every enforceable rule to declare applicability and verification metadata, so that prose, selectors, validators, skills, and workflows do not drift independently.
- *As a CI maintainer*, I want deterministic negative fixtures, so that a guardrail regression fails even when ordinary happy-path tests remain green.

### Scenario Matrix

| ID | Situation | Expected Outcome | Failure / Recovery |
| --- | --- | --- | --- |
| SC-01 | A TypeScript service unit declares exact files and symbols | Resolver binds only common/service/architecture rules relevant to those files and emits their hashes and directives | Unknown file scope blocks execution or requires explicit discovery; it does not silently bind the full catalog |
| SC-02 | A unit omits `<language_rules>` or leaves template placeholders | `plan:check` exits non-zero with an actionable diagnostic | Planner repairs the unit before any worktree execution |
| SC-03 | A unit cites a nonexistent or wrong-stack rule | Contract validation rejects the plan | Re-resolve against the declared host stack and update the unit |
| SC-04 | Default runner invokes an LLM provider | Provider receives a compiled, delimited rule contract and provenance, not only paths | Prompt preparation failure stops the run before provider dispatch |
| SC-05 | Generated code uses `any` despite a blocking TypeScript rule | Language-native static checks or a deterministic policy check fails the unit | Executor repairs code and reruns checks; reviewer sees both failed and passing attempts |
| SC-06 | A rule is architectural and cannot be fully linted | Harness records the rule as NOT_AUTOMATABLE and requires named review evidence/checklist | Missing human evidence blocks the checkpoint when the rule is marked blocking |
| SC-07 | A legitimate exception is needed | An explicit waiver records rule ID, scope, authority, rationale, expiry/review trigger, and compensating check | Undocumented inline deviation is rejected |
| SC-08 | An editor bridge cannot inject runtime hooks | Generated host instructions require a bundle/receipt workflow and a pre-check command | Unsupported editor capabilities are surfaced rather than silently treated as enforced |
| SC-09 | Host-local rule text contains malicious or conflicting instructions | Provenance and precedence validation rejects forbidden overrides and records the conflict | User or accepted ADR must authorize a scoped exception |
| SC-10 | A language has rules but no conformance adapter | Prompt binding still works, but enforcement capability is reported as partial | The stack cannot be advertised as fully enforced until its adapter contract passes |

### Functional Requirements

- [ ] **FR-01 — Canonical rule contract:** Define machine-readable identity, applicability, severity, verification mode, and exception policy for each enforceable rule while keeping human-readable Markdown canonical.
- [ ] **FR-02 — Artifact-aware resolution:** Resolve against declared stack plus changed/planned paths, layer, artifact type, and workflow; reject ambiguous default-stack inference for material code generation.
- [ ] **FR-03 — Compiled generation context:** Make default prompt preparation consume the immutable selected bundle and place concise directives adjacent to the generation request.
- [ ] **FR-04 — Fail-closed plan validation:** Validate rule references, placement, scope match, non-placeholder directives, contradictions, and exception metadata; include the result in process exit status.
- [ ] **FR-05 — Conformance adapter interface:** Support deterministic generic checks and pluggable stack adapters that invoke existing formatter/linter/typechecker/test/architecture tools without embedding every language in the core.
- [ ] **FR-06 — Evidence ledger:** Persist per-rule result, command, exit code, relevant output, diff/source hash, timestamp, and verifier type.
- [ ] **FR-07 — Review/checkpoint gate:** Require all blocking rules to be PASS or explicitly WAIVED before `review`, `verify`, or phase completion can report success.
- [ ] **FR-08 — Bridge parity:** Generate equivalent enforcement instructions and commands for Codex, Claude, Gemini/Antigravity, Cursor, Windsurf, Trae, and Copilot within their supported capabilities.
- [ ] **FR-09 — Adversarial evaluations:** Add negative plan, prompt-capture, bridge, source-diff, waiver, stale-hash, and wrong-stack cases.
- [ ] **FR-10 — Synchronization:** Update canonical sources, manifest/maps, schemas, lock, doctor, evaluations, and version as one context-maintenance change.

### Quality Attributes

- **Deterministic:** The same request, host profile, file scope, and context version produce the same rule-binding manifest.
- **Explainable:** Every inclusion, exclusion, failure, waiver, and unsupported check has a reason.
- **Fail-safe:** Missing required context or failed prompt compilation stops before generation; failed blocking checks stop before checkpoint.
- **Portable:** Core contracts stay model-neutral and stack adapters stay isolated behind a stable interface.
- **Token-aware:** The model receives concise directives, while full source and hashes remain available in the evidence bundle.
- **Backward-compatible:** Existing Markdown rules remain readable; migration can add metadata progressively with a temporary, visible partial-enforcement status.

## 3. Technical & Architectural Context

### Affected Boundaries

- **Resolution:** `scripts/context-core.mjs`, host `.context-bridge.json`, rule frontmatter, and resolver CLI output.
- **Bundle and prompt compilation:** `scripts/harness-cli.mjs`, `app/cli/core/bundler.mjs`, `orchestrator/runner.mjs`, and provider adapters.
- **Planning gate:** `scripts/plan-check.mjs`, `docs/templates/Unit.md`, `skills/productivity/plan*`.
- **Execution and review:** `skills/engineering/execute`, `review`, and `verify`, plus a proposed conformance runner/adapter boundary.
- **Schemas and evidence:** `schemas/`, run result contract, rule-binding contract, waiver contract, and conformance report contract.
- **Cross-editor delivery:** `app/cli/core/bridge-generator.mjs` and doctor checks for generated instructions.
- **Regression harness:** `evals/cases/`, `evals/datasets/`, and focused Node tests.

### Language Stack & Applicable Rules for This Design Work

- **Implementation stack:** Pure Node.js ESM JavaScript and Markdown contracts.
- **Applicable rules:**
  - `rules/global/evidence-and-claims.md` — every enforcement claim needs source or runtime evidence.
  - `rules/global/architecture-conformance.md` — preserve accepted contracts and record a durable replacement/extension decision.
  - `rules/global/code-quality.md` — keep core modules cohesive and independently testable.
  - `rules/solid/single-responsibility.md` — separate resolution, compilation, validation, adapter execution, and reporting.
  - `rules/solid/open-closed.md` — add stack enforcement via adapters rather than core conditionals for every language.
  - `rules/solid/dependency-inversion.md` — orchestration depends on a conformance-port contract; stack/tool adapters implement it.

### Candidate Architecture for the Later ADR (1-3-1)

1. **Stronger prompt and checklist enforcement:** Make rule injection the default, tighten bridge text, and make `plan:check` fail closed. Lowest cost, but still cannot independently prove generated code conforms.
2. **Layered rule-contract harness with pluggable conformance adapters (recommended):** Add machine-readable applicability and verification metadata, compile an immutable generation contract, run deterministic preflight gates, invoke stack-native checks through adapters, and persist per-rule evidence. This closes the observed gaps while preserving Markdown sources and reversible adapter boundaries.
3. **External multi-language policy/AST engine:** Translate rules into a dedicated policy engine or AST service and make it authoritative. Offers deeper automation, but introduces substantial language coverage, hosting, synchronization, and false-positive costs before the local contract is mature.

The ADR must decide whether option 2 is accepted, define the adapter contract and failure policy, and state how it extends or partially supersedes ADR 0027 without discarding its prompt-proximity benefits.

### Data, Security, Performance, and Operations

- **Data:** No application database changes are expected. New versioned JSON schemas and local run artifacts are likely.
- **Security:** Only repository-authorized rule sources may enter the system prompt. Paths must remain inside declared roots; host overrides need provenance and conflict checks. Logs and reports must avoid source secrets and model credentials.
- **Performance:** Cache rule parsing and tool capability discovery by content hash. Run only checks mapped to touched scope; avoid invoking full-project tools for every small unit when a sound focused command exists.
- **Operations:** CI and local execution must use the same conformance command and report schema. Tool-unavailable and timeout states must be explicit and must not be mislabeled PASS.
- **Rollback:** Keep the previous resolver and prompt-binding behavior behind a temporary compatibility mode during migration; rollback removes the blocking gate while retaining evidence artifacts and ADR 0027 prompt anchors.

## 4. UI/UX & Interaction Guidelines

This is primarily a CLI and agent-contract feature.

- Display a compact preflight summary: declared stack, affected scope, bound rules, blocking checks, unsupported checks, and waivers.
- On failure, name the rule, affected file/symbol, evidence command, and remediation path.
- Separate `WARN`, `FAIL`, `WAIVED`, `NOT_AUTOMATABLE`, and `TOOL_UNAVAILABLE`; never collapse them into a generic warning.
- Keep normal successful output concise while allowing a JSON report for CI and detailed inspection.

## 5. Scope & Boundaries

### In Scope

- Rule applicability and verification metadata.
- Deterministic rule binding and prompt compilation.
- Blocking validation of plan/unit rule contracts.
- Pluggable conformance execution and evidence reporting.
- Lifecycle integration across context, plan, execute, review, verify, bridges, doctor, and evaluations.
- Migration of the currently supported TypeScript and Laravel rule catalogs according to the rollout decision still to be confirmed.

### Out of Scope / Non-Goals

- Building a hosted policy SaaS or telemetry backend.
- Automatically rewriting failed code without developer/agent review.
- Claiming full enforcement for the empty `rules/flutter/` catalog.
- Replacing project-native linters, typecheckers, formatters, tests, or architecture tools.
- Encoding every architectural judgment as AST logic; some checks will require explicit review evidence.
- Implementing production changes before this context is confirmed, an ADR is accepted, and a plan is approved.

## 6. Decisions, Assumptions, and Open Questions

### Proposed Decisions

| ID | Status | Proposal |
| --- | --- | --- |
| D-01 | proposed | Preserve ADR 0027 prompt-proximity binding, but treat it as one layer rather than proof of compliance. |
| D-02 | proposed | Introduce a canonical rule-binding manifest and conformance report as contracts between resolver, runner, plan checker, adapters, and reviewers. |
| D-03 | proposed | Keep stack-specific enforcement behind adapter interfaces and reuse host-native tools. |
| D-04 | decided | Fail closed when a blocking rule fails or lacks required evidence. Permit only an explicit, scoped, authorized, expiring waiver with rationale and compensating evidence. Confirmed by the user on 2026-10-06. |
| D-05 | decided | Deliver the core rule contract and TypeScript conformance adapter first; add Laravel in the next gated phase using the same adapter contract. Do not claim Flutter enforcement while its rule catalog is empty. Confirmed by the user on 2026-10-06. |
| D-06 | decided | Only a human maintainer may authorize, renew, or broaden a rule waiver. Agents may detect the need and draft a waiver request, but may not approve their own or another agent's exception. Confirmed by the user on 2026-10-06. |
| D-07 | decided | Every enforceable directive declares exactly one mode: `automated-blocking`, `evidence-blocking`, or `advisory`. Unmigrated directives are reported as unsupported and cannot be claimed enforced. Confirmed by the user on 2026-10-06. |
| D-08 | decided | Repository/CLI preflight and conformance gates are authoritative across all supported editors. Editor-native prompt hooks are supplemental and may improve generation, but cannot weaken or replace the shared gates. Confirmed by the user on 2026-10-06. |

### Assumptions

- Markdown remains the authoring source of truth, with structured frontmatter or linked descriptors supplying machine-readable fields.
- The first implementation can remain dependency-light and call existing host tools as subprocesses.
- Exact changed paths are available by plan scope before execution and by Git diff after execution.

### Resolved Question Q-01 — Enforcement Failure Policy

**Decision:** Fail closed with governed waivers. A failed or unverifiable blocking rule stops planning, execution, CI, review, or checkpoint success. A waiver must identify the rule, exact scope, authorizing party, rationale, expiry or review trigger, and compensating evidence. Advisory-only results remain available only for rules explicitly classified as non-blocking.

This rejects advisory-only enforcement because it preserves the current trust gap, and rejects absolute no-waiver enforcement because some architectural rules require bounded human judgment or temporary migration exceptions.

### Resolved Question Q-02 — Initial Stack Rollout

**Decision:** Introduce stack enforcement progressively. The first gated delivery must prove the full contract, prompt compilation, preflight, TypeScript adapter, evidence report, and blocking checkpoint against Context Factory's own Node.js code. The next gated delivery adds Laravel through the same adapter interface. Flutter remains explicitly unsupported until its rule catalog and adapter exist.

This rejects a combined TypeScript/Laravel first release because it expands the diagnostic surface before the contract is proven, and rejects a contract-only release because it would not demonstrate real code-violation detection.

### Resolved Question Q-03 — Waiver Authority

**Decision:** Waiver authority belongs exclusively to a human maintainer. An agent may produce a proposed waiver record containing the rule, scope, rationale, expiry/review trigger, and compensating evidence, but the record remains inactive until explicit human approval is attached. Agents cannot renew or broaden an approved waiver.

This rejects reviewer-agent authorization because generator and reviewer may share the same model failure mode, and rejects configuration-only authorization because a static bypass can become stale or unintentionally broad.

### Resolved Question Q-04 — Rule Enforcement Classification

**Decision:** Every enforceable directive must declare exactly one enforcement mode: `automated-blocking`, `evidence-blocking`, or `advisory`. Automated-blocking directives require a passing deterministic/tool result. Evidence-blocking directives require named, inspectable human evidence. Advisory directives are reported but do not block. Unmigrated or unclassified directives are `unsupported`, not implicitly advisory and never counted as enforced.

This rejects treating every directive as mechanically blocking because subjective checks would generate false failures, and rejects making all non-automated guidance advisory because architectural constraints would remain optional.

### Resolved Question Q-05 — Cross-Editor Enforcement Boundary

**Decision:** The repository/CLI contract is authoritative across supported editors. Every editor integration must invoke or clearly require the same deterministic preflight, rule-binding, conformance, and evidence gates. Native prompt hooks may inject the compiled contract earlier or present richer feedback, but are supplemental and cannot substitute for repository verification.

This rejects editor-native authority because capabilities differ and would produce inconsistent guarantees, and rejects limiting support to fully hookable editors because it would break the existing cross-editor bridge contract.

## 7. References

- `docs/decisions/0004-deterministic-context-harness.md`
- `docs/decisions/0008-pluggable-ai-execution-harness.md`
- `docs/decisions/0018-synchronization-and-package-manager-modernization.md`
- `docs/decisions/0021-explicit-language-stack-selection.md`
- `docs/decisions/0027-language-rule-lifecycle-binding-and-verification.md`
- `docs/context/rules/language-rule-lifecycle-binding.md`
- `workflows/architecture-change.md`
- `workflows/context-maintenance.md`

## Readiness Gate

**Status: ready.** Q-01 through Q-05 are resolved. The objective, actors, stack scope, failure/recovery scenarios, security boundary, enforcement modes, waiver authority, rollout sequence, cross-editor authority, success criteria, and non-goals are explicit. The user confirmed the shared understanding and authorized ADR plus implementation planning on 2026-10-06. No unresolved product-policy blocker remains.
