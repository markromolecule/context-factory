---
title: "Clean Ephemeral Directories and Remove Conformance Adapters Architecture Discovery Record"
type: discovery-record
status: ready
created: "2026-10-17"
sourceContext: docs/context/refactors/clean-adapters-conformance-and-ephemeral-dirs.md
sourceContextHash: sha256:0df8aff0d049300ee4cc4af8c0a500a1f92fe096a4f9b0b4e9c8ce3379ad2f73
---

# Clean Ephemeral Directories and Remove Conformance Adapters Architecture Discovery Record

## Idea and Release Condition

Clean Context Factory further by purging ephemeral/legacy directories (`.agents`, `.claude`, `.worktrees`) from the repository root, and completely removing the logic for language conformance and stack adapters (`orchestrator/conformance/`, `app/cli/commands/conform.mjs`, and associated tests/schemas). In addition, prepare the repository structure for rewriting the bridge generator by removing factory-internal assertions for `.agents` and `.claude`. Release one plan-facing brief only after all target files, boundary scenarios, indexer alignments, and test gates are verified against codebase evidence and user-confirmed architectural decisions.

## Grounding Claim Packet: Architecture & Principles

Selection: Checked against canonical knowledge items in `knowledge/principles/` and accepted architectural decisions in `docs/decisions/`.

| Claim ID | Source / heading | Authority / lifecycle / verified date / content hash | Selection reason | Status and content |
| --- | --- | --- | --- | --- |
| G-KISS-001 | `knowledge/principles/kiss.md` / Keep It Simple, Stupid | canonical / active / 2026-07-25 / `sha256:69b12d539ec1fa9e3347b4d3f3f22718e8df5ae8e9064c07d3b5b60e6f6631ad` | Architectural simplification principle | **verified:** Eliminating the entire complex runtime conformance and adapter layer (`orchestrator/conformance/**`, ~1,500 LOC) radically reduces architectural complexity, adhering directly to KISS. |
| G-YAGNI-002 | `knowledge/principles/yagni.md` / You Aren't Gonna Need It | canonical / active / 2026-07-25 / `sha256:b1d8481fe12111bb9e5dd469e3ba2c7bb140889218d6a86ff4b8e3a24ec4a87c` | Scope & abstraction trimming principle | **verified:** Multi-stack adapter abstractions and AST/regex rule checks add friction without benefit in a lean context engineering repository. Purging them removes unused cognitive and maintenance overhead. |
| G-ADR-0029 | `docs/decisions/0029-executable-rule-conformance-harness.md` | accepted decision / 2026-10-06 | Governed rule conformance harness | **decommissioned:** The conformance harness and adapters introduced in ADR 0029 are fully decommissioned. Conformance is superseded by standard project linting, typechecking, and manifest validation. |
| G-ADR-0035 | `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md` | accepted decision / 2026-10-08 | Governed conformance receipts & fixture modes | **decommissioned:** Conformance receipts, hashes, and fixture mode checks introduced in ADR 0035 are decommissioned alongside the conformance subsystem. |

## Repository Facts and Decisions

| ID | Class | Evidence | Finding and consequence |
| --- | --- | --- | --- |
| R-01 | verified fact | `.worktrees/` | Contains 3 orphaned directories (`0001`, `0003`, `PLN-0004`) from past tasks; not active git worktrees. Must be deleted immediately. |
| R-02 | verified fact | `.claude/` | Tracked in git, contains 12 symlinks to `skills/workflows/*`. Must be untracked and removed from repo root. |
| R-03 | verified fact | `.agents/` | Contains symlinks to `skills/`, `rules/`, `agents/`, `workflows/` and `skills.json`. Must be removed from repo root. |
| R-04 | verified fact | `orchestrator/conformance/` | Contains 8 files implementing adapter contract, TypeScript adapter, waiver policy, evidence gate, report verifier, etc. Must be deleted. |
| R-05 | verified fact | `app/cli/commands/conform.mjs` & `context-cli.mjs` | `conform` CLI command evaluates changes against rule bindings. Must be removed from CLI and manifest. |
| R-06 | verified fact | `evals/tests/conformance/` & `evals/datasets/conformance/` | 8 test files and 8 golden datasets assert conformance execution. Must be deleted, and `run-evals.mjs` updated. |
| R-07 | verified fact | `scripts/validate-context.mjs` | Lines 586-652 validate `.agents` and `.agents/skills/`. Must be removed so validation passes without ephemeral directories. |
| R-08 | verified fact | `app/cli/commands/doctor.mjs` | Queries adapter list and displays "Conformance Enforcement". Must be cleaned to focus on manifest, lock, and lint health. |
| R-09 | user decision | Discovery Q-01 | Completely eliminate the conformance subsystem: delete `orchestrator/conformance/`, remove `context-cli conform`, purge schemas/tests, and focus `doctor` on manifest/lock/lint health. |
| R-10 | user decision | Discovery Q-02 | Clean project state now to prepare for rewriting the bridge generator. Remove `.agents` and `.claude` from context-factory root and remove lingering checks. |

## Scenarios

### Scenario S-01: Clean Repository Root Inspection (Happy Path)
- **Input:** Developer inspects repository root with `ls -la`.
- **Expected Outcome:** No `.agents`, `.claude`, or `.worktrees` directories exist at the repository root. All active skills reside in canonical directories under `skills/` and workflows under `skills/workflows/`.

### Scenario S-02: Project Validation via Validator & Doctor (Happy Path)
- **Input:** Developer runs `node scripts/validate-context.mjs` and `node app/cli/bin/context-cli.mjs doctor`.
- **Expected Outcome:** Both commands pass (PASS) cleanly without requiring `.agents` symlinks, `.claude` links, or conformance adapters.

### Scenario S-03: Evaluation Suite Execution (Clean Suite)
- **Input:** Developer runs `npm test` (`node app/cli/bin/context-cli.mjs eval`).
- **Expected Outcome:** All unit and non-conformance dataset tests pass cleanly without attempting to evaluate deleted conformance fixtures or adapters.

### Scenario S-04: Rule Resolution and Preflight (Happy Path)
- **Input:** Developer runs `node scripts/context.mjs resolve "add custom hook with query cache"`.
- **Expected Outcome:** Command executes smoothly and resolves relevant TypeScript rules without invoking adapter or conformance validation logic.
