---
title: "Phase 4 — Sync & Verification"
type: phase
parent: "0002-task-loop-engineering-integration"
phase: "04"
status: completed
created: "2026-08-29"
tags: [task, phase, sync, lock, doctor, evals, verification]
---

# Phase 4 — Sync & Verification

## Objective

Synchronize `context-manifest.json`, rebuild Obsidian MOCs (`docs/Skills.md`, `docs/Rules.md`, `docs/decisions/README.md`), regenerate `context-lock.json`, and run the comprehensive evaluation and doctor test suites.

## Dependencies & Prerequisites

- Phase 1, 2, and 3 implementation completed.

## Impacted Files & Components

- `context-manifest.json` — Factory inventory manifest.
- `context-lock.json` — Cryptographic hash digest lockfile.
- `docs/Skills.md` — Auto-synced Skills Map of Content.
- `scripts/context-core.mjs` & `scripts/validate-context.mjs` — Keyword / routing updates.

## Implementation Tasks

- [x] Add `triage` to `ACTION_TERMS` in `scripts/context-core.mjs` and `protectedTriggers` in `scripts/validate-context.mjs`.
- [x] Update `context-manifest.json` with new skills (`skills/triage/SKILL.md`), tools (`scripts/worktree.mjs`, `scripts/triage.mjs`), automation (`.github/workflows/discovery.yml`), and vault indexes (`docs/Connectors.md`, `docs/tasks/INBOX.md`).
- [x] Run `node app/cli/bin/context-cli.mjs sync` (or `npm run sync`) to regenerate MOCs and `context-lock.json`.
- [x] Run `node scripts/context.mjs doctor` to verify complete factory health.
- [x] Run `node evals/run-evals.mjs` to ensure all 20+ unit and dataset evaluations pass.

## Verification & Testing

- `node scripts/context.mjs doctor` — must output PASS across all checks.
- `node evals/run-evals.mjs` — must pass 100%.

## Risks & Rollback

- **Risk:** Stale lockfile digest or missing manifest entry causing CI doctor failures.
- **Mitigation:** Execute full sync workflow before reporting completion.
