---
title: "Phase 2: Diagnostics, Health Checks & Auto-Repair (doctor, pull, sync)"
type: phase
parent: "docs/tasks/2026/08/2026-08-28/0001-task-ide-bridging-and-sync-enhancements/README.md"
phase: "02"
status: completed
created: "2026-08-28"
tags: [task, phase, doctor, health, diagnostics, repair, pull, sync]
---

# Phase 2: Diagnostics, Health Checks & Auto-Repair (doctor, pull, sync)

## Objective

Enhance `context-cli doctor`, `lint`, `pull`, and `sync` to audit symlink health and bridge validity across both Context Factory and consumer host projects. Implement `--repair` in `doctor` and `bridge` to automatically restore broken or missing symlinks, and ensure `context-cli pull` auto-heals symlinks after updating git submodules or remote commits.

## Dependencies & Prerequisites

- Phase 1 completed (symlink generator and `.agents/` scaffolding available in `bridge-generator.mjs`).

## Impacted Files & Components

- `app/cli/commands/doctor.mjs` (Modified): Added symlink health audit (verifying factory `.agents` and host `.agents` links), report dangling/broken links, and support `--repair` flag to restore them.
- `app/cli/commands/pull.mjs` (Modified): After pulling submodule or git remote updates, invoke auto-repair for symlinks and run post-pull diagnostics.
- `app/cli/core/indexer.mjs` (Modified): Verify and maintain `.agents/` symlinks in factory root during `syncFactoryInventory`.
- `scripts/validate-context.mjs` (Modified): Added `.agents/` symlink target resolution and existence validation during linting.

## Implementation Tasks

- [x] Task 2.1 — Implement `verifySymlinkHealth(targetDir)` diagnostic utility that checks all `.agents/*` symlinks for existence, broken links, and target accessibility.
- [x] Task 2.2 — Update `app/cli/commands/doctor.mjs` to incorporate symlink diagnostics for both direct factory runs and bridged host repos.
- [x] Task 2.3 — Implement `--repair` flag in `doctor.mjs` and `bridge.mjs` to recreate missing/broken symlinks without clobbering host custom rules or files.
- [x] Task 2.4 — Update `app/cli/commands/pull.mjs` to automatically invoke symlink health verification and repair following git pull / submodule update.
- [x] Task 2.5 — Add symlink audit checks into `scripts/validate-context.mjs` so `context-cli lint` catches broken links during CI.

## Verification & Testing

- `node app/cli/bin/context-cli.mjs doctor` executed in `context-factory`: PASS (6/6 symlinks verified healthy, 18/18 evals passed).
- Simulated broken/missing symlink in test directory `/tmp/test-doctor-repair`: `context-cli doctor --target /tmp/test-doctor-repair` flagged failure (`0 broken, 1 missing. Run context-cli doctor --repair`).
- Auto-repair verified: `node app/cli/bin/context-cli.mjs doctor --repair --target /tmp/test-doctor-repair` restored missing symlink and passed 100%.

## Risks & Rollback

- **Risk:** Auto-repair could accidentally overwrite local host customizations if not carefully scoped.
- **Mitigation:** Only re-creates known factory symlinks (`skills`, `rules`, `agents`, `workflows`, `AGENTS.md`, `GEMINI.md`) and strictly preserves host files.
- **Rollback:** Revert modifications in `app/cli/commands/doctor.mjs`, `pull.mjs`, `core/indexer.mjs`, and `scripts/validate-context.mjs`.
