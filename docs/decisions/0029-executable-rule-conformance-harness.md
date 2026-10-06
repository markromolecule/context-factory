---
title: "Executable Rule Conformance Harness"
type: decision
status: accepted
created: "2026-10-06"
tags: [adr, rules, harness, conformance, validation, adapters, evidence, llm]
---

# 0029 — Executable Rule Conformance Harness

## Context

ADR 0027 established active language-rule binding, point-of-generation proximity, rule precedence, and an LLM review gate. Those controls remain useful, but repository evidence shows they do not form an executable enforcement boundary:

- `orchestrator/runner.mjs` resolves rule paths but the default run path forwards the original request and a generic system prompt; selected source contents are not compiled into the provider prompt unless a caller supplies a custom hook.
- `scripts/harness-cli.mjs` can build a source-complete bundle, but `run` does not consume it.
- `scripts/plan-check.mjs` detects only a non-empty `<language_rules>` block and excludes missing-rule diagnostics from the failing exit condition.
- Current plan-check tests accept a plan with no language-rule block, and evaluation datasets assert routing/selection metadata rather than rejection of non-conforming code.
- Editor bridges instruct agents to invoke resolution, but cannot prove the resulting rules were loaded or obeyed.
- Request-term scoring plus broad `alwaysApply` metadata can select a large, weakly scoped rule set before affected files or architecture boundaries are known.

The authorized context is `docs/context/harness/executable-rule-conformance-guardrails.md`. The user confirmed these policy constraints:

1. Blocking failures fail closed, with explicit governed waivers.
2. Only a human maintainer may authorize, renew, or broaden a waiver.
3. Every enforceable directive declares `automated-blocking`, `evidence-blocking`, or `advisory`; unmigrated directives are `unsupported` and cannot be claimed enforced.
4. Delivery proves the core contract and TypeScript adapter first, then adds Laravel through the same adapter boundary; Flutter is not claimed supported while its catalog is empty.
5. Repository/CLI gates are authoritative across editors; editor-native hooks are supplemental.

### Decision problem

How should Context Factory turn Markdown rules into narrow, portable, fail-closed guardrails that can prove what the model received and what the resulting code satisfied, without replacing project-native tools or coupling the core to every language?

### Success criteria

- Deterministic, immutable rule-binding manifests connect request, stack, touched scope, selected directives, source hashes, and exceptions.
- The default provider path receives the compiled directives before generation.
- Invalid or placeholder plan bindings fail before execution.
- Post-generation validation reports per-directive PASS, FAIL, WAIVED, NOT_AUTOMATABLE, TOOL_UNAVAILABLE, or UNSUPPORTED evidence without conflating states.
- A blocking directive must PASS or hold a valid human-authorized waiver before a checkpoint can succeed.
- TypeScript enforcement is proven end to end before Laravel is added through the same port.
- All supported editors share the same repository/CLI minimum guarantee.

## Options considered

### Option 1 — Strengthen prompt contracts and lifecycle checklists

Make bundle injection the runner default, tighten `<language_rules>` validation, and expand bridge instructions and reviewer checklists. This is the smallest change and preserves the existing Markdown model. It improves the probability of first-pass compliance but still asks an LLM or human to prove most outcomes, cannot reliably distinguish an executed check from a textual claim, and leaves language-native validation outside the lifecycle contract.

Choose this only if Context Factory is intentionally advisory and false acceptance is tolerable. That conflicts with the confirmed fail-closed policy.

### Option 2 — Layered rule contract with pluggable conformance adapters

Keep Markdown canonical, add structured directive identity/applicability/enforcement metadata, compile an immutable rule-binding manifest, make prompt compilation mandatory, validate plan bindings deterministically, and execute post-generation checks through a model-neutral conformance port. Generic validators handle contract integrity; stack adapters map directives to existing host tools and focused checks. A conformance report records evidence and gates lifecycle success. Editor hooks can improve prompt delivery, but repository/CLI commands remain authoritative.

This adds schemas, migration work, and explicit adapter ownership. Some architecture rules remain evidence-blocking rather than fully automated. In return, it closes the selection, delivery, validation, and evidence gaps without building a hosted service or embedding language-specific conditionals in the orchestrator.

Choose this when portable, inspectable, fail-closed enforcement is required while language-native tooling remains the source of technical truth.

### Option 3 — External multi-language AST/policy engine

Translate all rules into a dedicated policy engine or service that parses source trees, owns enforcement, and integrates with editors and CI. This could eventually provide deep semantic checks and centralized reporting across repositories.

It introduces new infrastructure, language-parser coverage, rule duplication or compilation complexity, operational availability requirements, and a high false-positive maintenance burden. It also makes the local Markdown factory dependent on a hosted or heavyweight runtime before directive identities and evidence contracts are mature.

Choose this only after local adapter volume and cross-repository trace data demonstrate that a centralized engine is justified.

## Decision

Adopt **Option 2: Layered rule contract with pluggable conformance adapters**.

ADR 0027 remains authoritative for point-of-generation proximity and rule precedence. This decision extends it by making selection, delivery, validation, and evidence executable. Where ADR 0027 describes an LLM review as a verification gate, ADR 0029 requires that review to consume a conformance report and prevents it from declaring success over failed or missing blocking evidence.

