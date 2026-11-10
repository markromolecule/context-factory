---
title: "Grounded Run Context and Retrieval Evaluations"
type: context
status: ready
created: "2026-11-10"
tags: [context, harness, retrieval, evaluations]
feature: "grounded-run-context-and-retrieval-evaluations"
---

# Grounded Run Context and Retrieval Evaluations Context Specification

## 1. Overview & Objective

The resolver selects canonical files and the bundle compiler records their full text, paths, and hashes, but `executeRun` currently sends only the request and compiled rule directives to a provider. Dataset evaluations pass the expected output into the mock provider as a fixture. Common wording such as “implement an authenticated orders endpoint” currently selects neither the feature workflow nor the security rule.

The maintainer wants a direct run to use the selected sources within an enforced input budget, and wants evaluations to observe the retrieval-to-answer path. Success means the provider receives bounded, provenance-labeled source material; a required-source overflow stops before dispatch; the authenticated-orders request routes to feature delivery and security guidance; and offline evaluations fail if the evidence needed for an answer is absent or altered.

## 2. Requirements & Scenarios

- **Actors:** A developer or agent invokes `context-cli run`; a maintainer authors canonical context and evaluates regressions; a provider consumes the assembled prompt; a reviewer checks that a passing evaluation actually exercised retrieval and answer derivation.
- **Authority:** Repository instructions and compiled rule bindings retain their existing priority. Retrieved file text is source data, including when a file is canonical; it does not acquire system-instruction authority merely by being retrieved. The maintainer owns deliberate changes to source selection and golden expectations.
- **FR-01:** Include selected file content in the direct run's provider input with repository-relative path and content hash. Keep the original request and mandatory rule directives intact.
- **FR-02:** Enforce a deterministic input budget before invoking any provider. Count the final assembled input, including request, instructions, source labels, and binding text. Do not silently truncate a file or claim that an estimate is exact provider token usage. Define required versus optional source behavior and a clear overflow result during planning.
- **FR-03:** Present retrieved text in a clearly delimited source section so instructions embedded in a source cannot silently become higher-priority instructions. Preserve source order and provenance consistently across providers.
- **FR-04:** Route “implement an authenticated orders endpoint” to the feature-delivery workflow and `rules/global/security-guardrails.md`, without making unrelated order requests security-sensitive.
- **FR-05:** Add offline evaluation that consumes the assembled provider input and checks an answer derived from retrieved content, including provenance. It must fail when needed content is removed or changed. Existing selection fixtures may remain, but fixture-fed output must not be presented as answer-quality evidence.

| ID | Situation | Expected outcome and recovery |
| --- | --- | --- |
| S-01 | KISS/YAGNI request with available canonical notes | Provider input includes each selected note's path, hash, and full content; answer evaluation derives claims from those notes. |
| S-02 | Input fits the cap exactly or is one unit over | Exact-cap input dispatches; overflow is rejected before provider invocation with a useful diagnostic. |
| S-03 | Optional sources exceed the cap | A deterministic selection policy removes whole optional sources and reports omissions; required instructions and sources remain intact. |
| S-04 | Required content alone exceeds the cap | Run fails closed before provider invocation; caller can narrow scope or raise an explicitly configured cap. |
| S-05 | Retrieved source contains instruction-like text or unsafe path | Source remains labeled as data; unsafe paths are rejected before dispatch. |
| S-06 | Authenticated orders endpoint request | Feature-delivery workflow and security guardrails are selected; ordinary order-domain wording does not trigger unrelated security guidance. |
| S-07 | Golden answer is supplied directly to mock or needed note is withheld | Evaluation cannot pass from a canned answer; evidence removal or mutation causes a meaningful failure. |
| S-08 | Provider omits usage counts or uses a different tokenizer | Pre-dispatch budget remains a conservative local estimate and is labeled as such; provider-reported usage is reported separately when present. |

## 3. Technical & Architectural Context

- **Stack:** Dependency-free Node.js ESM harness; TypeScript-specific rules are catalog data rather than the implementation language of these modules. Applicable global rules include code quality, evidence and claims, and security guardrails. JavaScript/ESM files are outside the current TypeScript preflight binding support, so their verification needs actual Node tests and applicable global review.
- **Current files:** `scripts/context-core.mjs` selects paths and reports estimated budget status; `orchestrator/rules/prompt-compiler.mjs` builds an immutable source bundle but `compilePrompt` does not inject it; `orchestrator/runner.mjs` resolves then dispatches; `evals/run-evals.mjs` passes `goldenOutput` as a fixture; `evals/tests/rules/prompt-compiler.test.mjs` and `evals/tests/resolver/intent-routing.test.mjs` cover adjacent behavior.
- **Existing decisions:** ADR 0004 keeps Markdown/manifest canonical and starts with deterministic lexical retrieval. ADR 0008 accepts a dependency-free provider runner and offline mock evaluation. ADR 0041 separates context selection from verification claims.
- **Data and security:** No database or application authorization change. Source text and request text may be sensitive, so new diagnostics and evaluation reports should report paths, hashes, counts, and error classes without dumping full provider payloads.

## 4. Scope & Boundaries

**In scope:** Direct harness run payload assembly, enforceable input-budget policy, source provenance and instruction boundary, targeted authenticated-request routing, and offline retrieval-to-answer evaluation with positive and negative cases. Update affected CLI/help or contract documentation if behavior changes.

**Out of scope:** Vector database, embeddings, hosted retrieval, new provider SDKs, external IDE-agent instrumentation, production host code checks, agent tool loop, provider pricing, and a CI dependency on live model credentials. A deterministic offline provider proves the harness boundary, not broad live-model answer quality.

## 5. Evidence & Handoff

| ID | Evidence | State | Finding and consequence |
| --- | --- | --- | --- |
| E-01 | `scripts/context-core.mjs` | verified 2026-11-10 | Selection includes path-level sources; budget is an estimate and warning, not an enforced dispatch gate. |
| E-02 | `orchestrator/rules/prompt-compiler.mjs`, `orchestrator/runner.mjs` | verified 2026-11-10 | Bundle captures content and hashes, but direct dispatch does not use it. |
| E-03 | `evals/run-evals.mjs` | verified 2026-11-10 | Golden output is passed to the mock provider as a fixture before comparison. |
| E-04 | `node app/cli/bin/context-cli.mjs resolve 'implement an authenticated orders endpoint' --json` | verified 2026-11-10 | Workflow and security rule were absent. |
| E-05 | `node scripts/context.mjs doctor` | verified 2026-11-10 | Catalog and current 27 evaluations passed; this does not cover the new behavior. |

**Material product or scope unknowns:** none. The user confirmed both goals for planning on 2026-11-10 and confirmed this message as the scope source in the same chat. Numerical cap, source-priority policy, and evaluation fixture representation are implementation choices for the plan.

**Handoff:** Ready for grounding and grill. The released brief, rather than this specification, is the direct input to `plan`.
