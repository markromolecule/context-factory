---
title: "Doctor Health Audit & Auto-Repair for All Editors"
type: unit
parent: "phase-03-diagnostics-and-evaluations"
unit: "03.01"
branch: "task/0001/phase-03/unit-01-doctor-audit-repair"
worktree: ".worktrees/0001/phase-03/unit-01-doctor-audit-repair"
status: planned
created: "2026-10-05"
tags: [task, unit, doctor, audit, repair, diagnostics]
depends_on: ["02.02"]
parallelizable_with: []
---

# Unit 03.01: Doctor Health Audit & Auto-Repair for All Editors

> Phase: phase-03-diagnostics-and-evaluations · Depends on: 02.02 · Parallelizable with: none
> Worktree: .worktrees/0001/phase-03/unit-01-doctor-audit-repair · Branch: task/0001/phase-03/unit-01-doctor-audit-repair

## Objective

Enhance `context-cli doctor` and `verifySymlinkHealth` to audit the presence, valid syntax, and target accuracy of Trae rules, VS Code copilot/settings, Cursor rules, and Antigravity symlinks in host repositories, with automated self-healing via `doctor --repair`.

## Context packet

- Current `doctor.mjs`: audits `.agents` symlinks and manifest/lockfile currency.
- Current `repairBridgeSymlinks`: re-runs `generateBridge` with `force: true`.
- Acceptance criteria: AC-05 (doctor audit and repair).
- Decision ledger: D-07 (audit for all configured editors based on `.context-bridge.json`).

## Preconditions

- Unit 02.02 completed and merged into `task/0001/phase-02/integration`.
- Dedicated git worktree and branch provisioned at `.worktrees/0001/phase-03/unit-01-doctor-audit-repair`.

## Scope

- **In scope:**
  - `app/cli/commands/doctor.mjs`:
    - Add diagnostic section for editor rule artifacts.
    - Check `.context-bridge.json` in host repository to identify configured `ides`.
    - If `trae` configured, verify `.trae/rules/project_rules.md` exists and contains orchestrator reference.
    - If `vscode` configured, verify `.github/copilot-instructions.md` exists.
    - If `cursor` configured, verify `.cursor/rules/context-factory.mdc` exists.
    - If `antigravity` configured, audit `.agents/` symlinks.
    - In `--repair` mode, trigger `repairBridgeSymlinks` with configured IDE profiles.
- **Out of scope:**
  - Writing automated evaluation test files (handled in Unit 03.02).

## Steps

1. In `app/cli/commands/doctor.mjs`, add `auditEditorConfigurations(targetDir)`.
2. Inspect target directory's `.context-bridge.json` for configured `ides`.
3. Check required files per configured editor and flag missing or empty artifacts.
4. Integrate check into `handleDoctorCommand` output table.
5. In `repairBridgeSymlinks`, ensure configured IDE profiles are preserved and passed to `generateBridge({ force: true })`.
6. Run doctor check against test directories.

## Verification

- Test type: **Integration tests** — verifies doctor detects missing editor files and successfully restores them with `--repair`.
- Cases:
  - Host repo missing `.trae/rules/project_rules.md` (when Trae configured) is flagged as FAIL.
  - Running `doctor --repair` recreates `.trae/rules/project_rules.md` and subsequent check PASSES.
- Command: `node --test tests/doctor-editor-audit.test.mjs`

## Rollback

Revert modifications to `app/cli/commands/doctor.mjs` and `app/cli/core/bridge-generator.mjs`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-05
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
