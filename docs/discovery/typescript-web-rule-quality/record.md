---
title: "TypeScript Web Rule Quality and Conformance Verification Discovery Record"
type: discovery-record
status: ready
created: "2026-10-09"
sourceContext: docs/context/harness/typescript-web-rule-quality.md
sourceContextHash: sha256:38c19de768f6d4e988f346299cfa34d47562c0a5f61bc8a79c5c43862bbfad27
---

# TypeScript Web Rule Quality & Conformance Verification Discovery Record

## Idea and Release Condition

Advance TypeScript web conformance verification from heuristic fallbacks and basic probe detection to rigorous host tool execution receipts and a comprehensive good/bad fixture test suite. Ensure that in real host projects, automated-blocking directives require verifiable compiler (`tsc`) and linter (`eslint`) execution receipts with validated effective configurations, while providing standardized fixtures that prove zero false-passes across all violation classes. Release one plan-facing brief only after scenario challenges are complete, material unknowns are resolved, and the user has confirmed the shared understanding.

## Grounding Claim Packet: Host Compiler Conformance Scope

Selection: Checked against `docs/Wiki.md` and `knowledge/README.md`. The canonical LLM Wiki currently indexes architectural SOLID concepts (`factory.principles.solid.*`) and contains **no grounded answer** for host compiler execution receipts, static fallback boundary semantics, or good/bad test fixture matrices. Repository source, tests, and accepted ADRs (0027, 0029, 0032, 0034) are authoritative evidence for this discovery.

| Claim ID | Source / heading | Authority / lifecycle / verified date / content hash | Selection reason | Status and content |
| --- | --- | --- | --- | --- |
| G-TS-001 | `knowledge/README.md` / Canonical Knowledge Items | canonical index / active / 2026-07-25 / `sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac` | Verified against active Wiki inventory and manifest paths | **unknown:** no applicable TypeScript compiler receipt knowledge item exists; use repository source and ADRs. |

## Repository Facts and Decisions

| ID | Class | Evidence | Finding and consequence |
| --- | --- | --- | --- |
| R-01 | verified fact | `orchestrator/conformance/adapters/typescript.mjs` | `checkStrictCompiler` inspects `tsconfig.json` via `--showConfig` and executes `tsc --noEmit` if tooling is discovered; otherwise falls back to static AST regex checks. |
| R-02 | verified fact | `orchestrator/conformance/adapters/typescript.mjs` | `checkLint` runs ESLint with `@typescript-eslint` rules if ESLint is present; otherwise falls back to floating promise static regex scanning. |
| R-03 | verified fact | `orchestrator/conformance/evidence-gate.mjs` | `TOOL_UNAVAILABLE` on an `automated-blocking` directive marks the directive `isBlocked: true`, leading to overall verdict `BLOCKED` unless an authorized human waiver exists. |
| R-04 | accepted decision | ADR 0029; ADR 0032 | Automated-blocking directives require deterministic tool verification; missing host tools cannot be normalized to PASS in production gates. |
| R-05 | accepted decision | ADR 0034 | Framework rules (React, Next.js, SolidJS) are scoped to package dependencies; Next.js implies React; SolidJS excludes React/Next.js. |
| R-06 | verified fact | `evals/tests/conformance/typescript-adapter.test.mjs` | 15 adapter tests cover 4 F6 probe regressions and fail-closed checks using mock `readTextFn` and `commandRunner`. |
| R-07 | verified fact | `docs/context/harness/typescript-web-rule-quality.md` §3 audit recommendations | Remaining audit recommendations call for real host execution receipts, testing missing tools without synthetic injection, and adding bad/good fixtures across boundary validation, unsafe type flow, and framework behavior. |
| R-08 | verified fact | `scripts/handoff-contract.mjs` | Plan handoff contract requires `brief.md` in JSON format with valid `discovery-brief` schema and matching source record hash. |

