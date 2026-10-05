---
title: "Phase 1: Multi-Editor Bridge Core"
type: phase
parent: "0001-task-submodule-first-flow-and-multi-editor-bridging"
phase: "01"
phase_branch: "task/0001/phase-01/integration"
status: planned
created: "2026-10-05"
tags: [task, phase, bridge, generator, trae, vscode, cursor]
---

# Phase 1: Multi-Editor Bridge Core

## Objective

Extend Context Factory's core bridge engine (`app/cli/core/bridge-generator.mjs`) to natively support **Trae**, **VS Code**, and **modern Cursor (`.mdc`)** rules, including non-destructive JSON merging for `.vscode/settings.json`.

## Dependencies & Prerequisites

- Context Specification: `docs/context/cli/submodule-editor-onboarding.md` (ready)
- Architecture Decision: `docs/decisions/0026-submodule-first-ide-onboarding-flow.md` (accepted)

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Trae, VS Code, and Cursor Generator Enhancements | `unit-01-trae-vscode-cursor-generator.md` | `task/0001/phase-01/unit-01-bridge-core` | `.worktrees/0001/phase-01/unit-01-bridge-core` | `none` | `none` | `planned` |

## Impacted Files & Components

- `app/cli/core/bridge-generator.mjs`:
  - `normalizeIdeProfiles`: Add recognition of `vscode` and `trae`.
  - Trae rule scaffolding: `.trae/rules/project_rules.md`.
  - VS Code scaffolding: `.github/copilot-instructions.md`, `.vscode/extensions.json`, and safe JSON merge helper for `.vscode/settings.json`.
  - Modern Cursor rule scaffolding: `.cursor/rules/context-factory.mdc` alongside `.cursorrules`.

## Implementation Tasks

- [ ] Unit 01.01 — Implement Trae, VS Code, and Cursor generator logic with safe JSON merge in `bridge-generator.mjs`.

## Verification & Testing

- `node --test tests/bridge-generator.test.mjs` verifying file creation, content correctness, and non-destructive JSON merging.

## Risks, Worktree Teardown & Rollback

- **Risk:** Accidental clobbering of existing `.vscode/settings.json`.
- **Mitigation:** Unit tests specifically testing merge behavior against pre-existing configuration.
- **Teardown:** Remove `.worktrees/0001/phase-01/unit-01-bridge-core` after merging into `task/0001/phase-01/integration`.
