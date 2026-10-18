---
title: "Clean Ephemeral Directories and Remove Conformance Adapters Architecture"
type: context
status: ready
created: "2026-10-17"
tags: [context, refactor, cleanup, conformance, adapters, structure, architecture]
feature: "clean-adapters-conformance-and-ephemeral-dirs"
---

# Clean Ephemeral Directories and Remove Conformance Adapters Architecture Context Specification

## 1. Overview & Objective

- **Problem Statement:** Context Factory currently retains ephemeral/legacy directories (`.agents`, `.claude`, `.worktrees`) at its repository root, along with a complex runtime conformance checking and stack adapter system under `orchestrator/conformance/` (including `adapter-contract.mjs`, `conformance-orchestrator.mjs`, `adapters/typescript.mjs`, `waiver-policy.mjs`, `report-verifier.mjs`, `change-identity.mjs`, `evidence-gate.mjs`, and associated test suites). In addition, `bridge-generator.mjs` carries extensive legacy symlink scaffolding targeted for a complete rewrite. This creates unnecessary architectural weight, friction, and maintenance burden.
- **Business / User Value:** Streamline Context Factory into a lean, pristine, pure TypeScript repository by purging ephemeral root directories (`.agents`, `.claude`, `.worktrees`), completely eliminating the language conformance/adapter subsystem, and simplifying project validation. This provides a fresh, clean, and healthy foundation prepared for rewriting the bridge generator.
- **Success Criteria:**
  - Removal of `.agents`, `.claude`, and `.worktrees` directories from the repository.
  - Complete elimination of `orchestrator/conformance/` (all 8 files including `adapters/typescript.mjs`) and the `context-cli conform` command.
  - Removal of conformance-specific evaluation test suites (`evals/tests/conformance/*`), datasets (`evals/datasets/conformance/*`), and schemas (`schemas/conformance-*.schema.json`).
  - Simplification of `scripts/validate-context.mjs`, `app/cli/commands/doctor.mjs`, and `app/cli/bin/context-cli.mjs` to focus strictly on manifest, lockfile, syntax lint, and core health checks without asserting deleted adapters or ephemeral symlinks.
  - Manifest (`context-manifest.json`) and lockfile (`context-lock.json`) fully synchronized, with `npm test`, `context-cli validate`, and `context-cli doctor` passing cleanly (100% PASS).

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As an AI assistant or human maintainer working in Context Factory, I want the repository root to be free of ephemeral symlink/worktree directories (`.agents`, `.claude`, `.worktrees`), so that project navigation is uncluttered and native files are immediately visible.*
- *As a developer, I want rule resolution and project validation to be direct and lightweight without running complex AST/regex conformance adapters and waiver verification machinery, so that execution is fast, clear, and unburdened by obsolete multi-adapter scaffolding.*
- *As a maintainer preparing to rewrite the bridge generator, I want all legacy conformance and ephemeral directory baggage removed, so that the project structure is clean, healthy, and easy to evolve.*

### Functional Requirements

- [ ] **FR-01 (Ephemeral Directory Removal):**
  - Delete `.agents` directory and all internal symlinks/configs (`.agents/rules`, `.agents/agents`, `.agents/workflows`, `.agents/skills/`, `.agents/skills.json`).
  - Delete git-tracked `.claude` directory and all internal workflow symlinks (`.claude/skills/*`).
  - Delete `.worktrees` directory containing orphaned worktrees (`0001`, `0003`, `PLN-0004`).
- [ ] **FR-02 (Conformance & Adapter Subsystem Elimination):**
  - Delete entire `orchestrator/conformance/` directory:
    - `orchestrator/conformance/adapters/typescript.mjs`
    - `orchestrator/conformance/adapter-contract.mjs`
    - `orchestrator/conformance/conformance-orchestrator.mjs`
    - `orchestrator/conformance/change-identity.mjs`
    - `orchestrator/conformance/evidence-gate.mjs`
    - `orchestrator/conformance/process-runner.mjs`
    - `orchestrator/conformance/report-verifier.mjs`
    - `orchestrator/conformance/waiver-policy.mjs`
  - Delete `app/cli/commands/conform.mjs`.
  - Remove `conform` command routing, help documentation, and cards from `app/cli/bin/context-cli.mjs`.
  - Delete conformance schemas: `schemas/conformance-report.schema.json` and `schemas/conformance-result.schema.json`.
  - Delete conformance evaluation tests: all 8 files in `evals/tests/conformance/`.
  - Delete conformance datasets: all 8 files in `evals/datasets/conformance/`.
  - Update `evals/run-evals.mjs` to remove conformance evaluation runs and adapter registrations.
