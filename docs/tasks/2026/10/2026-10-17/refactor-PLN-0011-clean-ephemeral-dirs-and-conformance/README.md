---
title: "Clean Ephemeral Directories and Conformance Adapters Architecture"
type: task
status: planned
plan_contract_version: 3
plan_id: "PLN-0011"
created: "2026-10-17"
tags: [task, refactor, cleanup, conformance, adapters, structure, architecture]
target_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
discovery_brief: "../../../../../discovery/clean-adapters-conformance-and-ephemeral-dirs/brief.md"
---

# Clean Ephemeral Directories and Conformance Adapters Architecture Master Plan

## Outcome

Clean Context Factory by removing ephemeral/legacy directories (`.agents`, `.claude`, `.worktrees`) from the repository root, and completely eliminating the runtime language conformance checking and stack adapter system under `orchestrator/conformance/` (including `adapters/typescript.mjs`, `adapter-contract.mjs`, `conformance-orchestrator.mjs`, waiver policies, report verifiers, schemas, and 16 evaluation test/dataset files). Align `validate-context.mjs`, `doctor.mjs`, and bridge tests so that Context Factory passes all health checks cleanly with 100% PASS, providing a clean baseline for rewriting the bridge generator.

## Pre-planning record

The released discovery brief is fresh and has no material unknowns (`docs/discovery/clean-adapters-conformance-and-ephemeral-dirs/brief.md`). Grounding packets `G-KISS-001` and `G-YAGNI-002` support eliminating runtime conformance indirection and dead multi-stack adapter abstractions, formally decommissioning `ADR 0029` (Executable Rule Conformance Harness) and `ADR 0035` (Host Conformance Receipts). The user confirmed complete elimination of the conformance subsystem (CLI command, schemas, tests) and removal of `.agents`, `.claude`, and `.worktrees` from context-factory to establish a pristine project baseline.

### Actors and goals

| Actor | Goal |
| :--- | :--- |
| **Context Factory Maintainer** | Maintain a clean, minimal root directory free of ephemeral symlinks and worktrees, with lean, fast validation. |
| **AI Coding Agent** | Discover and execute skills and workflows natively from canonical directories (`skills/`, `skills/workflows/`) without relying on ephemeral symlink mirrors. |
| **CI / Evaluation Pipeline** | Run lint, validation, and golden dataset evaluations with fast execution and 100% PASS rate without adapter timeout guards or waiver checks. |

### Domain language

- **Canonical Skills Inventory:** Skills located authoritatively under `skills/engineering/`, `skills/productivity/`, and `skills/workflows/`, which act as first-class skill directories without needing `.agents/skills/` mirrors inside the factory itself.
- **Model-Neutral Core:** Orchestration rules and developer guidelines defined once in `orchestrator/SHARED.md` and `README.md`.
- **Standard Static Validation:** Project and syntax health validated through `scripts/validate-context.mjs` (manifest, lockfile, frontmatter, schemas) rather than dynamic AST/regex stack conformance adapters.

### Language stack and applicable rules

- **Declared Stack:** `typescript` (Node.js ESM for CLI tooling and Markdown for rules/skills).
- **Rule Binding ID & Hash:** `binding-PLN-0011` (`sha256:7b1e8481fe12111bb9e5dd469e3ba2c7bb140889218d6a86ff4b8e3a24ec4a87c`)
- **Active Directives:**
  - `[directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md`
  - `[directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md`
  - `[directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md`
- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Unit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S-01** | Developer inspects root directory `ls -la` | Ephemeral directories removed | Root contains no `.agents`, `.claude`, or `.worktrees` directories | Dangling file or untracked directory found | 01.01 |
| **S-02** | Maintainer runs test suite `npm test` | Conformance subsystem and 8 datasets removed | Test suite executes 27 unit/dataset evaluations with 100% PASS | Missing adapter import or evaluation error fails test | 02.01 |
| **S-03** | Developer runs validator and doctor diagnostics | Validator and doctor updated | `validate-context.mjs` and `doctor.mjs` pass without requiring `.agents` or conformance adapters | Assertion failure on missing `.agents` | 03.01 |
| **S-04** | Maintainer verifies manifest, lock, and documentation | Manifest and lock updated | `context-manifest.json` and `context-lock.json` have 0 dangling files; doctor reports HEALTHY | Stale lockfile detected | 04.01 |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | How should ephemeral root directories be handled? | Empty and remove `.agents/`, `.claude/`, and `.worktrees/` (`0001`, `0003`, `PLN-0004`) from repository root. | Unclutters repository structure and removes stale task worktrees. | Leaving symlink directories in place. | `docs/discovery/clean-adapters-conformance-and-ephemeral-dirs/record.md` |
| **D-02** | How should language conformance and stack adapters be eliminated? | Completely delete `orchestrator/conformance/`, remove `context-cli conform`, and purge all 16 conformance test/dataset files and schemas. | Conforms to KISS and YAGNI; eliminates ~1,500 lines of complex runtime AST/regex checking in favor of standard project lint/validation. | Deprecating or stubbing the `conform` command. | `docs/discovery/clean-adapters-conformance-and-ephemeral-dirs/record.md` |
| **D-03** | How should tooling and validation adapt to the removal? | Update `validate-context.mjs` and `doctor.mjs` to not assert `.agents`, `.claude`, or conformance adapters for Context Factory. | Prepares a clean project state for rewriting the bridge generator in a subsequent task. | Retaining legacy bridge enforcement in the factory root. | `docs/discovery/clean-adapters-conformance-and-ephemeral-dirs/record.md` |

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Unit | Verification Command | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| AC-01 | S-01, D-01 | `.agents`, `.claude`, and `.worktrees` directories are completely removed from root | 01.01 | git status --short | planned |
| AC-02 | S-02, D-02 | `orchestrator/conformance/`, `conform.mjs`, conformance schemas, and conformance evals/datasets are deleted; `npm test` passes remaining 27 evaluations | 02.01 | npm test | planned |
| AC-03 | S-03, D-03 | `validate-context.mjs`, `doctor.mjs`, and bridge tests updated to pass without `.agents` or conformance adapter checks | 03.01 | node scripts/validate-context.mjs | planned |
| AC-04 | S-04, D-01..D-03 | Manifest and lockfile synchronized with zero dangling entries; documentation updated; doctor passes 100% HEALTHY | 04.01 | node app/cli/bin/context-cli.mjs doctor | planned |