## Decision Tree and Current Answers

| Branch | Answer or issue | State |
| --- | --- | --- |
| Outcome and actors | Host developers, CI workflows, and AI code generation need deterministic, tamper-evident proof that code satisfies TypeScript constraints. | settled |
| Domain language | Conformance adapter, tool execution receipt, verifier type, effective configuration, good/bad fixture, and human waiver retain existing canonical definitions. | settled |
| Architectural boundary | Adapters remain in `orchestrator/conformance/adapters/`, consumed via `ConformanceAdapter` interface. Zero runtime npm dependencies for Context Factory core. | settled |
| Receipt structure | Conformance report evidence must include tool name, command line, effective config digest, exit code, and stdout/stderr excerpt. | settled |
| Host vs Fixture mode | In host repository execution, missing tools return `TOOL_UNAVAILABLE` (`BLOCKED`); static AST checks are used exclusively in dedicated offline fixture/unit test modes. | settled by user (Q-01) |
| Fixture catalog | Matrix of paired positive (good) and negative (bad) code snippets for all 4 violation classes across shared TypeScript and 3 web frameworks. | settled |
| Security and isolation | Commands executed via safe `argv` arrays with neutralized shell metacharacters; no arbitrary code execution or unescaped shell strings. | settled |
| Release gate | Brief released as valid JSON with complete planning metadata and source record hash. | settled |

## Question Log and Unknowns

| ID | Question | Why it matters | Recommendation and trade-off | Owner / state |
| --- | --- | --- | --- | --- |
| Q-01 | How should host tool discovery behave when `tsc` or `eslint` is absent in a target project? | ADR 0029 requires `TOOL_UNAVAILABLE` leading to `BLOCKED` for automated-blocking directives, but unit test fixtures frequently run in standalone environments without host-installed compilers. | **Selected by user, 2026-10-09:** Strict separation: In host repository execution, missing tools return `TOOL_UNAVAILABLE` (`BLOCKED`); static AST checks are used exclusively in dedicated offline fixture/unit test modes. | user / resolved |

## Scenario Challenge and Coverage

| Class | Concrete scenario | Expected outcome | Evidence / decision | State |
| --- | --- | --- | --- | --- |
| Happy path | Host has `tsc` and `tsconfig.json` with strict settings; conforming code passes. | Emits tool receipt with command, exit code 0, and passes directive. | R-01; ADR 0029; Q-01 | covered |
| Boundary | Host lacks `tsc` or `eslint` for an automated-blocking directive in host run. | Returns `TOOL_UNAVAILABLE`, resulting in `BLOCKED` gate requiring tool setup or human waiver. | R-03; ADR 0029; Q-01 | covered |
| Boundary | Negative fixture with deliberate floating promise or unvalidated boundary cast. | Deterministically caught and returns `FAIL` with violation line and explanation. | R-02; R-06 | covered |
| Failure | Host `tsconfig.json` has `strict: false` or disables `noImplicitAny`. | `checkStrictCompiler` fails closed with explicit configuration error output. | R-01; ADR 0029 | covered |
| Abuse | Generator attempts to use `any` via type alias or type assertion. | Ban-any check catches violation; returns `FAIL`. | R-01; R-06 | covered |
| Concurrency | Parallel test fixtures run conformance checks simultaneously. | Deterministic, side-effect free checks produce identical receipts without race conditions. | R-06 | covered |
| Lifecycle | Host updates compiler or rule catalog; receipts recompiled. | Report invalidates when binding or file content SHA-256 changes. | R-05; ADR 0032 | covered |

## Coverage Audit and Release State

The discovery session is complete. Outcome, actors, architectural boundaries, grounding packet, and repository facts are recorded. Scenario challenges are verified across happy path, boundary, failure, abuse, concurrency, and lifecycle dimensions. Q-01 is resolved by explicit user decision. No material unknown remains. The discovery brief may now be released.