- [ ] **FR-03 (Validator, Doctor & Bridge Generator Simplification):**
  - Update `scripts/validate-context.mjs` to remove assertions checking `.agents`, `.agents/skills.json`, and `.agents/skills/` symlinks.
  - Update `app/cli/commands/doctor.mjs` to remove adapter registration, adapter list queries, and the "Conformance Enforcement" check row.
  - Update `app/cli/commands/preflight.mjs` to remove lingering references to conformance checks.
  - Update `evals/tests/bridge/workflow-entry-contract.test.mjs` to remove assertions requiring `.agents/skills/` or `.claude/skills/` in Context Factory root, focusing on canonical workflow skills in `skills/workflows/`.
  - Update `evals/tests/bridge/bridge-conformance.test.mjs` to reflect the removal of the `conform` command.
- [ ] **FR-04 (Manifest, Lock & Documentation Synchronization):**
  - Update `context-manifest.json` to deregister deleted tools, schemas, datasets, and tests.
  - Regenerate `context-lock.json` via `node scripts/context.mjs lock`.
  - Update `orchestrator/SHARED.md` and `README.md` to remove references to `context-cli conform` and language adapters.
  - Verify that `node scripts/validate-context.mjs`, `node app/cli/bin/context-cli.mjs doctor`, and `npm test` pass with 100% success.

### Edge Cases & Failure Modes

- **Antigravity Workspace Detection:** While `.agents` is removed from context-factory, skills remain canonically organized under `skills/engineering/`, `skills/productivity/`, and `skills/workflows/`.
- **Dangling Manifest/Lock Entries:** All deleted files must be removed from `context-manifest.json` before running the lock update to prevent stale hash errors during doctor/lint checks.
- **Eval Suite Integrity:** Removing the 8 conformance dataset cases will reduce dataset evaluation count from 14 to 6, while keeping all unit and remaining feature/defect/architecture evals intact.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:**
  - Root directory (`.agents`, `.claude`, `.worktrees`)
  - CLI commands (`app/cli/commands/conform.mjs`, `app/cli/commands/doctor.mjs`, `app/cli/bin/context-cli.mjs`, `app/cli/commands/preflight.mjs`)
  - Orchestrator (`orchestrator/conformance/**`)
  - Bridge generator (`app/cli/core/bridge-generator.mjs`)
  - Validator (`scripts/validate-context.mjs`)
  - Evaluations (`evals/tests/conformance/**`, `evals/datasets/conformance/**`, `evals/run-evals.mjs`, `evals/tests/bridge/*`)
  - Schemas (`schemas/conformance-report.schema.json`, `schemas/conformance-result.schema.json`)
  - Manifest & Lock (`context-manifest.json`, `context-lock.json`)
  - Documentation (`README.md`, `orchestrator/SHARED.md`)

