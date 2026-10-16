---
title: "Clean and Rebuild Context Factory for TypeScript-Only Ecosystem Discovery Record"
type: discovery-record
status: ready
created: "2026-10-16"
sourceContext: docs/context/refactors/typescript-factory-rebuild.md
sourceContextHash: sha256:3dd0c62402639db2e5f46bc27d2a64e768d5738e2107dae78fe904c2ca577773
---

# Clean and Rebuild Context Factory for TypeScript-Only Ecosystem Discovery Record

## Idea and Release Condition

Clean and rebuild Context Factory to dedicate it strictly to the TypeScript ecosystem with zero language/framework selection overhead. Eliminate the dual workflow wrapper structure (`workflows/*.md` + `skills/workflow-entries/*`) by consolidating workflows directly into first-class skill directories (`skills/workflows/<slug>/SKILL.md`). Purge model-specific root files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*` adapters), making `orchestrator/SHARED.md` and `README.md` the sole model-neutral sources of truth. Release one plan-facing brief only after all target files, boundary scenarios, indexer alignments, and test gates are verified against codebase evidence and user-confirmed architectural decisions.

## Grounding Claim Packet: Architecture & Principles

Selection: Checked against canonical knowledge items in `knowledge/principles/` and accepted architectural decisions in `docs/decisions/`.

| Claim ID | Source / heading | Authority / lifecycle / verified date / content hash | Selection reason | Status and content |
| --- | --- | --- | --- | --- |
| G-KISS-001 | `knowledge/principles/kiss.md` / Keep It Simple, Stupid | canonical / active / 2026-07-25 / `sha256:69b12d539ec1fa9e3347b4d3f3f22718e8df5ae8e9064c07d3b5b60e6f6631ad` | Architectural simplification principle | **verified:** Consolidating workflows directly into `skills/workflows/<slug>/SKILL.md` and removing `skills/workflow-entries/` eliminates unnecessary indirection, conforming directly to KISS. |
| G-YAGNI-002 | `knowledge/principles/yagni.md` / You Aren't Gonna Need It | canonical / active / 2026-07-25 / `sha256:b1d8481fe12111bb9e5dd469e3ba2c7bb140889218d6a86ff4b8e3a24ec4a87c` | Scope & abstraction trimming principle | **verified:** Eliminating dead multi-stack selection code (`--stack` flag, Flutter checks) removes speculative abstractions that provide no value in a TypeScript-only factory. |
| G-ADR-0038 | `docs/decisions/0038-host-native-workflow-entries.md` | accepted decision / 2026-10-11 | Governs workflow entries in Codex and Claude | **superseded:** ADR 0038 created thin wrapper entries under `skills/workflow-entries/`. The new design supersedes this by placing authoritative workflows directly into `skills/workflows/<slug>/SKILL.md` as first-class skills. |
| G-ADR-0036 | `docs/decisions/0036-decommission-laravel-php-stack-focus-typescript.md` | accepted decision / 2026-10-09 | Governs TypeScript exclusivity | **verified:** ADR 0036 established TypeScript dedication. Completing this refactor eliminates the lingering remnants of multi-stack checks (e.g. `doctor.mjs` unsupported Flutter assertions). |

## Repository Facts and Decisions

| ID | Class | Evidence | Finding and consequence |
| --- | --- | --- | --- |
| R-01 | verified fact | `skills/workflow-entries/` | 12 wrapper skill folders exist merely to wrap root `workflows/*.md`. Must be deleted entirely. |
| R-02 | verified fact | `workflows/` | Root `workflows/` contains 12 markdown files. Must be relocated and transformed into first-class skills: `skills/workflows/<slug>/SKILL.md`. Root `workflows/` directory deleted. |
| R-03 | verified fact | Root directory | `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules` clutter the project root. Must be deleted. |
| R-04 | verified fact | `orchestrator/` | Contains `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md` model-specific wrappers. Must be deleted; `orchestrator/SHARED.md` remains authoritative. |
| R-05 | verified fact | `app/cli/commands/doctor.mjs` | Lines 283-294 check `flutter` as an unsupported stack. Must be cleaned up to report single-stack TypeScript readiness. |
| R-06 | verified fact | CLI commands (`conform.mjs`, `preflight.mjs`, `resolve.mjs`, `init.mjs`) | Contain `--stack` / `--stacks` arguments and prompts. Must be streamlined to default to TypeScript implicitly without stack selection. |
| R-07 | verified fact | `scripts/validate-context.mjs` | Lines 16-100 validate `skills/workflow-entries/` and lines 651-678 validate `.agents/AGENTS.md` and `.agents/GEMINI.md`. Must be updated to validate `skills/workflows/` and clean `.agents/` symlinks. |
| R-08 | verified fact | `app/cli/core/bridge-generator.mjs` | Scaffolds `.agents/` symlinks and editor files. Must be updated to link `skills/workflows/*` into `.agents/skills/` and remove obsolete root file generations. |
| R-09 | user decision | Discovery Q-01 | Workflows structured as first-class skill directories (`skills/workflows/<slug>/SKILL.md`), unifying the lifecycle policy and skill discovery. |
| R-10 | user decision | Discovery Q-02 | Remove all model-specific root entrypoints (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `orchestrator/*`). `orchestrator/SHARED.md` and `README.md` are the sole sources of truth. |
| R-11 | user decision | Discovery Q-03 | Unified TypeScript catalog: Treat TypeScript as the sole, hardcoded environment. Framework guidelines remain standard TypeScript references, but framework-filtering logic and multi-stack checks are removed. |

## Scenarios

### Scenario S-01: Workflow Discovery and Invocation (Happy Path)
- **Input:** Agent or user invokes `/feature-delivery` or `$feature-delivery` in an IDE.
- **Expected Outcome:** Tool discovers `skills/workflows/feature-delivery/SKILL.md` directly under `.agents/skills/feature-delivery` or `skills/workflows/`. Full lifecycle phases, gates, and stop conditions are parsed from this single authoritative file without following wrapper redirects.

### Scenario S-02: Clean Root Directory Inspection (Model-Neutral Workspace)
- **Input:** Developer inspects repository root `ls -la`.
- **Expected Outcome:** No `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, or `.windsurfrules` exist on root. Only `README.md`, `package.json`, `context-manifest.json`, `context-lock.json`, and standard system directories are present.

### Scenario S-03: Context Resolution without Multi-Stack Prompts (Happy Path)
- **Input:** Developer runs `node scripts/context.mjs resolve "add custom hook with query cache"`.
- **Expected Outcome:** Command executes without requiring `--stack typescript` or checking for other languages. Resolves relevant TypeScript rules directly from `rules/typescript/`.

### Scenario S-04: Doctor Diagnostic Health Check (Lifecycle & Conformance)
- **Input:** Developer runs `node scripts/context.mjs doctor`.
- **Expected Outcome:** Doctor verifies 100% PASS:
  - Manifest & syntax lint: PASS (0 broken links, zero dangling files).
  - Lockfile integrity: PASS.
  - Symlink & agent configs: PASS (all skills under `skills/engineering`, `skills/productivity`, `skills/workflows` cleanly linked).
  - Conformance enforcement: PASS (`Adapters: typescript (ready)`).
  - Evaluation suite: PASS.

### Scenario S-05: Legacy `--stack` Argument Handling (Boundary & Resilience)
- **Input:** External script runs `context-cli conform --stack typescript` or passes `--stack`.
- **Expected Outcome:** CLI gracefully ignores or accepts `--stack typescript` without error, while rejecting non-TypeScript stacks with informative exit code 2 (BLOCKED).

## Coverage Audit & Release Gate

- [x] Desired outcome and measurable success criteria are explicit.
- [x] All actors, permission boundaries, and authority contracts identified.
- [x] Workflow relocation and single-file unification defined with zero ambiguity.
- [x] Root file deletions and model-neutral entrypoints established.
- [x] All CLI and doctor adjustments bounded.
- [x] Scenarios (happy path, boundary, diagnostic, legacy flags) verified.
- [x] User confirmed decisions for U-01, U-02, and U-03.

**Result:** PASS — Ready for brief release.
