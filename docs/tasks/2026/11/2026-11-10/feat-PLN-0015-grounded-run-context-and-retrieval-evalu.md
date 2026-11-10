---
title: "Grounded run context and retrieval evaluations"
type: task
status: planned
plan_contract_version: 3
plan_id: "PLN-0015"
created: "2026-11-10"
tags: [task, harness, retrieval]
target_branch: "master"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
discovery_brief: "../../../../discovery/grounded-run-context-and-retrieval-evaluations/brief.md"
---

# Grounded run context and retrieval evaluations

## Outcome

Make `executeRun` send selected source text with repository-relative paths and content hashes to every direct provider under an enforced pre-dispatch input budget. Make offline evaluations exercise retrieval and source-dependent answer construction, and route the authenticated-orders example to feature delivery and security guardrails. This document plans work only; no production implementation is included in the planning phase.

## Pre-planning record

### Actors and goals

- The direct CLI user needs a bounded, grounded run rather than an unaugmented request.
- The canonical-content maintainer needs provenance and a predictable source selection policy.
- The reviewer needs test evidence that answers depend on retrieved text rather than fixture-fed output.
- The provider receives one consistent source-data boundary; repository instructions and rule bindings retain their existing priority.

### Domain language

- **Selection:** resolver result containing workflow, rules, skills, knowledge, and `selectedPaths`.
- **Bundle:** ordered source entries with `path`, `hash`, and `content` from `buildContextBundle`.
- **Final input budget:** conservative, locally estimated token units counted from the fully assembled request and system input before dispatch. Provider-reported usage remains a separate observation.
- **Required source:** selected content whose omission would make the run violate the current contract, especially shared orchestration, selected workflow, and applicable rule text. **Optional source:** supporting knowledge or procedure content that may be omitted whole with an explicit receipt under the chosen policy. The exact classification is finalized in Unit 01.01 and tested before integration.

### Language stack and applicable rules

- Implementation is Node.js ESM (`.mjs`), even though the catalog targets TypeScript hosts. Current `preflight` marks JavaScript scope `UNSUPPORTED`; it cannot be reported as a TypeScript code PASS.
- Applicable global sources: `rules/global/code-quality.md` (`sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe`), `rules/global/evidence-and-claims.md` (`sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622`), and `rules/global/security-guardrails.md` (`sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3`). Unit blocks pin applicable directive IDs, modes, and source hashes. Refresh them if sources change.
- Rule selection records scope and source hashes; `node --test` and configured pnpm checks verify behavior. Binding or `doctor` does not prove changed code conforms.

### Scenario coverage

| ID | Actor and situation | Expected outcome | Failure or recovery |
| --- | --- | --- | --- |
| S-01 | User asks about KISS and YAGNI | Both selected notes reach provider with path/hash/content and a source-dependent answer is produced | Missing note fails answer evaluation |
| S-02 | Final input at or just over cap | At-cap input dispatches; over-cap input does not | Diagnostic names cap and required/optional result |
| S-03 | Optional or required sources overflow | Optional whole files are omitted deterministically; required overflow fails closed | Narrow request or explicitly raise cap |
| S-04 | Source contains instruction-like text or unsafe path | Source is data; unsafe path is rejected and binding remains intact | Stop before provider dispatch |
| S-05 | Authenticated orders endpoint request | Feature delivery and security guardrails selected | Ordinary order request does not acquire security rule |
| S-06 | Mock receives its own golden answer | Fixture echo cannot count as retrieval-to-answer evidence | New source-dependent evaluation fails when evidence changes |
| S-07 | Provider reports usage unlike local estimate | Estimate and actual usage remain distinct | No claim of exact cross-provider tokenizer parity |

### Decision ledger

**D-01 — Overflow policy (1-3-1).** Problem: the resolver may select more whole files than fit a bounded final input. Evidence: `scripts/context-core.mjs` only warns based on source characters, and `executeRun` has no payload budget gate. Success means required content is never silently removed and dispatch cannot exceed the configured local estimate.

| Approach | Advantage | Cost or failure mode | When viable |
| --- | --- | --- | --- |
| Fail every over-budget run | Simple and preserves every source | Common optional-source overflow blocks otherwise useful requests | Small catalogs or strict complete-context jobs |
| Drop whole optional sources in stable priority order; fail if required content still exceeds cap | Preserves mandatory context and useful partial retrieval with an omission receipt | Priority and omitted-source evidence must be maintained | Current mixed rule/knowledge catalog |
| Re-resolve repeatedly with narrower task terms until the payload fits | Can improve semantic relevance | Repeated selection is harder to explain and may change required rules unpredictably | A future measured retrieval optimizer |

