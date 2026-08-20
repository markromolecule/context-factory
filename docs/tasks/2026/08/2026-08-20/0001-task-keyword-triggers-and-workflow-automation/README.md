---
title: "Session Keyword Triggers and Automated Workflow Dispatch"
type: task
status: completed
created: "2026-08-20"
tags: [task, workflow, triggers, automation]
---

# Session Keyword Triggers and Automated Workflow Dispatch

## Outcome

Enable instant, deterministic session triggers (e.g. `/plan`, `/fix`, `/migrate`, `/sec`, `/grill`, `[HOTFIX]`, `[DISCOVERY]`, etc.) across all AI model entrypoint contracts and the deterministic context engine, implement automated task scaffolding and workflow state transition tracking in the harness CLI, and wire pre/post execution verification hooks to guarantee quality gates without manual overhead.

## Pre-planning record

### Actors and goals

- **Developer / User:** Trigger complex engineering workflows instantly with concise prompt prefixes (e.g. `/plan`, `/fix`, `/migrate`) and automate task creation and validation.
- **AI Agent (Antigravity, Gemini, Claude, Cursor, Codex):** Instantly resolve unambiguous workflows, domain rules, and subagent personas from trigger prefixes without hallucinating context or skipping quality gates.
- **Harness CLI & CI:** Provide deterministic evaluation, scaffolding commands, and automated lock/doctor health checks.

### Domain language

- **Prefix / Slash Trigger:** High-priority prefix tokens (e.g. `/migrate`, `[HOTFIX]`, `/plan`) in user prompts that take precedence over natural language fuzzy scoring.
- **Workflow State Machine:** A lifecycle tracker managing task transitions across discovery, planning, execution, verification, and release.
- **Task Scaffolding:** CLI-driven automated generation of date-versioned task directories and phase artifacts from canonical templates.
- **Quality Gate Hooks:** Automated pre-flight checks (capturing reproduction tests) and post-flight verification (typecheck, test runner, schema validation, lock check).

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | User types `/plan <feature>` | Workspace is initialized | Resolves `feature-delivery`, loads `implementation-plan`, creates task scaffold, stops before coding | Fallback to fuzzy term scoring if prefix unknown | Verified |
| SC-02 | User types `/fix <bug>` or `[HOTFIX]` | Defect exists in code | Resolves `defect-resolution`, enforces reproduction test gate before code changes | Halt and prompt for repro command if absent | Verified |
| SC-03 | User types `/migrate <table change>` | Schema change requested | Resolves `database-migration`, loads DB rules, enforces rollback step | Reject if migration lacks down-migration/rollback plan | Verified |
| SC-04 | User runs `node scripts/harness-cli.mjs task:new "Auth Webhook" --type feature` | Valid task title provided | Automatically creates `docs/tasks/YYYY/MM/YYYY-MM-DD/000X-.../` with `README.md` and phase templates | Return actionable CLI error on invalid type | Verified |
| SC-05 | Agent executes task phase | Phase tasks completed | Post-execution hook runs tests, typecheck, and claim validator; reports verified evidence | Mark phase incomplete if checks fail | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | How should session triggers be parsed? | Prioritize prefix regexes (`/cmd`, `[TAG]`) over lexical term scoring in `scripts/context-core.mjs` | Guarantees deterministic 100% precision for explicit developer intents | Pure term frequency scoring (susceptible to fuzzy ambiguity) | `docs/decisions/0009-session-keyword-triggers-and-workflow-automation.md` |
| DEC-02 | Where should task scaffolding logic reside? | Inside `scripts/harness-cli.mjs` and reusable `scripts/task-workflow.mjs` | Unified CLI interface without third-party dependencies | Manual template copying or external node modules | `docs/decisions/0009-session-keyword-triggers-and-workflow-automation.md` |
| DEC-03 | How should subagents be invoked? | Map prefixes directly to persona directives in `AGENTS.md` and model adapters | Transparent delegation to BA, PM, Dev, QA, and DevOps subagents | Hardcoded opaque subagent orchestration | `orchestrator/SHARED.md` |