## Scope

- **In scope:**
  - Deleting `.agents/`, `.claude/`, and `.worktrees/` directories from repository root.
  - Deleting entire `orchestrator/conformance/` directory (8 files) and `app/cli/commands/conform.mjs`.
  - Removing `conform` command from `app/cli/bin/context-cli.mjs`.
  - Deleting `schemas/conformance-report.schema.json` and `schemas/conformance-result.schema.json`.
  - Deleting all 8 test files in `evals/tests/conformance/` and all 8 dataset files in `evals/datasets/conformance/`.
  - Updating `evals/run-evals.mjs`, `scripts/validate-context.mjs`, `app/cli/commands/doctor.mjs`, `app/cli/commands/preflight.mjs`, and `evals/tests/bridge/*`.
  - Updating `context-manifest.json` and regenerating `context-lock.json`.
  - Updating `README.md` and `orchestrator/SHARED.md`.
- **Out of scope (non-goals):**
  - Rewriting `bridge-generator.mjs` (will be executed in a dedicated follow-up task; this task provides the clean foundation).
  - Modifying canonical rules in `rules/` or core skills in `skills/`.
  - Modifying historical task logs under `docs/tasks/2026/`.

## Unknowns and blockers

- None. All unknowns (U-01, U-02) were resolved with user confirmation during pre-planning grilling.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
| :--- | :--- | :--- |
| **Broken Validator Assertions** | High | Unit 03.01 removes hardcoded `.agents` assertions from `scripts/validate-context.mjs`. |
| **Dangling Manifest/Lock Entries** | High | Unit 04.01 updates `context-manifest.json` first, then runs `node scripts/context.mjs lock` to ensure exact parity. |
| **Lingering Imports in Test Harness** | Medium | Unit 02.01 scrubs all imports of `conformance-orchestrator.mjs`, `typescript.mjs`, and `waiver-policy.mjs` from `evals/run-evals.mjs`. |

## Task branch

| Field | Recorded decision |
| :--- | :--- |
| Target branch | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` |
| Task branch | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` |
| Base commit | `c7524e96a0e97bacdb848bdee05abd9203ef5e96` |

## Plan done-check

- [x] Acceptance criteria mapped to units and verification commands
- [x] Blockers resolved or none remain
- [x] Risks and dependencies assessed
- [x] Task branch and base commit aligned across all units

## Phases

- [ ] `phase-01-ephemeral-directory-removal/phase.md` — Phase 1 — Ephemeral Root Directory Removal
- [ ] `phase-02-conformance-elimination/phase.md` — Phase 2 — Conformance and Adapter Subsystem Elimination
- [ ] `phase-03-tooling-alignment/phase.md` — Phase 3 — Validation, Doctor & Tooling Alignment
- [ ] `phase-04-manifest-sync-and-verification/phase.md` — Phase 4 — Manifest & Lock Synchronization, Final Verification & Documentation

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Conformance Report | Verification Command |
| :--- | :--- | :--- | :--- | :--- |
| Phase 01 Verification | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | pending | PASS | `git status --short` |
| Phase 02 Verification | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | pending | PASS | `npm test` |
| Phase 03 Verification | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | pending | PASS | `node scripts/validate-context.mjs` |
| Phase 04 Verification | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` | pending | PASS | `node app/cli/bin/context-cli.mjs doctor` |
| Task Finalization | `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance` to `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | pending | PASS | `node app/cli/bin/context-cli.mjs doctor` |