**Recommendation:** use deterministic whole-source omission for optional material, then fail before dispatch if required content cannot fit. Count the rendered final input, not just selected file lengths. Keep the estimate explicitly labeled; define the default cap and override in Unit 01.01 from existing intent budgets, with boundary tests. Do not cut a file mid-content. This is a reversible local harness choice consistent with ADR 0004 and does not need a new ADR unless it changes canonical selection authority.

**D-02 — Offline answer evaluation (1-3-1).** Problem: `evals/run-evals.mjs` gives `goldenOutput` to the mock provider and then checks that output, so the dataset cannot prove grounding. Success means the evaluated answer changes or fails when source evidence is removed or changed.

| Approach | Advantage | Cost or failure mode | When viable |
| --- | --- | --- | --- |
| Deterministic provider parses labeled input and derives a narrow answer/citation | Offline, reproducible, directly tests the assembled input | Does not measure broad model reasoning | CI harness boundary test |
| Bundled local model evaluated offline | Exercises model generation without network credentials | Large dependency and nondeterministic environment | If model quality later needs an offline gate |
| Live-provider canary outside CI | Observes actual answer quality | Credential, cost, drift, and availability burden | Optional later quality review |

**Recommendation:** use a deterministic source-dependent provider for the required offline gate; keep live-model evaluation optional and separately labeled. Retire fixture-fed golden output as evidence of answer quality, while retaining routing-only fixtures for their stated purpose. The change stays within the current dependency-free harness decision in ADR 0008.

## Unknowns and blockers

- None for planning. The released brief is verified and user-confirmed. The exact cap, source priority, and offline provider fixture format are bounded technical decisions assigned above and to Units 01.01 and 03.02.

## Acceptance criteria

| ID | Source | Criterion | Unit | Verification | Status |
| --- | --- | --- | --- | --- | --- |
| AC-01 | S-01, R-02 | Selected KISS/YAGNI full text, paths, and matching hashes reach direct provider input with request and directives intact | 01.01, 02.01 | `node --test evals/tests/rules/prompt-compiler.test.mjs` | planned |
| AC-02 | S-02, S-03, D-01 | Final input cap is enforced before dispatch; exact cap passes, required overflow blocks, optional omissions are whole and visible | 01.01, 02.01 | `node --test evals/tests/rules/prompt-compiler.test.mjs` | planned |
| AC-03 | S-04 | Source text remains delimited data; unsafe paths and hook tampering cannot remove mandatory directives | 01.01, 02.01 | `node --test evals/tests/rules/prompt-compiler.test.mjs` | planned |
| AC-04 | S-05 | Authenticated orders routes to feature delivery and security guardrails without ordinary-order false positives | 03.01 | `node --test evals/tests/resolver/intent-routing.test.mjs` | planned |
| AC-05 | S-01, S-06, D-02 | Offline integration answer derives from received sources, with provenance, and fails when needed source is removed or changed; dataset golden output is never supplied to its provider | 03.02 | `node --test evals/tests/rules/prompt-compiler.test.mjs` and `node scripts/context.mjs eval` | planned |
| AC-06 | S-07 | Budget estimate and actual provider usage remain separately labeled; factory health and the grounded-answer regression run in CI | 02.01, 03.02 | `node scripts/context.mjs doctor` and `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs evals/tests/resolver/intent-routing.test.mjs` | planned |

## Scope

- Existing: `scripts/context-core.mjs`, `orchestrator/rules/prompt-compiler.mjs`, `orchestrator/runner.mjs`, `evals/run-evals.mjs`, `evals/tests/rules/prompt-compiler.test.mjs`, `evals/tests/resolver/intent-routing.test.mjs`, `schemas/run-result.schema.json`, `context-manifest.json`, `context-lock.json`, `.github/workflows/context-factory.yml`, and the direct run entries in `app/cli/commands/run.mjs`, `app/cli/bin/context-cli.mjs`, and `scripts/harness-cli.mjs`.
- New: `evals/tests/cli/run-budget.test.mjs` for the public CLI contract. No new package dependency is assumed.
- The unit file scopes below allocate ownership; a discovered consumer or schema change requires plan reconciliation before editing.

## Non-goals

- Embeddings, vector database, hosted retrieval, external IDE-agent telemetry, live-model CI, new SDK, application authorization, tool-calling loop, or broader runner defects such as model defaults and response-hook revalidation.

## Constraints and decisions