### Boundary and dependency direction

Use five cohesive boundaries:

1. **Rule descriptor parser:** converts canonical Markdown/frontmatter into versioned directive descriptors and rejects invalid identity, applicability, enforcement mode, or verification metadata.
2. **Rule binding compiler:** combines declared stack, workflow, planned/changed file scope, relevant architecture boundary, source hashes, and active waivers into an immutable binding manifest.
3. **Prompt compiler:** renders the scoped directives and provenance into the model request. Provider adapters receive a compiled prompt contract, not raw selection metadata.
4. **Conformance orchestrator:** depends on a lean `ConformanceAdapter` port and aggregates generic contract checks with stack-specific results.
5. **Evidence gate:** evaluates directive results and waiver validity, emits the versioned report, and supplies the only success status accepted by execute/review/verify/checkpoint workflows.

High-level orchestration owns the port and report contracts. TypeScript and later Laravel adapters depend on those contracts. Provider and editor adapters cannot redefine enforcement semantics.

### Contract decisions

- Add versioned schemas for rule descriptors, binding manifests, waiver records, adapter results, and conformance reports.
- Give directives stable IDs independent of headings and file renames.
- Require applicability metadata for stack, artifact/layer, and path patterns; require an explicit enforcement mode and verifier type.
- Hash source rules and touched scope so stale bindings or post-validation changes invalidate the report.
- A waiver is inactive without explicit human authority, exact rule/scope, rationale, compensating evidence, and expiry/review trigger.
- Treat `UNSUPPORTED`, `NOT_AUTOMATABLE`, `TOOL_UNAVAILABLE`, and `FAIL` as distinct states. For blocking directives, none may be normalized to success.
- Existing unclassified rules migrate visibly; they are not included in enforcement coverage metrics until classified.

## Consequences

### Rules, skills, and workflows

- Rules gain structured enforcement responsibilities; skills remain procedures; workflows remain lifecycle sequencing. The same policy must not be duplicated across all three.
- `context` records stack and boundary scope, `plan` binds directive IDs, `plan-review` validates them, `execute` compiles/runs them, and `review`/`verify` consume the resulting evidence.
- `plan:check`, runner status, CLI exit codes, and task completion status must agree on blocking outcomes.

### Data and schemas

- No application database is introduced.
- Local JSON artifacts become durable run evidence and require schema/version migration rules, deterministic serialization, and source/diff hashes.
- Generated artifacts remain ignored or stored under an intentional local run directory; accepted waivers belong in reviewable repository documentation or configuration.

### Security

- Rule loading is restricted to declared repository roots with path traversal protection.
- Factory, host, and waiver provenance is explicit; a host rule cannot silently override higher-authority contracts.
- Prompt compilation treats rule text as policy data and rejects instructions that attempt to alter authority or tool permissions outside the rule schema.
- Reports omit secrets, credentials, full prompts, and unrelated source content.
- Agents cannot authorize their own exceptions.

### Performance

- Parse and cache descriptors by content hash.
- Select checks by touched paths and directive applicability.
- Prefer focused project-native commands when they provide sound coverage; phase/final gates may run broader suites.
- Record timeouts and unavailable tools without converting them to PASS.

### Operations and editor compatibility

- One repository/CLI command contract drives local execution and CI.
- Editor bridges expose the same required preflight and conformance commands. Native hooks may compile prompts earlier or display diagnostics, but do not own final status.
- Doctor reports catalog migration coverage, adapter availability, schema/lock health, and bridge parity separately.

### Migration

1. Introduce schemas and parser in compatibility mode while existing rules are reported as unclassified/unsupported.
2. Migrate a minimal TypeScript rule slice and prove negative fixtures.
3. Connect binding, prompt compilation, plan validation, conformance execution, and checkpoint gating.
4. Expand TypeScript directives only after the vertical slice passes.
5. Add the Laravel adapter and migrate its catalog in a separate gated phase.
6. Remove compatibility behavior only after bridge, CI, and task artifacts use the new contracts.

### Rollback

- Keep schema versions and adapter registration additive during migration.
- A phase can disable the new blocking command and return to ADR 0027 prompt binding without deleting reports or changing Markdown rule content.
- Rollback must never label previously unsupported or failed directives as enforced.
- Reverting an adapter does not change the core manifest or evidence schemas.

## Validation and review trigger

Validate with:

- parser/schema tests for invalid modes, paths, duplicate IDs, stale hashes, and unsafe overrides;
- plan-check negative tests for missing, placeholder, nonexistent, wrong-stack, irrelevant, and contradictory bindings;
- prompt-capture tests proving selected directive content and hashes reach each provider path;
- TypeScript adapter fixtures containing deliberate type, import-boundary, validation, and architecture violations;
- waiver tests for absent authority, over-broad scope, expiry, renewal, and compensating evidence;
- lifecycle tests proving failed blocking results prevent review/verify/checkpoint success;
- bridge tests proving every supported editor exposes the authoritative repository commands;
- doctor/evaluation checks proving inventory, maps, schemas, lock, and reported coverage agree.

Review this decision after the TypeScript adapter has completed ten material units or by 2027-04-06, whichever comes first. Reconsider an external policy engine only if adapter duplication, performance, or cross-repository trace volume makes the local model unsustainable.