### Unknowns and blockers

- None. All required dependencies (pure ESM Node.js built-ins) are present.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | SC-01, DEC-01 | `/plan`, `/fix`, `/migrate`, `/sec`, `/grill`, `/adr`, `/verify` and `[TAG]` prefixes resolve to correct workflows with 100% deterministic precision | Update `ROUTING_HINTS` in `scripts/context-core.mjs` | Unit eval test cases in `evals/cases/` | Verified |
| AC-02 | SC-04, DEC-02 | `harness-cli.mjs task:new <title> --type <type>` scaffolds date-partitioned task folders with interpolated templates | Implement `scaffoldTask` in `scripts/task-workflow.mjs` | CLI invocation test | Verified |
| AC-03 | SC-05 | Pre/post execution verification hooks run test suite, typecheck, schema validator, and lock check | Add `runHooks` in `orchestrator/runner.mjs` / `harness-cli.mjs` | Evals suite execution | Verified |
| AC-04 | DEC-03 | All entrypoint contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`) explicitly document prefix triggers and dispatch matrix | Update entrypoints and orchestrators | `scripts/validate-context.mjs` passes | Verified |
| AC-05 | Repository Integrity | New files, decisions, and evaluations are indexed in `context-manifest.json` and locked in `context-lock.json` | Update manifest, run lock and doctor | `node scripts/harness-cli.mjs doctor` passes with 0 errors | Verified |

## Scope

- Extending `scripts/context-core.mjs` routing hints with prefix and slash command patterns.
- Adding `task:new` and workflow automation subcommands to `scripts/harness-cli.mjs`.
- Creating `docs/decisions/0009-session-keyword-triggers-and-workflow-automation.md`.
- Updating all entrypoint adapters and contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `orchestrator/*.md`).
- Adding unit evaluation cases for all new prefix triggers in `evals/cases/`.
- Updating `context-manifest.json`, regenerating `context-lock.json`, and verifying with `doctor`.

## Non-goals

- Modifying existing backend/frontend domain rules.
- Introducing heavy external npm dependencies.
- Bypassing manual approval gates for production code execution.

## Constraints and decisions

- Zero external npm dependencies; use standard Node.js ESM built-ins (`node:fs/promises`, `node:path`, `node:crypto`, `node:child_process`).
- Must preserve 100% backward compatibility with natural language queries.
- Must satisfy `validate-context.mjs` structure, frontmatter schemas, and lock digest integrity.

## Phases

- [x] `phase-01-prefix-and-slash-trigger-engine.md` — Phase 1: Prefix & slash trigger pattern matching in context core
- [x] `phase-02-task-scaffolding-and-state-machine-cli.md` — Phase 2: Automated task scaffolding & workflow CLI
- [x] `phase-03-pre-post-execution-quality-gates.md` — Phase 3: Pre/post execution verification hooks & ADR-0009
- [x] `phase-04-subagent-routing-and-entrypoint-contracts.md` — Phase 4: Entrypoint contracts and subagent dispatch synchronization
- [x] `phase-05-evaluations-locking-and-verification.md` — Phase 5: Evaluation cases, manifest sync, lock generation, and doctor verification

## Verification

- `node scripts/harness-cli.mjs resolve "/migrate add user table"` $\rightarrow$ verifies `workflows/database-migration.md`.
- `node scripts/harness-cli.mjs resolve "/fix bug in login"` $\rightarrow$ verifies `workflows/defect-resolution.md`.
- `node scripts/harness-cli.mjs resolve "/plan new payment gateway"` $\rightarrow$ verifies `workflows/feature-delivery.md`.
- `node scripts/harness-cli.mjs eval --unit` $\rightarrow$ 9/9 unit evaluations passed.
- `node scripts/harness-cli.mjs eval --datasets` $\rightarrow$ 3/3 golden dataset evaluations passed.
- `node scripts/harness-cli.mjs doctor` $\rightarrow$ reports valid schemas, current lock digest, and zero discrepancies.

## Deviations

None.

## Result

Completed and verified. All 5 phases executed, tested, and validated against canonical context rules.
