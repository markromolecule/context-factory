{
  "contractVersion": 2,
  "status": "released",
  "sourceContext": {
    "path": "docs/context/harness/grounded-run-context-and-retrieval-evaluations.md",
    "confirmedByUserOn": "2026-11-10",
    "status": "ready",
    "sha256": "sha256:df5d14817342d00cc415076f5da19f6dcb9d2fb51a1d651b43ba2fa12758d4b7"
  },
  "objective": "Ensure direct harness runs consume selected source content with path and hash provenance under an enforced input budget, and make offline evaluations test retrieval together with source-dependent answers.",
  "actors": [
    "Developer or agent invoking the direct Context Factory run command",
    "Maintainer of canonical context and routing expectations",
    "Provider consuming the assembled input",
    "Reviewer judging retrieval and answer evaluation evidence"
  ],
  "scope": [
    "Assemble selected source content, repository-relative paths, and content hashes into the direct provider input while retaining the request and required rule directives",
    "Enforce a deterministic pre-dispatch input budget including the final assembled prompt; preserve whole-source integrity and report omissions or overflow",
    "Keep retrieved text clearly delimited as source data with no higher instruction authority",
    "Route the authenticated orders endpoint example to feature delivery and security guardrails without broad false positives",
    "Add offline source-dependent retrieval-to-answer evaluations and negative cases that fail when evidence is missing or changed"
  ],
  "nonGoals": [
    "No embeddings, vector database, hosted retrieval, new provider SDK, or external IDE-agent instrumentation",
    "No live-model credentials or live answer-quality gate in CI",
    "No new agent tool loop, application data migration, or production host-code verification claim from factory doctor",
    "No unrelated runner fixes such as model defaults, response-hook revalidation, or retry semantics in this plan"
  ],
  "acceptedDecisions": [
    "The user confirmed the two goals and their use as this plan's scope on 2026-11-10.",
    "Selected text must reach every direct provider through one bounded payload contract, retaining path and hash provenance.",
    "Retrieved text is source data, not a higher-priority instruction; required rule directives retain their existing integrity checks.",
    "Offline evaluation must depend on received source content rather than the golden output supplied to the mock provider.",
    "Keep the accepted dependency-free ESM and canonical Markdown/manifest architecture."
  ],
  "acceptanceCriteria": [
    "A direct run for KISS and YAGNI sends both selected notes' full text, repository-relative paths, and matching hashes to a capture provider; the request and applicable binding directives remain present.",
    "Final assembled input at the configured cap dispatches; overflow by required content prevents any provider call with an actionable budget result; optional-source behavior is deterministic and visible, with no partial source truncation.",
    "Retrieved text is marked as source material, unsafe paths are rejected, and instruction-like text inside a source cannot remove or replace mandatory directives.",
    "The authenticated orders endpoint prompt selects feature delivery and security guardrails; nearby ordinary order prompts do not select the security rule without security intent.",
    "Offline evaluation derives an answer and provenance from received source text, and fails when the needed source is withheld or changed rather than passing from injected golden output.",
    "Focused tests and factory doctor pass; the report distinguishes offline harness evidence from live-model answer quality."
  ],
  "scenarioCoverage": "Discovery record S-01 through S-08 cover happy path, exact and over-limit input, optional and required overflow, prompt-authority abuse, authenticated versus ordinary order routing, fixture-echo regression, and estimate versus provider usage.",
  "risks": [
    "Existing base documents may consume much of the input budget, so required-source classification and overflow diagnostics need explicit tests.",
    "Provider tokenization varies; a local estimate must be conservative and clearly labeled, with actual usage reported separately.",
    "A deterministic offline answer provider can prove the harness data path but cannot establish broad live-model reasoning quality.",
    "Changing route terms can produce false positives; negative order-domain cases must accompany the authenticated example."
  ],
  "remainingAssumptions": [
    "The exact default cap, override interface, source-priority algorithm, and evaluation fixture representation are plan-level technical choices if they preserve all acceptance criteria."
  ],
  "materialUnknowns": [],
  "readyForPlan": true,
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "source": {
    "path": "docs/discovery/grounded-run-context-and-retrieval-evaluations/record.md",
    "sha256": "sha256:b734df77c5e568267133e2cfd2eb351daf10ac10bcebddfadc83db0a03152f6f"
  }
}
