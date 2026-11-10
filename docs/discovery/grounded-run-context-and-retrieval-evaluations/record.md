---
title: "Grounded Run Context and Retrieval Evaluations Discovery"
type: discovery-record
status: ready
created: "2026-11-10"
sourceContext: docs/context/harness/grounded-run-context-and-retrieval-evaluations.md
sourceContextHash: sha256:df5d14817342d00cc415076f5da19f6dcb9d2fb51a1d651b43ba2fa12758d4b7
---

# Grounded Run Context and Retrieval Evaluations Discovery Record

## Outcome, actors, and authority

The maintainer asked for two linked outcomes: selected context must enter the direct run payload with paths and hashes under an enforced token budget, and tests must check retrieval together with answer derivation. The maintainer explicitly confirmed on 2026-11-10 that these two goals are the scope for the plan. The direct CLI user, canonical-content maintainer, provider, and reviewer are the affected actors. Existing repository instructions and rule bindings govern behavior; retrieved text remains source data and cannot become a higher-priority instruction through its location in the prompt.

## Grounding claim packet

| ID | Source and authority | Last verified and hash | Selection reason and result |
| --- | --- | --- | --- |
| G-01 | `knowledge/principles/kiss.md`, active canonical principle | `lastVerified: 2026-10-10`; checked 2026-11-10; `sha256:caa4c31363d68199e25ce4e67e9ab80e0ec55588348ce31d6ca4e8808fba8405` | verified: extend the existing selector, bundle, and runner seams before adding a new retrieval service. |
| G-02 | `knowledge/principles/yagni.md`, active canonical principle | `lastVerified: 2026-10-10`; checked 2026-11-10; `sha256:ff5bf723ec8c758403a4502b7ab4d893139d83fe4e4e7f6a7f52ae83b2634a2e` | verified: a vector database, hosted model judge, and new provider SDK are outside the stated need. |

These principles guide scope but do not determine a numerical budget or source-order policy. No applicable canonical knowledge note answers those technical choices; the plan must compare viable approaches. No conflicting canonical claims were found.

## Repository evidence and reconciled contracts

| ID | Evidence | Finding and consequence |
| --- | --- | --- |
| R-01 | `scripts/context-core.mjs` selection and budget logic | Paths are selected; budget status is advisory and estimated at roughly four characters per token. An enforced final-input gate is new work. |
| R-02 | `orchestrator/rules/prompt-compiler.mjs`, `orchestrator/runner.mjs` | The bundle captures source text, path, and hash, but `executeRun` dispatches the unaugmented request plus compiled directives. Integrate the existing bundle seam with provider input. |
| R-03 | `evals/run-evals.mjs` and `orchestrator/runner.mjs` mock provider | Dataset golden output is passed to the provider as a fixture, then compared with itself. A source-dependent evaluation must observe the assembled prompt and derive output without the golden answer. |
| R-04 | `node app/cli/bin/context-cli.mjs resolve 'implement an authenticated orders endpoint' --json` on 2026-11-10 | The workflow is null and the security rule absent. Add a positive route and nearby negative cases without expanding all order requests to security work. |
| R-05 | ADR 0004, ADR 0008, ADR 0041 | Preserve manifest/Markdown source, dependency-free ESM runner, offline evaluation, and honest distinction between selection and code verification. |
| R-06 | `node scripts/context.mjs doctor` on 2026-11-10 | Existing catalog and 27 evaluations pass. This is a baseline, not evidence that the requested run payload or answer path works. |

## Accepted boundaries and remaining technical choices

1. Include selected source content with repository-relative path and hash in the direct provider input; keep source text labeled as data and preserve mandatory rule directives.
2. Enforce a deterministic pre-dispatch input cap. A run that cannot fit required content does not call a provider. Optional source selection may be a plan-level technical choice; no silent truncation of a source is allowed.
3. Evaluate the retrieval-to-answer path without passing the expected answer to the mock. The offline result must depend on the retrieved source; it does not claim broad live-model quality.
4. Route authenticated orders endpoint implementation to feature delivery and security guardrails, while avoiding an unrelated security classification for ordinary order requests.
5. Keep live-model CI, embeddings, a vector store, hosted retrieval, new SDKs, and external IDE instrumentation out of scope.

The user specified no numerical budget. The plan can choose a conservative default and explicit override policy, with tests at the boundary. A choice among whole-source omission, failure, or another defensible bounded approach must be recorded in the plan's decision ledger.

## Scenario challenge

| ID | Class and challenge | Expected result and recovery |
| --- | --- | --- |
| S-01 | Happy path: KISS and YAGNI notes are selected | Provider input contains both full notes with path/hash labels; source-dependent answer checks pass. |
| S-02 | Boundary: final input equals or exceeds cap by one unit | Equal fits; overflow rejects before dispatch and reports the budget condition. |
| S-03 | Boundary: optional sources overflow | Whole optional sources are omitted in a deterministic order and reported; required content is intact. |
| S-04 | Failure: required content overflows | Run fails before provider call; caller narrows scope or explicitly adjusts the cap. |
| S-05 | Abuse: retrieved file embeds instruction-like text or path escape | Delimiter and authority boundary remain clear; unsafe path is rejected. |
| S-06 | Routing: authenticated orders versus ordinary orders | Authenticated endpoint gets feature workflow and security rule; ordinary order task does not get security guidance solely from domain wording. |
| S-07 | Regression: golden fixture passed to mock, needed note removed or changed | Evaluation cannot pass from fixture echo; removal or mutation fails provenance and answer assertions. |
| S-08 | Lifecycle: provider usage differs from local estimate | Budget uses labeled local estimate for pre-dispatch protection; actual provider tokens remain separately reported. |

## Coverage audit and confirmation

The record covers actors, authority, success, source ownership, happy path, boundaries, failures, abuse, regression, and lifecycle behavior. No data migration, application authorization change, or UI behavior is in scope. There is no material product or scope unknown. The user confirmed the two-goal scope on 2026-11-10 in this chat and then explicitly instructed the assistant to continue the plan. Technical decisions remain assigned to planning. **Ready for release: yes.**