- Preserve source provenance and binding integrity across OpenAI, Anthropic, Gemini, mock, and custom providers through the same prepared prompt seam.
- Use a locally enforceable conservative token estimate, named as an estimate. Test the final serialized input and compare provider usage only after the call; do not imply exact tokenizer parity.
- Keep source bodies out of routine budget diagnostics or telemetry. Represent selected and omitted sources by paths and hashes.
- ADR 0004, ADR 0008, and ADR 0041 remain authoritative. This plan adds no production application schema, migration, or dependency.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
| --- | --- | --- |
| Mandatory base text consumes most of the cap | Frequent rejection or hidden omission | 01.01 measures real baseline and tests required overflow; cap/priority decision is explicit |
| Provider tokenizers differ | Estimate may differ from billed usage | Label estimate, use conservative pre-dispatch measure, compare actual usage separately |
| Source prompt injection | Retrieved data could be mistaken for instructions | 01.01 delimiters, 02.01 hook integrity and negative provider capture |
| Prompt hook removes or changes selected source text | A direct run succeeds without the evidence it selected | 02.01 validates included source path/hash/content after hooks and proves zero provider calls on tampering |
| Auth term matching overgeneralizes | False security routing | 03.01 positive and ordinary-order negative fixtures |
| Offline mock overstates answer quality | False confidence | 03.02 source-dependent mutation/removal test, CI command, and explicit live-quality limitation |
| Canonical context edits stale hashes/lock | Doctor failure or invalid receipt | Refresh rule hashes, manifest/lock only if inventory changes, rerun doctor |

## Task branch

| Field | Recorded decision |
| --- | --- |
| Target branch | `master` |
| Task branch | `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` |
| Base commit | `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e` |

## Phases

- [ ] `feat-PLN-0015-grounded-run-context-and-retrieval-evalu/phase-01-bounded-source-assembly/phase.md` — Phase 1: source payload and budget contract (Unit 01.01)
- [ ] `feat-PLN-0015-grounded-run-context-and-retrieval-evalu/phase-02-runner-integration/phase.md` — Phase 2: direct provider integration (Unit 02.01)
- [ ] `feat-PLN-0015-grounded-run-context-and-retrieval-evalu/phase-03-routing-and-evaluation/phase.md` — Phase 3: routing repair and grounded evaluation (Units 03.01, 03.02)

**Linearized order:** 01.01 → 02.01 → 03.01 → 03.02. Units execute serially on the single task branch; 03.02 depends on both payload integration and the routing fixture. If execution changes a contract, reconcile downstream units before starting them.

## Verification

- Planning: `node scripts/context.mjs handoff:verify-brief docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md` passed; `node scripts/context.mjs plan:check <task-directory>` is required after all unit files are filled.
- Execution commands are listed in the units. Record command, host root, affected scope, revision or diff identity, exit code, and result in each unit receipt. `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` are configured; Phase 3 adds the focused grounded-answer and CLI tests to CI because doctor currently runs only the dataset/routing evaluator. No separate typecheck script is declared in this factory's `package.json`. Regenerate `context-lock.json` in each unit that changes manifest-tracked code before host checks.
- No production checks are claimed as passing by this plan. Offline tests prove the harness boundary; a live-model quality claim requires separate evidence.

## Deviations

- The user approved restoring seven staged `.DS_Store` files to clean the checkout for branch creation. The assistant-authored discovery files were temporarily moved aside for the scaffold's clean-checkout gate and restored byte-for-byte on the task branch. During Unit 01.01 execution, lint and doctor exposed that manifest-tracked code changes require a lock refresh in every affected unit; the plan also mislabeled the configured build check as unconfigured. The user instructed continuation on 2026-11-10, so the unit scopes and host checks were reconciled before reissuing the packet.

## Plan done-check

- [x] Acceptance criteria map to unit IDs and concrete verification commands.
- [x] Blockers are resolved or absent in the verified released brief.
- [x] Risks and dependencies are recorded with owners or mitigations.
- [x] Checkout and target branch are verified at the recorded base commit.

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Host checks and human evidence | Verification command |
| --- | --- | --- | --- | --- |
| Phase 01 verification | Task branch | pending | pending | `node --test evals/tests/rules/prompt-compiler.test.mjs` |
| Phase 02 verification | Task branch | pending | pending | `node --test evals/tests/rules/prompt-compiler.test.mjs` |
| Phase 03 verification | Task branch | pending | pending | `node scripts/context.mjs doctor` and focused `node --test` command from Unit 03.02 |
| Task finalization | Task branch to `master` | pending | pending | `node scripts/context.mjs plan:check` and review packet |

## Result

Plan review passed on 2026-11-10 after reconciling manifest/lock inventory, CI coverage for focused tests, and post-hook source integrity. The initial approved packet was issued, then execution found the per-unit lock scope and configured-build gaps recorded above. The revised plan passed re-review under the user's continuation instruction and is eligible for a fresh packet before Unit 01.01 is committed.
