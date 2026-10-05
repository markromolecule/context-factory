---
title: "Phase 3: Diagnostics & Evaluations"
type: phase
parent: "0001-task-submodule-first-flow-and-multi-editor-bridging"
phase: "03"
phase_branch: "task/0001/phase-03/integration"
status: planned
created: "2026-10-05"
tags: [task, phase, diagnostics, doctor, audit, evals]
---

# Phase 3: Diagnostics & Evaluations

## Objective

Extend `context-cli doctor` and `verifySymlinkHealth` to audit the integrity of Trae, VS Code, Cursor, and Antigravity bridge artifacts, support automated self-healing via `--repair`, and add integration evaluation cases.

## Dependencies & Prerequisites

- Phase 2 completed (`unit-02-interactive-editor-wizard.md` merged).

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 03.01** | Doctor Health Audit & Auto-Repair for All Editors | `unit-01-doctor-audit-and-repair.md` | `task/0001/phase-03/unit-01-doctor-audit-repair` | `.worktrees/0001/phase-03/unit-01-doctor-audit-repair` | `02.02` | `none` | `merged` |
| **Unit 03.02** | Automated Integration Evaluations for Multi-Editor Bridging | `unit-02-integration-evals.md` | `task/0001/phase-03/unit-02-integration-evals` | `.worktrees/0001/phase-03/unit-02-integration-evals` | `03.01` | `none` | `planned` |

## Impacted Files & Components

- `app/cli/commands/doctor.mjs`: Extend audit checks for Trae rules, VS Code copilot/settings, and Cursor rules.
- `app/cli/core/bridge-generator.mjs`: Update `repairBridgeSymlinks` to regenerate missing editor configurations during `--repair`.
- `evals/cases/`: Add evaluation test case for multi-editor bridging and safe merging.

## Implementation Tasks

- [x] Unit 03.01 — Implement editor artifact health checks and `--repair` support in `doctor.mjs`.
- [ ] Unit 03.02 — Author automated evaluation test suites covering multi-editor bridging and safe merging.

## Verification & Testing

- `node app/cli/bin/context-cli.mjs doctor --target ./tests/fixtures/mock-host`
- `node app/cli/bin/context-cli.mjs eval`

## Risks, Worktree Teardown & Rollback

- **Risk:** False negatives if a host project intentionally configured only one editor.
- **Mitigation:** Inspect `.context-bridge.json` (if present) to only require artifacts for configured `ides`.
- **Teardown:** Prune `.worktrees/0001/phase-03/*` after phase integration merge.