- **Files to Delete:**
  - `.agents/` (entire directory)
  - `.claude/` (entire directory)
  - `.worktrees/` (entire directory)
  - `orchestrator/conformance/adapters/typescript.mjs`
  - `orchestrator/conformance/adapter-contract.mjs`
  - `orchestrator/conformance/conformance-orchestrator.mjs`
  - `orchestrator/conformance/change-identity.mjs`
  - `orchestrator/conformance/evidence-gate.mjs`
  - `orchestrator/conformance/process-runner.mjs`
  - `orchestrator/conformance/report-verifier.mjs`
  - `orchestrator/conformance/waiver-policy.mjs`
  - `app/cli/commands/conform.mjs`
  - `schemas/conformance-report.schema.json`
  - `schemas/conformance-result.schema.json`
  - `evals/tests/conformance/conformance-cli-verify.test.mjs`
  - `evals/tests/conformance/conformance-cli.test.mjs`
  - `evals/tests/conformance/conformance-gate.test.mjs`
  - `evals/tests/conformance/decommissioned-stack.test.mjs`
  - `evals/tests/conformance/lifecycle-conformance.test.mjs`
  - `evals/tests/conformance/receipt-identity.test.mjs`
  - `evals/tests/conformance/typescript-adapter.test.mjs`
  - `evals/tests/conformance/typescript-fixtures.test.mjs`
  - `evals/datasets/conformance/01-missing-binding.json`
  - `evals/datasets/conformance/02-wrong-stack.json`
  - `evals/datasets/conformance/03-stale-hash.json`
  - `evals/datasets/conformance/04-code-violation.json`
  - `evals/datasets/conformance/05-forged-waiver.json`
  - `evals/datasets/conformance/06-tool-unavailable.json`
  - `evals/datasets/conformance/07-prompt-stripping.json`
  - `evals/datasets/conformance/08-bridge-omission.json`

## 4. Scope & Boundaries

- **In Scope:**
  - Removing `.agents`, `.claude`, and `.worktrees` from repository root.
  - Purging the entire `orchestrator/conformance/` directory and language adapter logic.
  - Removing `context-cli conform`, associated schemas, and evaluation datasets/tests.
  - Updating `validate-context.mjs`, `doctor.mjs`, `preflight.mjs`, and bridge tests.
  - Synchronizing manifest, lockfile, and documentation.
- **Out of Scope / Non-Goals:**
  - Full rewrite of `bridge-generator.mjs` (will be addressed in an upcoming targeted task; this cleanup provides the clean state for it).
  - Modifying canonical rules under `rules/` or core skills under `skills/`.
  - Modifying historical task logs under `docs/tasks/` or `docs/execution/`.

## 5. References & External Context

- [ADR 0029](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0029-executable-rule-conformance-harness.md): Executable Rule Conformance Harness (legacy design decommissioned)
- [ADR 0035](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md): Host Conformance Receipts and Fixture Modes (legacy design decommissioned)
- [ADR 0039](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md): First-Class Workflow Skills and TypeScript Consolidation
- [orchestrator/SHARED.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/SHARED.md): Shared Orchestration Contract

## 6. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `.worktrees/` | verified | Contains 3 orphaned directories (`0001`, `0003`, `PLN-0004`) from past tasks; not active git worktrees | Safe to completely delete immediately |
| E-02 | `.claude/` | verified | Tracked in git, contains 12 symlinks to `skills/workflows/*` | Can be untracked and removed from repo root; tests must be updated |
| E-03 | `.agents/` | verified | Contains symlinks to `skills/`, `rules/`, `agents/`, `workflows/` and `skills.json` | Ignored in `.gitignore`, but asserted in `scripts/validate-context.mjs` lines 586-652 |
| E-04 | `orchestrator/conformance/` | verified | 8 files (`typescript.mjs`, `adapter-contract.mjs`, `conformance-orchestrator.mjs`, etc.) totaling ~1,500 lines implementing multi-adapter conformance | Targeted for complete elimination |
| E-05 | `app/cli/commands/conform.mjs` & `context-cli.mjs` | verified | `conform` CLI command provides post-generation verification against rule bindings | Completely eliminated from CLI and manifest |
| E-06 | `evals/tests/conformance/` & `evals/datasets/conformance/` | verified | 8 test files and 8 golden datasets assert conformance execution | Completely deregistered and removed |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | Should the `context-cli conform` command be completely removed from the CLI, or replaced with a deprecated notice / lightweight validator? | decision | User | no | Confirmed: Completely eliminate the conformance subsystem: delete `orchestrator/conformance/`, remove `context-cli conform`, purge schemas/tests, and focus `doctor` on manifest/lock/lint health. |
| U-02 | Does external host bridging (`context-cli bridge`) still retain the ability to generate `.agents/` for host projects, or should all `.agents` logic be purged? | decision | User | no | Confirmed: Clean project state now to prepare for rewriting the bridge generator. Remove `.agents` and `.claude` from context-factory root and remove lingering checks. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **Ready for grill:** yes
- **Context content hash:** verified
