---
title: "LLM Entry Point Clarity and Context Selection"
type: context
status: ready
created: "2026-10-09"
tags: [context, harness, instructions, token-budget]
feature: "llm-entrypoint-clarity"
---

# LLM Entry Point Clarity and Context Selection

## 1. Overview & Objective

- **Problem:** Model entry points repeat instructions, contain stale worktree language and skill paths, and use terms such as “intra-worktree diff review” without defining the action. The suggested short entry point would also mistake `doctor` for proof that a task is complete.
- **User value:** A short prompt should lead the model to the right source files and to an evidence-backed result without loading unrelated instructions or guessing the workflow.
- **Success:** Every active entry point uses plain actions and current paths; generated host instructions match; required branch, test, conformance, and completion gates remain discoverable; review evidence distinguishes factory health from task verification. The Claude and agent entry files stay under 200 words each, and focused bridge tests reject stale worktree instructions.

## 2. Requirements & User Stories

- As a user, I want a direct question or trivial edit to avoid task scaffolding.
- As an agent, I want one clear route to relevant context and actual target files so I can act without reading the whole factory.
- As a maintainer, I want each model adapter and generated host file to give the same current instructions.

### Functional requirements

- Keep entry points short and point to `orchestrator/SHARED.md` as the shared contract.
- Run `resolve` for substantive code, plan, or documentation changes; treat its selections as candidates, not a prohibition on reading explicitly named or affected files.
- State that `plan` owns branch creation, `plan:check` checks plans, behavior changes need appropriate tests, and code completion needs relevant verification and any required conformance report.
- Reserve `doctor` for factory health. Report failed, blocked, and unrun checks accurately.
- Replace unexplained “intra-worktree diff review” with “review the changes on the task branch against the unit's allowed files and tests.”

### Edge cases and failure modes

| Situation | Expected response |
| --- | --- |
| Resolver omits an explicitly named file or selects irrelevant rules | Read the named file and relevant targets; do not load every selected path blindly. |
| Documentation-only task | Avoid test-first code procedure; run checks relevant to changed context. |
| Code change without a plan | Use relevant tests and review; do not invent a task branch or approved plan. |
| Planned code change on wrong branch or conformance status `BLOCKED` | Stop the affected work and report the exact mismatch or missing evidence. |
| `doctor` passes while task tests or criteria fail | Report factory health separately; do not claim task completion. |

## 3. Technical & Architectural Context

- **Affected surfaces:** Root `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`; `orchestrator/{AGENTS,CLAUDE,CODEX,GEMINI}.md`; host bridge templates in `app/cli/core/bridge-generator.mjs` and their tests.
- **Rules:** `rules/global/evidence-and-claims.md` applies `cf.evidence.grounding` (`evidence-blocking`), `cf.evidence.verification` (`automated-blocking`), and `cf.evidence.completion` (`evidence-blocking`). `rules/global/code-quality.md` applies `cf.quality.tests-for-behavior-changes` (`automated-blocking`) to the bridge generator. No data schema, authorization boundary, or application API changes.
- **Current resolver behavior:** `resolve` returns informational selections. Without a declared stack it defaults to TypeScript; base paths include the README, shared contract, and all knowledge files, so even a wording request can estimate thousands of input tokens. Improving selector precision is a separate measurable follow-up.

## 4. UI/UX & Interaction Guidelines

Use plain verbs, actual commands, and paths that exist. Avoid internal labels such as “scope fence,” “cold-start executability,” and “intra-worktree” in entry points; keep specialized terms in the skills that define them. Separate the health check from task-specific tests and acceptance criteria.

## 5. Scope & Boundaries

- **In scope:** Audit entry-point jargon and stale instructions; revise all active model entry points and generated host templates; update focused tests, context inventory, lock, and validation.
- **Out of scope:** Rewrite historical ADRs and task plans, remove Git's optional worktree support, or redesign resolver selection and the conformance engine.

## 6. References & External Context

- `docs/templates/Context.md`, `orchestrator/SHARED.md`, `docs/decisions/0025-lhg-minimal-input-and-session-state-primitives.md`, `docs/decisions/0033-branch-only-task-lifecycle.md`.
- User brief and clarification of 2026-10-09: update all LLM instruction entry points.

## 7. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` | verified | Entry points say “intra-worktree” after the branch-only decision. | Replace with a concrete branch diff action. |
| E-02 | `orchestrator/CLAUDE.md` and peer adapters | verified | Long duplicated dispatch tables include old paths and isolated worktree instructions. | Make adapters thin pointers to current contracts. |
| E-03 | `scripts/context-core.mjs` | verified | Resolver selection is informational and includes broad base knowledge. | Do not instruct agents to read only its returned files. |
| E-04 | `app/cli/commands/doctor.mjs`, `rules/global/evidence-and-claims.md` | verified | Doctor checks factory health; task completion requires outcome evidence. | State separate completion criteria. |
| E-05 | `app/cli/core/bridge-generator.mjs`, `evals/tests/bridge/bridge-conformance.test.mjs` | verified | Generated host files use a shared directive builder and are audited for required gates. | Update builder and tests together. |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | Exact token and success-rate improvement across representative tasks | unknown | Maintainer | no | Measure in a later selector evaluation; do not claim an unmeasured gain. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **Ready for grill:** yes
- **Context content hash:** record when handing this specification to `grounding`
